
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

// UK-focused RSS feeds for celebrities, sports personalities, and general news
const RSS_FEEDS = [
  // UK Celebrity & Entertainment News
  { url: 'https://www.thesun.co.uk/tvandshowbiz/feed/', name: 'The Sun - TV & Showbiz' },
  { url: 'https://www.dailymail.co.uk/tvshowbiz/index.rss', name: 'Daily Mail - TV & Showbiz' },
  { url: 'https://www.mirror.co.uk/3am/feed/', name: 'The Mirror - 3AM Celebrity News' },
  { url: 'https://www.ok.co.uk/celebrity-news/rss.xml', name: 'OK! Magazine Celebrity News' },
  { url: 'https://www.hellomagazine.com/rss/celebrities/', name: 'Hello! Magazine - Celebrities' },
  { url: 'https://www.digitalspy.com/rss/showbiz.xml', name: 'Digital Spy - Showbiz' },
  
  // UK Sports News
  { url: 'https://www.bbc.co.uk/sport/rss.xml', name: 'BBC Sport' },
  { url: 'https://www.theguardian.com/uk/sport/rss', name: 'The Guardian - UK Sport' },
  { url: 'https://www.skysports.com/rss/12040', name: 'Sky Sports News' },
  { url: 'https://www.independent.co.uk/sport/rss', name: 'The Independent - Sport' },
  { url: 'https://talksport.com/feed/', name: 'talkSPORT' },
  { url: 'https://www.telegraph.co.uk/sport/rss.xml', name: 'The Telegraph - Sport' },
  
  // UK Football (Premier League focus)
  { url: 'https://www.bbc.co.uk/sport/football/rss.xml', name: 'BBC Sport - Football' },
  { url: 'https://www.theguardian.com/football/rss', name: 'The Guardian - Football' },
  { url: 'https://www.skysports.com/rss/12691', name: 'Sky Sports - Premier League' },
  
  // UK General News (for public figures)
  { url: 'https://www.bbc.co.uk/news/rss.xml', name: 'BBC News' },
  { url: 'https://www.theguardian.com/uk/rss', name: 'The Guardian - UK News' },
  { url: 'https://www.independent.co.uk/news/uk/rss', name: 'The Independent - UK News' },
  { url: 'https://www.telegraph.co.uk/news/rss.xml', name: 'The Telegraph - News' },
  
  // UK Business & Politics (public figures)
  { url: 'https://www.bbc.co.uk/news/business/rss.xml', name: 'BBC Business' },
  { url: 'https://www.bbc.co.uk/news/politics/rss.xml', name: 'BBC Politics' },
  { url: 'https://www.theguardian.com/politics/rss', name: 'The Guardian - Politics' },
  { url: 'https://www.ft.com/rss/home/uk', name: 'Financial Times - UK' }
];

// UK-focused keywords for public figure threats and reputation risks
const THREAT_KEYWORDS = [
  // Legal issues
  'lawsuit', 'sued', 'charges', 'arrested', 'investigation', 'fraud', 'scandal',
  'court', 'trial', 'guilty', 'conviction', 'settlement', 'legal action', 'charged',
  
  // UK-specific legal terms
  'magistrates court', 'crown court', 'tribunal', 'police investigation', 'CPS',
  'serious fraud office', 'ofcom investigation', 'parliamentary inquiry',
  
  // Behavioral issues
  'controversy', 'backlash', 'criticism', 'outrage', 'offensive', 'inappropriate',
  'misconduct', 'behaviour', 'allegations', 'accused', 'denied', 'apology',
  'racism', 'sexism', 'harassment', 'discrimination',
  
  // Career/reputation damage
  'fired', 'suspended', 'dropped', 'cancelled', 'boycott', 'loses sponsorship',
  'contract terminated', 'banned', 'excluded', 'resignation', 'stepped down',
  'sacked', 'dismissed', 'stripped of title', 'loses endorsement',
  
  // UK Sports specific
  'transfer saga', 'doping', 'performance enhancing', 'match fixing', 'betting scandal',
  'relegated', 'points deduction', 'FA investigation', 'premier league',
  
  // UK Celebrity specific
  'divorce battle', 'custody dispute', 'rehab', 'mental health crisis',
  'tax avoidance', 'offshore accounts', 'bankruptcy', 'financial troubles',
  
  // Social media/public relations
  'viral', 'trending', 'social media storm', 'twitter row', 'instagram drama',
  'leaked', 'exposed', 'caught', 'video surfaces', 'photos leaked', 'paparazzi',
  
  // UK Media specific
  'tabloid exclusive', 'kiss and tell', 'phone hacking', 'privacy breach',
  'injunction', 'super injunction', 'gagging order'
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
      platform: 'uk_news',
      url: item.link,
      source_type: 'uk_rss_feed',
      confidence_score: 80,
      potential_reach: 100000, // Higher reach estimate for UK news
      metadata: {
        source: item.source,
        published_date: item.pubDate,
        content_type: 'uk_celebrity_sports_news',
        region: 'UK'
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
  console.log('[RSS-SCRAPER] Starting UK celebrity/sports/news scan...');
  
  const matchingItems: RSSItem[] = [];
  
  for (const feed of RSS_FEEDS) {
    console.log(`[RSS-SCRAPER] Scanning ${feed.name}: ${feed.url}`);
    
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'RepWatch UK Scanner/1.0 (https://repwatch.co)'
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
        console.log(`[RSS-SCRAPER] Found ${threatItems.length} potential UK reputation threats in ${feed.name}`);
        matchingItems.push(...threatItems);
      }
      
    } catch (error) {
      console.error(`[RSS-SCRAPER] Error scanning ${feed.name}:`, error);
      continue;
    }
  }
  
  console.log(`[RSS-SCRAPER] Found ${matchingItems.length} UK celebrity/sports/news threat items total`);
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
    console.log('[RSS-SCRAPER] Starting UK celebrity/sports/news scan...');
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
    
    console.log(`[RSS-SCRAPER] UK celebrity/sports/news scan completed successfully`);
    return new Response(JSON.stringify({ 
      status: 'success',
      scan_type: 'uk_celebrity_sports_news',
      region: 'UK',
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
