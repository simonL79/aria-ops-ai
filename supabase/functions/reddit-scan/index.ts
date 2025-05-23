
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
const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID');
const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET');
const REDDIT_USERNAME = Deno.env.get('REDDIT_USERNAME');
const REDDIT_PASSWORD = Deno.env.get('REDDIT_PASSWORD');
const ARIA_INGEST_KEY = Deno.env.get('ARIA_INGEST_KEY');

console.log('[REDDIT-SCAN] Environment check:');
console.log('[REDDIT-SCAN] REDDIT_CLIENT_ID exists:', !!REDDIT_CLIENT_ID);
console.log('[REDDIT-SCAN] REDDIT_CLIENT_SECRET exists:', !!REDDIT_CLIENT_SECRET);
console.log('[REDDIT-SCAN] REDDIT_USERNAME exists:', !!REDDIT_USERNAME);
console.log('[REDDIT-SCAN] REDDIT_PASSWORD exists:', !!REDDIT_PASSWORD);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Reddit scanner configuration
const monitoredSubs = ['technology', 'news', 'business'];
const keywords = ['lawsuit', 'fraud', 'scandal', 'CEO', 'leak', 'exposed'];

// Reddit post interface
interface RedditPost {
  title: string;
  selftext: string;
  permalink: string;
  created_utc: number;
  subreddit_name_prefixed: string;
  author: {
    name: string;
  };
  ups: number;
  num_comments: number;
}

/**
 * Scans Reddit for potential threats using the Reddit API
 */
async function scanReddit(): Promise<RedditPost[]> {
  console.log('[REDDIT-SCAN] Starting Reddit scan...');
  
  try {
    const matchingPosts: RedditPost[] = [];
    
    // Prepare authentication for Reddit API with proper User-Agent
    const credentials = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`);
    const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
    
    // Create form data for authentication
    const authBody = new URLSearchParams();
    authBody.append('grant_type', 'password');
    authBody.append('username', REDDIT_USERNAME!);
    authBody.append('password', REDDIT_PASSWORD!);
    
    console.log('[REDDIT-SCAN] Requesting Reddit access token...');
    console.log('[REDDIT-SCAN] Using username:', REDDIT_USERNAME);
    console.log('[REDDIT-SCAN] Client ID length:', REDDIT_CLIENT_ID?.length || 0);
    console.log('[REDDIT-SCAN] Client Secret length:', REDDIT_CLIENT_SECRET?.length || 0);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'ThreatScanner/1.0 by RepWatch (https://repwatch.co)'
      },
      body: authBody.toString()
    });
    
    console.log('[REDDIT-SCAN] Token response status:', tokenResponse.status);
    console.log('[REDDIT-SCAN] Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    
    const responseText = await tokenResponse.text();
    console.log('[REDDIT-SCAN] Raw token response:', responseText);
    
    if (!tokenResponse.ok) {
      console.error(`[REDDIT-SCAN] Reddit authentication failed with status ${tokenResponse.status}`);
      throw new Error(`Reddit authentication failed: ${tokenResponse.status} - ${responseText}`);
    }
    
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[REDDIT-SCAN] Failed to parse token response:', parseError);
      throw new Error(`Invalid JSON response from Reddit: ${responseText}`);
    }
    
    console.log('[REDDIT-SCAN] Parsed token data:', JSON.stringify(tokenData, null, 2));
    
    // Check for error in response
    if (tokenData.error) {
      console.error('[REDDIT-SCAN] Reddit API returned error:', tokenData.error);
      console.error('[REDDIT-SCAN] Error description:', tokenData.error_description);
      
      // Provide specific error messages for common issues
      let errorMessage = `Reddit API error: ${tokenData.error}`;
      if (tokenData.error === 'invalid_grant') {
        errorMessage += ' - This usually means the username/password combination is incorrect, or 2FA is enabled on the account.';
      }
      
      throw new Error(errorMessage);
    }
    
    const accessToken = tokenData?.access_token;
    console.log('[REDDIT-SCAN] Access token received:', !!accessToken);
    
    if (!accessToken) {
      console.error('[REDDIT-SCAN] No access token in response:', tokenData);
      throw new Error('No access token received from Reddit - authentication failed');
    }
    
    console.log('[REDDIT-SCAN] Successfully obtained Reddit access token');
    
    // Scan each subreddit
    for (const sub of monitoredSubs) {
      console.log(`[REDDIT-SCAN] Scanning r/${sub}...`);
      
      try {
        const response = await fetch(`https://oauth.reddit.com/r/${sub}/new.json?limit=25`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'ThreatScanner/1.0 by RepWatch (https://repwatch.co)'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[REDDIT-SCAN] Failed to fetch from r/${sub}: ${response.status} - ${errorText}`);
          continue;
        }
        
        const data = await response.json();
        console.log(`[REDDIT-SCAN] Retrieved ${data?.data?.children?.length || 0} posts from r/${sub}`);
        
        if (!data?.data?.children) {
          console.log(`[REDDIT-SCAN] No posts data found for r/${sub}`);
          continue;
        }
        
        const posts = data.data.children.map((child: any) => child.data);
        
        for (const post of posts) {
          const text = `${post.title || ''}\n${post.selftext || ''}`;
          
          if (keywords.some(k => text.toLowerCase().includes(k.toLowerCase()))) {
            console.log(`[REDDIT-SCAN] Found matching post in r/${sub}: ${post.title}`);
            matchingPosts.push(post);
          }
        }
        
      } catch (subError) {
        console.error(`[REDDIT-SCAN] Error scanning r/${sub}:`, subError);
        continue;
      }
    }
    
    console.log(`[REDDIT-SCAN] Found ${matchingPosts.length} matching posts total`);
    return matchingPosts;
    
  } catch (error) {
    console.error('[REDDIT-SCAN] Error in scanReddit:', error);
    throw error;
  }
}

