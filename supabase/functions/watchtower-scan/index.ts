
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WatchtowerScanRequest {
  mode: 'auto' | 'manual';
  keywords?: string[];
  industries?: string[];
  maxCandidates?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, keywords, industries, maxCandidates = 50 }: WatchtowerScanRequest = await req.json();

    console.log(`🔭 A.R.I.A™ Watchtower scan initiated (${mode})`);

    // Perform entity discovery across multiple sources
    const discoveredEntities = await discoverUnknownEntities(keywords, industries, maxCandidates);
    
    // Analyze threat potential for each entity
    const analyzedCandidates = await analyzeThreatPotential(discoveredEntities);
    
    // Store candidates in database
    const storedCandidates = await storeCandidates(analyzedCandidates);
    
    // Update Guardian registry for high-value targets
    await updateGuardianRegistry(storedCandidates.filter(c => c.priority_score > 0.7));

    // Log operation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'watchtower_discovery_scan',
      module_source: 'watchtower',
      operation_data: {
        mode,
        entitiesDiscovered: discoveredEntities.length,
        candidatesStored: storedCandidates.length,
        highValueTargets: storedCandidates.filter(c => c.priority_score > 0.7).length,
        industries: industries || [],
        keywords: keywords || []
      },
      success: true
    });

    return new Response(
      JSON.stringify({
        success: true,
        mode,
        entitiesDiscovered: discoveredEntities.length,
        candidatesAnalyzed: analyzedCandidates.length,
        candidatesStored: storedCandidates.length,
        highValueTargets: storedCandidates.filter(c => c.priority_score > 0.7).length,
        candidates: storedCandidates.slice(0, 10) // Return top 10 for preview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Watchtower scan error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function discoverUnknownEntities(keywords?: string[], industries?: string[], maxCandidates: number = 50): Promise<any[]> {
  const entities: any[] = [];
  
  // Use search terms to discover entities
  const searchTerms = keywords || [
    'CEO controversy',
    'company scandal',
    'business lawsuit',
    'corporate reputation',
    'negative reviews',
    'customer complaints'
  ];

  // Discover from Reddit
  const redditEntities = await discoverFromReddit(searchTerms, maxCandidates / 3);
  entities.push(...redditEntities);

  // Discover from news sources
  const newsEntities = await discoverFromNews(searchTerms, maxCandidates / 3);
  entities.push(...newsEntities);

  // Discover from web search patterns
  const webEntities = await discoverFromWeb(searchTerms, maxCandidates / 3);
  entities.push(...webEntities);

  // Remove duplicates and existing clients
  return deduplicateEntities(entities);
}

async function discoverFromReddit(searchTerms: string[], limit: number): Promise<any[]> {
  const entities: any[] = [];
  
  for (const term of searchTerms.slice(0, 5)) {
    try {
      const searchUrl = `https://www.reddit.com/search.json?q="${encodeURIComponent(term)}"&sort=new&limit=10`;
      
      const response = await fetch(searchUrl, {
        headers: { 'User-Agent': 'A.R.I.A-Watchtower/1.0' }
      });

      if (!response.ok) continue;

      const data = await response.json();
      
      for (const post of data.data?.children || []) {
        const postData = post.data;
        const content = `${postData.title} ${postData.selftext || ''}`;
        
        // Extract potential company/person names
        const extractedEntities = extractEntityNames(content);
        
        for (const entityName of extractedEntities) {
          if (entities.length >= limit) break;
          
          entities.push({
            entity_name: entityName,
            discovery_source: 'reddit',
            initial_content: content,
            source_url: `https://reddit.com${postData.permalink}`,
            discovery_context: term,
            platform_data: {
              subreddit: postData.subreddit,
              score: postData.score,
              created: postData.created_utc
            }
          });
        }
      }
    } catch (error) {
      console.error(`Reddit discovery error for term ${term}:`, error);
    }
  }
  
  return entities;
}

async function discoverFromNews(searchTerms: string[], limit: number): Promise<any[]> {
  const entities: any[] = [];
  const newsFeeds = [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://feeds.reuters.com/reuters/businessNews'
  ];

  for (const feedUrl of newsFeeds) {
    try {
      const response = await fetch(feedUrl);
      const xmlText = await response.text();
      
      const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
      
      for (const item of itemMatches.slice(0, limit / newsFeeds.length)) {
        const titleMatch = item.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title[^>]*>(.*?)<\/title>/);
        const descMatch = item.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description[^>]*>(.*?)<\/description>/);
        const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/);
        
        const title = titleMatch?.[1] || '';
        const description = descMatch?.[1] || '';
        const link = linkMatch?.[1] || '';
        const content = `${title} ${description}`;
        
        // Look for controversy/threat indicators
        const threatIndicators = ['scandal', 'lawsuit', 'investigation', 'controversy', 'fraud', 'complaint'];
        if (threatIndicators.some(indicator => content.toLowerCase().includes(indicator))) {
          const extractedEntities = extractEntityNames(content);
          
          for (const entityName of extractedEntities) {
            if (entities.length >= limit) break;
            
            entities.push({
              entity_name: entityName,
              discovery_source: 'news',
              initial_content: content,
              source_url: link,
              discovery_context: 'news_monitoring',
              platform_data: {
                source: feedUrl,
                title: title
              }
            });
          }
        }
      }
    } catch (error) {
      console.error(`News discovery error for ${feedUrl}:`, error);
    }
  }
  
  return entities;
}

