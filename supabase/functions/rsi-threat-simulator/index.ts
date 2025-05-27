
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

    // Create a content alert as our simulation record
    const { data: simulation, error: simError } = await supabase
      .from('content_alerts')
      .insert({
        client_id: targetClientId,
        content: `RSI Threat Simulation: ${threat_topic}`,
        platform: 'RSI_Simulation',
        threat_type: 'rsi_simulation',
        severity: threat_level >= 4 ? 'high' : threat_level >= 2 ? 'medium' : 'low',
        status: 'new',
        confidence_score: Math.round(likelihood_score * 100),
        sentiment: -50, // Negative sentiment for threat simulation
        source_type: 'simulation'
      })
      .select()
      .single();

    if (simError) {
      console.error('Error creating simulation:', simError);
      return new Response(
        JSON.stringify({ error: 'Failed to create simulation', details: simError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create RSI activation log if the table exists
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'rsi_simulation_triggered',
        entity_type: 'rsi_simulation',
        entity_id: simulation.id,
        details: `RSI simulation for threat: ${threat_topic}. Type: ${simulation_type}. Threat level: ${threat_level}. Likelihood: ${likelihood_score}`,
        user_email: 'system@rsi.local'
      });

    if (logError) {
      console.error('Error creating activation log:', logError);
    }

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
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
