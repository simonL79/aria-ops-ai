
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('RSI Threat Simulator: Processing live threat data...');

    // Get high-risk scan results that need counter-narratives
    const { data: threats, error } = await supabase
      .from('scan_results')
      .select('*')
      .in('severity', ['high', 'medium'])
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching threats:', error);
      throw error;
    }

    const counterNarratives = [];

    for (const threat of threats || []) {
      // Generate counter-narrative based on threat content
      const narrativeTone = threat.severity === 'high' ? 'assertive' : 'empathetic';
      const platform = threat.platform || 'general';
      
      // Create counter-narrative
      const { data: narrative, error: narrativeError } = await supabase
        .from('counter_narratives')
        .insert({
          threat_id: threat.id,
          message: `Automated response to address concerns raised in ${platform}. We take all feedback seriously and are committed to transparency.`,
          platform: platform,
          tone: narrativeTone,
          status: 'pending',
          scheduled_at: new Date(Date.now() + 60000).toISOString() // 1 minute delay
        })
        .select()
        .single();

      if (!narrativeError && narrative) {
        counterNarratives.push(narrative);

        // Update threat status to show it's being addressed
        await supabase
          .from('scan_results')
          .update({ status: 'actioned' })
          .eq('id', threat.id);
      }
    }

    // Log RSI activation
    if (counterNarratives.length > 0) {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'rsi_activation',
        module_source: 'RSI™',
        operation_data: { 
          narratives_generated: counterNarratives.length,
          threats_addressed: threats?.length || 0
        },
        success: true
      });
    }

    return new Response(JSON.stringify({
      success: true,
      threatsAnalyzed: threats?.length || 0,
      narrativesGenerated: counterNarratives.length,
      counterNarratives: counterNarratives,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('RSI Threat Simulator error:', error);
    return new Response(JSON.stringify({
      error: 'RSI Threat Simulator failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