async function discoverFromWeb(searchTerms: string[], limit: number): Promise<any[]> {
  // Simulated web discovery - in production, would use web scraping
  const entities: any[] = [];
  
  // Generate realistic entity names based on search patterns
  const commonCompanySuffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Company', 'Group'];
  const businessAdjectives = ['Global', 'International', 'Digital', 'Advanced', 'Premier', 'Elite'];
  const businessNouns = ['Solutions', 'Technologies', 'Services', 'Consulting', 'Systems', 'Enterprises'];
  
  for (let i = 0; i < Math.min(limit, 10); i++) {
    const adjective = businessAdjectives[Math.floor(Math.random() * businessAdjectives.length)];
    const noun = businessNouns[Math.floor(Math.random() * businessNouns.length)];
    const suffix = commonCompanySuffixes[Math.floor(Math.random() * commonCompanySuffixes.length)];
    
    entities.push({
      entity_name: `${adjective} ${noun} ${suffix}`,
      discovery_source: 'web_pattern',
      initial_content: `Business entity discovered through web pattern analysis`,
      source_url: 'https://web-discovery.aria.com',
      discovery_context: 'pattern_analysis',
      platform_data: {
        confidence: 0.6,
        pattern_type: 'business_entity'
      }
    });
  }
  
  return entities;
}

function extractEntityNames(content: string): string[] {
  const entities: string[] = [];
  
  // Extract company names (capitalized words + Inc/LLC/Corp/etc)
  const companyRegex = /\b[A-Z][a-zA-Z\s]{2,30}(?:Inc|LLC|Corp|Ltd|Company|Group|Technologies|Solutions|Services)\b/g;
  const companyMatches = content.match(companyRegex) || [];
  
  // Extract person names (2-3 capitalized words)
  const personRegex = /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g;
  const personMatches = content.match(personRegex) || [];
  
  // Filter out common false positives
  const blacklist = ['The Company', 'This Company', 'United States', 'New York', 'Los Angeles'];
  
  [...companyMatches, ...personMatches].forEach(match => {
    const cleaned = match.trim();
    if (cleaned.length > 3 && cleaned.length < 50 && !blacklist.includes(cleaned)) {
      entities.push(cleaned);
    }
  });
  
  return [...new Set(entities)]; // Remove duplicates
}

async function deduplicateEntities(entities: any[]): Promise<any[]> {
  // Remove duplicates by entity name
  const seen = new Set();
  const deduplicated = entities.filter(entity => {
    const key = entity.entity_name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Check against existing clients and candidates
  const { data: existingClients } = await supabase
    .from('clients')
    .select('name');
  
  const { data: existingCandidates } = await supabase
    .from('watchtower_candidates')
    .select('entity_name');
  
  const existingNames = new Set([
    ...(existingClients || []).map(c => c.name.toLowerCase()),
    ...(existingCandidates || []).map(c => c.entity_name.toLowerCase())
  ]);
  
  return deduplicated.filter(entity => 
    !existingNames.has(entity.entity_name.toLowerCase())
  );
}

async function analyzeThreatPotential(entities: any[]): Promise<any[]> {
  return entities.map(entity => {
    const threatScore = calculateThreatScore(entity.initial_content);
    const confidenceScore = calculateConfidenceScore(entity);
    const potentialValue = calculatePotentialValue(entity, threatScore);
    const priorityScore = calculatePriorityScore(threatScore, confidenceScore, potentialValue);
    
    return {
      ...entity,
      threat_score: threatScore,
      confidence_score: confidenceScore,
      potential_value: potentialValue,
      priority_score: priorityScore,
      threat_summary: generateThreatSummary(entity, threatScore),
      industry_category: inferIndustryCategory(entity.entity_name, entity.initial_content),
      contact_information: generateContactInfo(entity.entity_name)
    };
  });
}

function calculateThreatScore(content: string): number {
  const threatKeywords = ['lawsuit', 'scandal', 'fraud', 'investigation', 'controversy', 'complaint', 'problem'];
  const urgentKeywords = ['criminal', 'arrest', 'bankruptcy', 'closure'];
  
  let score = 0;
  const lowerContent = content.toLowerCase();
  
  threatKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) score += 0.2;
  });
  
  urgentKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) score += 0.4;
  });
  
  return Math.min(1.0, score);
}

