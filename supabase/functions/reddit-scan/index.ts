
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[REDDIT-SCAN] === NEW REQUEST ===');
  console.log('[REDDIT-SCAN] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[REDDIT-SCAN] Starting LIVE-ONLY scan process...');

    // Environment check - STRICT REQUIREMENT
    const clientId = Deno.env.get('REDDIT_CLIENT_ID');
    const clientSecret = Deno.env.get('REDDIT_CLIENT_SECRET');
    const username = Deno.env.get('REDDIT_USERNAME');
    const password = Deno.env.get('REDDIT_PASSWORD');

    if (!clientId || !clientSecret || !username || !password) {
      console.error('[REDDIT-SCAN] LIVE DATA ENFORCEMENT: Missing Reddit credentials');
      throw new Error('LIVE DATA ENFORCEMENT: Reddit API credentials required. No demo data allowed.');
    }

    console.log('[REDDIT-SCAN] Starting LIVE Reddit scan with verified credentials...');

    // Get Reddit access token - LIVE API ONLY
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ARIA-Monitor/1.0.0 (Live Intelligence)'
      },
      body: `grant_type=password&username=${username}&password=${password}`
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[REDDIT-SCAN] LIVE API ERROR:', tokenResponse.status, errorText);
      throw new Error(`LIVE Reddit API authentication failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('LIVE Reddit API: No access token received');
    }

    console.log('[REDDIT-SCAN] Successfully obtained LIVE Reddit access token');

    const accessToken = tokenData.access_token;
    const results = [];

    // Scan real subreddits with LIVE data only
    const subreddits = ['technology', 'business', 'news', 'PublicRelations', 'marketing'];

    for (const subreddit of subreddits) {
      console.log(`[REDDIT-SCAN] Scanning LIVE data from r/${subreddit}...`);
      
      const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'ARIA-Monitor/1.0.0 (Live Intelligence)'
        }
      });

      if (!response.ok) {
        console.error(`[REDDIT-SCAN] Failed to fetch LIVE data from r/${subreddit}:`, response.status);
        continue;
      }

      const data = await response.json();
      const posts = data.data?.children || [];
      
      console.log(`[REDDIT-SCAN] Retrieved ${posts.length} LIVE posts from r/${subreddit}`);

      // Look for business/reputation related posts - LIVE CONTENT ONLY
      const relevantKeywords = [
        'company', 'business', 'CEO', 'scandal', 'lawsuit', 'fraud', 'controversy',
        'reputation', 'crisis', 'investigation', 'allegations', 'misconduct',
        'corporate', 'brand', 'PR', 'public relations', 'management'
      ];

      for (const post of posts) {
        const postData = post.data;
        const title = postData.title?.toLowerCase() || '';
        const selftext = postData.selftext?.toLowerCase() || '';
        const content = title + ' ' + selftext;

        // Check if post contains relevant keywords
        const isRelevant = relevantKeywords.some(keyword => 
          content.includes(keyword)
        );

        if (isRelevant) {
          console.log(`[REDDIT-SCAN] Found LIVE matching post in r/${subreddit}: ${postData.title}`);
          
          const result = {
            title: postData.title,
            content: postData.selftext || postData.title,
            url: `https://reddit.com${postData.permalink}`,
            subreddit: subreddit,
            score: postData.score || 0,
            created_utc: postData.created_utc,
            potential_reach: Math.max(postData.score * 10, 100),
            detected_entities: [],
            platform: 'Reddit'
          };
          
          results.push(result);
        }
      }
    }

    console.log(`[REDDIT-SCAN] LIVE SCAN COMPLETE: Found ${results.length} real threat posts`);

    return new Response(JSON.stringify({
      success: true,
      matchesFound: results.length,
      results: results,
      message: `LIVE SCAN: Found ${results.length} real posts from Reddit API`,
      dataSource: 'LIVE_REDDIT_API'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[REDDIT-SCAN] LIVE SCAN ERROR:', error);
    return new Response(JSON.stringify({
      error: 'LIVE Reddit scan failed - no fallback data provided',
      details: error.message,
      enforcement: 'LIVE_DATA_ONLY'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
