// Approve or reject a pending dispatched response. On approve, executes the action.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { executeAction } from '../_shared/eidetic-executors.ts';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body { dispatch_id: string; decision: 'approve' | 'reject'; notes?: string; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;
    const actor = auth.user.id;


    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { dispatch_id, decision, notes } = (await req.json()) as Body;
    if (!dispatch_id || !['approve', 'reject'].includes(decision)) {
      return json({ error: 'Invalid input' }, 400);
    }

    const { data: dispatch, error: dErr } = await admin
      .from('eidetic_dispatched_responses')
      .select('*')
      .eq('id', dispatch_id)
      .maybeSingle();
    if (dErr || !dispatch) return json({ error: 'Dispatch not found' }, 404);
    if (dispatch.status !== 'pending') return json({ error: `Already ${dispatch.status}` }, 400);

    if (decision === 'reject') {
      await admin.from('eidetic_dispatched_responses').update({
        status: 'rejected',
        approved_by: actor,
        approved_at: new Date().toISOString(),
        error_message: notes ?? null,
      }).eq('id', dispatch_id);
      return json({ ok: true, status: 'rejected' });
    }

    // Approve + execute
    await admin.from('eidetic_dispatched_responses').update({
      status: 'approved',
      approved_by: actor,
      approved_at: new Date().toISOString(),
    }).eq('id', dispatch_id);

    const { data: event } = await admin
      .from('eidetic_resurfacing_events')
      .select('*')
      .eq('id', dispatch.event_id)
      .maybeSingle();

    const result = await executeAction(admin, dispatch.action_type, dispatch.payload, event);
    await admin.from('eidetic_dispatched_responses').update({
      status: result.ok ? 'dispatched' : 'failed',
      result: result.data ?? {},
      error_message: result.error ?? null,
      dispatched_at: new Date().toISOString(),
    }).eq('id', dispatch_id);

    return json({ ok: result.ok, result: result.data, error: result.error });
  } catch (e) {
    console.error('approve-dispatch error', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
