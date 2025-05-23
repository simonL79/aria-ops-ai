
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Load environment
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const AUTH_KEY = "H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=";
const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

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
  // Log incoming auth header for debug
  console.log("Auth header received:", req.headers.get('authorization'));
  
  // More detailed authorization logging
  const authHeader = req.headers.get('authorization') || 'No auth header';
  console.log("Full auth header:", authHeader);
  console.log("Expected auth:", `Bearer ${AUTH_KEY}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    // Validate authentication - more verbose for debugging
    const auth = req.headers.get('authorization');
    if (!auth) {
      console.error('No authorization header provided');
      return new Response('Unauthorized: No auth header', { 
        status: 401,
        headers: corsHeaders 
      });
    }
    
    // Check if auth header format is correct
    if (!auth.startsWith('Bearer ')) {
      console.error('Authorization header not in Bearer format');
      return new Response('Unauthorized: Invalid auth format', { 
        status: 401,
        headers: corsHeaders 
      });
    }
    
    // Extract token and compare
    const token = auth.substring(7); // Remove 'Bearer ' prefix
    console.log("Extracted token:", token);
    console.log("AUTH_KEY:", AUTH_KEY);
    
    if (token !== AUTH_KEY) {
      console.error('Invalid token provided');
      return new Response('Unauthorized: Invalid token', { 
        status: 401,
        headers: corsHeaders 
      });
    }

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
      console.error('Missing required fields');
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing content from ${platform}: ${url.substring(0, 50)}...`);

    // Clean and process content
    const cleanedContent = sanitizeContent(content);
    console.log('Extracting entities with OpenAI...');
    
    const detected_entities = await extractEntities(cleanedContent, openaiKey);
    const topEntity = detected_entities[0] ?? { name: null, type: null };

    console.log('Extracted entities:', detected_entities);

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
      console.log('Test mode - returning preview without inserting');
      return new Response(JSON.stringify({ test: true, payload }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Insert into database
    console.log('Inserting into scan_results...');
    const { data: insertedData, error } = await supabase.from('scan_results').insert([payload]).select().single();

    if (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Successfully inserted scan result:', insertedData.id);

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
      console.error('Activity log error:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      inserted: insertedData,
      message: 'Content processed and inserted into A.R.I.A™ pipeline'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
