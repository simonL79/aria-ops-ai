
// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate request method
export function validateRequest(req: Request) {
  if (req.method !== 'POST') {
    console.log(`[ARIA-INGEST] Method not allowed: ${req.method}`);
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }
  return null;
}

// Import the sanitizeContent function from utils
import { sanitizeContent } from './utils.ts';
import { extractEntities } from './entityExtraction.ts';

// Process the request data
export async function handleRequest(requestData: any, supabase: any) {
  console.log(`[ARIA-INGEST] Processing request data`);

  const { 
    content, 
    platform, 
    url, 
    test = false, 
    severity = 'low', 
    threat_type = null,
    source_type = 'fallback_ai',
    confidence_score = 90,
    potential_reach = 0
  } = requestData;

  // Validate required fields
  if (!content || !platform || !url) {
    console.error('[ARIA-INGEST] Missing required fields');
    return new Response(JSON.stringify({ 
      error: 'Missing required fields',
      received: { content: !!content, platform: !!platform, url: !!url }
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  console.log(`[ARIA-INGEST] Processing content from ${platform}: ${url.substring(0, 50)}...`);

  // Clean and process content
  const cleanedContent = sanitizeContent(content);
  console.log('[ARIA-INGEST] Extracting entities with OpenAI...');
  
  const openaiKey = Deno.env.get('OPENAI_API_KEY')!;
  const detected_entities = await extractEntities(cleanedContent, openaiKey);
  const topEntity = detected_entities[0] ?? { name: null, type: null };

  console.log('[ARIA-INGEST] Extracted entities:', detected_entities);

  // Prepare payload for database
  const payload = {
    content: cleanedContent,
    platform,
    url,
    detected_entities,
    risk_entity_name: topEntity.name,
    risk_entity_type: topEntity.type,
    severity,
    threat_type,
    source_type,
    status: 'new',
    confidence_score,
    sentiment: 0,
    potential_reach
  };

  // Handle test mode
  if (test) {
    console.log('[ARIA-INGEST] Test mode - returning preview without inserting');
    return new Response(JSON.stringify({ test: true, payload }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Insert into database
  console.log('[ARIA-INGEST] Inserting into scan_results...');
  const { data: insertedData, error } = await supabase.from('scan_results').insert([payload]).select().single();

  if (error) {
    console.error('[ARIA-INGEST] Database insertion error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  console.log('[ARIA-INGEST] Successfully inserted scan result:', insertedData.id);

  // Log activity
  const { error: logError } = await supabase
    .from('activity_logs')
    .insert({
      action: 'aria_ingest',
      details: `Processed content from ${platform} via fallback pipeline`,
      entity_type: 'scan_result',
      entity_id: insertedData.id
    });

  if (logError) {
    console.error('[ARIA-INGEST] Activity log error:', logError);
  }

  return new Response(JSON.stringify({ 
    success: true, 
    inserted: insertedData,
    message: 'Content processed and inserted into A.R.I.A™ pipeline'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
