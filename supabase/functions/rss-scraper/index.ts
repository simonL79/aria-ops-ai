
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, RSS_FEEDS } from './config.ts';
import { scanRSSFeeds } from './scanner.ts';
import { sendToAriaIngest } from './ariaIngest.ts';

console.log('[RSS-SCRAPER] Environment check:');
console.log('[RSS-SCRAPER] SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'));
console.log('[RSS-SCRAPER] ARIA_INGEST_KEY exists:', !!Deno.env.get('ARIA_INGEST_KEY'));

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
