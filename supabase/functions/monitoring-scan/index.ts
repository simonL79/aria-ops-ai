
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

    console.log('[MONITORING-SCAN] Starting LIVE-ONLY comprehensive monitoring scan...');

    const { fullScan, targetEntity, source } = await req.json().catch(() => ({}));

    // STRICT: Clean ALL mock/demo/test data - ZERO TOLERANCE
    console.log('[MONITORING-SCAN] ENFORCING LIVE DATA ONLY - Purging all non-live data...');
    const { error: cleanupError } = await supabase
      .from('scan_results')
      .delete()
      .or('content.ilike.%test%,content.ilike.%mock%,content.ilike.%demo%,content.ilike.%sample%,platform.eq.System,platform.eq.ARIA System,platform.eq.ARIA Monitor');

    if (cleanupError) {
      console.error('[MONITORING-SCAN] Error purging non-live data:', cleanupError);
    }

    // Also clean content_alerts of any non-live data
    await supabase
      .from('content_alerts')
      .delete()
      .or('content.ilike.%test%,content.ilike.%mock%,content.ilike.%demo%,content.ilike.%sample%');

    console.log('[MONITORING-SCAN] All non-live data purged from system');

    // Update monitoring status to show scan is active
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: true,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (statusError) {
      console.error('[MONITORING-SCAN] Error updating monitoring status:', statusError);
    }

    const results = [];

    // Call the Reddit scan function for LIVE data only
    try {
      console.log('[MONITORING-SCAN] Calling LIVE Reddit scan function...');
      const { data: redditData, error: redditError } = await supabase.functions.invoke('reddit-scan');
      
      if (redditError) {
        console.error('[MONITORING-SCAN] LIVE Reddit scan error:', redditError);
        throw new Error(`LIVE Reddit scan failed: ${redditError.message}`);
      } 
      
      if (redditData && redditData.results && redditData.dataSource === 'LIVE_REDDIT_API') {
        console.log(`[MONITORING-SCAN] LIVE Reddit scan completed: found ${redditData.matchesFound || 0} real matches`);
        
        // Insert LIVE Reddit results directly into scan_results with proper fields
        for (const result of redditData.results) {
          const scanResult = {
            platform: 'Reddit',
            content: result.title || result.content || 'Live Reddit post content',
            url: result.url || '',
            severity: 'medium',
            status: 'new',
            threat_type: 'social_media',
            sentiment: -0.2,
            confidence_score: 85,
            potential_reach: result.potential_reach || 1000,
            detected_entities: Array.isArray(result.detected_entities) ? result.detected_entities : [],
            source_type: 'live_api',
            entity_name: result.entity_name || 'business_entity',
            source_credibility_score: 75,
            media_is_ai_generated: false,
            ai_detection_confidence: 0
          };
          
          const { error: insertError } = await supabase
            .from('scan_results')
            .insert(scanResult);
            
          if (insertError) {
            console.error('[MONITORING-SCAN] Error inserting LIVE Reddit result:', insertError);
          } else {
            results.push(scanResult);
            console.log(`[MONITORING-SCAN] Successfully inserted LIVE Reddit result: ${scanResult.content.substring(0, 50)}...`);
          }
        }
      } else {
        console.log('[MONITORING-SCAN] No LIVE Reddit data received - will not add any fallback data');
      }
    } catch (redditScanError) {
      console.error('[MONITORING-SCAN] LIVE Reddit scan failed:', redditScanError);
      // NO FALLBACK DATA - LIVE ONLY ENFORCEMENT
    }

    console.log(`[MONITORING-SCAN] LIVE monitoring scan completed. Found ${results.length} real results.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `LIVE monitoring scan completed: ${results.length} real results found`,
        enforcement: 'LIVE_DATA_ONLY',
        cleanup_performed: true,
        stats: {
          platformsScanned: ['Reddit (Live API)'],
          redditScanTriggered: true,
          resultsFound: results.length,
          dataSource: 'LIVE_ONLY'
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[MONITORING-SCAN] LIVE monitoring scan error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'LIVE monitoring scan failed', 
        details: error.message,
        enforcement: 'LIVE_DATA_ONLY'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
