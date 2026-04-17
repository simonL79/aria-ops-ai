import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = Deno.env.get('APP_URL') ?? 'https://ariaops.co.uk';

function timeInTz(tz: string): { hours: number; minutes: number; ymd: string; iso: string } {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '00';
  return {
    hours: parseInt(get('hour'), 10),
    minutes: parseInt(get('minute'), 10),
    ymd: `${get('year')}-${get('month')}-${get('day')}`,
    iso: now.toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: prefsList, error: prefsErr } = await (supabase.from('eidetic_alert_preferences') as any)
      .select('*').neq('digest_frequency', 'off');
    if (prefsErr) {
      console.error('load prefs error', prefsErr);
      return new Response(JSON.stringify({ error: 'load prefs failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results: any[] = [];

    for (const prefs of (prefsList ?? [])) {
      try {
        const tz = prefs.quiet_hours_timezone || 'Europe/London';
        const tnow = timeInTz(tz);
        const [sh, sm] = String(prefs.digest_send_time || '08:00').split(':').map(Number);
        const sendMinutes = sh * 60 + sm;
        const curMinutes = tnow.hours * 60 + tnow.minutes;

        // Window: send if current local time is within [send_time, send_time + 30min]
        if (curMinutes < sendMinutes || curMinutes > sendMinutes + 30) {
          results.push({ user_id: prefs.user_id, skipped: 'not in send window' });
          continue;
        }

        // De-dupe: daily = once per local day; weekly = once per 7 days
        const lastSent = prefs.digest_last_sent_at ? new Date(prefs.digest_last_sent_at) : null;
        if (lastSent) {
          const ageMs = Date.now() - lastSent.getTime();
          const minGapMs = prefs.digest_frequency === 'weekly' ? 6 * 24 * 3600_000 : 20 * 3600_000;
          if (ageMs < minGapMs) {
            results.push({ user_id: prefs.user_id, skipped: 'already sent recently' });
            continue;
          }
        }

        // Period
        const periodMs = prefs.digest_frequency === 'weekly' ? 7 * 24 * 3600_000 : 24 * 3600_000;
        const periodStart = new Date(Date.now() - periodMs).toISOString();
        const periodEnd = new Date().toISOString();

        // Fetch events
        const { data: events } = await (supabase.from('eidetic_resurfacing_events') as any)
          .select('id, severity, event_type, narrative_category, content_excerpt, content_url, status, created_at')
          .gte('created_at', periodStart)
          .order('created_at', { ascending: false })
          .limit(200);

        const all = events ?? [];
        const totalEvents = all.length;
        const criticalCount = all.filter((e: any) => e.severity === 'critical').length;
        const highCount = all.filter((e: any) => e.severity === 'high').length;
        const mediumCount = all.filter((e: any) => e.severity === 'medium').length;
        const resolvedCount = all.filter((e: any) => e.status === 'resolved').length;

        if (totalEvents === 0) {
          results.push({ user_id: prefs.user_id, skipped: 'no events' });
          continue;
        }

        // Top 5 by severity rank then recency
        const rank: Record<string, number> = { critical: 3, high: 2, medium: 1, low: 0 };
        const topEvents = [...all]
          .sort((a: any, b: any) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0)
            || +new Date(b.created_at) - +new Date(a.created_at))
          .slice(0, 5);

        // Get recipient email
        const { data: u } = await supabase.auth.admin.getUserById(prefs.user_id);
        const email = u?.user?.email;
        if (!email) {
          results.push({ user_id: prefs.user_id, skipped: 'no email' });
          continue;
        }

        const idemKey = `eidetic-digest-${prefs.user_id}-${tnow.ymd}-${prefs.digest_frequency}`;

        const r = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE}` },
          body: JSON.stringify({
            templateName: 'eidetic-digest',
            recipientEmail: email,
            idempotencyKey: idemKey,
            templateData: {
              digestType: prefs.digest_frequency,
              periodLabel: prefs.digest_frequency === 'weekly' ? 'last 7 days' : 'last 24 hours',
              totalEvents, criticalCount, highCount, mediumCount, resolvedCount,
              topEvents,
              preferencesUrl: `${APP_URL}/admin/eidetic/preferences`,
              dashboardUrl: `${APP_URL}/admin`,
            },
          }),
        });

        const sent = r.ok;

        await (supabase.from('eidetic_digest_log') as any).insert({
          user_id: prefs.user_id,
          digest_type: prefs.digest_frequency,
          period_start: periodStart,
          period_end: periodEnd,
          event_count: totalEvents,
          critical_count: criticalCount,
          high_count: highCount,
          resolved_count: resolvedCount,
          email_sent: sent,
        });

        if (sent) {
          await (supabase.from('eidetic_alert_preferences') as any)
            .update({ digest_last_sent_at: new Date().toISOString() })
            .eq('user_id', prefs.user_id);
        }

        results.push({ user_id: prefs.user_id, sent, totalEvents });
      } catch (innerErr) {
        console.error('digest user error', prefs.user_id, innerErr);
        results.push({ user_id: prefs.user_id, error: String(innerErr) });
      }
    }

    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-digest error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
