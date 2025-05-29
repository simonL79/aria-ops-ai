
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QueueItem {
  id: string
  raw_content: string
  source: string
  detected_at: string
  entity_match?: string
  risk_score?: number
  status: string
}

interface EnrichmentResult {
  sentiment: string
  threat_type: string
  summary: string
  risk_score: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting threat enrichment pipeline...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get pending queue items
    const { data: queueItems, error: queueError } = await supabase
      .from('threat_ingestion_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(5)

    if (queueError) {
      console.error('Queue fetch error:', queueError)
      throw queueError
    }

    if (!queueItems || queueItems.length === 0) {
      console.log('No pending queue items found')
      return new Response(JSON.stringify({ 
        message: 'No pending items in queue',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Processing ${queueItems.length} queue items...`)
    let processedCount = 0
    let errorCount = 0

    for (const item of queueItems as QueueItem[]) {
      try {
        console.log(`Processing item ${item.id}...`)

        // Update status to processing
        await supabase.from('threat_ingestion_queue')
          .update({ status: 'processing' })
          .eq('id', item.id)

        // GPT enrichment
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'system',
              content: 'Analyze this content for reputation threats. Respond with JSON: {"sentiment": "positive|neutral|negative", "threat_type": "legal|viral|offensive|spam|other", "summary": "brief summary", "risk_score": number 0-100}'
            }, {
              role: 'user',
              content: item.raw_content.substring(0, 1000) // Limit content length
            }],
            temperature: 0.3,
            max_tokens: 200
          })
        })

        if (!gptResponse.ok) {
          throw new Error(`OpenAI API error: ${gptResponse.status}`)
        }

        const gptData = await gptResponse.json()
        let enrichment: EnrichmentResult

        try {
          enrichment = JSON.parse(gptData.choices[0].message.content)
        } catch {
          // Fallback enrichment if JSON parsing fails
          enrichment = {
            sentiment: 'neutral',
            threat_type: 'other',
            summary: 'Auto-processed content',
            risk_score: 50
          }
        }

        // Insert into threats table
        const { error: insertError } = await supabase.from('threats').insert({
          entity_id: item.entity_match || null,
          source: item.source,
          content: item.raw_content,
          detected_at: item.detected_at,
          threat_type: enrichment.threat_type,
          sentiment: enrichment.sentiment,
          risk_score: enrichment.risk_score,
          summary: enrichment.summary,
          is_live: true,
          status: 'active'
        })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw insertError
        }

        // Update queue status to complete
        await supabase.from('threat_ingestion_queue').update({
          status: 'complete',
          processing_notes: 'Enriched and inserted to threats table',
          processed_by: 'edge-gpt-pipeline',
          risk_score: enrichment.risk_score
        }).eq('id', item.id)

        processedCount++
        console.log(`Successfully processed item ${item.id}`)

      } catch (err) {
        console.error(`Processing error for item ${item.id}:`, err)
        errorCount++
        
        // Update queue status to error
        await supabase.from('threat_ingestion_queue').update({
          status: 'error',
          processing_notes: err.message || 'Unknown processing error',
          processed_by: 'edge-gpt-pipeline'
        }).eq('id', item.id)
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
        name: 'Threat Detection',
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
      message: `Pipeline completed: ${processedCount} threats processed`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Pipeline error:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
