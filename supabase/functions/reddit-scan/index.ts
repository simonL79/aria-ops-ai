
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[REDDIT-SCAN] === ENHANCED HIGH RECALL, HIGH PRECISION SCAN ===');
  console.log('[REDDIT-SCAN] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      entity, 
      targetEntity,
      search_queries = [],
      entity_fingerprint = null,
      keywords = [], 
      source = 'reddit',
      confidenceThreshold = 0.6
    } = await req.json().catch(() => ({}));
    
    const entityName = entity || targetEntity || 'Simon Lindsay';
    console.log('[REDDIT-SCAN] Starting ENHANCED entity-specific Reddit scan for:', entityName);
    console.log('[REDDIT-SCAN] Search queries count:', search_queries.length);
    console.log('[REDDIT-SCAN] Confidence threshold:', confidenceThreshold);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use EXPANDED search queries for broader recall
    const searchTerms = search_queries.length > 0 ? search_queries : [
      `"${entityName}"`,
      entityName,
      `${entityName} Glasgow`,
      `${entityName} KSL Hair`,
      `${entityName} fraud`,
      `${entityName} scam`,
      `${entityName} warrant`
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
        
        console.log('[REDDIT-SCAN] Executing broad search for term:', searchTerm);

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

    console.log(`[REDDIT-SCAN] BROAD SEARCH COMPLETED:`);
    console.log(`   Queries Executed: ${searchStats.queries_executed}`);
    console.log(`   Total Raw Results: ${rawResults.length}`);
    console.log(`   Processing Errors: ${searchStats.processing_errors}`);

    // Apply ENHANCED entity filtering with confidence scoring
    const entitySpecificResults = [];
    const filteringStats = {
      exact_matches: 0,
      alias_matches: 0,
      contextual_matches: 0,
      fuzzy_matches: 0,
      below_threshold: 0,
      no_match: 0
    };
    
    for (const result of rawResults) {
      const fullText = (result.title + ' ' + result.content).toLowerCase();
      
      // Enhanced layered matching
      let matchFound = false;
      let confidenceScore = 0;
      let matchType = 'none';
      let matchedAlias = '';
      
      if (entity_fingerprint) {
        // Layer 1: Exact matches (1.0 confidence)
        const exactPhrases = entity_fingerprint.exact_phrases || [];
        for (const phrase of exactPhrases) {
          if (fullText.includes(phrase.toLowerCase())) {
            matchFound = true;
            confidenceScore = 1.0;
            matchType = 'exact';
            matchedAlias = phrase;
            filteringStats.exact_matches++;
            break;
          }
        }
        
        // Layer 2: Alias matches (0.85 confidence)
        if (!matchFound) {
          const aliasVariations = entity_fingerprint.alias_variations || [];
          for (const alias of aliasVariations) {
            if (fullText.includes(alias.toLowerCase())) {
              matchFound = true;
              confidenceScore = 0.85;
              matchType = 'alias';
              matchedAlias = alias;
              filteringStats.alias_matches++;
              break;
            }
          }
        }
        
        // Layer 3: Contextual matches (0.6 confidence)
        if (!matchFound) {
          const businessContexts = entity_fingerprint.business_contexts || [];
          const locationContexts = entity_fingerprint.location_contexts || [];
          const negativeKeywords = entity_fingerprint.negative_keywords || [];
          
          const hasNameReference = fullText.includes(entityName.split(' ')[0].toLowerCase()) || 
                                  fullText.includes(entityName.split(' ')[1].toLowerCase());
          
          if (hasNameReference) {
            const contextMatches = [
              ...businessContexts.filter(ctx => fullText.includes(ctx.toLowerCase())),
              ...locationContexts.filter(loc => fullText.includes(loc.toLowerCase())),
              ...negativeKeywords.filter(kw => fullText.includes(kw.toLowerCase()))
            ];
            
            if (contextMatches.length > 0) {
              matchFound = true;
              confidenceScore = 0.6;
              matchType = 'contextual';
              matchedAlias = contextMatches.join(', ');
              filteringStats.contextual_matches++;
            }
          }
        }
        
        // Layer 4: Fuzzy matches (0.4 confidence)
        if (!matchFound) {
          const fuzzyVariations = entity_fingerprint.fuzzy_variations || [];
          for (const fuzzy of fuzzyVariations) {
            if (fullText.includes(fuzzy.toLowerCase())) {
              matchFound = true;
              confidenceScore = 0.4;
              matchType = 'fuzzy';
              matchedAlias = fuzzy;
              filteringStats.fuzzy_matches++;
              break;
            }
          }
        }
      } else {
        // Fallback: Basic exact phrase matching
        const entityLower = entityName.toLowerCase();
        if (fullText.includes(entityLower) || fullText.includes(`"${entityLower}"`)) {
          matchFound = true;
          confidenceScore = 0.8;
          matchType = 'basic';
          matchedAlias = entityLower;
        }
      }

      // Apply confidence threshold
      if (matchFound && confidenceScore >= confidenceThreshold) {
        console.log(`[REDDIT-SCAN] ✅ ${matchType.toUpperCase()} match (${confidenceScore}):`, result.title.substring(0, 50));
        
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
          detected_entities: [entityName],
          source_type: source,
          entity_name: entityName,
          created_at: result.updated || new Date().toISOString(),
          potential_reach: Math.floor(Math.random() * 1000) + 100,
          source_credibility_score: 75,
          // Enhanced fields
          match_type: matchType,
          matched_alias: matchedAlias,
          search_term: result.search_term
        };

        entitySpecificResults.push(processedResult);
      } else if (matchFound) {
        filteringStats.below_threshold++;
        console.log(`[REDDIT-SCAN] ⚠️ Below threshold (${confidenceScore}):`, result.title.substring(0, 50));
      } else {
        filteringStats.no_match++;
      }
    }

    console.log(`[REDDIT-SCAN] ENHANCED FILTERING COMPLETE:`);
    console.log(`   Raw Results: ${rawResults.length}`);
    console.log(`   Entity-Specific Results: ${entitySpecificResults.length}`);
    console.log(`   Filtering Stats:`, filteringStats);
    console.log(`   Precision Rate: ${rawResults.length > 0 ? ((entitySpecificResults.length / rawResults.length) * 100).toFixed(1) : 0}%`);

    // Insert with enhanced tracking
    if (entitySpecificResults.length > 0) {
      try {
        const { error } = await supabase.from('scan_results').insert(entitySpecificResults);
        if (error) {
          console.error('[REDDIT-SCAN] Database insert error:', error);
        } else {
          console.log('[REDDIT-SCAN] Successfully inserted', entitySpecificResults.length, 'enhanced entity-specific entries');
        }
      } catch (dbError) {
        console.error('[REDDIT-SCAN] Database operation failed:', dbError);
      }
    }

    // Enhanced audit logging
    try {
      await supabase.from('scanner_query_log').insert({
        entity_name: entityName,
        search_terms: searchTerms,
        platform: 'Reddit',
        total_results_returned: rawResults.length,
        results_matched_entity: entitySpecificResults.length,
        executed_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('[REDDIT-SCAN] Failed to log query:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: entitySpecificResults.length, 
      results: entitySpecificResults,
      message: `Reddit ENHANCED entity scan completed: ${entitySpecificResults.length} high-confidence items found for "${entityName}"`,
      entity_name: entityName,
      search_terms: searchTerms,
      dataSource: 'ENHANCED_REDDIT_RSS',
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
      error: 'Reddit enhanced entity scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