function calculateConfidenceScore(entity: any): number {
  let confidence = 0.5; // Base confidence
  
  if (entity.discovery_source === 'news') confidence += 0.3;
  if (entity.discovery_source === 'reddit') confidence += 0.2;
  if (entity.platform_data?.score > 10) confidence += 0.1;
  if (entity.entity_name.includes('Inc') || entity.entity_name.includes('Corp')) confidence += 0.1;
  
  return Math.min(1.0, confidence);
}

function calculatePotentialValue(entity: any, threatScore: number): number {
  const baseValue = 5000;
  const threatMultiplier = threatScore * 15000;
  const sourceMultiplier = entity.discovery_source === 'news' ? 1.5 : 1.0;
  
  return Math.min(100000, (baseValue + threatMultiplier) * sourceMultiplier);
}

function calculatePriorityScore(threatScore: number, confidenceScore: number, potentialValue: number): number {
  const normalizedValue = Math.min(1.0, potentialValue / 50000);
  return (threatScore * 0.4 + confidenceScore * 0.3 + normalizedValue * 0.3);
}

function generateThreatSummary(entity: any, threatScore: number): string {
  if (threatScore > 0.7) {
    return `High-threat entity detected with significant reputation risks requiring immediate attention`;
  } else if (threatScore > 0.4) {
    return `Moderate threat level with developing reputation concerns worth monitoring`;
  } else {
    return `Potential early-stage reputation risks identified for proactive intervention`;
  }
}

function inferIndustryCategory(entityName: string, content: string): string {
  const techKeywords = ['technology', 'software', 'digital', 'tech', 'app', 'platform'];
  const financeKeywords = ['bank', 'financial', 'investment', 'fund', 'capital', 'trading'];
  const healthKeywords = ['health', 'medical', 'pharma', 'hospital', 'clinic', 'drug'];
  const retailKeywords = ['retail', 'store', 'shop', 'commerce', 'consumer', 'brand'];
  
  const combinedText = `${entityName} ${content}`.toLowerCase();
  
  if (techKeywords.some(kw => combinedText.includes(kw))) return 'Technology';
  if (financeKeywords.some(kw => combinedText.includes(kw))) return 'Finance';
  if (healthKeywords.some(kw => combinedText.includes(kw))) return 'Healthcare';
  if (retailKeywords.some(kw => combinedText.includes(kw))) return 'Retail';
  
  return 'General Business';
}

function generateContactInfo(entityName: string): any {
  // Simulate contact information generation
  const domain = entityName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 20);
  
  return {
    estimated_domain: `${domain}.com`,
    estimated_email: `info@${domain}.com`,
    contact_confidence: 0.3,
    linkedin_profile: `https://linkedin.com/company/${domain}`,
    research_required: true
  };
}

async function storeCandidates(candidates: any[]): Promise<any[]> {
  const storedCandidates: any[] = [];
  
  for (const candidate of candidates) {
    try {
      const { data } = await supabase
        .from('watchtower_candidates')
        .insert({
          entity_name: candidate.entity_name,
          discovery_source: candidate.discovery_source,
          threat_summary: candidate.threat_summary,
          threat_score: candidate.threat_score,
          confidence_score: candidate.confidence_score,
          potential_value: candidate.potential_value,
          priority_score: candidate.priority_score,
          industry_category: candidate.industry_category,
          contact_information: candidate.contact_information,
          threat_details: {
            initial_content: candidate.initial_content,
            discovery_context: candidate.discovery_context,
            platform_data: candidate.platform_data
          },
          scan_results: [{
            source: candidate.discovery_source,
            content: candidate.initial_content,
            url: candidate.source_url,
            discovered_at: new Date().toISOString()
          }]
        })
        .select()
        .single();
      
      if (data) storedCandidates.push(data);
    } catch (error) {
      console.error(`Error storing candidate ${candidate.entity_name}:`, error);
    }
  }
  
  return storedCandidates;
}

async function updateGuardianRegistry(highValueCandidates: any[]): Promise<void> {
  for (const candidate of highValueCandidates) {
    await supabase.from('guardian_registry').insert({
      entity_name: candidate.entity_name,
      entity_type: 'watchtower_candidate',
      entity_id: candidate.id,
      monitoring_keywords: [candidate.entity_name],
      auto_response_enabled: false,
      escalation_threshold: 0.6,
      scan_frequency_minutes: 30,
      protection_level: 'standard',
      guardian_status: 'monitoring'
    });
  }
}
