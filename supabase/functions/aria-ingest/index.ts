
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Load environment
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiKey = Deno.env.get('OPENAI_API_KEY')!;
const AUTH_KEY = "H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function extractEntities(text: string, apiKey: string) {
  const prompt = `
Extract all people, organizations, and social handles from the following text.

Return in JSON format like:
[
  { "name": "Jane Doe", "type": "PERSON" },
  { "name": "ACME Corp", "type": "ORG" },
  { "name": "@janedoe", "type": "SOCIAL" }
]

Text:
"""${text}"""
`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the more efficient mini model
        messages: [
          { role: 'system', content: 'You are an entity extraction assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('OpenAI API error:', errorData);
      return [];
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e, 'Response was:', content);
      return [];
    }
  } catch (error) {
    console.error('Error in entity extraction:', error);
    return [];
  }
}

function sanitizeContent(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, '') // remove URLs
    .replace(/[^\x00-\x7F]+/g, '') // remove emojis
    .trim();
}

serve(async (req) => {
  console.log(`[ARIA-INGEST] Received ${req.method} request to aria-ingest function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[ARIA-INGEST] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log(`[ARIA-INGEST] Method not allowed: ${req.method}`);
      return new Response('Method Not Allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    // Check for authorization header
    const auth = req.headers.get('authorization');
    console.log(`[ARIA-INGEST] Authorization header received: ${auth ? 'YES' : 'NO'}`);
    
    if (!auth) {
      console.log("[ARIA-INGEST] Authentication failed: No authorization header provided");
      return new Response(JSON.stringify({ error: 'Authorization header required' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if the token matches our expected token
    const expectedAuth = `Bearer ${AUTH_KEY}`;
    console.log(`[ARIA-INGEST] Expected: "${expectedAuth}"`);
    console.log(`[ARIA-INGEST] Received: "${auth}"`);
    
    if (auth !== expectedAuth) {
      console.log("[ARIA-INGEST] Authentication failed: Invalid token");
      return new Response(JSON.stringify({ error: 'Invalid authorization token' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log("[ARIA-INGEST] Authentication successful!");
    
    // Parse request body
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
    } = await req.json();

    // Validate required fields
    if (!content || !platform || !url) {
      console.error('[ARIA-INGEST] Missing required fields');
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[ARIA-INGEST] Processing content from ${platform}: ${url.substring(0, 50)}...`);

    // Clean and process content
    const cleanedContent = sanitizeContent(content);
    console.log('[ARIA-INGEST] Extracting entities with OpenAI...');
    
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

  } catch (err) {
    console.error('[ARIA-INGEST] Function error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
