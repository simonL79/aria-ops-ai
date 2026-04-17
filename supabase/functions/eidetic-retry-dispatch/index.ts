// Retry a failed EIDETIC dispatched response — re-runs the downstream invoke only,
// reusing the existing artifact row. Admin-only.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { executeAction } from '../_shared/eidetic-executors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body { dispatch_id: string; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: aerr } = await userClient.auth.getClaims(token);
    if (aerr || !claims?.claims) return json({ error: 'Unauthorized' }, 401);
    const actor = claims.claims.sub as string;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', actor)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ error: 'Admin role required' }, 403);

    const { dispatch_id } = (await req.json()) as Body;
    if (!dispatch_id) return json({ error: 'dispatch_id required' }, 400);

    const { data: dispatch, error: dErr } = await admin
      .from('eidetic_dispatched_responses')
      .select('*')
      .eq('id', dispatch_id)
      .maybeSingle();
    if (dErr || !dispatch) return json({ error: 'Dispatch not found' }, 404);
    if (dispatch.status !== 'failed') return json({ error: `Cannot retry status=${dispatch.status}` }, 400);

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
    console.error('[EIDETIC-RETRY] error', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
