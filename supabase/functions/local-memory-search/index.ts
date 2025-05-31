
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const LOCAL_INFERENCE_URL = Deno.env.get('LOCAL_INFERENCE_URL') || 'http://localhost:3001';

serve(async (req) => {
  console.log('[LOCAL-MEMORY-SEARCH] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, entityName, searchType = 'threat_patterns', limit = 5 } = await req.json();
    
    console.log(`[LOCAL-MEMORY-SEARCH] Searching for: ${query}, entity: ${entityName}`);

    // Call local memory search endpoint
    const response = await fetch(`${LOCAL_INFERENCE_URL}/memory-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        entityName,
        searchType,
        limit
      })
    });

    if (!response.ok) {
      throw new Error(`Memory search error: ${response.status}`);
    }

    const searchResults = await response.json();
    
    // Store search query for learning
    await supabase.from('anubis_entity_memory').insert({
      entity_name: entityName,
      memory_type: 'search_query',
      memory_summary: `Memory search: ${query}`,
      context_reference: searchType,
      key_findings: { query, results_count: searchResults.length }
    });

    console.log(`[LOCAL-MEMORY-SEARCH] Found ${searchResults.length} relevant memories`);

    return new Response(JSON.stringify({
      success: true,
      query,
      entityName,
      results: searchResults,
      resultsCount: searchResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[LOCAL-MEMORY-SEARCH] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      results: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
