import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ARIA_INGEST_KEY = Deno.env.get('ARIA_INGEST_KEY');

console.log('[RSS-SCRAPER] Environment check:');
console.log('[RSS-SCRAPER] SUPABASE_URL exists:', !!SUPABASE_URL);
console.log('[RSS-SCRAPER] ARIA_INGEST_KEY exists:', !!ARIA_INGEST_KEY);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// RSS feeds focused on influencers, sports personalities, and public figures
const RSS_FEEDS = [
  { url: 'https://www.tmz.com/rss.xml', name: 'TMZ Celebrity News' },
  { url: 'https://pagesix.nypost.com/feed/', name: 'Page Six' },
  { url: 'https://www.etonline.com/rss', name: 'Entertainment Tonight' },
  { url: 'https://www.espn.com/espn/rss/news', name: 'ESPN Sports News' },
  { url: 'https://www.si.com/rss/si_topstories.rss', name: 'Sports Illustrated' },
  { url: 'https://www.usatoday.com/sports/', name: 'USA Today Sports' },
  { url: 'https://www.hollywoodreporter.com/feed/', name: 'Hollywood Reporter' },
  { url: 'https://variety.com/feed/', name: 'Variety Entertainment' },
  { url: 'https://www.people.com/feed/', name: 'People Magazine' },
  { url: 'https://www.eonline.com/news.rss', name: 'E! News' },
  { url: 'https://www.complex.com/rss/', name: 'Complex Culture' },
  { url: 'https://www.billboard.com/feed/', name: 'Billboard Music' },
  { url: 'https://bleacherreport.com/articles/feed', name: 'Bleacher Report' },
  { url: 'https://www.nfl.com/feeds/rss/news', name: 'NFL News' },
  { url: 'https://www.nba.com/news/rss.xml', name: 'NBA News' }
];

// Keywords focused on public figure threats and reputation risks
const THREAT_KEYWORDS = [
  // Legal issues
  'lawsuit', 'sued', 'charges', 'arrested', 'investigation', 'fraud', 'scandal',
  'court', 'trial', 'guilty', 'conviction', 'settlement', 'legal action',
  
  // Behavioral issues
  'controversy', 'backlash', 'criticism', 'outrage', 'offensive', 'inappropriate',
  'misconduct', 'behavior', 'allegations', 'accused', 'denied', 'apology',
  
  // Career/reputation damage
  'fired', 'suspended', 'dropped', 'cancelled', 'boycott', 'loses endorsement',
  'contract terminated', 'banned', 'excluded', 'resignation', 'stepped down',
  
  // Social media/public relations
  'viral', 'trending', 'social media storm', 'twitter controversy', 'instagram drama',
  'leaked', 'exposed', 'caught', 'video surfaces', 'photos leaked',
  
  // Health/personal issues
  'rehab', 'addiction', 'mental health', 'hospitalized', 'injury concerns',
  'personal struggles', 'family issues', 'divorce', 'custody battle',
  
  // Performance/career issues
  'poor performance', 'booed', 'criticized', 'disappointing', 'failure',
  'retirement', 'benched', 'traded', 'cut from team', 'career ending'
];

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

/**
 * Parse RSS feed XML and extract items
 */
function parseRSSFeed(xmlText: string, sourceName: string): RSSItem[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = doc.querySelectorAll('item');
    const parsedItems: RSSItem[] = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      parsedItems.push({
        title,
        description,
        link,
        pubDate,
        source: sourceName
      });
    });
    
    return parsedItems;
  } catch (error) {
    console.error(`[RSS-SCRAPER] Error parsing RSS feed for ${sourceName}:`, error);
    return [];
  }
}

/**
 * Check if an RSS item contains threat keywords
 */
function containsThreatKeywords(item: RSSItem): boolean {
  const content = `${item.title} ${item.description}`.toLowerCase();
  return THREAT_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
}

/**
 * Send RSS item to ARIA ingest pipeline
 */
async function sendToAriaIngest(item: RSSItem) {
  try {
    const content = `${item.title}\n${item.description}`;
    
    console.log(`[RSS-SCRAPER] Sending to ARIA ingest: ${item.title.substring(0, 50)}...`);
    
    const payload = {
      content: content,
      platform: 'news',
      url: item.link,
      source_type: 'rss_feed',
      confidence_score: 75,
      potential_reach: 50000, // Higher reach estimate for celebrity/sports news
      metadata: {
        source: item.source,
        published_date: item.pubDate,
        content_type: 'celebrity_sports_news'
      }
    };
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/aria-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ARIA_INGEST_KEY || 'H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ARIA ingest failed: ${error}`);
    }
    
    const result = await response.json();
    console.log(`[RSS-SCRAPER] Successfully sent to ARIA ingest`);
    return result;
    
  } catch (error) {
    console.error(`[RSS-SCRAPER] Error sending to ARIA ingest:`, error);
    throw error;
  }
}

/**
 * Scan RSS feeds for threat-related content
 */
async function scanRSSFeeds(): Promise<RSSItem[]> {
  console.log('[RSS-SCRAPER] Starting RSS feed scan for celebrity/sports content...');
  
  const matchingItems: RSSItem[] = [];
  
  for (const feed of RSS_FEEDS) {
    console.log(`[RSS-SCRAPER] Scanning ${feed.name}: ${feed.url}`);
    
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'RepWatch Celebrity Scanner/1.0 (https://repwatch.co)'
        }
      });
      
      if (!response.ok) {
        console.error(`[RSS-SCRAPER] Failed to fetch ${feed.name}: ${response.status}`);
        continue;
      }
      
      const xmlText = await response.text();
      const items = parseRSSFeed(xmlText, feed.name);
      
      console.log(`[RSS-SCRAPER] Retrieved ${items.length} items from ${feed.name}`);
      
      // Filter items that contain threat keywords
      const threatItems = items.filter(containsThreatKeywords);
      
      if (threatItems.length > 0) {
        console.log(`[RSS-SCRAPER] Found ${threatItems.length} potential reputation threats in ${feed.name}`);
        matchingItems.push(...threatItems);
      }
      
    } catch (error) {
      console.error(`[RSS-SCRAPER] Error scanning ${feed.name}:`, error);
      continue;
    }
  }
  
  console.log(`[RSS-SCRAPER] Found ${matchingItems.length} celebrity/sports threat items total`);
  return matchingItems;
}

/**
 * Main handler for the RSS scraper function
 */
serve(async (req) => {
  console.log(`[RSS-SCRAPER] === NEW REQUEST ===`);
  console.log(`[RSS-SCRAPER] Method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST or GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Scan RSS feeds for matching content
    console.log('[RSS-SCRAPER] Starting celebrity/sports news scan...');
    const matchingItems = await scanRSSFeeds();
    
    // Process each matching item
    const results = [];
    for (const item of matchingItems) {
      try {
        const result = await sendToAriaIngest(item);
        results.push({
          title: item.title,
          source: item.source,
          url: item.link,
          success: true,
          ariaResult: result
        });
      } catch (error) {
        console.error('[RSS-SCRAPER] Error processing item:', error);
        results.push({
          title: item.title,
          source: item.source,
          url: item.link,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log(`[RSS-SCRAPER] Celebrity/sports scan completed successfully`);
    return new Response(JSON.stringify({ 
      status: 'success',
      scan_type: 'celebrity_sports_news',
      feeds_scanned: RSS_FEEDS.map(f => f.name),
      matches_found: matchingItems.length,
      processed: results.length,
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[RSS-SCRAPER] Function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
