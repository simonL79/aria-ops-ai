// Tier 7: Auto-response dispatcher.
// Evaluates a resurfacing event against active hooks and creates dispatched_responses.
// If hook.requires_approval=false, executes immediately. Otherwise stays pending for operator approval.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SEV_RANK: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

interface Body { event_id: string; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { event_id } = (await req.json()) as Body;
    if (!event_id) return json({ error: 'event_id required' }, 400);

    const { data: event, error: eErr } = await supabase
      .from('eidetic_resurfacing_events')
      .select('*')
      .eq('id', event_id)
      .maybeSingle();
    if (eErr || !event) return json({ error: 'event not found' }, 404);

    const { data: hooks } = await supabase
      .from('eidetic_response_hooks')
      .select('*')
      .eq('enabled', true);

    const matched = (hooks ?? []).filter((h: any) => {
      if (h.trigger_event_types?.length && !h.trigger_event_types.includes(event.event_type)) return false;
      if ((SEV_RANK[event.severity] ?? 0) < (SEV_RANK[h.trigger_min_severity] ?? 3)) return false;
      if (h.trigger_narrative_categories?.length && event.narrative_category &&
          !h.trigger_narrative_categories.includes(event.narrative_category)) return false;
      return true;
    });

    const dispatched: any[] = [];
    for (const hook of matched) {
      const payload = buildPayload(hook, event);
      const requiresApproval = hook.requires_approval !== false;

      const { data: row, error: insErr } = await supabase
        .from('eidetic_dispatched_responses')
        .insert({
          hook_id: hook.id,
          event_id: event.id,
          action_type: hook.action_type,
          status: requiresApproval ? 'pending' : 'approved',
          payload,
        })
        .select()
        .single();
      if (insErr) { console.error('insert dispatch failed', insErr); continue; }

      if (!requiresApproval) {
        const result = await executeAction(supabase, hook.action_type, payload, event);
        await supabase
          .from('eidetic_dispatched_responses')
          .update({
            status: result.ok ? 'dispatched' : 'failed',
            result: result.data ?? {},
            error_message: result.error ?? null,
            dispatched_at: new Date().toISOString(),
          })
          .eq('id', row.id);
      }
      dispatched.push({ hook_id: hook.id, action: hook.action_type, requires_approval: requiresApproval });
    }

    return json({ ok: true, matched: matched.length, dispatched });
  } catch (e) {
    console.error('dispatch error', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function buildPayload(hook: any, event: any) {
  return {
    action: hook.action_type,
    config: hook.action_config ?? {},
    event: {
      id: event.id,
      type: event.event_type,
      severity: event.severity,
      narrative_category: event.narrative_category,
      content_url: event.content_url,
      content_excerpt: event.content_excerpt,
      footprint_id: event.footprint_id,
      new_threat_30d: event.new_threat_30d,
      new_decay_score: event.new_decay_score,
    },
  };
}

async function executeAction(supabase: any, action: string, payload: any, event: any): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    switch (action) {
      case 'requiem': {
        // Queue a counter-content campaign
        const { data, error } = await supabase.from('persona_saturation_campaigns').insert({
          campaign_name: `EIDETIC auto: ${event.event_type} ${event.id.slice(0, 8)}`,
          entity_name: event.narrative_category ?? 'unknown',
          status: 'queued',
          content: { source_event: event.id, url: event.content_url, excerpt: event.content_excerpt },
          platforms: payload.config?.platforms ?? ['blog'],
        }).select().single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: { campaign_id: data.id } };
      }
      case 'legal_erasure': {
        const { data, error } = await supabase.from('data_subject_requests').insert({
          request_type: 'erasure',
          status: 'pending',
          priority: event.severity === 'critical' ? 'high' : 'medium',
          request_details: `EIDETIC auto-generated erasure request. Source URL: ${event.content_url ?? 'n/a'}\n\nExcerpt: ${event.content_excerpt ?? ''}`,
          metadata: { source: 'eidetic', event_id: event.id, footprint_id: event.footprint_id },
        }).select().single();
        if (error) return { ok: false, error: error.message };
        return { ok: true, data: { request_id: data.id } };
      }
      case 'counter_narrative': {
        const { data, error } = await supabase.from('counter_narratives').insert({
          entity_name: event.narrative_category ?? 'unknown',
          narrative_type: 'auto_response',
          theme: event.event_type,
          status: 'draft',
          content: `Auto-generated counter for ${event.content_url}: ${event.content_excerpt ?? ''}`,
          metadata: { source: 'eidetic', event_id: event.id },
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
