
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { extractEntities } from './entityExtraction.ts';
import { sanitizeContent } from './utils.ts';
import { corsHeaders, handleRequest, validateRequest } from './middleware.ts';

// Load environment
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const AUTH_KEY = "H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  console.log(`[ARIA-INGEST] === NEW REQUEST ===`);
  console.log(`[ARIA-INGEST] Method: ${req.method}`);
  console.log(`[ARIA-INGEST] URL: ${req.url}`);
  
  // Log all headers for debugging
  console.log(`[ARIA-INGEST] Headers:`);
  for (const [key, value] of req.headers.entries()) {
    console.log(`[ARIA-INGEST]   ${key}: ${value}`);
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[ARIA-INGEST] Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    const methodValidation = validateRequest(req);
    if (methodValidation) return methodValidation;
    
    // Parse request body
    const bodyText = await req.text();
    console.log(`[ARIA-INGEST] Raw request body: ${bodyText}`);
    
    let requestData;
    try {
      requestData = JSON.parse(bodyText);
      console.log(`[ARIA-INGEST] Parsed JSON successfully`);
    } catch (e) {
      console.error(`[ARIA-INGEST] Failed to parse JSON:`, e);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extract the auth key regardless of format (supporting multiple formats)
    const authHeader = req.headers.get('authorization') || '';
    console.log(`[ARIA-INGEST] Raw auth header: "${authHeader}"`);
    
    let receivedKey = '';
    
    // Extract the actual key part regardless of format
    if (authHeader.startsWith('Bearer ')) {
      receivedKey = authHeader.substring(7).trim();
    } else if (authHeader.includes(' ')) {
      // Try to extract key if it's in another format with a space
      receivedKey = authHeader.split(' ')[1]?.trim() || '';
    } else {
      // Maybe it's just the raw key
      receivedKey = authHeader.trim();
    }
    
    console.log(`[ARIA-INGEST] Extracted key: "${receivedKey}" (${receivedKey.length} chars)`);
    console.log(`[ARIA-INGEST] Expected key: "${AUTH_KEY}" (${AUTH_KEY.length} chars)`);
    console.log(`[ARIA-INGEST] Keys match: ${receivedKey === AUTH_KEY}`);
    
    // More flexible auth check - just compare the actual key parts
    if (!receivedKey || receivedKey !== AUTH_KEY) {
      console.log(`[ARIA-INGEST] Auth failed - keys don't match`);
      
      return new Response(JSON.stringify({ 
        error: 'Authorization failed',
        debug: { 
          receivedKeyLength: receivedKey.length,
          expectedKeyLength: AUTH_KEY.length,
          hint: "Make sure the exact key is being sent, without any encoding issues"
        }
      }), {
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`[ARIA-INGEST] Auth successful - proceeding with request`);
    
    // Process the request
    return await handleRequest(requestData, supabase);
    
  } catch (err) {
    console.error('[ARIA-INGEST] Function error:', err);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: err.message,
      stack: err.stack
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
