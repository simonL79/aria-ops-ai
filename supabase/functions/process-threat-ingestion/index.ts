
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Processing threat ingestion queue...')

    // Get pending items from the ingestion queue
    const { data: queue, error: queueError } = await supabase
      .from('threat_ingestion_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(5)

    if (queueError) {
      console.error('Queue fetch error:', queueError)
      throw queueError
    }

    if (!queue || queue.length === 0) {
      console.log('No pending items in queue')
      
      // Log the successful check
      await supabase.from('edge_function_events').insert({
        function_name: 'process-threat-ingestion',
        status: 'success',
        result_summary: 'No pending items to process',
        event_payload: { checked_at: new Date().toISOString() }
      })

      return new Response(JSON.stringify({
        success: true,
        message: 'No pending items in queue',
        processed: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Processing ${queue.length} items from queue...`)
    let processedCount = 0
    let errorCount = 0

    for (const item of queue) {
      try {
        console.log(`Processing item ${item.id}...`)

        // Update queue item to processing status
        await supabase
          .from('threat_ingestion_queue')
          .update({ status: 'processing' })
          .eq('id', item.id)

        // Create enriched threat summary
        const enrichedSummary = `AI Analysis: ${item.raw_content.slice(0, 100)}... [Risk: ${item.risk_score}/100]`
        
        // Determine threat classification
        let threatType = 'reputation_risk'
        let sentiment = 'negative'
        
        if (item.raw_content.toLowerCase().includes('legal')) {
          threatType = 'legal'
        } else if (item.raw_content.toLowerCase().includes('review') || item.raw_content.toLowerCase().includes('complaint')) {
          threatType = 'review'
        } else if (item.raw_content.toLowerCase().includes('social')) {
          threatType = 'social_media'
        }

        // Insert into threats table
        const { error: insertError } = await supabase
          .from('threats')
          .insert({
            entity_id: item.entity_match,
            source: item.source,
            content: item.raw_content,
            detected_at: item.detected_at,
            threat_type: threatType,
            sentiment: sentiment,
            risk_score: item.risk_score || 50,
            summary: enrichedSummary,
            is_live: true,
            status: 'active'
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw insertError
        }

        // Update queue item to completed
        await supabase
          .from('threat_ingestion_queue')
          .update({
            status: 'complete',
            processing_notes: enrichedSummary
          })
          .eq('id', item.id)

        // Log successful processing
        await supabase.from('edge_function_events').insert({
          function_name: 'process-threat-ingestion',
          status: 'success',
          event_payload: {
            item_id: item.id,
            source: item.source,
            risk_score: item.risk_score
          },
          result_summary: `Processed threat from ${item.source} with risk score ${item.risk_score}`
        })

        processedCount++
        console.log(`Successfully processed item ${item.id}`)

      } catch (err) {
        console.error(`Processing error for item ${item.id}:`, err)
        errorCount++

        // Update queue item to error status
        await supabase
          .from('threat_ingestion_queue')
          .update({
            status: 'error',
            processing_notes: err.message || 'Unknown processing error'
          })
          .eq('id', item.id)

        // Log the error
        await supabase.from('edge_function_events').insert({
          function_name: 'process-threat-ingestion',
          status: 'fail',
          event_payload: {
            item_id: item.id,
            error: err.message
          },
          result_summary: `Failed to process item: ${err.message}`
        })
      }
    }

    // Update live status after processing
    const { data: threatCount } = await supabase
      .from('threats')
      .select('*', { count: 'exact', head: true })
      .eq('is_live', true)
      .eq('status', 'active')

    await supabase.from('live_status').upsert([
      {
        name: 'Threat Processing',
        active_threats: threatCount?.length || 0,
        last_threat_seen: new Date().toISOString(),
        last_report: new Date().toISOString(),
        system_status: 'LIVE'
      }
    ], { onConflict: 'name' })

    return new Response(JSON.stringify({
      success: true,
      processed: processedCount,
      errors: errorCount,
      message: `Processing completed: ${processedCount} threats processed, ${errorCount} errors`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
