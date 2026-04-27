import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyShieldToken } from '../_shared/shieldToken.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shield-token',
};

const ALLOWED: Record<string, string[]> = {
  new: ['triaged', 'false_positive'],
  triaged: ['evidence_required', 'monitoring', 'false_positive'],
  evidence_required: ['evidence_captured'],
  evidence_captured: ['action_required'],
  action_required: ['takedown_opened', 'legal_review', 'law_enforcement_review', 'monitoring'],
  takedown_opened: ['monitoring', 'resolved'],
  legal_review: ['takedown_opened', 'monitoring'],
  law_enforcement_review: ['monitoring'],
  monitoring: ['action_required', 'resolved'],
  resolved: [],
  false_positive: [],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    let auth: { userId: string };
    try {
      auth = await verifyShieldToken(req.headers.get('x-shield-token'), 'transition');
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { alert_id, to_status, notes, client_visible } = await req.json();
    if (!alert_id || !to_status) {
      return new Response(JSON.stringify({ error: 'alert_id and to_status required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: current } = await (admin as any).from('shield_alerts').select('status').eq('id', alert_id).maybeSingle();
    if (!current) return new Response(JSON.stringify({ error: 'Alert not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const allowed = ALLOWED[current.status] || [];
    if (!allowed.includes(to_status)) {
      return new Response(JSON.stringify({ error: `Invalid transition ${current.status} -> ${to_status}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const updatePatch: any = { status: to_status };
    if (typeof client_visible === 'boolean') updatePatch.client_visible = client_visible;

    await (admin as any).from('shield_alerts').update(updatePatch).eq('id', alert_id);

    await (admin as any).from('shield_alert_events').insert({
      alert_id, actor_id: auth.userId, from_status: current.status, to_status,
      event_type: 'status_change', notes: notes || null,
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('shield-transition-alert error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
