import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ALERT_EMAIL = Deno.env.get('EIDETIC_ALERT_EMAIL') ?? 'simon@ariaops.co.uk';

function fmtPct(n: number | null | undefined) {
  if (n === null || n === undefined) return '—';
  return `${(Number(n) * 100).toFixed(0)}%`;
}

function buildHtml(ev: any) {
  const sev = String(ev.severity ?? 'medium').toUpperCase();
  const sevColor = ev.severity === 'critical' ? '#dc2626' : ev.severity === 'high' ? '#ea580c' : '#ca8a04';
  const eventLabel = String(ev.event_type ?? 'event').replace(/_/g, ' ');

  const rows: string[] = [];
  if (ev.prev_decay_score !== null && ev.new_decay_score !== null) {
    rows.push(`<tr><td style="padding:6px 0;color:#6b7280">Decay</td><td style="padding:6px 0;color:#111827"><b>${fmtPct(ev.prev_decay_score)}</b> → <b>${fmtPct(ev.new_decay_score)}</b></td></tr>`);
  }
  if (ev.prev_threat_30d !== null && ev.new_threat_30d !== null) {
    rows.push(`<tr><td style="padding:6px 0;color:#6b7280">Threat (30d)</td><td style="padding:6px 0;color:#111827"><b>${fmtPct(ev.prev_threat_30d)}</b> → <b>${fmtPct(ev.new_threat_30d)}</b></td></tr>`);
  } else if (ev.new_threat_30d !== null) {
    rows.push(`<tr><td style="padding:6px 0;color:#6b7280">Threat (30d)</td><td style="padding:6px 0;color:#111827"><b>${fmtPct(ev.new_threat_30d)}</b></td></tr>`);
  }
  if (ev.narrative_category) {
    rows.push(`<tr><td style="padding:6px 0;color:#6b7280">Category</td><td style="padding:6px 0;color:#111827">${ev.narrative_category}</td></tr>`);
  }

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
    <div style="padding:16px 20px;background:${sevColor};color:#fff">
      <div style="font-size:11px;letter-spacing:1px;opacity:.85">A.R.I.A™ EIDETIC ALERT — ${sev}</div>
      <div style="font-size:18px;font-weight:600;margin-top:4px;text-transform:capitalize">${eventLabel}</div>
    </div>
    <div style="padding:20px;color:#111827;font-size:14px;line-height:1.5">
      <p style="margin:0 0 12px">A previously stable digital memory has shifted state and requires attention.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">${rows.join('')}</table>
      ${ev.content_excerpt ? `<div style="margin-top:14px;padding:12px;background:#f9fafb;border-left:3px solid ${sevColor};color:#374151;font-size:13px">${String(ev.content_excerpt).replace(/</g,'&lt;')}</div>` : ''}
      ${ev.content_url ? `<p style="margin:16px 0 0"><a href="${ev.content_url}" style="color:#2563eb;text-decoration:none">View source →</a></p>` : ''}
      <p style="margin:24px 0 0;color:#6b7280;font-size:12px">Acknowledge this event in the EIDETIC dashboard to clear it from the active queue.</p>
    </div>
  </div>
  </body></html>`;
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

    const html = buildHtml(ev);
    const subject = `EIDETIC ${String(ev.severity).toUpperCase()}: ${String(ev.event_type).replace(/_/g,' ')}`;

    // Try transactional infra first; fall back to logging only
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE}` },
        body: JSON.stringify({
          templateName: 'eidetic-resurfacing-alert',
          recipientEmail: ALERT_EMAIL,
          idempotencyKey: `eidetic-event-${event_id}`,
          templateData: { subject, html, severity: ev.severity, eventType: ev.event_type },
        }),
      });
      if (!r.ok) console.warn('send-transactional-email returned', r.status);
    } catch (e) {
      console.warn('transactional email infra unavailable; event logged only', e);
    }

    await (supabase.from('eidetic_resurfacing_events') as any)
      .update({ notified_at: new Response().headers.has('x') ? null : new Date().toISOString() })
      .eq('id', event_id);

    return new Response(JSON.stringify({ ok: true, event_id, recipient: ALERT_EMAIL }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('notify-resurfacing error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
