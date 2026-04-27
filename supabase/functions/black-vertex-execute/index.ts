import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Internal function: requires service-role bearer
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('authorization') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (authHeader !== `Bearer ${serviceKey}`) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action_id } = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

    const { data: action, error } = await supabase
      .from('black_vertex_actions')
      .select('*')
      .eq('id', action_id)
      .single();
    if (error || !action) throw new Error('Action not found');

    let result: Record<string, unknown> = {};
    let success = true;

    try {
      switch (action.action_type) {
        case 'notify_only':
          await supabase.from('aria_notifications').insert({
            event_type: 'black_vertex_alert',
            entity_name: (action.payload as any)?.entity_name || null,
            summary: `Notification for ${action.target_url || 'target'}`,
            priority: 'high',
            metadata: { action_id, payload: action.payload },
          });
          result = { notified: true };
          break;

        case 'suppression_boost': {
          const payload = (action.payload || {}) as any;
          const { data: asset, error: aErr } = await supabase
            .from('suppression_assets')
            .insert({
              title: payload.title || `Suppression boost for ${action.target_url}`,
              url: payload.url || action.target_url,
              asset_type: 'boost',
              status: 'queued',
              metadata: { source: 'black_vertex', action_id, ...payload },
            })
            .select()
            .single();
          if (aErr) throw aErr;
          result = { suppression_asset_id: asset.id };
          break;
        }

        case 'counter_content': {
          const payload = (action.payload || {}) as any;
          const { data: asset, error: aErr } = await supabase
            .from('suppression_assets')
            .insert({
              title: payload.title || `Counter content draft`,
              url: payload.url || null,
              asset_type: 'counter_content',
              status: 'draft',
              metadata: { source: 'black_vertex', action_id, target_url: action.target_url, ...payload },
            })
            .select()
            .single();
          if (aErr) throw aErr;
          result = { draft_asset_id: asset.id, note: 'Live multi-platform publish is Phase 5' };
          break;
        }

        case 'manual_review':
          result = { flagged: true, note: 'Awaiting analyst review' };
          break;

        default:
          throw new Error(`Unknown action_type: ${action.action_type}`);
      }
    } catch (handlerErr) {
      success = false;
      result = { error: (handlerErr as Error).message };
    }

    await supabase
      .from('black_vertex_actions')
      .update({
        status: success ? 'completed' : 'failed',
        executed_at: new Date().toISOString(),
        result,
      })
      .eq('id', action_id);

    await supabase.from('aria_ops_log').insert({
      operation_type: 'action_executed',
      module_source: 'black_vertex',
      operation_data: { action_id, action_type: action.action_type, result },
      success,
    });

    return new Response(JSON.stringify({ success, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('black-vertex-execute error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
