
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { scanYouTube } from './youtube.ts';
import { scanInstagram } from './instagram.ts';
import { scanTikTok } from './tiktok.ts';

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
    console.log('[ARIA-SCRAPER] Starting comprehensive social media scan...');
    
    const results = {
      youtube: 0,
      instagram: 0,
      tiktok: 0,
      total: 0,
      timestamp: new Date().toISOString(),
      errors: []
    };
    
    // Run all scrapers concurrently for better performance
    const scanPromises = [
      scanYouTube().catch(error => {
        console.error('[ARIA-SCRAPER] YouTube scan failed:', error);
        results.errors.push(`YouTube: ${error.message}`);
        return 0;
      }),
      scanInstagram().catch(error => {
        console.error('[ARIA-SCRAPER] Instagram scan failed:', error);
        results.errors.push(`Instagram: ${error.message}`);
        return 0;
      }),
      scanTikTok().catch(error => {
        console.error('[ARIA-SCRAPER] TikTok scan failed:', error);
        results.errors.push(`TikTok: ${error.message}`);
        return 0;
      })
    ];
    
    const [youtubeResults, instagramResults, tiktokResults] = await Promise.all(scanPromises);
    
    results.youtube = youtubeResults;
    results.instagram = instagramResults;
    results.tiktok = tiktokResults;
    results.total = results.youtube + results.instagram + results.tiktok;
    
    console.log('[ARIA-SCRAPER] All scans completed successfully');
    console.log(`[ARIA-SCRAPER] Total threats found: ${results.total}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'ARIA comprehensive scraper completed',
      results: results,
      platforms_scanned: ['YouTube', 'Instagram', 'TikTok'],
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
