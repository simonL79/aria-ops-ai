
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
    console.log('[REDDIT-SCAN] Starting scan process...');

    // Environment check
    console.log('[REDDIT-SCAN] Environment check:');
    console.log('[REDDIT-SCAN] REDDIT_CLIENT_ID exists:', !!Deno.env.get('REDDIT_CLIENT_ID'));
    console.log('[REDDIT-SCAN] REDDIT_CLIENT_SECRET exists:', !!Deno.env.get('REDDIT_CLIENT_SECRET'));
    console.log('[REDDIT-SCAN] REDDIT_USERNAME exists:', !!Deno.env.get('REDDIT_USERNAME'));
    console.log('[REDDIT-SCAN] REDDIT_PASSWORD exists:', !!Deno.env.get('REDDIT_PASSWORD'));

    const clientId = Deno.env.get('REDDIT_CLIENT_ID');
    const clientSecret = Deno.env.get('REDDIT_CLIENT_SECRET');
    const username = Deno.env.get('REDDIT_USERNAME');
    const password = Deno.env.get('REDDIT_PASSWORD');

    if (!clientId || !clientSecret || !username || !password) {
      throw new Error('Missing Reddit API credentials');
    }

    console.log('[REDDIT-SCAN] Starting Reddit scan...');

    // Get Reddit access token
    console.log('[REDDIT-SCAN] Requesting Reddit access token...');
    console.log('[REDDIT-SCAN] Using username:', username);
    console.log('[REDDIT-SCAN] Client ID length:', clientId.length);
    console.log('[REDDIT-SCAN] Client Secret length:', clientSecret.length);

    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'FixExotic9448/1.0.0 (by /u/FixExotic9448)'
      },
      body: `grant_type=password&username=${username}&password=${password}`
    });

    console.log('[REDDIT-SCAN] Token response status:', tokenResponse.status);
    console.log('[REDDIT-SCAN] Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get Reddit token: ${tokenResponse.status}`);
    }

    const tokenText = await tokenResponse.text();
    console.log('[REDDIT-SCAN] Raw token response:', tokenText);

    const tokenData = JSON.parse(tokenText);
    console.log('[REDDIT-SCAN] Parsed token data:', tokenData);
    console.log('[REDDIT-SCAN] Access token received:', !!tokenData.access_token);

    if (!tokenData.access_token) {
      throw new Error('No access token received from Reddit');
    }

    console.log('[REDDIT-SCAN] Successfully obtained Reddit access token');

    const accessToken = tokenData.access_token;
    const results = [];

    // Define subreddits to scan
    const subreddits = ['technology', 'news', 'business'];

    // Scan each subreddit
    for (const subreddit of subreddits) {
      console.log(`[REDDIT-SCAN] Scanning r/${subreddit}...`);
      
      try {
        const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=25`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'FixExotic9448/1.0.0 (by /u/FixExotic9448)'
          }
        });

        if (!response.ok) {
          console.error(`[REDDIT-SCAN] Failed to fetch r/${subreddit}:`, response.status);
          continue;
        }

        const data = await response.json();
        const posts = data.data?.children || [];
        
        console.log(`[REDDIT-SCAN] Retrieved ${posts.length} posts from r/${subreddit}`);

        // Look for business/reputation related posts
        const relevantKeywords = [
          'company', 'business', 'CEO', 'scandal', 'lawsuit', 'fraud', 'controversy',
          'reputation', 'crisis', 'investigation', 'allegations', 'misconduct'
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
            console.log(`[REDDIT-SCAN] Found matching post in r/${subreddit}: ${postData.title}`);
            
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
      } catch (error) {
        console.error(`[REDDIT-SCAN] Error scanning r/${subreddit}:`, error);
      }
    }

    console.log(`[REDDIT-SCAN] Found ${results.length} matching posts total`);
    console.log('[REDDIT-SCAN] Scan completed successfully');

    return new Response(JSON.stringify({
      success: true,
      matchesFound: results.length,
      results: results,
      message: `Found ${results.length} relevant posts`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[REDDIT-SCAN] Error:', error);
    return new Response(JSON.stringify({
      error: 'Reddit scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
