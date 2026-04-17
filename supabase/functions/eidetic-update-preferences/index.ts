import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const SEVERITIES = new Set(['low', 'medium', 'high', 'critical']);
const FREQUENCIES = new Set(['off', 'daily', 'weekly']);

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return bad('Unauthorized', 401);

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) return bad('Unauthorized', 401);
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const update: Record<string, any> = { user_id: userId };

    if ('email_enabled' in body) update.email_enabled = !!body.email_enabled;
    if ('email_min_severity' in body) {
      if (!SEVERITIES.has(body.email_min_severity)) return bad('invalid severity');
      update.email_min_severity = body.email_min_severity;
    }
    if ('event_type_filter' in body) {
      if (body.event_type_filter !== null && !Array.isArray(body.event_type_filter)) return bad('event_type_filter must be array or null');
      update.event_type_filter = body.event_type_filter;
    }
    if ('narrative_category_filter' in body) {
      if (body.narrative_category_filter !== null && !Array.isArray(body.narrative_category_filter)) return bad('narrative_category_filter must be array or null');
      update.narrative_category_filter = body.narrative_category_filter;
    }
    if ('quiet_hours_start' in body) update.quiet_hours_start = body.quiet_hours_start || null;
    if ('quiet_hours_end' in body) update.quiet_hours_end = body.quiet_hours_end || null;
    if ('quiet_hours_timezone' in body) update.quiet_hours_timezone = String(body.quiet_hours_timezone || 'Europe/London');
    if ('digest_frequency' in body) {
      if (!FREQUENCIES.has(body.digest_frequency)) return bad('invalid digest frequency');
      update.digest_frequency = body.digest_frequency;
    }
    if ('digest_send_time' in body) update.digest_send_time = body.digest_send_time || '08:00';
    if ('mute_until' in body) update.mute_until = body.mute_until || null;

    const { data, error } = await (supabase.from('eidetic_alert_preferences') as any)
      .upsert(update, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('upsert preferences error', error);
      return bad('Failed to save preferences', 500);
    }

    return new Response(JSON.stringify({ ok: true, preferences: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('update-preferences error', e);
    return bad('Internal server error', 500);
  }
});
