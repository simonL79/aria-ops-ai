
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { threat_topic, client_id, simulation_type = 'manual' } = await req.json();
    
    console.log('RSI Threat Simulation triggered:', { threat_topic, client_id, simulation_type });

    // Create threat simulation record
    const { data: simulation, error: simError } = await supabase
      .from('threat_simulations')
      .insert({
        threat_topic: threat_topic,
        client_id: client_id,
        threat_level: Math.floor(Math.random() * 5) + 3, // Random 3-7
        likelihood_score: Math.random() * 0.5 + 0.5, // Random 0.5-1.0
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (simError) {
      console.error('Error creating simulation:', simError);
      throw new Error('Failed to create threat simulation');
    }

    // Create RSI activation log
    const { data: activation, error: activationError } = await supabase
      .from('rsi_activation_logs')
      .insert({
        client_id: client_id,
        threat_simulation_id: simulation.id,
        trigger_type: simulation_type,
        matched_threat: threat_topic,
        activation_status: 'initiated',
        triggered_at: new Date().toISOString()
      })
      .select()
      .single();

    if (activationError) {
      console.error('Error creating activation log:', activationError);
      // Continue anyway, simulation was created
    }

    console.log('RSI simulation created successfully:', simulation.id);

    return new Response(JSON.stringify({
      success: true,
      simulation_id: simulation.id,
      activation_id: activation?.id,
      threat_topic: threat_topic,
      status: 'initiated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('RSI Threat Simulator error:', error);
    return new Response(JSON.stringify({
      error: 'RSI simulation failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
