
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanRequest {
  entityName: string;
  scanType: 'sentinel' | 'watchtower';
  clientId?: string;
  discoverySource?: string;
}

interface ThreatResult {
  platform: string;
  content: string;
  url: string;
  severity: string;
  confidence: number;
  sentiment: number;
  threatType: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entityName, scanType, clientId, discoverySource }: ScanRequest = await req.json();

    console.log(`🔍 A.R.I.A™ SIGMA Enhanced scan initiated for: ${entityName} (${scanType})`);

    // Perform live Reddit scan
    const redditResults = await scanReddit(entityName);
    
    // Perform RSS news scan
    const newsResults = await scanRSSFeeds(entityName);
    
    // Combine and analyze results
    const allResults = [...redditResults, ...newsResults];
    const analysisResults = await analyzeThreats(allResults, entityName);

    // Store results based on scan type
    if (scanType === 'sentinel') {
      await processSentinelResults(entityName, analysisResults, clientId);
    } else if (scanType === 'watchtower') {
      await processWatchtowerResults(entityName, analysisResults, discoverySource || 'sigmalive');
    }

    // Log operation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'sigmalive_enhanced_scan',
      entity_name: entityName,
      module_source: scanType,
      operation_data: {
        resultsFound: analysisResults.length,
        highThreatCount: analysisResults.filter(r => r.severity === 'high').length,
        platforms: [...new Set(analysisResults.map(r => r.platform))]
      },
      success: true
    });

    return new Response(
      JSON.stringify({
        success: true,
        entityName,
        scanType,
        resultsFound: analysisResults.length,
        highThreatCount: analysisResults.filter(r => r.severity === 'high').length,
        threats: analysisResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SIGMA Enhanced scan error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scanReddit(entityName: string): Promise<ThreatResult[]> {
  try {
    // Use Reddit API without authentication for public data
    const searchUrl = `https://www.reddit.com/search.json?q="${encodeURIComponent(entityName)}"&sort=new&limit=25`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'A.R.I.A-OSINT/1.0'
      }
    });

    if (!response.ok) {
      console.log('Reddit API rate limited, using fallback');
      return [];
    }

    const data = await response.json();
    const results: ThreatResult[] = [];

    for (const post of data.data?.children || []) {
      const postData = post.data;
      const content = `${postData.title} ${postData.selftext || ''}`;
      
      if (content.toLowerCase().includes(entityName.toLowerCase())) {
        const sentiment = analyzeSentiment(content);
        const severity = determineSeverity(content, sentiment);
        
        results.push({
          platform: 'Reddit',
          content: content,
          url: `https://reddit.com${postData.permalink}`,
          severity,
          confidence: 0.85,
          sentiment,
          threatType: classifyThreatType(content)
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Reddit scan error:', error);
    return [];
  }
}

async function scanRSSFeeds(entityName: string): Promise<ThreatResult[]> {
  const rssFeeds = [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.cnn.com/rss/edition.rss',
    'https://feeds.reuters.com/reuters/businessNews'
  ];

  const results: ThreatResult[] = [];

  for (const feedUrl of rssFeeds) {
    try {
      const response = await fetch(feedUrl);
      const xmlText = await response.text();
      
      // Simple XML parsing for RSS
      const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
      
      for (const item of itemMatches.slice(0, 10)) {
        const titleMatch = item.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title[^>]*>(.*?)<\/title>/);
        const descMatch = item.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description[^>]*>(.*?)<\/description>/);
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/);
        
        const title = titleMatch?.[1] || '';
        const description = descMatch?.[1] || '';
        const link = linkMatch?.[1] || '';
        const content = `${title} ${description}`;
        
        if (content.toLowerCase().includes(entityName.toLowerCase())) {
          const sentiment = analyzeSentiment(content);
          const severity = determineSeverity(content, sentiment);
          
          results.push({
            platform: 'News',
            content: content,
            url: link,
            severity,
            confidence: 0.90,
            sentiment,
            threatType: classifyThreatType(content)
          });
        }
      }
    } catch (error) {
      console.error(`RSS feed scan error for ${feedUrl}:`, error);
    }
  }

  return results;
}

function analyzeSentiment(text: string): number {
  const negativeWords = ['bad', 'terrible', 'awful', 'scam', 'fraud', 'corrupt', 'illegal', 'lawsuit', 'scandal', 'controversy'];
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'successful', 'trusted', 'reliable', 'innovative'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  for (const word of words) {
    if (negativeWords.some(neg => word.includes(neg))) score -= 1;
    if (positiveWords.some(pos => word.includes(pos))) score += 1;
  }
  
  return Math.max(-100, Math.min(100, score * 10));
}

function determineSeverity(content: string, sentiment: number): string {
  const urgentKeywords = ['lawsuit', 'scandal', 'fraud', 'investigation', 'criminal', 'arrest'];
  const hasUrgentKeywords = urgentKeywords.some(keyword => 
    content.toLowerCase().includes(keyword)
  );
  
  if (hasUrgentKeywords || sentiment < -50) return 'high';
  if (sentiment < -20) return 'medium';
  return 'low';
}

function classifyThreatType(content: string): string {
  const legalKeywords = ['lawsuit', 'court', 'legal', 'attorney', 'judge'];
  const reputationKeywords = ['review', 'complaint', 'customer', 'service'];
  const financialKeywords = ['stock', 'investment', 'fraud', 'money'];
  
  if (legalKeywords.some(kw => content.toLowerCase().includes(kw))) return 'legal';
  if (financialKeywords.some(kw => content.toLowerCase().includes(kw))) return 'financial';
  if (reputationKeywords.some(kw => content.toLowerCase().includes(kw))) return 'reputation';
  return 'general';
}

async function analyzeThreats(results: ThreatResult[], entityName: string): Promise<ThreatResult[]> {
  // Filter and enhance threat analysis
  return results.filter(result => {
    // Only return significant threats
    return result.severity !== 'low' || result.sentiment < -30;
  }).map(result => ({
    ...result,
    // Enhance confidence based on multiple factors
    confidence: Math.min(0.95, result.confidence + (result.severity === 'high' ? 0.1 : 0))
  }));
}

async function processSentinelResults(entityName: string, threats: ThreatResult[], clientId?: string) {
  if (threats.length === 0) return;

  // Create or update Sentinel case
  const { data: existingCase } = await supabase
    .from('sentinel_cases')
    .select('*')
    .eq('entity_name', entityName)
    .eq('case_status', 'active')
    .single();

  let caseId: string;

  if (existingCase) {
    // Update existing case
    caseId = existingCase.id;
    await supabase
      .from('sentinel_cases')
      .update({
        threat_level: Math.max(existingCase.threat_level, threats.filter(t => t.severity === 'high').length),
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);
  } else {
    // Create new case
    const { data: newCase } = await supabase
      .from('sentinel_cases')
      .insert({
        client_id: clientId,
        entity_name: entityName,
        case_title: `Threat Response: ${entityName}`,
        threat_level: threats.filter(t => t.severity === 'high').length,
        discovery_method: 'sigmalive_enhanced',
        case_summary: `Detected ${threats.length} threats via SIGMA Enhanced scan`
      })
      .select()
      .single();
    
    caseId = newCase?.id;
  }

  // Add timeline events
  for (const threat of threats) {
    await supabase.from('sentinel_threat_timeline').insert({
      case_id: caseId,
      event_type: 'threat_detected',
      event_description: threat.content.substring(0, 500),
      threat_severity: threat.severity,
      source_platform: threat.platform,
      source_url: threat.url,
      metadata: {
        confidence: threat.confidence,
        sentiment: threat.sentiment,
        threatType: threat.threatType
      }
    });
  }
}

async function processWatchtowerResults(entityName: string, threats: ThreatResult[], discoverySource: string) {
  if (threats.length === 0) return;

  const threatScore = threats.reduce((sum, t) => sum + (t.severity === 'high' ? 0.8 : t.severity === 'medium' ? 0.5 : 0.2), 0);
  const avgConfidence = threats.reduce((sum, t) => sum + t.confidence, 0) / threats.length;

  // Create or update Watchtower candidate
  await supabase
    .from('watchtower_candidates')
    .upsert({
      entity_name: entityName,
      discovery_source: discoverySource,
      threat_summary: `Detected ${threats.length} threats with ${threats.filter(t => t.severity === 'high').length} high-severity items`,
      threat_score: threatScore,
      confidence_score: avgConfidence,
      potential_value: calculatePotentialValue(threats),
      threat_details: { threats },
      scan_results: threats,
      last_scanned: new Date().toISOString()
    }, { onConflict: 'entity_name' });
}

function calculatePotentialValue(threats: ThreatResult[]): number {
  // Calculate potential client value based on threat complexity and visibility
  const baseValue = 5000;
  const threatMultiplier = threats.length * 500;
  const severityBonus = threats.filter(t => t.severity === 'high').length * 2000;
  
  return Math.min(50000, baseValue + threatMultiplier + severityBonus);
}
