import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = 'https://ariaops.co.uk';

/**
 * Evaluates UI crash-rate alert rules against client_error_logs.
 * Callable by an admin (manual "run now") or by pg_cron using the service role key.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const isCron = authHeader === `Bearer ${SERVICE_ROLE}`;
  if (!isCron) {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const { data: rules, error: rulesErr } = await (supabase.from('error_alert_rules') as any)
      .select('*')
      .eq('enabled', true);
    if (rulesErr) throw rulesErr;

    const now = Date.now();
    const results: any[] = [];

    for (const rule of rules ?? []) {
      const windowMinutes = Math.max(1, Math.min(1440, Number(rule.window_minutes) || 60));
      const threshold = Math.max(1, Number(rule.threshold) || 5);
      const cooldown = Math.max(0, Number(rule.cooldown_minutes) || 0);

      if (rule.last_triggered_at && now - new Date(rule.last_triggered_at).getTime() < cooldown * 60_000) {
        results.push({ rule_id: rule.id, skipped: 'cooldown' });
        continue;
      }

      const since = new Date(now - windowMinutes * 60_000).toISOString();
      let q = (supabase.from('client_error_logs') as any)
        .select('message, created_at', { count: 'exact' })
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5);
      if (rule.section) q = q.eq('section', rule.section);

      const { data: logs, count, error: countErr } = await q;
      if (countErr) throw countErr;

      const errorCount = count ?? 0;
      if (errorCount < threshold) {
        results.push({ rule_id: rule.id, count: errorCount, threshold, fired: false });
        continue;
      }

      const sectionLabel = rule.section || 'All sections';
      let emailSent = false;
      let detail: string | null = null;

      try {
        const r = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE}` },
          body: JSON.stringify({
            templateName: 'ui-crash-rate-alert',
            recipientEmail: rule.notify_email,
            idempotencyKey: `crash-rate-${rule.id}-${Math.floor(now / (cooldown > 0 ? cooldown * 60_000 : 3_600_000))}`,
            templateData: {
              section: sectionLabel,
              errorCount,
              threshold,
              windowMinutes,
              sampleMessages: (logs ?? []).map((l: any) => String(l.message).slice(0, 180)),
              errorLogUrl: `${APP_URL}/admin/error-log`,
            },
          }),
        });
        emailSent = r.ok;
        if (!r.ok) detail = `email failed (${r.status})`;
      } catch (_e) {
        detail = 'email request failed';
      }

      await (supabase.from('error_alert_events') as any).insert({
        rule_id: rule.id,
        section: rule.section,
        error_count: errorCount,
        threshold,
        window_minutes: windowMinutes,
        notify_email: rule.notify_email,
        email_sent: emailSent,
        detail,
      });

      await (supabase.from('error_alert_rules') as any)
        .update({ last_triggered_at: new Date(now).toISOString() })
        .eq('id', rule.id);

      results.push({ rule_id: rule.id, count: errorCount, threshold, fired: true, email_sent: emailSent });
    }

    return new Response(JSON.stringify({ success: true, evaluated: rules?.length ?? 0, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('error-rate-alert failed:', e);
    return new Response(JSON.stringify({ error: 'Alert evaluation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
