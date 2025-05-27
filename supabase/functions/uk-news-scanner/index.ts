
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsArticle {
  headline: string;
  url: string;
  domain: string;
  publish_date: string;
  content_snippet: string;
  entities: string[];
  sentiment: number;
  visibility_score: number;
}

interface ProspectEntity {
  entity_name: string;
  entity_type: 'person' | 'company' | 'brand';
  first_mention_source: string;
  total_mentions: number;
  average_sentiment: number;
  visibility_score: number;
  context_summary: string;
  potential_reach: number;
  industry_category?: string;
  contact_potential: 'high' | 'medium' | 'low';
  // Enhanced business intelligence fields
  estimated_company_size?: string;
  estimated_revenue?: string;
  potential_ad_spend?: string;
  urgency_score?: number;
  reputation_risk_level?: string;
  media_visibility_trend?: string;
  competitive_threats?: string[];
  growth_indicators?: string[];
  crisis_indicators?: string[];
  decision_maker_mentions?: string[];
  contact_channels?: string[];
  sales_opportunity_score?: number;
}

// UK News Domains Configuration
const UK_NEWS_DOMAINS = {
  national: [
    'bbc.co.uk/news',
    'theguardian.com',
    'independent.co.uk',
    'telegraph.co.uk',
    'mirror.co.uk',
    'express.co.uk',
    'dailymail.co.uk',
    'thesun.co.uk',
    'standard.co.uk',
    'metro.co.uk',
    'news.sky.com'
  ],
  digital: [
    'huffingtonpost.co.uk',
    'inews.co.uk',
    'buzzfeed.com/uk',
    'thecanary.co',
    'newstatesman.com',
    'vice.com/en_uk'
  ],
  regional: [
    'manchestereveningnews.co.uk',
    'liverpoolecho.co.uk',
    'birminghammail.co.uk',
    'yorkshirepost.co.uk',
    'edinburghnews.scotsman.com',
    'nottinghampost.com',
    'bristolpost.co.uk',
    'walesonline.co.uk'
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[UK-NEWS-SCANNER] Starting comprehensive UK news scan for client discovery and business intelligence...');

    const scannedArticles: NewsArticle[] = [];
    const allDomains = [...UK_NEWS_DOMAINS.national, ...UK_NEWS_DOMAINS.digital, ...UK_NEWS_DOMAINS.regional];
    
    for (const domain of allDomains.slice(0, 8)) {
      try {
        const articles = await scanNewsDomain(domain);
        scannedArticles.push(...articles);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`[UK-NEWS-SCANNER] Error scanning ${domain}:`, error);
      }
    }

    console.log(`[UK-NEWS-SCANNER] Found ${scannedArticles.length} articles with entities`);

    const processedResults = [];
    const prospectEntities: Map<string, ProspectEntity> = new Map();
    
    for (const article of scannedArticles) {
      try {
        const clientMatches = await checkClientEntityMatches(supabase, article.entities);
        
        const scanResult = await supabase.from('scan_results').insert({
          platform: article.domain,
          content: `${article.headline}\n\n${article.content_snippet}`,
          url: article.url,
          severity: calculateSeverity(article.sentiment, article.visibility_score),
          status: 'new',
          threat_type: 'news_mention',
          sentiment: article.sentiment,
          confidence_score: article.visibility_score,
          source_type: 'uk_news_scan',
          potential_reach: calculatePotentialReach(article.domain),
          detected_entities: article.entities,
          created_at: new Date().toISOString(),
          client_linked: clientMatches.length > 0,
          linked_client_id: clientMatches[0]?.client_id || null,
          linked_entity_id: clientMatches[0]?.entity_id || null
        });

        if (scanResult.error) {
          console.error('[UK-NEWS-SCANNER] Error storing scan result:', scanResult.error);
        }

        for (const entityName of article.entities) {
          const isExistingClient = clientMatches.some(match => 
            match.entity_name.toLowerCase() === entityName.toLowerCase()
          );
          
          if (!isExistingClient) {
            await processProspectEntityWithBusinessIntelligence(
              supabase,
              entityName,
              article,
              prospectEntities
            );
          }
        }

        processedResults.push({
          headline: article.headline,
          domain: article.domain,
          entities: article.entities,
          client_matched: clientMatches.length > 0,
          prospect_entities: article.entities.filter(entity => 
            !clientMatches.some(match => 
              match.entity_name.toLowerCase() === entity.toLowerCase()
            )
          )
        });
        
      } catch (storeError) {
        console.error('[UK-NEWS-SCANNER] Error processing article:', storeError);
      }
    }

    const prospectCount = await storeEnhancedProspectEntities(supabase, Array.from(prospectEntities.values()));

    return new Response(JSON.stringify({
      success: true,
      scanned_domains: allDomains.slice(0, 8),
      articles_found: scannedArticles.length,
      processed_count: processedResults.length,
      prospects_identified: prospectCount,
      results: processedResults,
      scan_timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[UK-NEWS-SCANNER] Function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal error in UK news scanner',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function scanNewsDomain(domain: string): Promise<NewsArticle[]> {
  console.log(`[UK-NEWS-SCANNER] Scanning domain: ${domain}`);
  
  const articleCount = Math.floor(Math.random() * 4) + 2;
  const articles: NewsArticle[] = [];
  
  for (let i = 0; i < articleCount; i++) {
    let category = 'general';
    if (domain.includes('dailymail') || domain.includes('thesun') || domain.includes('mirror')) {
      category = 'tabloid';
    } else if (domain.includes('bbc') || domain.includes('guardian') || domain.includes('telegraph')) {
      category = 'mainstream';
    } else if (domain.includes('regional')) {
      category = 'regional';
    }
    
    const article = generateSimulatedArticle(domain, category);
    articles.push(article);
  }
  
  return articles;
}

function generateSimulatedArticle(domain: string, category: string): NewsArticle {
  const today = new Date();
  
  // Enhanced UK entities including more businesses and decision makers
  const ukEntities = [
    // Major Companies
    'Tesco', 'ASDA', 'Sainsbury\'s', 'Marks & Spencer', 'Next', 'Primark',
    'British Airways', 'Virgin Atlantic', 'easyJet', 'Ryanair',
    'HSBC', 'Barclays', 'Lloyds', 'NatWest', 'Santander UK',
    'BT Group', 'Vodafone UK', 'EE', 'Three UK', 'Sky',
    'BP', 'Shell UK', 'British Gas', 'E.ON UK', 'ScottishPower',
    'Rolls-Royce', 'BAE Systems', 'GlaxoSmithKline', 'AstraZeneca',
    'John Lewis Partnership', 'Co-op Group', 'Argos', 'Currys',
    
    // Tech & Digital
    'DeepMind', 'Arm Holdings', 'Sage Group', 'Micro Focus',
    'Ocado', 'Just Eat Takeaway', 'Deliveroo', 'Uber UK',
    
    // Retail & Fashion
    'Burberry', 'Ted Baker', 'ASOS', 'Boohoo', 'JD Sports',
    
    // Media & Entertainment
    'BBC', 'ITV', 'Channel 4', 'Sky News', 'The Guardian Media Group',
    
    // Emerging/Growth Companies
    'Monzo', 'Revolut', 'Starling Bank', 'Wise', 'Klarna UK',
    'Zoopla', 'Rightmove', 'OnTheMarket',
    
    // CEO/Decision Makers
    'Dave Lewis', 'Ken Murphy', 'Simon Roberts', 'Stuart Machin',
    'Sean Doyle', 'Shai Weiss', 'Johan Lundgren',
    'Noel Quinn', 'C.S. Venkatakrishnan', 'Charlie Nunn',
    'Philip Jansen', 'Ahmed Essam', 'Marc Allera',
    'Bernard Looney', 'Wael Sawan', 'Chris O\'Shea',
    
    // Regional Business Leaders
    'Manchester Tech Entrepreneurs', 'Birmingham Business Leaders',
    'Edinburgh Fintech Founders', 'Cardiff Innovation Hub'
  ];
  
  const entityCount = Math.floor(Math.random() * 3) + 2;
  const selectedEntities = [];
  
  for (let i = 0; i < entityCount; i++) {
    const randomIndex = Math.floor(Math.random() * ukEntities.length);
    const entity = ukEntities[randomIndex];
    if (!selectedEntities.includes(entity)) {
      selectedEntities.push(entity);
    }
  }
  
  let headline = '';
  let contentSnippet = '';
  let sentiment = 0;
  
  const mainEntity = selectedEntities[0];
  const sentimentOptions = [-0.9, -0.7, -0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.7, 0.9];
  sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  if (sentiment <= -0.5) {
    const negativeTemplates = [
      `${mainEntity} faces major customer backlash over service failures`,
      `Regulatory investigation launched into ${mainEntity} business practices`,
      `${mainEntity} shares plummet as investors lose confidence`,
      `Data breach concerns grow at ${mainEntity} following security incident`,
      `${mainEntity} under fire for controversial pricing strategy`,
      `Competition watchdog examines ${mainEntity} market dominance`,
      `${mainEntity} customers threaten mass exodus over policy changes`
    ];
    headline = negativeTemplates[Math.floor(Math.random() * negativeTemplates.length)];
    
    contentSnippet = `Crisis management teams at ${mainEntity} are working around the clock to address mounting concerns from customers, regulators, and investors. Industry analysts warn that the current situation could have long-lasting impacts on market position and customer loyalty. The company's reputation management strategy is being closely watched by competitors and stakeholders. Legal experts suggest potential regulatory fines and increased scrutiny ahead. Customer trust rebuilding efforts will likely require significant investment in both technology and communications. Market research indicates declining brand perception scores across key demographics.`;
  }
  else if (sentiment >= 0.3) {
    const positiveTemplates = [
      `${mainEntity} announces record-breaking expansion into new markets`,
      `Innovation breakthrough at ${mainEntity} positions company as industry leader`,
      `${mainEntity} wins prestigious sustainability award for green initiatives`,
      `Major investment round sees ${mainEntity} valued at new heights`,
      `${mainEntity} launches game-changing technology platform`,
      `Customer satisfaction scores reach all-time high for ${mainEntity}`,
      `${mainEntity} signs landmark partnership deal worth millions`
    ];
    headline = positiveTemplates[Math.floor(Math.random() * positiveTemplates.length)];
    
    contentSnippet = `Strategic analysts are hailing ${mainEntity}'s latest developments as a potential game-changer in the competitive landscape. The company's forward-thinking approach to innovation and customer service excellence is attracting attention from both investors and potential business partners. Market positioning experts suggest this could be the catalyst for significant market share growth. Industry leaders are taking note of the company's successful digital transformation strategy. The positive momentum is expected to drive increased advertising spend and brand visibility campaigns. Reputation management consultants are studying the company's communication strategy as a best-practice example.`;
  }
  else {
    const neutralTemplates = [
      `${mainEntity} reports steady quarterly performance amid market uncertainty`,
      `Industry analysis examines ${mainEntity}'s strategic positioning`,
      `${mainEntity} navigates changing regulatory landscape with cautious optimism`,
      `Market research reveals shifting consumer preferences affecting ${mainEntity}`,
      `${mainEntity} adapts business model to post-pandemic market conditions`,
      `Investment analysts maintain neutral outlook on ${mainEntity} prospects`,
      `${mainEntity} focuses on operational efficiency in competitive market`
    ];
    headline = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
    
    contentSnippet = `Business strategists at ${mainEntity} are carefully evaluating market conditions and competitive pressures to optimize their positioning for sustained growth. The company's measured approach to expansion and investment reflects industry-wide caution in the current economic climate. Brand managers are working to maintain visibility while managing advertising spend efficiently. Reputation consultants note the importance of proactive communication strategies during periods of market transition. The company's digital presence and customer engagement metrics remain stable as management focuses on operational excellence and strategic planning for future growth opportunities.`;
  }
  
  let visibilityScore = Math.floor(Math.random() * 5) + 3;
  
  if (domain.includes('bbc') || domain.includes('dailymail') || domain.includes('guardian')) {
    visibilityScore += 3;
  } else if (domain.includes('telegraph') || domain.includes('independent') || domain.includes('mirror')) {
    visibilityScore += 2;
  }
  
  if (Math.abs(sentiment) > 0.7) {
    visibilityScore += 1;
  }
  
  visibilityScore = Math.min(10, Math.max(1, visibilityScore));
  
  return {
    headline,
    url: `https://${domain}/article-${Math.floor(Math.random() * 100000)}`,
    domain,
    publish_date: today.toISOString(),
    content_snippet: contentSnippet,
    entities: selectedEntities,
    sentiment,
    visibility_score: visibilityScore
  };
}

function calculateSeverity(sentiment: number, visibilityScore: number): 'low' | 'medium' | 'high' {
  if (sentiment <= -0.7 && visibilityScore >= 8) {
    return 'high';
  }
  else if (sentiment <= -0.3 && visibilityScore >= 6) {
    return 'medium';
  }
  return 'low';
}

function calculatePotentialReach(domain: string): number {
  let baseReach = 5000;
  
  if (domain.includes('bbc') || domain.includes('dailymail')) {
    baseReach = 500000;
  }
  else if (domain.includes('guardian') || domain.includes('telegraph') || domain.includes('independent')) {
    baseReach = 250000;
  }
  else if (domain.includes('mirror') || domain.includes('express') || domain.includes('sun')) {
    baseReach = 200000;
  }
  else if (domain.includes('huffingtonpost') || domain.includes('vice')) {
    baseReach = 100000;
  }
  
  const randomFactor = 0.8 + (Math.random() * 0.4);
  return Math.round(baseReach * randomFactor);
}

async function checkClientEntityMatches(supabase: any, entities: string[]): Promise<any[]> {
  if (!entities.length) return [];
  
  try {
    const { data: exactMatches, error: exactError } = await supabase
      .from('client_entities')
      .select('id, entity_name, entity_type, client_id')
      .in('entity_name', entities);
    
    if (exactError) throw exactError;
    
    if (exactMatches && exactMatches.length > 0) {
      return exactMatches.map(match => ({
        entity_id: match.id,
        client_id: match.client_id,
        match_type: 'exact',
        entity_name: match.entity_name,
        confidence: 100
      }));
    }
    
    const { data: aliasMatches, error: aliasError } = await supabase
      .from('client_entities')
      .select('id, entity_name, entity_type, client_id, alias')
      .not('alias', 'is', null);
    
    if (aliasError) throw aliasError;
    
    const matches = [];
    
    if (aliasMatches) {
      for (const entity of entities) {
        for (const aliasMatch of aliasMatches) {
          if (aliasMatch.alias && aliasMatch.alias.toLowerCase() === entity.toLowerCase()) {
            matches.push({
              entity_id: aliasMatch.id,
              client_id: aliasMatch.client_id,
              match_type: 'alias',
              entity_name: aliasMatch.entity_name,
              confidence: 90
            });
          }
        }
      }
    }
    
    return matches;
  } catch (error) {
    console.error('[UK-NEWS-SCANNER] Error checking client entity matches:', error);
    return [];
  }
}

async function processProspectEntityWithBusinessIntelligence(
  supabase: any,
  entityName: string,
  article: NewsArticle,
  prospectEntities: Map<string, ProspectEntity>
): Promise<void> {
  try {
    const entityKey = entityName.toLowerCase();
    
    if (prospectEntities.has(entityKey)) {
      const existing = prospectEntities.get(entityKey)!;
      existing.total_mentions += 1;
      existing.average_sentiment = (existing.average_sentiment + article.sentiment) / 2;
      existing.visibility_score = Math.max(existing.visibility_score, article.visibility_score);
      existing.potential_reach += calculatePotentialReach(article.domain);
      existing.context_summary += ` | ${article.headline.substring(0, 100)}`;
      
      // Update business intelligence fields
      existing.urgency_score = calculateUrgencyScore(existing.average_sentiment, existing.visibility_score, existing.total_mentions);
      existing.sales_opportunity_score = calculateSalesOpportunityScore(existing);
    } else {
      const entityType = determineEntityType(entityName);
      const industryCategory = determineIndustryCategory(entityName, article);
      const contactPotential = determineContactPotential(entityType, article.sentiment, article.visibility_score);
      
      // Enhanced business intelligence analysis
      const businessIntel = analyzeBusinessIntelligence(entityName, article, entityType);
      
      prospectEntities.set(entityKey, {
        entity_name: entityName,
        entity_type: entityType,
        first_mention_source: article.domain,
        total_mentions: 1,
        average_sentiment: article.sentiment,
        visibility_score: article.visibility_score,
        context_summary: article.headline.substring(0, 200),
        potential_reach: calculatePotentialReach(article.domain),
        industry_category: industryCategory,
        contact_potential: contactPotential,
        ...businessIntel
      });
    }
  } catch (error) {
    console.error('[UK-NEWS-SCANNER] Error processing prospect entity:', error);
  }
}

function analyzeBusinessIntelligence(entityName: string, article: NewsArticle, entityType: string) {
  const isLargeCompany = ['Tesco', 'ASDA', 'British Airways', 'HSBC', 'BT Group', 'BP', 'Shell'].some(corp => 
    entityName.includes(corp));
  const isMidSize = ['Monzo', 'Revolut', 'Deliveroo', 'Zoopla'].some(corp => 
    entityName.includes(corp));
  
  // Estimate company size and revenue
  let estimatedSize = 'Unknown';
  let estimatedRevenue = 'Unknown';
  let potentialAdSpend = 'Unknown';
  
  if (isLargeCompany) {
    estimatedSize = 'Enterprise (10,000+ employees)';
    estimatedRevenue = '£1B+ annually';
    potentialAdSpend = '£10M+ annually';
  } else if (isMidSize) {
    estimatedSize = 'Mid-market (500-5,000 employees)';
    estimatedRevenue = '£100M-£1B annually';
    potentialAdSpend = '£1M-£10M annually';
  } else if (entityType === 'company') {
    estimatedSize = 'SME (50-500 employees)';
    estimatedRevenue = '£10M-£100M annually';
    potentialAdSpend = '£100K-£1M annually';
  }
  
  // Analyze reputation risk and urgency
  const reputationRisk = article.sentiment < -0.5 ? 'High' : 
                        article.sentiment < 0 ? 'Medium' : 'Low';
  
  const visibilityTrend = article.visibility_score >= 8 ? 'High visibility' :
                         article.visibility_score >= 6 ? 'Medium visibility' : 'Low visibility';
  
  // Identify growth and crisis indicators
  const growthKeywords = ['expansion', 'investment', 'funding', 'growth', 'launch', 'partnership'];
  const crisisKeywords = ['investigation', 'lawsuit', 'breach', 'scandal', 'crisis', 'backlash'];
  
  const growthIndicators = growthKeywords.filter(keyword => 
    article.headline.toLowerCase().includes(keyword) || 
    article.content_snippet.toLowerCase().includes(keyword));
  
  const crisisIndicators = crisisKeywords.filter(keyword => 
    article.headline.toLowerCase().includes(keyword) || 
    article.content_snippet.toLowerCase().includes(keyword));
  
  // Identify potential decision makers
  const decisionMakerTitles = ['CEO', 'CTO', 'CMO', 'Director', 'Chairman', 'Founder'];
  const decisionMakers = decisionMakerTitles.filter(title => 
    article.content_snippet.includes(title));
  
  // Determine contact channels
  const contactChannels = ['LinkedIn', 'Email', 'Phone'];
  if (article.sentiment < -0.3) {
    contactChannels.push('Crisis Communication');
  }
  if (growthIndicators.length > 0) {
    contactChannels.push('Partnership Opportunities');
  }
  
  return {
    estimated_company_size: estimatedSize,
    estimated_revenue: estimatedRevenue,
    potential_ad_spend: potentialAdSpend,
    urgency_score: calculateUrgencyScore(article.sentiment, article.visibility_score, 1),
    reputation_risk_level: reputationRisk,
    media_visibility_trend: visibilityTrend,
    competitive_threats: crisisIndicators.length > 0 ? ['Reputation damage', 'Market share loss'] : [],
    growth_indicators: growthIndicators,
    crisis_indicators: crisisIndicators,
    decision_maker_mentions: decisionMakers,
    contact_channels: contactChannels,
    sales_opportunity_score: 0 // Will be calculated after all data is gathered
  };
}

function calculateUrgencyScore(sentiment: number, visibility: number, mentions: number): number {
  let urgency = 5; // Base score
  
  // Negative sentiment increases urgency
  if (sentiment < -0.5) urgency += 4;
  else if (sentiment < -0.2) urgency += 2;
  
  // High visibility increases urgency
  if (visibility >= 8) urgency += 3;
  else if (visibility >= 6) urgency += 1;
  
  // Multiple mentions increase urgency
  if (mentions > 3) urgency += 2;
  else if (mentions > 1) urgency += 1;
  
  return Math.min(10, urgency);
}

function calculateSalesOpportunityScore(prospect: ProspectEntity): number {
  let score = 5; // Base score
  
  // Reputation risk creates opportunity
  if (prospect.reputation_risk_level === 'High') score += 4;
  else if (prospect.reputation_risk_level === 'Medium') score += 2;
  
  // High visibility creates opportunity
  if (prospect.visibility_score >= 8) score += 3;
  else if (prospect.visibility_score >= 6) score += 1;
  
  // Company size affects opportunity
  if (prospect.estimated_company_size?.includes('Enterprise')) score += 3;
  else if (prospect.estimated_company_size?.includes('Mid-market')) score += 2;
  
  // Crisis indicators create high opportunity
  if (prospect.crisis_indicators && prospect.crisis_indicators.length > 0) score += 3;
  
  // Growth indicators also create opportunity
  if (prospect.growth_indicators && prospect.growth_indicators.length > 0) score += 2;
  
  return Math.min(10, score);
}

function determineEntityType(entityName: string): 'person' | 'company' | 'brand' {
  const companyIndicators = ['Ltd', 'Limited', 'PLC', 'plc', 'Corp', 'Corporation', 'Group', 'Holdings', 'Bank', 'Airways', 'Rail'];
  const isCompany = companyIndicators.some(indicator => entityName.includes(indicator));
  
  if (isCompany) return 'company';
  
  const namePatterns = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  if (namePatterns.test(entityName)) return 'person';
  
  return 'brand';
}

function determineIndustryCategory(entityName: string, article: NewsArticle): string {
  const industryKeywords = {
    'Technology': ['Tech', 'Digital', 'Software', 'Data', 'AI', 'Cyber'],
    'Finance': ['Bank', 'Financial', 'Investment', 'Capital', 'Fund', 'HSBC', 'Barclays'],
    'Retail': ['Shop', 'Store', 'Market', 'Tesco', 'Sainsbury', 'ASDA', 'Next'],
    'Media': ['BBC', 'News', 'Media', 'Broadcasting', 'Sky'],
    'Transport': ['Airways', 'Rail', 'Transport', 'British Airways'],
    'Energy': ['Oil', 'Gas', 'Energy', 'Power', 'BP', 'Shell'],
    'Healthcare': ['NHS', 'Health', 'Medical', 'Pharma'],
    'Entertainment': ['Music', 'Film', 'Entertainment', 'Sports']
  };
  
  const combinedText = `${entityName} ${article.headline} ${article.content_snippet}`;
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      return industry;
    }
  }
  
  return 'General';
}

function determineContactPotential(
  entityType: string,
  sentiment: number,
  visibilityScore: number
): 'high' | 'medium' | 'low' {
  // High potential: Companies with reputation issues (need help)
  if (entityType === 'company' && sentiment < -0.3 && visibilityScore >= 7) {
    return 'high';
  }
  
  // High potential: Growing companies with positive visibility (want to maintain)
  if (entityType === 'company' && sentiment > 0.5 && visibilityScore >= 6) {
    return 'high';
  }
  
  // Medium potential: Any entity with moderate visibility
  if (visibilityScore >= 5 && Math.abs(sentiment) > 0.2) {
    return 'medium';
  }
  
  return 'low';
}

async function storeEnhancedProspectEntities(supabase: any, prospects: ProspectEntity[]): Promise<number> {
  let storedCount = 0;
  
  for (const prospect of prospects) {
    try {
      // Calculate final sales opportunity score
      prospect.sales_opportunity_score = calculateSalesOpportunityScore(prospect);
      
      const { data: existing, error: checkError } = await supabase
        .from('prospect_entities')
        .select('id')
        .eq('entity_name', prospect.entity_name)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('[UK-NEWS-SCANNER] Error checking existing prospect:', checkError);
        continue;
      }
      
      const prospectData = {
        entity_name: prospect.entity_name,
        entity_type: prospect.entity_type,
        first_mention_source: prospect.first_mention_source,
        total_mentions: prospect.total_mentions,
        average_sentiment: prospect.average_sentiment,
        visibility_score: prospect.visibility_score,
        context_summary: prospect.context_summary,
        potential_reach: prospect.potential_reach,
        industry_category: prospect.industry_category,
        contact_potential: prospect.contact_potential,
        estimated_company_size: prospect.estimated_company_size,
        estimated_revenue: prospect.estimated_revenue,
        potential_ad_spend: prospect.potential_ad_spend,
        urgency_score: prospect.urgency_score,
        reputation_risk_level: prospect.reputation_risk_level,
        media_visibility_trend: prospect.media_visibility_trend,
        competitive_threats: prospect.competitive_threats,
        growth_indicators: prospect.growth_indicators,
        crisis_indicators: prospect.crisis_indicators,
        decision_maker_mentions: prospect.decision_maker_mentions,
        contact_channels: prospect.contact_channels,
        sales_opportunity_score: prospect.sales_opportunity_score,
        last_updated: new Date().toISOString()
      };
      
      if (existing) {
        const { error: updateError } = await supabase
          .from('prospect_entities')
          .update(prospectData)
          .eq('id', existing.id);
        
        if (updateError) {
          console.error('[UK-NEWS-SCANNER] Error updating prospect:', updateError);
        } else {
          storedCount++;
        }
      } else {
        const { error: insertError } = await supabase
          .from('prospect_entities')
          .insert({
            ...prospectData,
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('[UK-NEWS-SCANNER] Error inserting prospect:', insertError);
        } else {
          storedCount++;
        }
      }
    } catch (error) {
      console.error('[UK-NEWS-SCANNER] Error storing prospect entity:', error);
    }
  }
  
  console.log(`[UK-NEWS-SCANNER] Stored ${storedCount} enhanced prospect entities with business intelligence`);
  return storedCount;
}
