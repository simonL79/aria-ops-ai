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

    console.log('[UK-NEWS-SCANNER] Starting comprehensive UK news scan for client and prospect discovery...');

    const scannedArticles: NewsArticle[] = [];
    const allDomains = [...UK_NEWS_DOMAINS.national, ...UK_NEWS_DOMAINS.digital, ...UK_NEWS_DOMAINS.regional];
    
    for (const domain of allDomains.slice(0, 8)) { // Increased to 8 domains for better coverage
      try {
        const articles = await scanNewsDomain(domain);
        scannedArticles.push(...articles);
        
        // Throttle to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`[UK-NEWS-SCANNER] Error scanning ${domain}:`, error);
      }
    }

    console.log(`[UK-NEWS-SCANNER] Found ${scannedArticles.length} articles with entities`);

    // Process articles and categorize entities
    const processedResults = [];
    const prospectEntities: Map<string, ProspectEntity> = new Map();
    
    for (const article of scannedArticles) {
      try {
        // Check for client entity matches
        const clientMatches = await checkClientEntityMatches(supabase, article.entities);
        
        // Store scan result
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

        // Process entities for prospect identification
        for (const entityName of article.entities) {
          const isExistingClient = clientMatches.some(match => 
            match.entity_name.toLowerCase() === entityName.toLowerCase()
          );
          
          if (!isExistingClient) {
            // This is a potential prospect - collect detailed information
            await processProspectEntity(
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

    // Store aggregated prospect information
    const prospectCount = await storeProspectEntities(supabase, Array.from(prospectEntities.values()));

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

/**
 * Scan a news domain for recent news articles
 * Simulated function that would normally fetch and parse real content
 */
async function scanNewsDomain(domain: string): Promise<NewsArticle[]> {
  console.log(`[UK-NEWS-SCANNER] Scanning domain: ${domain}`);
  
  // Simulate different article counts by domain
  const articleCount = Math.floor(Math.random() * 4) + 2; // Increased from 3 to 4 max
  
  // Generate simulated articles based on the domain
  const articles: NewsArticle[] = [];
  
  for (let i = 0; i < articleCount; i++) {
    // Determine domain category
    let category = 'general';
    if (domain.includes('dailymail') || domain.includes('thesun') || domain.includes('mirror')) {
      category = 'tabloid';
    } else if (domain.includes('bbc') || domain.includes('guardian') || domain.includes('telegraph')) {
      category = 'mainstream';
    } else if (domain.includes('regional')) {
      category = 'regional';
    }
    
    // Generate article based on domain category
    const article = generateSimulatedArticle(domain, category);
    articles.push(article);
  }
  
  return articles;
}

/**
 * Generate simulated article data
 * This would be replaced with actual web scraping in production
 */
function generateSimulatedArticle(domain: string, category: string): NewsArticle {
  const today = new Date();
  
  // Expanded UK figures/entities including more business leaders and companies
  const ukPublicFigures = [
    'Keir Starmer', 'Rishi Sunak', 'Boris Johnson', 'Prince William', 
    'King Charles', 'David Beckham', 'Adele', 'Lewis Hamilton', 
    'Emma Watson', 'Idris Elba', 'Daniel Craig', 'Judi Dench',
    'Marcus Rashford', 'John Lewis', 'BBC', 'NHS', 'Tesco', 
    'British Airways', 'Royal Mail', 'BP', 'Shell', 'Vodafone',
    'Richard Branson', 'Alan Sugar', 'James Dyson', 'Bernard Eccleston',
    'Rolls-Royce', 'Aston Martin', 'Burberry', 'HSBC', 'Barclays',
    'Sainsbury\'s', 'ASDA', 'Marks & Spencer', 'Next', 'Primark',
    'Gordon Ramsay', 'Jamie Oliver', 'Ed Sheeran', 'Coldplay',
    'Sky', 'BT', 'EE', 'Three Mobile', 'Virgin Media'
  ];
  
  // Select 2-4 random entities for better prospect data
  const entityCount = Math.floor(Math.random() * 3) + 2;
  const selectedEntities = [];
  
  for (let i = 0; i < entityCount; i++) {
    const randomIndex = Math.floor(Math.random() * ukPublicFigures.length);
    const entity = ukPublicFigures[randomIndex];
    if (!selectedEntities.includes(entity)) {
      selectedEntities.push(entity);
    }
  }
  
  // Generate headline based on selected entities
  let headline = '';
  let contentSnippet = '';
  let sentiment = 0;
  
  const mainEntity = selectedEntities[0];
  const sentimentOptions = [-0.9, -0.7, -0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.7, 0.9];
  sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  if (sentiment <= -0.5) {
    // Negative headline
    const negativeTemplates = [
      `${mainEntity} faces criticism over recent controversial statements`,
      `Scandal erupts as ${mainEntity} admits to strategic mistakes`,
      `Public outrage grows following ${mainEntity}'s controversial business decision`,
      `${mainEntity} under fire after shocking financial revelations`,
      `Crisis deepens for ${mainEntity} as regulatory investigation begins`,
      `${mainEntity} stock price plummets amid investor concerns`,
      `Customers boycott ${mainEntity} following service failures`
    ];
    headline = negativeTemplates[Math.floor(Math.random() * negativeTemplates.length)];
    
    contentSnippet = `The reputation of ${mainEntity} is in serious jeopardy after recent developments that have sent shockwaves through the industry. Critics have been increasingly vocal about their disapproval, with many suggesting potential long-term damage to public trust and market position. Industry experts express grave concern about the implications of these events, warning of possible regulatory intervention and significant financial consequences. Stakeholders are calling for immediate action to address the mounting concerns.`;
  }
  else if (sentiment >= 0.3) {
    // Positive headline
    const positiveTemplates = [
      `${mainEntity} praised for groundbreaking sustainable initiative`,
      `Public shows overwhelming support for ${mainEntity}'s innovation`,
      `${mainEntity} celebrates record-breaking success of recent expansion`,
      `New poll shows rising popularity and trust for ${mainEntity}`,
      `${mainEntity} receives prestigious industry award for excellence`,
      `${mainEntity} announces major investment in UK operations`,
      `Share prices soar as ${mainEntity} reports exceptional growth`
    ];
    headline = positiveTemplates[Math.floor(Math.random() * positiveTemplates.length)];
    
    contentSnippet = `In a highly welcome development, ${mainEntity} has received significant positive attention from both the public and industry professionals nationwide. Market analysts suggest this could substantially strengthen their competitive position in the coming months, with several major opportunities for further advancement and expansion on the horizon. The company's stock has responded positively to the news, and industry leaders are taking note of their innovative approach.`;
  }
  else {
    // Neutral headline
    const neutralTemplates = [
      `${mainEntity} announces strategic plans for upcoming fiscal year`,
      `Recent comprehensive survey examines market impact of ${mainEntity}`,
      `${mainEntity} discusses industry transformation in exclusive interview`,
      `Market Analysis: What's next for ${mainEntity} in changing landscape?`,
      `${mainEntity} participates in major annual industry forum`,
      `${mainEntity} reports quarterly results meeting analyst expectations`,
      `Industry experts weigh in on ${mainEntity}'s market strategy`
    ];
    headline = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
    
    contentSnippet = `In recent developments involving ${mainEntity}, several key strategic factors have come to light that may significantly influence future market outcomes and industry positioning. Industry observers note that while these changes represent important shifts in approach, their ultimate impact on market share and consumer sentiment remains to be seen as circumstances continue to evolve rapidly in the competitive landscape.`;
  }
  
  // Calculate visibility score (1-10) with more variation
  let visibilityScore = Math.floor(Math.random() * 5) + 3; // 3-7 base range
  
  // Adjust based on domain popularity
  if (domain.includes('bbc') || domain.includes('dailymail') || domain.includes('guardian')) {
    visibilityScore += 3; // Major outlets get higher visibility
  } else if (domain.includes('telegraph') || domain.includes('independent') || domain.includes('mirror')) {
    visibilityScore += 2; // Mid-tier outlets
  }
  
  // Adjust based on sentiment extremity
  if (Math.abs(sentiment) > 0.7) {
    visibilityScore += 1; // Extreme sentiment gets more visibility
  }
  
  // Keep within 1-10 range
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

/**
 * Determine severity level based on sentiment and visibility
 */
function calculateSeverity(sentiment: number, visibilityScore: number): 'low' | 'medium' | 'high' {
  // High severity if it's very negative AND highly visible
  if (sentiment <= -0.7 && visibilityScore >= 8) {
    return 'high';
  }
  // Medium severity if it's negative AND moderately visible
  else if (sentiment <= -0.3 && visibilityScore >= 6) {
    return 'medium';
  }
  // Otherwise low severity
  return 'low';
}

/**
 * Estimate potential reach based on domain
 */
function calculatePotentialReach(domain: string): number {
  // Base reach values by domain category
  let baseReach = 5000; // Default for regional/smaller outlets
  
  if (domain.includes('bbc') || domain.includes('dailymail')) {
    baseReach = 500000; // Major national outlets
  }
  else if (domain.includes('guardian') || domain.includes('telegraph') || domain.includes('independent')) {
    baseReach = 250000; // Large nationals
  }
  else if (domain.includes('mirror') || domain.includes('express') || domain.includes('sun')) {
    baseReach = 200000; // Tabloids
  }
  else if (domain.includes('huffingtonpost') || domain.includes('vice')) {
    baseReach = 100000; // Digital only
  }
  
  // Add some randomness (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4);
  return Math.round(baseReach * randomFactor);
}

/**
 * Check for matches with client entities
 */
async function checkClientEntityMatches(supabase: any, entities: string[]): Promise<any[]> {
  if (!entities.length) return [];
  
  try {
    // Query for exact matches first
    const { data: exactMatches, error: exactError } = await supabase
      .from('client_entities')
      .select('id, entity_name, entity_type, client_id')
      .in('entity_name', entities);
    
    if (exactError) throw exactError;
    
    // If we found exact matches, return those
    if (exactMatches && exactMatches.length > 0) {
      return exactMatches.map(match => ({
        entity_id: match.id,
        client_id: match.client_id,
        match_type: 'exact',
        entity_name: match.entity_name,
        confidence: 100
      }));
    }
    
    // Query for alias matches
    const { data: aliasMatches, error: aliasError } = await supabase
      .from('client_entities')
      .select('id, entity_name, entity_type, client_id, alias')
      .not('alias', 'is', null);
    
    if (aliasError) throw aliasError;
    
    // Check if any entity matches an alias
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

/**
 * Process and collect prospect entity information
 */
async function processProspectEntity(
  supabase: any,
  entityName: string,
  article: NewsArticle,
  prospectEntities: Map<string, ProspectEntity>
): Promise<void> {
  try {
    const entityKey = entityName.toLowerCase();
    
    if (prospectEntities.has(entityKey)) {
      // Update existing prospect data
      const existing = prospectEntities.get(entityKey)!;
      existing.total_mentions += 1;
      existing.average_sentiment = (existing.average_sentiment + article.sentiment) / 2;
      existing.visibility_score = Math.max(existing.visibility_score, article.visibility_score);
      existing.potential_reach += calculatePotentialReach(article.domain);
      existing.context_summary += ` | ${article.headline.substring(0, 100)}`;
    } else {
      // Create new prospect entity
      const entityType = determineEntityType(entityName);
      const industryCategory = determineIndustryCategory(entityName, article);
      const contactPotential = determineContactPotential(entityType, article.sentiment, article.visibility_score);
      
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
        contact_potential: contactPotential
      });
    }
  } catch (error) {
    console.error('[UK-NEWS-SCANNER] Error processing prospect entity:', error);
  }
}

/**
 * Determine entity type based on name patterns
 */
function determineEntityType(entityName: string): 'person' | 'company' | 'brand' {
  const companyIndicators = ['Ltd', 'Limited', 'PLC', 'plc', 'Corp', 'Corporation', 'Group', 'Holdings', 'Bank', 'Airways', 'Rail'];
  const isCompany = companyIndicators.some(indicator => entityName.includes(indicator));
  
  if (isCompany) return 'company';
  
  // Simple heuristic: if it contains typical name patterns, it's likely a person
  const namePatterns = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  if (namePatterns.test(entityName)) return 'person';
  
  return 'brand';
}

/**
 * Determine industry category based on entity name and context
 */
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

/**
 * Determine contact potential based on various factors
 */
function determineContactPotential(
  entityType: string,
  sentiment: number,
  visibilityScore: number
): 'high' | 'medium' | 'low' {
  // High potential: Companies with negative sentiment (reputation risk) and high visibility
  if (entityType === 'company' && sentiment < -0.3 && visibilityScore >= 7) {
    return 'high';
  }
  
  // Medium potential: Any entity with moderate visibility and some reputation concerns
  if (visibilityScore >= 5 && sentiment < 0) {
    return 'medium';
  }
  
  // High potential: Positive companies that might want to maintain their reputation
  if (entityType === 'company' && sentiment > 0.5 && visibilityScore >= 6) {
    return 'high';
  }
  
  return 'low';
}

/**
 * Store prospect entities in the database
 */
async function storeProspectEntities(supabase: any, prospects: ProspectEntity[]): Promise<number> {
  let storedCount = 0;
  
  for (const prospect of prospects) {
    try {
      // Check if this prospect already exists
      const { data: existing, error: checkError } = await supabase
        .from('prospect_entities')
        .select('id')
        .eq('entity_name', prospect.entity_name)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not a "no rows" error
        console.error('[UK-NEWS-SCANNER] Error checking existing prospect:', checkError);
        continue;
      }
      
      if (existing) {
        // Update existing prospect
        const { error: updateError } = await supabase
          .from('prospect_entities')
          .update({
            total_mentions: prospect.total_mentions,
            average_sentiment: prospect.average_sentiment,
            visibility_score: prospect.visibility_score,
            context_summary: prospect.context_summary,
            potential_reach: prospect.potential_reach,
            contact_potential: prospect.contact_potential,
            last_updated: new Date().toISOString()
          })
          .eq('id', existing.id);
        
        if (updateError) {
          console.error('[UK-NEWS-SCANNER] Error updating prospect:', updateError);
        } else {
          storedCount++;
        }
      } else {
        // Insert new prospect
        const { error: insertError } = await supabase
          .from('prospect_entities')
          .insert({
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
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
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
  
  console.log(`[UK-NEWS-SCANNER] Stored ${storedCount} prospect entities`);
  return storedCount;
}