/**
 * Sends a post to the ARIA ingest pipeline
 */
async function sendToAriaIngest(post: RedditPost) {
  try {
    const text = `${post.title}\n${post.selftext || ''}`;
    const url = `https://reddit.com${post.permalink}`;
    
    console.log(`[REDDIT-SCAN] Sending to ARIA ingest: ${post.title.substring(0, 50)}...`);
    
    const payload = {
      content: text,
      platform: 'reddit',
      url: url,
      source_type: 'reddit_scan',
      confidence_score: 80,
      potential_reach: post.ups + (post.num_comments * 5),
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
    console.log(`[REDDIT-SCAN] Successfully sent to ARIA ingest`);
    return result;
    
  } catch (error) {
    console.error(`[REDDIT-SCAN] Error sending to ARIA ingest:`, error);
    throw error;
  }
}

/**
 * Main handler for the Reddit scan function
 */
serve(async (req) => {
  console.log(`[REDDIT-SCAN] === NEW REQUEST ===`);
  console.log(`[REDDIT-SCAN] Method: ${req.method}`);
  
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
    // Check if Reddit API credentials are configured
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
      console.error('[REDDIT-SCAN] Missing Reddit credentials');
      return new Response(JSON.stringify({ 
        error: 'Reddit API credentials not configured',
        requiredEnvVars: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD'],
        debug: {
          hasClientId: !!REDDIT_CLIENT_ID,
          hasClientSecret: !!REDDIT_CLIENT_SECRET,
          hasUsername: !!REDDIT_USERNAME,
          hasPassword: !!REDDIT_PASSWORD
        }
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Scan Reddit for matching posts
    console.log('[REDDIT-SCAN] Starting scan process...');
    const matchingPosts = await scanReddit();
    
    // Process each matching post
    const results = [];
    for (const post of matchingPosts) {
      try {
        const result = await sendToAriaIngest(post);
        results.push({
          title: post.title,
          url: `https://reddit.com${post.permalink}`,
          success: true,
          ariaResult: result
        });
      } catch (error) {
        console.error('[REDDIT-SCAN] Error processing post:', error);
        results.push({
          title: post.title,
          url: `https://reddit.com${post.permalink}`,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log(`[REDDIT-SCAN] Scan completed successfully`);
    return new Response(JSON.stringify({ 
      status: 'success',
      scanned: monitoredSubs,
      matchesFound: matchingPosts.length,
      processed: results.length,
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[REDDIT-SCAN] Function error:', error);
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
