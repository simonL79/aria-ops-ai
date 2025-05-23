
import { sanitizeContent } from './utils.ts';
import { extractEntities } from './entityExtraction.ts';
import { analyzeThreatWithOpenAI } from './threatAnalysis.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function validateRequest(req: Request): Response | null {
  if (req.method !== 'POST') {
    console.log('[ARIA-INGEST] Invalid method:', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  return null;
}

export async function handleRequest(requestData: any, supabase: any): Promise<Response> {
  console.log('[ARIA-INGEST] Processing request data');
  
  const {
    content,
    platform,
    url,
    severity = 'medium',
    threat_type,
    source_type = 'manual',
    confidence_score = 75,
    potential_reach = 100,
    test = false
  } = requestData;

  if (!content || !platform) {
    return new Response(JSON.stringify({ error: 'Missing required fields: content, platform' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log(`[ARIA-INGEST] Processing content from ${platform}: ${url}...`);
    
    // Sanitize content
    const sanitizedContent = sanitizeContent(content);
    
    // Extract entities
    console.log('[ARIA-INGEST] Extracting entities with OpenAI...');
    const entities = await extractEntities(sanitizedContent);
    console.log('[ARIA-INGEST] Extracted entities:', entities);
    
    // Analyze threat with OpenAI
    console.log('[ARIA-INGEST] Analyzing threat with OpenAI...');
    const threatAnalysis = await analyzeThreatWithOpenAI(sanitizedContent);
    console.log('[ARIA-INGEST] Threat analysis result:', threatAnalysis);
    
    // Find the primary entity (prefer PERSON, then ORG)
    const primaryEntity = entities.find(e => e.type === 'PERSON') || 
                         entities.find(e => e.type === 'ORG') ||
                         entities.find(e => e.type === 'SOCIAL');

    const payload = {
      content: sanitizedContent,
      platform,
      url: url || `https://manual-entry-${platform}.com/${Date.now()}`,
      detected_entities: entities,
      risk_entity_name: primaryEntity?.name || null,
      risk_entity_type: primaryEntity?.type?.toLowerCase() || null,
      severity,
      threat_type,
      source_type,
      status: 'new',
      confidence_score,
      sentiment: 0, // Default neutral sentiment
      potential_reach,
      threat_summary: threatAnalysis.threat_summary,
      threat_severity: threatAnalysis.threat_severity
    };

    if (test) {
      console.log('[ARIA-INGEST] Test mode - returning payload without inserting');
      return new Response(JSON.stringify({ 
        test: true, 
        success: true,
        payload 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Insert into scan_results table
    console.log('[ARIA-INGEST] Inserting into scan_results...');
    const { data: insertedData, error: insertError } = await supabase
      .from('scan_results')
      .insert({
        content: payload.content,
        platform: payload.platform,
        url: payload.url,
        detected_entities: payload.detected_entities.map(e => e.name),
        risk_entity_name: payload.risk_entity_name,
        risk_entity_type: payload.risk_entity_type,
        severity: payload.severity,
        threat_type: payload.threat_type,
        source_type: payload.source_type,
        status: payload.status,
        confidence_score: payload.confidence_score,
        sentiment: payload.sentiment,
        potential_reach: payload.potential_reach,
        threat_summary: payload.threat_summary,
        threat_severity: payload.threat_severity
      })
      .select()
      .single();

    if (insertError) {
      console.error('[ARIA-INGEST] Error inserting scan result:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to insert scan result',
        details: insertError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('[ARIA-INGEST] Successfully inserted scan result:', insertedData.id);

    return new Response(JSON.stringify({
      success: true,
      payload,
      inserted: insertedData,
      message: 'Content processed and stored successfully with threat analysis'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[ARIA-INGEST] Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal processing error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
