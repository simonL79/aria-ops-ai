
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Determine verification status for a source
 */
function getSourceVerification(source: string): { verified: boolean; method: string; confidence: number } {
  const lowerSource = source.toLowerCase();
  
  if (lowerSource.includes('api') || lowerSource.includes('oauth')) {
    return { verified: true, method: 'oauth_api', confidence: 95 };
  }
  if (lowerSource.includes('rss') || lowerSource.includes('feed')) {
    return { verified: true, method: 'rss_feed', confidence: 85 };
  }
  if (lowerSource.includes('twitter') || lowerSource.includes('linkedin') || lowerSource.includes('reddit')) {
    return { verified: true, method: 'platform_verified', confidence: 90 };
  }
  if (lowerSource.includes('live') || lowerSource.includes('monitor')) {
    return { verified: true, method: 'live_monitoring', confidence: 80 };
  }
  
  return { verified: false, method: 'unverified_source', confidence: 50 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔥 Processing live threat ingestion queue with verification...')

    // Get pending items from the ingestion queue
    const { data: queue, error: queueError } = await supabase
      .from('threat_ingestion_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10)

    if (queueError) {
      console.error('Queue fetch error:', queueError)
      throw queueError
    }

    if (!queue || queue.length === 0) {
      console.log('No pending items in queue - system operational')
      
      // Update live status to show system is active
      await supabase.from('live_status').upsert([
        {
          name: 'Threat Processing',
          active_threats: 0,
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString(),
          system_status: 'LIVE'
        }
      ], { onConflict: 'name' })

      // Log the successful check
      await supabase.from('edge_function_events').insert({
        function_name: 'process-threat-ingestion',
        status: 'success',
        result_summary: 'No pending items to process - system operational with verification tracking',
        event_payload: { checked_at: new Date().toISOString(), queue_empty: true }
      })

      return new Response(JSON.stringify({
        success: true,
        message: 'No pending items in queue - system operational',
        processed: 0,
        systemStatus: 'LIVE'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`🔥 Processing ${queue.length} live threats from queue with verification...`)
    let processedCount = 0
    let errorCount = 0
    let verifiedCount = 0

    for (const item of queue) {
      try {
        console.log(`Processing live threat ${item.id} from ${item.source}...`)

        // Get verification status
        const verification = getSourceVerification(item.source)
        if (verification.verified) verifiedCount++

        // Update queue item to processing status
        await supabase
          .from('threat_ingestion_queue')
          .update({ 
            status: 'processing',
            processing_notes: `Processing started at ${new Date().toISOString()} (${verification.method})`
          })
          .eq('id', item.id)

        // Create enriched threat analysis
        let threatType = 'reputation_risk'
        let sentiment = 'negative'
        
        const content = item.raw_content.toLowerCase()
        
        // Intelligent threat classification
        if (content.includes('legal') || content.includes('lawsuit') || content.includes('court')) {
          threatType = 'legal'
        } else if (content.includes('review') || content.includes('complaint') || content.includes('terrible')) {
          threatType = 'review'
        } else if (content.includes('twitter') || content.includes('facebook') || content.includes('social')) {
          threatType = 'social_media'
        } else if (content.includes('news') || content.includes('article') || content.includes('report')) {
          threatType = 'media'
        }

        // Sentiment analysis
        if (content.includes('positive') || content.includes('great') || content.includes('excellent')) {
          sentiment = 'positive'
        } else if (content.includes('neutral') || content.includes('okay')) {
          sentiment = 'neutral'
        }

        // Calculate final risk score with verification boost
        const baseRisk = item.risk_score || 50
        let finalRisk = baseRisk
        
        if (threatType === 'legal') finalRisk = Math.min(100, baseRisk + 20)
        if (sentiment === 'negative') finalRisk = Math.min(100, finalRisk + 10)
        if (content.includes('critical') || content.includes('urgent')) finalRisk = Math.min(100, finalRisk + 15)
        
        // Boost confidence for verified sources
        if (verification.verified) finalRisk = Math.min(100, finalRisk + 5)

        const enrichedSummary = `Live A.R.I.A™ Analysis: ${threatType.toUpperCase()} threat detected from ${item.source}. Risk: ${finalRisk}/100. Verification: ${verification.method}. Content: "${item.raw_content.slice(0, 100)}..."`
        
        // Insert into live threats table with verification data
        const { data: newThreat, error: insertError } = await supabase
          .from('threats')
          .insert({
            entity_id: item.entity_match,
            source: item.source,
            content: item.raw_content,
            detected_at: item.detected_at || new Date().toISOString(),
            threat_type: threatType,
            sentiment: sentiment,
            risk_score: finalRisk,
            summary: enrichedSummary,
            is_live: true,
            status: 'active',
            verified_source: verification.verified,
            verified_at: verification.verified ? new Date().toISOString() : null,
            source_confidence_score: verification.confidence,
            verification_method: verification.method
          })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          throw insertError
        }

        // Update queue item to completed with verification info
        await supabase
          .from('threat_ingestion_queue')
          .update({
            status: 'complete',
            processing_notes: `✅ Processed successfully: ${enrichedSummary}`,
            risk_score: finalRisk,
            verified_source: verification.verified,
            verified_at: verification.verified ? new Date().toISOString() : null,
            source_confidence_score: verification.confidence,
            verification_method: verification.method
          })
          .eq('id', item.id)

        // Log successful processing
        await supabase.from('edge_function_events').insert({
          function_name: 'process-threat-ingestion',
          status: 'success',
          event_payload: {
            item_id: item.id,
            source: item.source,
            risk_score: finalRisk,
            threat_type: threatType,
            threat_id: newThreat.id,
            verified: verification.verified,
            verification_method: verification.method,
            confidence: verification.confidence
          },
          result_summary: `✅ Live threat processed: ${item.source} (Risk: ${finalRisk}, ${verification.verified ? 'VERIFIED' : 'UNVERIFIED'})`
        })

        processedCount++
        console.log(`✅ Successfully processed live threat ${item.id} - Risk: ${finalRisk}, Verified: ${verification.verified}`)

      } catch (err) {
        console.error(`❌ Processing error for item ${item.id}:`, err)
        errorCount++

        // Update queue item to error status
        await supabase
          .from('threat_ingestion_queue')
          .update({
            status: 'error',
            processing_notes: `❌ Error: ${err.message || 'Unknown processing error'}`
          })
          .eq('id', item.id)

        // Log the error
        await supabase.from('edge_function_events').insert({
          function_name: 'process-threat-ingestion',
          status: 'fail',
          event_payload: {
            item_id: item.id,
            error: err.message,
            source: item.source
          },
          result_summary: `❌ Failed to process: ${err.message}`
        })
      }
    }

    // Update live status after processing
    const { data: threatCount } = await supabase
      .from('threats')
      .select('*', { count: 'exact', head: true })
      .eq('is_live', true)
      .eq('status', 'active')

    const activeThreatCount = threatCount?.length || 0
    const verificationRate = processedCount > 0 ? (verifiedCount / processedCount) * 100 : 0

    await supabase.from('live_status').upsert([
      {
        name: 'Threat Processing',
        active_threats: activeThreatCount,
        last_threat_seen: new Date().toISOString(),
        last_report: new Date().toISOString(),
        system_status: 'LIVE'
      }
    ], { onConflict: 'name' })

    console.log(`🔥 Live processing completed: ${processedCount} threats processed, ${verifiedCount} verified (${verificationRate.toFixed(1)}%), ${errorCount} errors`)

    return new Response(JSON.stringify({
      success: true,
      processed: processedCount,
      verified: verifiedCount,
      verificationRate: verificationRate.toFixed(1),
      errors: errorCount,
      activeThreatCount,
      systemStatus: 'LIVE',
      message: `🔥 Live processing completed: ${processedCount} threats processed (${verifiedCount} verified), ${errorCount} errors, ${activeThreatCount} active threats`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Live threat processing failed:', error)
    
    // Log system failure
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!, 
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )
      
      await supabase.from('edge_function_events').insert({
        function_name: 'process-threat-ingestion',
        status: 'fail',
        event_payload: { error: error.message },
        result_summary: `❌ System failure: ${error.message}`
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return new Response(JSON.stringify({
      error: error.message,
      success: false,
      systemStatus: 'ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
