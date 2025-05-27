
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RSISimulationRequest {
  threat_topic: string;
  client_id?: string;
  simulation_type: 'manual' | 'automated';
  threat_level?: number;
  likelihood_score?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { threat_topic, client_id, simulation_type, threat_level = 3, likelihood_score = 0.6 }: RSISimulationRequest = await req.json();

    console.log('RSI Threat Simulation triggered:', { threat_topic, client_id, simulation_type });

    // Get a default client if none provided
    let targetClientId = client_id;
    if (!targetClientId) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id')
        .limit(1);
      
      if (clients && clients.length > 0) {
        targetClientId = clients[0].id;
      }
    }

    if (!targetClientId) {
      return new Response(
        JSON.stringify({ error: 'No client found for simulation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create threat simulation record
    const { data: simulation, error: simError } = await supabase
      .from('threat_simulations')
      .insert({
        client_id: targetClientId,
        threat_topic,
        threat_level,
        likelihood_score,
        predicted_keywords: [threat_topic.toLowerCase()],
        threat_source: 'manual_simulation',
        geographical_scope: ['global'],
        simulation_status: 'running'
      })
      .select()
      .single();

    if (simError) {
      console.error('Error creating simulation:', simError);
      return new Response(
        JSON.stringify({ error: 'Failed to create simulation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create RSI activation log
    const { error: logError } = await supabase
      .from('rsi_activation_logs')
      .insert({
        client_id: targetClientId,
        threat_simulation_id: simulation.id,
        trigger_type: simulation_type,
        matched_threat: threat_topic,
        activation_status: 'initiated',
        triggered_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error creating activation log:', logError);
    }

    // Update simulation status to completed
    await supabase
      .from('threat_simulations')
      .update({ simulation_status: 'completed' })
      .eq('id', simulation.id);

    console.log('RSI simulation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        simulation,
        message: 'RSI threat simulation completed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('RSI simulation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
