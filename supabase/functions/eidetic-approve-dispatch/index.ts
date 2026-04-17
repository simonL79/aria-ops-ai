// Approve or reject a pending dispatched response. On approve, executes the action.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body { dispatch_id: string; decision: 'approve' | 'reject'; notes?: string; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: aerr } = await userClient.auth.getClaims(token);
    if (aerr || !claims?.claims) return json({ error: 'Unauthorized' }, 401);
    const actor = claims.claims.sub as string;

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

async function executeAction(supabase: any, action: string, payload: any, event: any) {
  try {
    switch (action) {
      case 'requiem': {
        const { data, error } = await supabase.from('persona_saturation_campaigns').insert({
          campaign_name: `EIDETIC approved: ${event?.event_type} ${(event?.id ?? '').slice(0, 8)}`,
          entity_name: event?.narrative_category ?? 'unknown',
          status: 'queued',
          content: { source_event: event?.id, url: event?.content_url, excerpt: event?.content_excerpt },
          platforms: payload.config?.platforms ?? ['blog'],
        }).select().single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: { campaign_id: data.id } };
      }
      case 'legal_erasure': {
        const { data, error } = await supabase.from('data_subject_requests').insert({
          request_type: 'erasure',
          status: 'pending',
          priority: event?.severity === 'critical' ? 'high' : 'medium',
          request_details: `EIDETIC approved erasure request. Source URL: ${event?.content_url ?? 'n/a'}\n\nExcerpt: ${event?.content_excerpt ?? ''}`,
          metadata: { source: 'eidetic', event_id: event?.id, footprint_id: event?.footprint_id },
        }).select().single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: { request_id: data.id } };
      }
      case 'counter_narrative': {
        const { data, error } = await supabase.from('counter_narratives').insert({
          entity_name: event?.narrative_category ?? 'unknown',
          narrative_type: 'auto_response',
          theme: event?.event_type,
          status: 'draft',
          content: `Approved counter for ${event?.content_url}: ${event?.content_excerpt ?? ''}`,
          metadata: { source: 'eidetic', event_id: event?.id },
        }).select().single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: { narrative_id: data.id } };
      }
      default:
        return { ok: false, error: `Unknown action: ${action}` };
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
