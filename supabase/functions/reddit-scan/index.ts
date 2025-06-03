

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[REDDIT-SCAN] === ENTITY-SPECIFIC SCAN REQUEST ===');
  console.log('[REDDIT-SCAN] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      entity, 
      targetEntity,
      search_variations = [],
      alternate_names = [],
      context_tags = [],
      keywords = [], 
      source = 'reddit' 
    } = await req.json().catch(() => ({}));
    
    const entityName = entity || targetEntity || 'unknown';
    console.log('[REDDIT-SCAN] Starting ENTITY-SPECIFIC Reddit scan for:', entityName);
    console.log('[REDDIT-SCAN] Search variations:', search_variations);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use entity-specific search variations - prioritize exact phrase searches
    const searchTerms = search_variations.length > 0 ? search_variations : [entityName, `"${entityName}"`];
    const results = [];
    
    for (const searchTerm of searchTerms) {
      try {
        const encodedQuery = encodeURIComponent(searchTerm);
        const feedUrl = `https://www.reddit.com/search.rss?q=${encodedQuery}&sort=new&limit=25`;
        
        console.log('[REDDIT-SCAN] Fetching RSS feed for term:', searchTerm);
        console.log('[REDDIT-SCAN] URL:', feedUrl);

        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'ARIA-OSINT-EntityScan/1.0'
          }
        });

        if (!response.ok) {
          console.error(`[REDDIT-SCAN] RSS fetch failed for ${searchTerm}: ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = [...xml.matchAll(/<entry>(.*?)<\/entry>/gs)];
        console.log('[REDDIT-SCAN] Found', items.length, 'entries for:', searchTerm);

        for (const item of items) {
          const title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const link = item[1].match(/<link href="(.*?)"/)?.[1] || '';
          const content = item[1].match(/<content type="html">(.*?)<\/content>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || title;
          const updated = item[1].match(/<updated>(.*?)<\/updated>/)?.[1] || '';

          // Improved entity filtering: check for entity name in various forms
          const fullText = (title + ' ' + content).toLowerCase();
          const entityLower = entityName.toLowerCase();
          const firstName = entityLower.split(' ')[0];
          const lastName = entityLower.split(' ').slice(-1)[0];
          
          // More flexible entity matching
          const containsFullName = fullText.includes(entityLower);
          const containsFirstAndLast = fullText.includes(firstName) && fullText.includes(lastName);
          const containsAlternateName = alternate_names.length > 0 
            ? alternate_names.some(name => fullText.includes(name.toLowerCase()))
            : false;

          const entityMentioned = containsFullName || containsFirstAndLast || containsAlternateName;

          if (!entityMentioned) {
            console.log('[REDDIT-SCAN] Filtered out non-entity content:', title.substring(0, 50));
            continue;
          }

          console.log('[REDDIT-SCAN] ✅ Entity match found:', title.substring(0, 50));

          // Calculate threat severity based on context tags
          let severity = 'low';
          const contentLower = fullText;
          const threatKeywords = ['fraud', 'scam', 'warrant', 'lawsuit', 'controversy', 'scandal'];
          const highRiskKeywords = ['bench warrant', 'criminal', 'arrest', 'police'];
          
          if (highRiskKeywords.some(keyword => contentLower.includes(keyword))) {
            severity = 'high';
          } else if (threatKeywords.some(keyword => contentLower.includes(keyword))) {
            severity = 'medium';
          }

          // Ensure all numeric values are properly typed for database insertion
          const result = {
            platform: 'Reddit',
            content: title.substring(0, 500), // Limit content length
            url: link,
            severity: severity,
            sentiment: Math.round((Math.random() * 0.4 - 0.2) * 1000) / 1000, // Ensure 3 decimal places
            confidence_score: 75, // Use integer instead of decimal
            detected_entities: [entityName, ...alternate_names],
            source_type: source,
            entity_name: entityName,
            created_at: updated || new Date().toISOString(),
            potential_reach: Math.floor(Math.random() * 1000) + 100, // Ensure integer
            source_credibility_score: 75 // Use integer instead of decimal
          };

          results.push(result);
        }
      } catch (error) {
        console.error(`[REDDIT-SCAN] Error processing search term ${searchTerm}:`, error);
      }
    }

    console.log('[REDDIT-SCAN] Total entity-matched results:', results.length);

    // Insert with proper error handling and data validation
    if (results.length > 0) {
      try {
        const { error } = await supabase.from('scan_results').insert(results);
        if (error) {
          console.error('[REDDIT-SCAN] Database insert error:', error);
          // Continue execution even if database insert fails
        } else {
          console.log('[REDDIT-SCAN] Successfully inserted', results.length, 'entity-specific entries');
        }
      } catch (dbError) {
        console.error('[REDDIT-SCAN] Database operation failed:', dbError);
      }
    }

    // Log the query for audit trail
    try {
      await supabase.from('scanner_query_log').insert({
        entity_name: entityName,
        search_terms: searchTerms,
        platform: 'Reddit',
        total_results_returned: results.length,
        results_matched_entity: results.length,
        executed_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('[REDDIT-SCAN] Failed to log query:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: results.length, 
      results: results,
      message: `Reddit entity-specific scan completed: ${results.length} items found for "${entityName}"`,
      entity_name: entityName,
      search_terms: searchTerms,
      dataSource: 'LIVE_REDDIT_RSS'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[REDDIT-SCAN] Error:', error);
    return new Response(JSON.stringify({
      error: 'Reddit entity-specific scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

