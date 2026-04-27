import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const { action_id, decision } = await req.json().catch(() => ({}));
    if (!action_id || !['approve', 'reject'].includes(decision)) {
      return new Response(JSON.stringify({ error: 'action_id and decision (approve|reject) required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const newStatus = decision === 'approve' ? 'approved' : 'rejected';

    const { data: action, error } = await supabase
      .from('black_vertex_actions')
      .update({
        status: newStatus,
        approved_by: auth.user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', action_id)
      .eq('status', 'pending')
      .select()
      .single();

    if (error || !action) {
      return new Response(JSON.stringify({ error: 'Action not found or not pending' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('aria_ops_log').insert({
      operation_type: `action_${decision}`,
      module_source: 'black_vertex',
      operation_data: { action_id, by: auth.user.id },
      success: true,
    });

    let executeResult: any = null;
    if (decision === 'approve') {
      const execResp = await fetch(`${SUPABASE_URL}/functions/v1/black-vertex-execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({ action_id }),
      });
      executeResult = await execResp.json().catch(() => ({}));
    }

    return new Response(JSON.stringify({ success: true, action, execute: executeResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('black-vertex-approve error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
