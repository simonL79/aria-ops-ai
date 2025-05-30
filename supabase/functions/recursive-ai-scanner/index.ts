
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[RECURSIVE-AI-SCANNER] === NEW REQUEST ===');
  console.log('[RECURSIVE-AI-SCANNER] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, keywords = [], maxDepth = 1 } = await req.json();
    console.log('[RECURSIVE-AI-SCANNER] Starting recursive scan for:', entity);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // STEP 1: Expand queries with threat-focused keywords
    const expandQueries = (baseEntity: string, baseKeywords: string[]): string[] => {
      const threatModifiers = ['scandal', 'leak', 'controversy', 'lawsuit', 'fraud', 'abuse', 'criticism', 'investigation', 'allegation', 'crisis'];
      const queries = new Set<string>();
      
      // Add base entity
      queries.add(baseEntity);
      
      // Add entity + keywords
      baseKeywords.forEach(keyword => queries.add(`${baseEntity} ${keyword}`));
      
      // Add entity + threat modifiers
      threatModifiers.forEach(modifier => queries.add(`${baseEntity} ${modifier}`));
      
      return Array.from(queries).slice(0, 15); // Limit to prevent overload
    };

    // STEP 2: Fetch from multiple sources
    const fetchFromSources = async (queries: string[], targetEntity: string): Promise<any[]> => {
      const sources = [
        { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
        { name: 'The Guardian UK', url: 'https://www.theguardian.com/uk/rss' },
        { name: 'Reuters UK', url: 'https://feeds.reuters.com/reuters/UKTopNews' },
        { name: 'Reddit Search', url: 'https://www.reddit.com/search.rss?q=' }
      ];

      const results: any[] = [];

      for (const query of queries.slice(0, 10)) { // Limit queries
        for (const source of sources) {
          try {
            const feedUrl = source.name === 'Reddit Search' 
              ? `${source.url}${encodeURIComponent(query)}&sort=new`
              : source.url;
            
            console.log(`[RECURSIVE-AI-SCANNER] Fetching: ${source.name} for query: ${query}`);
            
            const res = await fetch(feedUrl, {
              headers: { 'User-Agent': 'ARIA-OSINT/1.0' }
            });
            
            if (!res.ok) continue;
            
            const xml = await res.text();
            let items: RegExpMatchArray[];
            
            if (source.name === 'Reddit Search') {
              items = [...xml.matchAll(/<entry>(.*?)<\/entry>/gs)];
            } else {
              items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)];
            }
            
            for (const item of items.slice(0, 5)) { // Limit items per source
              const content = item[1].toLowerCase();
              if (!content.includes(targetEntity.toLowerCase())) continue;

              let title, link, pubDate;
              
              if (source.name === 'Reddit Search') {
                title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
                link = item[1].match(/<link href="(.*?)"/)?.[1] || '';
                pubDate = item[1].match(/<updated>(.*?)<\/updated>/)?.[1] || '';
              } else {
                title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
                link = item[1].match(/<link>(.*?)<\/link>/)?.[1] || '';
                pubDate = item[1].match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
              }

              // Determine severity based on threat keywords
              const threatKeywords = ['scandal', 'controversy', 'investigation', 'allegation', 'lawsuit', 'fraud', 'crisis', 'abuse'];
              const hasThreatKeywords = threatKeywords.some(keyword => content.includes(keyword));
              
              results.push({
                platform: source.name,
                content: title,
                url: link,
                severity: hasThreatKeywords ? 'high' : 'medium',
                sentiment: hasThreatKeywords ? -0.7 : -0.2,
                confidence_score: 0.8,
                detected_entities: [targetEntity],
                source_type: 'recursive_osint',
                entity_name: targetEntity,
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error(`[RECURSIVE-AI-SCANNER] Error fetching ${source.name}:`, error);
          }
        }
      }

      return results;
    };

    // STEP 3: Extract related entities from results
    const extractEntities = (text: string): string[] => {
      // Extract potential person/organization names (capitalized words)
      const matches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
      const entityCounts: Record<string, number> = {};
      
      matches.forEach(match => {
        // Filter out common words that aren't entities
        const commonWords = ['The', 'This', 'That', 'However', 'Meanwhile', 'According', 'Following', 'During'];
        if (!commonWords.includes(match) && match.length > 2) {
          entityCounts[match] = (entityCounts[match] || 0) + 1;
        }
      });
      
      return Object.entries(entityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name]) => name);
    };

    // STEP 4: Summarize threats
    const summarizeThreats = (results: any[], targetEntity: string, relatedEntities: string[]): string => {
      const count = results.length;
      const highSeverityCount = results.filter(r => r.severity === 'high').length;
      const fromReddit = results.filter(r => r.platform?.includes('Reddit')).length;
      const fromNews = count - fromReddit;
      
      const riskLevel = highSeverityCount > 5 ? 'HIGH' : highSeverityCount > 2 ? 'MODERATE' : 'LOW';
      
      return `A.R.I.A™ Recursive Intelligence Summary for ${targetEntity}: ${count} mentions detected across ${fromNews} news sources and ${fromReddit} social discussions. ${highSeverityCount} high-severity threats identified. Risk Level: ${riskLevel}. Related entities discovered: ${relatedEntities.join(', ')}. Recommended for immediate tactical review.`;
    };

    // EXECUTE RECURSIVE SCAN
    console.log('[RECURSIVE-AI-SCANNER] Step 1: Expanding queries...');
    const searchVariants = expandQueries(entity, keywords);
    
    console.log('[RECURSIVE-AI-SCANNER] Step 2: Fetching from sources...');
    const rawResults = await fetchFromSources(searchVariants, entity);
    
    console.log('[RECURSIVE-AI-SCANNER] Step 3: Extracting related entities...');
    const contentText = rawResults.map(r => r.content).join(' ');
    const relatedEntities = extractEntities(contentText);
    
    let allResults = rawResults;
    
    // STEP 4: Recursive scan (if depth allows and entities found)
    if (maxDepth > 0 && relatedEntities.length > 0) {
      console.log('[RECURSIVE-AI-SCANNER] Step 4: Recursive scanning related entities...');
      const recursiveResults = await fetchFromSources(relatedEntities.slice(0, 3), entity); // Limit recursive entities
      allResults = [...rawResults, ...recursiveResults];
    }
    
    // STEP 5: Generate summary
    console.log('[RECURSIVE-AI-SCANNER] Step 5: Generating threat summary...');
    const summary = summarizeThreats(allResults, entity, relatedEntities);
    
    // STEP 6: Save to database
    console.log('[RECURSIVE-AI-SCANNER] Step 6: Saving to database...');
    
    if (allResults.length > 0) {
      const { error: scanError } = await supabase.from('scan_results').insert(allResults);
      if (scanError) {
        console.error('[RECURSIVE-AI-SCANNER] Error inserting scan results:', scanError);
      }
    }
    
    const { error: reportError } = await supabase.from('unified_reports').insert({
      entity_name: entity,
      summary,
      threat_count: allResults.length,
      high_severity_count: allResults.filter(r => r.severity === 'high').length,
      related_entities: relatedEntities,
      scan_metadata: {
        queries_used: searchVariants.length,
        sources_scanned: 4,
        recursive_depth: maxDepth,
        scan_timestamp: new Date().toISOString()
      }
    });
    
    if (reportError) {
      console.error('[RECURSIVE-AI-SCANNER] Error inserting report:', reportError);
    }

    console.log('[RECURSIVE-AI-SCANNER] Scan completed successfully');
    
    return new Response(JSON.stringify({ 
      success: true,
      status: 'completed',
      threat_count: allResults.length,
      high_severity_count: allResults.filter(r => r.severity === 'high').length,
      related_entities: relatedEntities,
      summary,
      message: `Recursive OSINT scan completed: ${allResults.length} threats analyzed, ${relatedEntities.length} related entities discovered`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[RECURSIVE-AI-SCANNER] Error:', error);
    return new Response(JSON.stringify({
      error: 'Recursive AI scanner failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
