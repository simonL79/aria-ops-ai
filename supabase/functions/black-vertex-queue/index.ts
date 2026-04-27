import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_TYPES = new Set(['counter_content', 'suppression_boost', 'notify_only', 'manual_review']);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const body = await req.json().catch(() => ({}));
    const { client_id, action_type, target_url, payload } = body;

    if (!action_type || !VALID_TYPES.has(action_type)) {
      return new Response(JSON.stringify({ error: 'Invalid action_type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase
      .from('black_vertex_actions')
      .insert({
        client_id: client_id || null,
        action_type,
        target_url: target_url || null,
        payload: payload || {},
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('aria_ops_log').insert({
      operation_type: 'queue_action',
      module_source: 'black_vertex',
      operation_data: { action_id: data.id, action_type, target_url, queued_by: auth.user.id },
      success: true,
    });

    return new Response(JSON.stringify({ success: true, action: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('black-vertex-queue error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
