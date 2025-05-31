
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SERPMonitorRequest {
  entityName: string;
  keywords: string[];
  searchEngines?: string[];
  trackingDomains?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entityName, keywords, searchEngines = ['duckduckgo'], trackingDomains = [] }: SERPMonitorRequest = await req.json();

    console.log(`🔍 SERP Monitoring for: ${entityName}`);

    const results = [];

    for (const keyword of keywords) {
      for (const engine of searchEngines) {
        const searchResults = await performSERPSearch(engine, entityName, keyword);
        const analysis = analyzeSERPResults(searchResults, trackingDomains, entityName);
        
        results.push({
          keyword,
          searchEngine: engine,
          totalResults: searchResults.length,
          ownedDomains: analysis.ownedDomains,
          topPosition: analysis.topPosition,
          penetrationRate: analysis.penetrationRate,
          competitorDomains: analysis.competitorDomains,
          searchResults: searchResults.slice(0, 10) // Top 10 for analysis
        });

        // Store in database
        await supabase.from('scan_results').insert({
          platform: `SERP_${engine}`,
          content: `SERP analysis for "${entityName} ${keyword}": ${analysis.ownedDomains.length} owned results in top 100`,
          url: `https://${engine}.com/search?q=${encodeURIComponent(`${entityName} ${keyword}`)}`,
          severity: analysis.penetrationRate > 0.5 ? 'low' : analysis.penetrationRate > 0.2 ? 'medium' : 'high',
          status: 'new',
          threat_type: 'serp_analysis',
          sentiment: analysis.penetrationRate * 100,
          source_type: 'serp_monitoring',
          potential_reach: 100000
        });
      }
    }

    // Calculate overall SERP health
    const overallPenetration = results.reduce((sum, r) => sum + r.penetrationRate, 0) / results.length;
    const totalOwnedResults = results.reduce((sum, r) => sum + r.ownedDomains.length, 0);

    return new Response(
      JSON.stringify({
        success: true,
        entityName,
        serpHealth: {
          overallPenetration: Math.round(overallPenetration * 100),
          totalOwnedResults,
          averagePosition: calculateAveragePosition(results),
          recommendations: generateRecommendations(overallPenetration, totalOwnedResults)
        },
        results,
        monitoringTimestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SERP monitoring error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performSERPSearch(engine: string, entityName: string, keyword: string): Promise<any[]> {
  const query = `${entityName} ${keyword}`;
  
  try {
    switch (engine) {
      case 'duckduckgo':
        return await searchDuckDuckGo(query);
      case 'startpage':
        return await searchStartPage(query);
      default:
        return [];
    }
  } catch (error) {
    console.error(`Search error for ${engine}:`, error);
    return [];
  }
}

async function searchDuckDuckGo(query: string): Promise<any[]> {
  try {
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    
    if (!response.ok) {
      throw new Error('DuckDuckGo API error');
    }

    const data = await response.json();
    const results = [];

    // Process instant answers
    if (data.Results) {
      results.push(...data.Results.map((result: any, index: number) => ({
        position: index + 1,
        title: result.Text,
        url: result.FirstURL,
        snippet: result.Text,
        source: 'duckduckgo_instant'
      })));
    }

    // Process related topics
    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic: any, index: number) => {
        if (topic.FirstURL) {
          results.push({
            position: results.length + 1,
            title: topic.Text,
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'duckduckgo_related'
          });
        }
      });
    }

    return results.slice(0, 100);
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
}

async function searchStartPage(query: string): Promise<any[]> {
  // Startpage doesn't have a public API, so this would require web scraping
  // For now, return mock data structure
  return [];
}

function analyzeSERPResults(results: any[], trackingDomains: string[], entityName: string): any {
  const ownedDomains: any[] = [];
  const competitorDomains: any[] = [];
  let topPosition = null;

  results.forEach((result, index) => {
    const domain = extractDomain(result.url);
    const isOwned = trackingDomains.some(tracked => domain.includes(tracked)) || 
                    result.title.toLowerCase().includes(entityName.toLowerCase()) ||
                    result.snippet.toLowerCase().includes(entityName.toLowerCase());

    if (isOwned) {
      ownedDomains.push({
        ...result,
        domain,
        actualPosition: index + 1
      });
      
      if (topPosition === null) {
        topPosition = index + 1;
      }
    } else {
      competitorDomains.push({
        ...result,
        domain,
        actualPosition: index + 1
      });
    }
  });

  const penetrationRate = results.length > 0 ? ownedDomains.length / results.length : 0;

  return {
    ownedDomains,
    competitorDomains,
    topPosition,
    penetrationRate
  };
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

function calculateAveragePosition(results: any[]): number {
  const positions = results
    .filter(r => r.topPosition !== null)
    .map(r => r.topPosition);
  
  return positions.length > 0 ? 
    Math.round(positions.reduce((sum, pos) => sum + pos, 0) / positions.length) : 
    0;
}

function generateRecommendations(penetration: number, ownedResults: number): string[] {
  const recommendations = [];
  
  if (penetration < 0.2) {
    recommendations.push('URGENT: Deploy persona saturation campaign immediately');
    recommendations.push('Target 100+ content pieces for rapid SERP improvement');
  } else if (penetration < 0.4) {
    recommendations.push('Deploy additional positive content to improve visibility');
    recommendations.push('Focus on high-authority platform deployment');
  } else if (penetration < 0.6) {
    recommendations.push('Maintain current content strategy');
    recommendations.push('Monitor for new negative content threats');
  } else {
    recommendations.push('Excellent SERP control maintained');
    recommendations.push('Continue monitoring and periodic content refresh');
  }

  if (ownedResults < 5) {
    recommendations.push('Increase content volume for better saturation');
  }

  return recommendations;
}
