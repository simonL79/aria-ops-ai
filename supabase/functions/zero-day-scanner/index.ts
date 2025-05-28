
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

    console.log('Zero-Day Scanner: Analyzing live threat patterns...');

    // Get recent high-severity scan results
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('severity', 'high')
      .gte('created_at', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()) // Last 4 hours
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching scan results:', error);
      throw error;
    }

    const zeroDayEvents = [];
    const suspiciousPatterns = [
      'exploit', 'vulnerability', 'zero-day', 'backdoor', 'malware', 
      'ransomware', 'phishing', 'social engineering', 'data breach',
      'unauthorized access', 'privilege escalation', 'remote code execution'
    ];

    for (const result of scanResults || []) {
      const content = (result.content || '').toLowerCase();
      const detectedPatterns = suspiciousPatterns.filter(pattern => 
        content.includes(pattern)
      );

      if (detectedPatterns.length > 0) {
        // Calculate entropy score based on content analysis
        const entropyScore = Math.min(1.0, 
          (Math.abs(result.sentiment || 0) * 0.5) + 
          (detectedPatterns.length * 0.2) + 
          (result.potential_reach ? Math.min(0.3, result.potential_reach / 10000) : 0)
        );

        // Trigger zero-day event
        const { data: eventData, error: eventError } = await supabase.rpc('api_anubis_trigger_zero_day', {
          p_vector: `${result.platform} Detection`,
          p_score: entropyScore,
          p_signature: `Patterns: ${detectedPatterns.join(', ')} | Content: ${content.substring(0, 100)}`,
          p_url: result.url || ''
        });

        if (!eventError && eventData) {
          zeroDayEvents.push({
            eventId: eventData,
            patterns: detectedPatterns,
            entropyScore,
            source: result.platform,
            originalContent: content.substring(0, 200)
          });

          // Simulate AI watchdog verdicts
          const watchdogs = ['OpenAI-GPT4', 'Anthropic-Claude', 'Google-Gemini'];
          for (const watchdog of watchdogs) {
            const isHighRisk = detectedPatterns.length > 2 || entropyScore > 0.7;
            const verdict = isHighRisk ? 
              (Math.random() > 0.3 ? 'malicious' : 'inconclusive') : 
              (Math.random() > 0.6 ? 'benign' : 'inconclusive');
            
            const confidence = Math.random() * 0.3 + (isHighRisk ? 0.7 : 0.5); // 0.5-1.0

            await supabase.rpc('api_anubis_submit_verdict', {
              p_threat_id: eventData,
              p_watchdog: watchdog,
              p_verdict: verdict,
              p_confidence: confidence
            });
          }
        }
      }
    }

    // Check dark web feed for additional threats
    const { data: darkwebData } = await supabase
      .from('darkweb_feed')
      .select('*')
      .gte('inserted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('entropy_score', { ascending: false })
      .limit(10);

    for (const dwItem of darkwebData || []) {
      if (dwItem.entropy_score > 0.6) {
        const { data: eventData } = await supabase.rpc('api_anubis_trigger_zero_day', {
          p_vector: 'Dark Web Intelligence',
          p_score: dwItem.entropy_score,
          p_signature: `Actor: ${dwItem.actor_alias} | Content: ${dwItem.content_text?.substring(0, 100)}`,
          p_url: dwItem.source_url || ''
        });

        if (eventData) {
          zeroDayEvents.push({
            eventId: eventData,
            patterns: ['dark_web_threat'],
            entropyScore: dwItem.entropy_score,
            source: 'Dark Web',
            originalContent: dwItem.content_text?.substring(0, 200)
          });
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      eventsTriggered: zeroDayEvents.length,
      events: zeroDayEvents,
      scanTimestamp: new Date().toISOString(),
      scanScope: {
        scanResults: scanResults?.length || 0,
        darkwebItems: darkwebData?.length || 0,
        timeWindow: '4 hours'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Zero-Day Scanner error:', error);
    return new Response(JSON.stringify({
      error: 'Zero-Day Scanner failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
