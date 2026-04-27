import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyShieldToken } from '../_shared/shieldToken.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shield-token',
};

function mapThreatTypeToShield(t: string | null): string {
  const v = (t || '').toLowerCase();
  if (v.includes('imperson')) return 'impersonation';
  if (v.includes('phish')) return 'phishing';
  if (v.includes('scam') || v.includes('fraud')) return 'scam_ad';
  if (v.includes('deepfake')) return 'deepfake';
  if (v.includes('dox')) return 'doxxing';
  if (v.includes('harass')) return 'harassment';
  if (v.includes('defam')) return 'defamation_risk';
  if (v.includes('leak')) return 'data_leak';
  if (v.includes('domain') || v.includes('spoof')) return 'spoofed_domain';
  if (v.includes('endorse')) return 'fake_endorsement';
  if (v.includes('takeover')) return 'account_takeover';
  if (v.includes('darkweb') || v.includes('credential')) return 'dark_web_exposure';
  if (v.includes('search') || v.includes('serp')) return 'search_result_risk';
  if (v.includes('narrative') || v.includes('hostile')) return 'hostile_narrative';
  if (v.includes('misinfo')) return 'misinformation';
  return 'unknown';
}

function scoreFor(threatSeverity: string | null, alertType: string) {
  const sev = (threatSeverity || '').toLowerCase();
  const base = sev === 'critical' ? 80 : sev === 'high' ? 65 : sev === 'medium' ? 45 : 25;
  const harm = base;
  const reach = Math.max(20, base - 10);
  const publicRisk = ['phishing', 'scam_ad', 'spoofed_domain', 'fake_endorsement', 'impersonation'].includes(alertType) ? base + 5 : base - 15;
  const legal = ['defamation_risk', 'data_leak', 'doxxing', 'harassment'].includes(alertType) ? base + 5 : base - 10;
  const confidence = 60;
  const urgency = sev === 'critical' ? 80 : sev === 'high' ? 60 : 35;
  const total = Math.round((harm * 0.25 + reach * 0.15 + publicRisk * 0.2 + legal * 0.15 + (100 - Math.abs(50 - confidence)) * 0.05 + urgency * 0.2));
  const severity = total >= 85 ? 'p1_critical' : total >= 65 ? 'p2_high' : total >= 40 ? 'p3_medium' : 'p4_low';
  return { harm_score: harm, reach_score: Math.max(0, reach), public_risk_score: Math.max(0, publicRisk), legal_risk_score: Math.max(0, legal), confidence_score: confidence, urgency_score: urgency, total_score: total, severity };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let auth: { userId: string };
    try {
      auth = await verifyShieldToken(req.headers.get('x-shield-token'), 'promote');
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { threat_id } = await req.json();
    if (!threat_id || typeof threat_id !== 'string') {
      return new Response(JSON.stringify({ error: 'threat_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Already promoted?
    const { data: existing } = await (admin as any).from('shield_alerts').select('id').eq('source_threat_id', threat_id).maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ alert_id: existing.id, already_existed: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: threat, error: tErr } = await (admin as any).from('threats').select('*').eq('id', threat_id).maybeSingle();
    if (tErr || !threat) {
      return new Response(JSON.stringify({ error: 'Threat not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const alertType = mapThreatTypeToShield(threat.threat_type);
    const scores = scoreFor(threat.severity, alertType);

    const { data: alert, error: aErr } = await (admin as any).from('shield_alerts').insert({
      source_threat_id: threat.id,
      entity_name: threat.entity_name,
      alert_type: alertType,
      title: `${alertType.replace(/_/g, ' ')}: ${threat.entity_name || 'Unknown entity'}`,
      summary: threat.content?.slice(0, 500) || null,
      source: threat.source,
      source_url: threat.url,
      status: 'new',
      created_by: auth.user.id,
      ...scores,
    }).select('id').single();

    if (aErr) {
      console.error('shield-promote-threat insert error', aErr);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    await (admin as any).from('shield_alert_events').insert({
      alert_id: alert.id, actor_id: auth.user.id, to_status: 'new',
      event_type: 'promoted_from_threat', notes: `Promoted from threat ${threat.id}`,
      metadata: { threat_id: threat.id, threat_type: threat.threat_type },
    });

    await (admin as any).from('shield_score_events').insert({
      alert_id: alert.id, actor_id: auth.user.id, ...scores, reason: 'initial_promotion',
    });

    await (admin as any).from('aria_ops_log').insert({
      operation_type: 'shield_promote_threat', module_source: 'shield',
      entity_name: threat.entity_name, success: true,
      operation_data: { threat_id: threat.id, alert_id: alert.id, alert_type: alertType, severity: scores.severity },
    });

    return new Response(JSON.stringify({ alert_id: alert.id, severity: scores.severity, total_score: scores.total_score }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('shield-promote-threat error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
