import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID = new Set(['under_review', 'removed', 'rejected', 'appealing', 'submitted']);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const { takedown_id, status, resolution_notes } = await req.json().catch(() => ({}));
    if (!takedown_id || !VALID.has(status)) {
      return new Response(JSON.stringify({ error: 'takedown_id and valid status required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const update: Record<string, unknown> = { status };
    if (resolution_notes) update.resolution_notes = resolution_notes;
    if (['removed', 'rejected'].includes(status)) update.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('oblivion_takedowns')
      .update(update)
      .eq('id', takedown_id)
      .select()
      .single();
    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Takedown not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('aria_ops_log').insert({
      operation_type: 'takedown_status_update',
      module_source: 'oblivion',
      operation_data: { takedown_id, status, by: auth.user.id },
      success: true,
    });

    return new Response(JSON.stringify({ success: true, takedown: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('oblivion-status-update error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
