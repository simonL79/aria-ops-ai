import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FALLBACK_EMAIL = Deno.env.get('EIDETIC_ALERT_EMAIL') ?? 'simon@ariaops.co.uk';
const APP_URL = Deno.env.get('APP_URL') ?? 'https://ariaops.co.uk';

const SEV_RANK: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function inQuietHours(prefs: any): boolean {
  if (!prefs.quiet_hours_start || !prefs.quiet_hours_end) return false;
  try {
    const tz = prefs.quiet_hours_timezone || 'Europe/London';
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const [h, m] = fmt.format(now).split(':').map(Number);
    const cur = h * 60 + m;
    const [sh, sm] = String(prefs.quiet_hours_start).split(':').map(Number);
    const [eh, em] = String(prefs.quiet_hours_end).split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (start === end) return false;
    if (start < end) return cur >= start && cur < end;
    return cur >= start || cur < end; // overnight window
  } catch {
    return false;
  }
}

function passesFilters(prefs: any, ev: any): boolean {
  if (!prefs.email_enabled) return false;
  if (prefs.mute_until && new Date(prefs.mute_until) > new Date()) return false;
  const minRank = SEV_RANK[prefs.email_min_severity] ?? 2;
  const evRank = SEV_RANK[ev.severity] ?? 0;
  if (evRank < minRank) return false;
  if (Array.isArray(prefs.event_type_filter) && prefs.event_type_filter.length > 0
      && !prefs.event_type_filter.includes(ev.event_type)) return false;
  if (Array.isArray(prefs.narrative_category_filter) && prefs.narrative_category_filter.length > 0
      && ev.narrative_category && !prefs.narrative_category_filter.includes(ev.narrative_category)) return false;
  if (inQuietHours(prefs)) return false;
  return true;
}

async function sendOne(supabase: any, recipient: string, ev: any, eventId: string, recipientUserId: string | null) {
  try {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE}` },
      body: JSON.stringify({
        templateName: 'eidetic-resurfacing-alert',
        recipientEmail: recipient,
        idempotencyKey: `eidetic-event-${eventId}-${recipientUserId ?? 'fallback'}`,
        templateData: {
          severity: ev.severity,
          eventType: ev.event_type,
          narrativeCategory: ev.narrative_category,
          prevDecay: ev.prev_decay_score,
          newDecay: ev.new_decay_score,
          prevThreat: ev.prev_threat_30d,
          newThreat: ev.new_threat_30d,
          contentExcerpt: ev.content_excerpt,
          contentUrl: ev.content_url,
          preferencesUrl: `${APP_URL}/admin/eidetic/preferences`,
        },
      }),
    });
    if (!r.ok) console.warn('send-transactional-email status', r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.warn('send-transactional-email failed', e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { event_id } = await req.json();
    if (!event_id) {
      return new Response(JSON.stringify({ error: 'event_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: ev, error: evErr } = await (supabase.from('eidetic_resurfacing_events') as any)
      .select('*').eq('id', event_id).single();
    if (evErr || !ev) {
      return new Response(JSON.stringify({ error: 'event not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (ev.notified_at) {
      return new Response(JSON.stringify({ skipped: 'already notified' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find admin user IDs
    const { data: admins } = await (supabase.from('user_roles') as any)
      .select('user_id').eq('role', 'admin');
    const adminIds: string[] = (admins ?? []).map((r: any) => r.user_id).filter(Boolean);

    const recipients: Array<{ user_id: string | null; email: string }> = [];

    if (adminIds.length > 0) {
      // Load preferences for all admins
      const { data: prefs } = await (supabase.from('eidetic_alert_preferences') as any)
        .select('*').in('user_id', adminIds);
      const prefsByUser = new Map<string, any>();
      for (const p of (prefs ?? [])) prefsByUser.set(p.user_id, p);

      // Default prefs for admins without a row
      const defaultPrefs = {
        email_enabled: true,
        email_min_severity: 'high',
        event_type_filter: null,
        narrative_category_filter: null,
        quiet_hours_start: null,
        quiet_hours_end: null,
        mute_until: null,
      };

      for (const uid of adminIds) {
        const prefs = prefsByUser.get(uid) ?? defaultPrefs;
        if (!passesFilters(prefs, ev)) continue;
        // Look up email via auth admin API
        const { data: u } = await supabase.auth.admin.getUserById(uid);
        const email = u?.user?.email;
        if (email) recipients.push({ user_id: uid, email });
      }
    }

    // Fallback: no eligible admin recipient → use fallback email
    if (recipients.length === 0) {
      recipients.push({ user_id: null, email: FALLBACK_EMAIL });
    }

    let sent = 0;
    for (const r of recipients) {
      const ok = await sendOne(supabase, r.email, ev, event_id, r.user_id);
      if (ok) sent++;
    }

    await (supabase.from('eidetic_resurfacing_events') as any)
      .update({ notified_at: new Date().toISOString() })
      .eq('id', event_id);

    return new Response(JSON.stringify({ ok: true, event_id, recipients: recipients.length, sent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('notify-resurfacing error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
