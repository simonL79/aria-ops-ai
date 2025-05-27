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

    console.log('[UK-NEWS-SCANNER] Starting UK newspaper zero-input discovery scan...');

    const scannedArticles: NewsArticle[] = [];
    const allDomains = [...UK_NEWS_DOMAINS.national, ...UK_NEWS_DOMAINS.digital, ...UK_NEWS_DOMAINS.regional];
    
    for (const domain of allDomains.slice(0, 5)) { // Limit to 5 domains per scan to avoid timeouts
      try {
        const articles = await scanNewsDomain(domain);
        scannedArticles.push(...articles);
        
        // Throttle to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`[UK-NEWS-SCANNER] Error scanning ${domain}:`, error);
      }
    }

    console.log(`[UK-NEWS-SCANNER] Found ${scannedArticles.length} articles with entities`);

    // Process and store articles
    const processedResults = [];
    for (const article of scannedArticles) {
      try {
        // Check for client entity matches
        const clientMatches = await checkClientEntityMatches(supabase, article.entities);
        
        // Store in scan_results
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
          // Client matching fields
          client_linked: clientMatches.length > 0,
          linked_client_id: clientMatches[0]?.client_id || null,
          linked_entity_id: clientMatches[0]?.entity_id || null
        });

        if (scanResult.error) {
          console.error('[UK-NEWS-SCANNER] Error storing scan result:', scanResult.error);
        } else {
          processedResults.push({
            headline: article.headline,
            domain: article.domain,
            entities: article.entities,
            client_matched: clientMatches.length > 0
          });
        }
      } catch (storeError) {
        console.error('[UK-NEWS-SCANNER] Error processing article:', storeError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      scanned_domains: allDomains.slice(0, 5),
      articles_found: scannedArticles.length,
      processed_count: processedResults.length,
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
  const articleCount = Math.floor(Math.random() * 3) + 1;
  
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
  
  // Define common UK figures/entities for simulation
  const ukPublicFigures = [
    'Keir Starmer', 'Rishi Sunak', 'Boris Johnson', 'Prince William', 
    'King Charles', 'David Beckham', 'Adele', 'Lewis Hamilton', 
    'Emma Watson', 'Idris Elba', 'Daniel Craig', 'Judi Dench',
    'Marcus Rashford', 'John Lewis', 'BBC', 'NHS', 'Tesco', 
    'British Airways', 'Royal Mail', 'BP', 'Shell'
  ];
  
  // Select 1-3 random entities
  const entityCount = Math.floor(Math.random() * 3) + 1;
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
  const sentimentOptions = [-0.9, -0.7, -0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.7];
  sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  if (sentiment <= -0.5) {
    // Negative headline
    const negativeTemplates = [
      `${mainEntity} faces criticism over recent comments`,
      `Scandal erupts as ${mainEntity} admits to mistakes`,
      `Public outrage grows following ${mainEntity}'s controversial decision`,
      `${mainEntity} under fire after shocking revelations`,
      `Crisis deepens for ${mainEntity} as new evidence emerges`
    ];
    headline = negativeTemplates[Math.floor(Math.random() * negativeTemplates.length)];
    
    contentSnippet = `The reputation of ${mainEntity} is in jeopardy after recent developments. Critics have been vocal about their disapproval, suggesting potential long-term damage to public trust. Industry experts express concern about the implications of these events.`;
  }
  else if (sentiment >= 0.3) {
    // Positive headline
    const positiveTemplates = [
      `${mainEntity} praised for groundbreaking initiative`,
      `Public shows overwhelming support for ${mainEntity}`,
      `${mainEntity} celebrates success of recent project`,
      `New poll shows rising popularity for ${mainEntity}`,
      `${mainEntity} receives award for outstanding contribution`
    ];
    headline = positiveTemplates[Math.floor(Math.random() * positiveTemplates.length)];
    
    contentSnippet = `In a welcome development, ${mainEntity} has received significant positive attention from both the public and industry professionals. Analysts suggest this could strengthen their position in the coming months, with several opportunities for further advancement on the horizon.`;
  }
  else {
    // Neutral headline
    const neutralTemplates = [
      `${mainEntity} announces new plans for coming year`,
      `Recent survey examines impact of ${mainEntity}`,
      `${mainEntity} discusses industry changes in interview`,
      `Analysis: What's next for ${mainEntity}?`,
      `${mainEntity} participates in annual forum`
    ];
    headline = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
    
    contentSnippet = `In recent developments involving ${mainEntity}, several key factors have come to light that may influence future outcomes. Industry observers note that while these changes are significant, their ultimate impact remains to be seen as circumstances continue to evolve.`;
  }
  
  // Calculate visibility score (1-10)
  let visibilityScore = 5; // Default midpoint
  
  // Adjust based on domain popularity
  if (domain.includes('bbc') || domain.includes('dailymail') || domain.includes('guardian')) {
    visibilityScore += 3; // Major outlets get higher visibility
  }
  
  // Adjust based on sentiment extremity
  if (Math.abs(sentiment) > 0.7) {
    visibilityScore += 1; // Extreme sentiment gets more visibility
  }
  
  // Keep within 1-10 range
  visibilityScore = Math.min(10, Math.max(1, visibilityScore));
  
  return {
    headline,
    url: `https://${domain}/article-${Math.floor(Math.random() * 10000)}`,
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
