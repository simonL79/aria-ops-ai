
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[SIGMALIVE] === A.R.I.A™ SIGMA LIVE SCANNER REQUEST ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, keywords = [], depth = 2, generateProfile = true } = await req.json();
    console.log('[SIGMALIVE] Starting SIGMA live scan for:', entity);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log mission start
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 1,
      action: 'SIGMA_LIVE_SCAN_INITIATED',
      module: 'sigmalive',
      status: 'executed',
      log_details: `Live scanning initiated for ${entity} with depth ${depth}`
    });

    // STEP 1: Expand search queries with threat-focused modifiers
    const expandQueries = (baseEntity: string, baseKeywords: string[]): string[] => {
      const threatModifiers = [
        'scandal', 'leak', 'controversy', 'lawsuit', 'fraud', 'abuse', 
        'criticism', 'investigation', 'allegation', 'crisis', 'hack', 
        'breach', 'exposed', 'caught', 'guilty', 'criminal'
      ];
      const queries = new Set<string>();
      
      queries.add(baseEntity);
      baseKeywords.forEach(keyword => queries.add(`${baseEntity} ${keyword}`));
      threatModifiers.forEach(modifier => queries.add(`${baseEntity} ${modifier}`));
      
      return Array.from(queries).slice(0, 20);
    };

    // STEP 2: Multi-source live data collection
    const fetchLiveData = async (queries: string[]): Promise<any[]> => {
      const sources = [
        { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
        { name: 'The Guardian UK', url: 'https://www.theguardian.com/uk/rss' },
        { name: 'Reuters UK', url: 'https://feeds.reuters.com/reuters/UKTopNews' },
        { name: 'Reddit Search', url: 'https://www.reddit.com/search.rss?q=' },
        { name: 'Financial Times', url: 'https://www.ft.com/rss/home/uk' }
      ];

      const results: any[] = [];

      for (const query of queries.slice(0, 15)) {
        for (const source of sources) {
          try {
            const feedUrl = source.name === 'Reddit Search' 
              ? `${source.url}${encodeURIComponent(query)}&sort=new`
              : source.url;
            
            console.log(`[SIGMALIVE] Scanning: ${source.name} for "${query}"`);
            
            const res = await fetch(feedUrl, {
              headers: { 'User-Agent': 'ARIA-SIGMA/1.0' },
              signal: AbortSignal.timeout(10000)
            });
            
            if (!res.ok) continue;
            
            const xml = await res.text();
            let items: RegExpMatchArray[];
            
            if (source.name === 'Reddit Search') {
              items = [...xml.matchAll(/<entry>(.*?)<\/entry>/gs)];
            } else {
              items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)];
            }
            
            for (const item of items.slice(0, 8)) {
              const content = item[1].toLowerCase();
              if (!content.includes(entity.toLowerCase())) continue;

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

              // Enhanced threat scoring
              const threatKeywords = ['scandal', 'controversy', 'investigation', 'allegation', 'lawsuit', 'fraud', 'crisis', 'abuse', 'hack', 'breach'];
              const criticalKeywords = ['arrested', 'charged', 'guilty', 'criminal', 'exposed', 'leaked'];
              
              const hasThreatKeywords = threatKeywords.some(keyword => content.includes(keyword));
              const hasCriticalKeywords = criticalKeywords.some(keyword => content.includes(keyword));
              
              let severity = 'low';
              let sentiment = -0.1;
              
              if (hasCriticalKeywords) {
                severity = 'high';
                sentiment = -0.8;
              } else if (hasThreatKeywords) {
                severity = 'medium';
                sentiment = -0.5;
              }
              
              results.push({
                platform: source.name,
                content: title,
                url: link,
                severity,
                sentiment,
                confidence_score: 0.85,
                detected_entities: [entity],
                entity_name: entity,
                source_type: 'sigma_live',
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error(`[SIGMALIVE] Error fetching ${source.name}:`, error);
          }
        }
      }

      return results;
    };

    // STEP 3: Entity relationship extraction
    const extractRelatedEntities = (text: string): string[] => {
      const matches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
      const entityCounts: Record<string, number> = {};
      
      matches.forEach(match => {
        const commonWords = ['The', 'This', 'That', 'However', 'Meanwhile', 'According', 'Following', 'During', 'News', 'BBC', 'Guardian'];
        if (!commonWords.includes(match) && match.length > 2 && match !== entity) {
          entityCounts[match] = (entityCounts[match] || 0) + 1;
        }
      });
      
      return Object.entries(entityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name]) => name);
    };

    // STEP 4: Execute live scanning
    console.log('[SIGMALIVE] Step 1: Expanding threat-focused queries...');
    const searchQueries = expandQueries(entity, keywords);
    
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 2,
      action: 'QUERY_EXPANSION_COMPLETE',
      module: 'sigmalive',
      status: 'executed',
      log_details: `Generated ${searchQueries.length} threat-focused search queries`
    });

    console.log('[SIGMALIVE] Step 2: Live data collection from sources...');
    const scanResults = await fetchLiveData(searchQueries);
    
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 3,
      action: 'LIVE_DATA_COLLECTION_COMPLETE',
      module: 'sigmalive',
      status: 'executed',
      log_details: `Collected ${scanResults.length} live intelligence items`
    });

    console.log('[SIGMALIVE] Step 3: Entity relationship extraction...');
    const contentText = scanResults.map(r => r.content).join(' ');
    const relatedEntities = extractRelatedEntities(contentText);
    
    // Store entity relationships
    for (const relatedEntity of relatedEntities) {
      await supabase.from('entity_graph').insert({
        source_entity: entity,
        related_entity: relatedEntity,
        relationship_type: 'co-mentioned',
        frequency: 1
      }).on('conflict', { column: ['source_entity', 'related_entity'] }, { 
        frequency: 'entity_graph.frequency + 1',
        last_seen: 'now()'
      });
    }

    // STEP 5: Generate threat profile if requested
    let threatProfile = null;
    if (generateProfile && scanResults.length > 0) {
      console.log('[SIGMALIVE] Step 4: Generating threat profile...');
      
      const highSeverityCount = scanResults.filter(r => r.severity === 'high').length;
      const mediumSeverityCount = scanResults.filter(r => r.severity === 'medium').length;
      const totalMentions = scanResults.length;
      const negativeMentions = scanResults.filter(r => r.sentiment < -0.2).length;
      
      // Calculate risk score
      const riskScore = Math.min(
        (highSeverityCount * 0.4 + mediumSeverityCount * 0.2 + (negativeMentions / totalMentions) * 0.4),
        1.0
      );
      
      let threatLevel = 'low';
      if (riskScore >= 0.8) threatLevel = 'critical';
      else if (riskScore >= 0.6) threatLevel = 'high';
      else if (riskScore >= 0.3) threatLevel = 'moderate';

      const platforms = [...new Set(scanResults.map(r => r.platform))];
      
      threatProfile = {
        entity_name: entity,
        threat_level: threatLevel,
        risk_score: riskScore,
        signature_match: `SIGMA-${Date.now()}`,
        match_confidence: 0.85,
        primary_platforms: platforms,
        total_mentions: totalMentions,
        negative_sentiment_score: negativeMentions / totalMentions,
        related_entities: relatedEntities,
        fix_plan: generateFixPlan(threatLevel, riskScore, totalMentions)
      };

      // Store threat profile
      const { data: profileData, error: profileError } = await supabase
        .from('threat_profiles')
        .insert(threatProfile)
        .select()
        .single();

      if (profileError) {
        console.error('[SIGMALIVE] Error storing threat profile:', profileError);
      } else {
        threatProfile = profileData;
      }
    }

    // STEP 6: Store scan results
    if (scanResults.length > 0) {
      const { error: scanError } = await supabase.from('scan_results').insert(scanResults);
      if (scanError) {
        console.error('[SIGMALIVE] Error storing scan results:', scanError);
      }
    }

    // STEP 7: Generate unified report
    const summary = generateExecutiveSummary(entity, scanResults, relatedEntities, threatProfile);
    
    const { data: reportData, error: reportError } = await supabase.from('unified_reports').insert({
      entity_name: entity,
      summary,
      threat_count: scanResults.length,
      high_severity_count: scanResults.filter(r => r.severity === 'high').length,
      related_entities: relatedEntities,
      scan_metadata: {
        scan_type: 'sigma_live',
        queries_processed: searchQueries.length,
        sources_scanned: 5,
        depth_level: depth,
        timestamp: new Date().toISOString()
      }
    }).select().single();

    // Final mission log
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 4,
      action: 'SIGMA_SCAN_COMPLETE',
      module: 'sigmalive',
      status: 'executed',
      log_details: `SIGMA scan completed: ${scanResults.length} threats analyzed, threat level: ${threatProfile?.threat_level || 'unknown'}`
    });

    console.log('[SIGMALIVE] SIGMA scan completed successfully');
    
    return new Response(JSON.stringify({ 
      success: true,
      status: 'sigma_complete',
      threat_profile: threatProfile,
      scan_results: scanResults.length,
      related_entities: relatedEntities,
      summary,
      report_id: reportData?.id,
      message: `A.R.I.A™ SIGMA scan completed: ${scanResults.length} live threats analyzed`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[SIGMALIVE] Error:', error);
    return new Response(JSON.stringify({
      error: 'SIGMA live scanner failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateFixPlan(threatLevel: string, riskScore: number, totalMentions: number): string {
  if (threatLevel === 'critical') {
    return 'IMMEDIATE: Deploy CEREBRA™ counter-narrative, activate EIDETIC™ memory override, initiate legal response protocol';
  } else if (threatLevel === 'high') {
    return 'URGENT: Deploy RSI™ sentiment intervention, enhance monitoring protocols, prepare legal documentation';
  } else if (threatLevel === 'moderate') {
    return 'MONITOR: Continue live surveillance, prepare RSI™ response templates, track sentiment trends';
  } else {
    return 'MAINTAIN: Standard monitoring protocols, periodic ANUBIS™ health checks';
  }
}

function generateExecutiveSummary(entity: string, results: any[], relatedEntities: string[], profile: any): string {
  const threatCount = results.length;
  const highSeverity = results.filter(r => r.severity === 'high').length;
  const platforms = [...new Set(results.map(r => r.platform))];
  
  return `A.R.I.A™ SIGMA Intelligence Summary for ${entity}: ${threatCount} live mentions detected across ${platforms.length} platforms. ${highSeverity} high-severity threats identified. Risk Level: ${profile?.threat_level?.toUpperCase() || 'UNKNOWN'}. Related entities discovered: ${relatedEntities.slice(0, 5).join(', ')}. Threat signature: ${profile?.signature_match || 'N/A'}. Recommended for immediate tactical assessment via A.R.I.A™ systems.`;
}
