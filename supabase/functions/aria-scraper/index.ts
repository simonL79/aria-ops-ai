
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { scanYouTube } from './youtube.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`[ARIA-SCRAPER] === NEW REQUEST ===`);
  console.log(`[ARIA-SCRAPER] Method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[ARIA-SCRAPER] Starting YouTube RSS scan...');
    
    const results = {
      youtube: 0,
      total: 0,
      timestamp: new Date().toISOString(),
      errors: []
    };
    
    // Run YouTube scanner
    const youtubeResults = await scanYouTube().catch(error => {
      console.error('[ARIA-SCRAPER] YouTube scan failed:', error);
      results.errors.push(`YouTube: ${error.message}`);
      return 0;
    });
    
    results.youtube = youtubeResults;
    results.total = results.youtube;
    
    console.log('[ARIA-SCRAPER] YouTube scan completed successfully');
    console.log(`[ARIA-SCRAPER] Total threats found: ${results.total}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'ARIA YouTube RSS scanner completed',
      results: results,
      platforms_scanned: ['YouTube'],
      scan_time: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[ARIA-SCRAPER] Scraper job error:', error);
    return new Response(JSON.stringify({ 
      error: 'ARIA scraper failed', 
      details: error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
