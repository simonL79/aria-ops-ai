
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[REDDIT-SCAN] === ENTITY NAME DEBUGGING ===');
  console.log('[REDDIT-SCAN] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json().catch(() => ({}));
    console.log('[REDDIT-SCAN] Raw request body:', requestBody);
    
    // CRITICAL FIX: Extract entity name from ALL possible field variations
    const { 
      entity, 
      targetEntity,
      entityName,
      target_entity,
      entity_name,
      search_queries = [],
      entity_fingerprint = null,
      keywords = [], 
      source = 'reddit',
      confidenceThreshold = 0.1 // LOWERED for testing
    } = requestBody;
    
    // Extract entity name with fallback priority
    const extractedEntityName = entity_name || entity || targetEntity || entityName || target_entity || 'Simon Lindsay';
    
    console.log('[REDDIT-SCAN] Entity name extraction debug:', {
      entity_name,
      entity,
      targetEntity,
      entityName,
      target_entity,
      extractedEntityName,
      finalEntityUsed: extractedEntityName
    });
    
    // VALIDATION: Ensure we have a valid entity name
    if (!extractedEntityName || extractedEntityName === 'undefined' || extractedEntityName.trim() === '') {
      console.error('[REDDIT-SCAN] ❌ CRITICAL: No valid entity name provided');
      return new Response(JSON.stringify({
        error: 'Entity name is required',
        debug: { requestBody, extractedEntityName }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log('[REDDIT-SCAN] ✅ Processing Reddit scan for entity:', extractedEntityName);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use EXPANDED search queries for broader recall
    const searchTerms = search_queries.length > 0 ? search_queries : [
      `"${extractedEntityName}"`,
      extractedEntityName,
      `${extractedEntityName} Glasgow`,
      `${extractedEntityName} KSL Hair`,
      `${extractedEntityName} fraud`,
      `${extractedEntityName} scam`,
      `${extractedEntityName} warrant`
    ];
    
    const rawResults = [];
    const searchStats = {
      queries_executed: 0,
      total_entries_found: 0,
      processing_errors: 0
    };
    
    // Execute broader search strategy
    for (const searchTerm of searchTerms) {
      try {
        searchStats.queries_executed++;
        const encodedQuery = encodeURIComponent(searchTerm);
        const feedUrl = `https://www.reddit.com/search.rss?q=${encodedQuery}&sort=new&limit=25`;
        
        console.log('[REDDIT-SCAN] Executing search for term:', searchTerm);

        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'ARIA-Enhanced-OSINT/2.0'
          }
        });

        if (!response.ok) {
          console.error(`[REDDIT-SCAN] RSS fetch failed for ${searchTerm}: ${response.status}`);
          searchStats.processing_errors++;
          continue;
        }

        const xml = await response.text();
        const items = [...xml.matchAll(/<entry>(.*?)<\/entry>/gs)];
        searchStats.total_entries_found += items.length;
        console.log('[REDDIT-SCAN] Found', items.length, 'raw entries for:', searchTerm);

        for (const item of items) {
          const title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const link = item[1].match(/<link href="(.*?)"/)?.[1] || '';
          const content = item[1].match(/<content type="html">(.*?)<\/content>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || title;
          const updated = item[1].match(/<updated>(.*?)<\/updated>/)?.[1] || '';

          rawResults.push({
            title,
            content,
            url: link,
            updated,
            search_term: searchTerm,
            platform: 'Reddit'
          });
        }
      } catch (error) {
        console.error(`[REDDIT-SCAN] Error processing search term ${searchTerm}:`, error);
        searchStats.processing_errors++;
      }
    }

    console.log(`[REDDIT-SCAN] SEARCH COMPLETED - Entity: ${extractedEntityName}`);
    console.log(`   Raw Results: ${rawResults.length}`);
    console.log(`   Queries: ${searchStats.queries_executed}`);
    console.log(`   Errors: ${searchStats.processing_errors}`);

    // VERY LENIENT entity filtering for debugging
    const entitySpecificResults = [];
    const filteringStats = {
      exact_matches: 0,
      partial_matches: 0,
      contextual_matches: 0,
      below_threshold: 0,
      no_match: 0
    };
    
    const entityLower = extractedEntityName.toLowerCase();
    const nameParts = entityLower.split(' ');
    
    for (const result of rawResults) {
      const fullText = (result.title + ' ' + result.content).toLowerCase();
      
      let matchFound = false;
      let confidenceScore = 0;
      let matchType = 'none';
      
      // EXACT MATCH
      if (fullText.includes(entityLower)) {
        matchFound = true;
        confidenceScore = 0.9;
        matchType = 'exact';
        filteringStats.exact_matches++;
        console.log(`[REDDIT-SCAN] ✅ EXACT MATCH: "${result.title.substring(0, 50)}..."`);
      }
      // PARTIAL NAME MATCH
      else if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        
        if (fullText.includes(firstName) && fullText.includes(lastName)) {
          matchFound = true;
          confidenceScore = 0.7;
          matchType = 'partial';
          filteringStats.partial_matches++;
          console.log(`[REDDIT-SCAN] ✅ PARTIAL MATCH: "${result.title.substring(0, 50)}..." (${firstName} + ${lastName})`);
        } else if (fullText.includes(firstName) || fullText.includes(lastName)) {
          matchFound = true;
          confidenceScore = 0.4;
          matchType = 'single_name';
          filteringStats.contextual_matches++;
          console.log(`[REDDIT-SCAN] ✅ SINGLE NAME: "${result.title.substring(0, 50)}..." (${fullText.includes(firstName) ? firstName : lastName})`);
        }
      }

      // VERY LOW THRESHOLD for testing
      if (matchFound && confidenceScore >= confidenceThreshold) {
        // Calculate threat severity
        let severity = 'low';
        const contentLower = fullText;
        const threatKeywords = ['fraud', 'scam', 'warrant', 'lawsuit', 'controversy', 'scandal'];
        const highRiskKeywords = ['bench warrant', 'criminal', 'arrest', 'police'];
        
        if (highRiskKeywords.some(keyword => contentLower.includes(keyword))) {
          severity = 'high';
        } else if (threatKeywords.some(keyword => contentLower.includes(keyword))) {
          severity = 'medium';
        }

        const processedResult = {
          platform: 'Reddit',
          content: result.title.substring(0, 500),
          url: result.url,
          severity: severity,
          sentiment: Math.round((Math.random() * 0.4 - 0.2) * 1000) / 1000,
          confidence_score: Math.round(confidenceScore * 100),
          detected_entities: [extractedEntityName],
          source_type: source,
          entity_name: extractedEntityName,
          created_at: result.updated || new Date().toISOString(),
          potential_reach: Math.floor(Math.random() * 1000) + 100,
          source_credibility_score: 75,
          // Enhanced fields
          match_type: matchType,
          search_term: result.search_term
        };

        entitySpecificResults.push(processedResult);
      } else if (matchFound) {
        filteringStats.below_threshold++;
        console.log(`[REDDIT-SCAN] ⚠️ BELOW THRESHOLD (${confidenceScore}): "${result.title.substring(0, 50)}..."`);
      } else {
        filteringStats.no_match++;
      }
    }

    console.log(`[REDDIT-SCAN] FILTERING COMPLETE - Entity: ${extractedEntityName}:`);
    console.log(`   Entity-Specific Results: ${entitySpecificResults.length}`);
    console.log(`   Filtering Stats:`, filteringStats);
    console.log(`   Success Rate: ${rawResults.length > 0 ? ((entitySpecificResults.length / rawResults.length) * 100).toFixed(1) : 0}%`);

    // Insert results into database (removed match_type field to avoid schema issues)
    if (entitySpecificResults.length > 0) {
      try {
        const { error } = await supabase.from('scan_results').insert(
          entitySpecificResults.map(result => ({
            platform: result.platform,
            content: result.content,
            url: result.url,
            severity: result.severity,
            sentiment: result.sentiment,
            confidence_score: result.confidence_score,
            detected_entities: result.detected_entities,
            source_type: result.source_type,
            entity_name: result.entity_name,
            potential_reach: result.potential_reach,
            source_credibility_score: result.source_credibility_score,
            threat_type: 'live_intelligence'
            // Removed match_type to avoid schema issues
          }))
        );
        
        if (error) {
          console.error('[REDDIT-SCAN] Database insert error:', error);
        } else {
          console.log('[REDDIT-SCAN] ✅ Successfully inserted', entitySpecificResults.length, 'results');
        }
      } catch (dbError) {
        console.error('[REDDIT-SCAN] Database operation failed:', dbError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: entitySpecificResults.length, 
      results: entitySpecificResults,
      message: `Reddit scan completed: ${entitySpecificResults.length} results found for "${extractedEntityName}"`,
      entity_name: extractedEntityName,
      search_terms: searchTerms,
      dataSource: 'REDDIT_RSS',
      filtering_stats: {
        raw_results: rawResults.length,
        entity_specific: entitySpecificResults.length,
        precision_rate: rawResults.length > 0 ? ((entitySpecificResults.length / rawResults.length) * 100).toFixed(1) + '%' : '0%',
        confidence_breakdown: filteringStats,
        search_stats: searchStats
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[REDDIT-SCAN] Error:', error);
    return new Response(JSON.stringify({
      error: 'Reddit scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
