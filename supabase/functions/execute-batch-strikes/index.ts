
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StrikeRequest {
  id: string;
  url: string;
  platform: string;
  reason: string;
  strike_type: string;
  batch_id: string;
}

async function executeStrike(strike: StrikeRequest): Promise<{ success: boolean; message: string; details?: any }> {
  const { url, platform, strike_type, reason } = strike;
  console.log(`Executing ${strike_type} strike on ${platform}: ${url}`);
  
  // Simulate execution
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: `${strike_type} strike executed for ${platform}`,
    details: { reference_id: `${strike_type.toUpperCase()}-${Date.now()}`, url }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Authenticate via JWT — do NOT trust client-supplied admin_id
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header', success: false }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Verify the JWT to get the real user
    const authSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await authSupabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', success: false }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify admin role using the authenticated user ID (not client-supplied)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: adminCheck, error: adminError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (adminError || !adminCheck) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin role required', success: false }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { batch_id } = await req.json()

    if (!batch_id) {
      return new Response(JSON.stringify({ error: 'Missing batch_id', success: false }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get approved strikes in this batch
    const { data: strikes, error: fetchError } = await supabase
      .from('strike_requests')
      .select('*')
      .eq('batch_id', batch_id)
      .eq('status', 'approved')

    if (fetchError) throw fetchError

    if (!strikes || strikes.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No approved strikes found in batch' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    await supabase
      .from('strike_requests')
      .update({ status: 'executing' })
      .eq('batch_id', batch_id)
      .eq('status', 'approved')

    let successCount = 0
    let failureCount = 0
    const results = []

    for (const strike of strikes) {
      try {
        const result = await executeStrike(strike)
        
        await supabase
          .from('strike_requests')
          .update({
            status: result.success ? 'completed' : 'failed',
            executed_at: new Date().toISOString(),
            execution_result: { success: result.success, message: result.message, details: result.details || {} }
          })
          .eq('id', strike.id)

        if (result.success) successCount++
        else failureCount++

        results.push({ strike_id: strike.id, url: strike.url, platform: strike.platform, success: result.success, message: result.message })
      } catch (error) {
        await supabase
          .from('strike_requests')
          .update({ status: 'failed', executed_at: new Date().toISOString(), execution_result: { success: false, message: error.message } })
          .eq('id', strike.id)

        failureCount++
        results.push({ strike_id: strike.id, url: strike.url, platform: strike.platform, success: false, message: error.message })
      }
    }

    // Log with real user ID
    await supabase.from('activity_logs').insert({
      action: 'batch_strike_execution',
      details: `Batch ${batch_id}: ${successCount}/${strikes.length} successful`,
      entity_type: 'strike',
      user_id: user.id
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Batch execution completed: ${successCount}/${strikes.length} strikes successful`,
      stats: { total: strikes.length, successful: successCount, failed: failureCount },
      results,
      batch_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Batch strike execution failed:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', success: false }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
