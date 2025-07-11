
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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

    // Extract the auth key from the header - accepting a simple key without Bearer prefix
    const authHeader = req.headers.get('authorization') || '';
    console.log(`[ARIA-INGEST] Raw auth header: "${authHeader}"`);
    
    // The key should be sent directly as is - no Bearer prefix expected
    const receivedKey = authHeader.trim();
    
    console.log(`[ARIA-INGEST] Expected key: "${AUTH_KEY}" (${AUTH_KEY.length} chars)`);
    console.log(`[ARIA-INGEST] Received key: "${receivedKey}" (${receivedKey.length} chars)`);
    console.log(`[ARIA-INGEST] Keys match: ${receivedKey === AUTH_KEY}`);
    
    // Validate the key
    if (!receivedKey || receivedKey !== AUTH_KEY) {
      console.log(`[ARIA-INGEST] Auth failed - invalid or missing key`);
      return new Response(JSON.stringify({ 
        error: 'Invalid or missing authorization key',
        debug: { 
          receivedKeyLength: receivedKey.length,
          expectedKeyLength: AUTH_KEY.length,
          hasAuth: !!authHeader
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
