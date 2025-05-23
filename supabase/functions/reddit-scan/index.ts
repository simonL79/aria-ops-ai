
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

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Reddit scanner configuration
const monitoredSubs = ['technology', 'news', 'business']; // customize
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
    
    // Fetch access token for Reddit API
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`
      },
      body: `grant_type=password&username=${REDDIT_USERNAME}&password=${REDDIT_PASSWORD}`
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error(`[REDDIT-SCAN] Failed to get Reddit token: ${error}`);
      throw new Error(`Failed to authenticate with Reddit: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Scan each subreddit
    for (const sub of monitoredSubs) {
      console.log(`[REDDIT-SCAN] Scanning r/${sub}...`);
      
      const response = await fetch(`https://oauth.reddit.com/r/${sub}/new.json?limit=25`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'aria-threat-scanner/1.0'
        }
      });
      
      if (!response.ok) {
        console.error(`[REDDIT-SCAN] Failed to fetch from r/${sub}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const posts = data.data.children.map((child: any) => child.data);
      
      for (const post of posts) {
        const text = `${post.title}\n${post.selftext || ''}`;
        
        if (keywords.some(k => text.toLowerCase().includes(k.toLowerCase()))) {
          console.log(`[REDDIT-SCAN] Found matching post in r/${sub}: ${post.title}`);
          matchingPosts.push(post);
        }
      }
    }
    
    console.log(`[REDDIT-SCAN] Found ${matchingPosts.length} matching posts`);
    return matchingPosts;
    
  } catch (error) {
    console.error('[REDDIT-SCAN] Error scanning Reddit:', error);
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
    const subreddit = post.subreddit_name_prefixed;
    
    console.log(`[REDDIT-SCAN] Sending to ARIA ingest: ${post.title}`);
    
    const payload = {
      content: text,
      platform: 'reddit',
      url: url,
      source_type: 'reddit_scan',
      confidence_score: 80,
      potential_reach: post.ups + (post.num_comments * 5), // Rough estimate based on upvotes + comments
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
    console.log(`[REDDIT-SCAN] Successfully sent to ARIA ingest, result:`, result.success);
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
      return new Response(JSON.stringify({ 
        error: 'Reddit API credentials not configured',
        requiredEnvVars: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD']
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Scan Reddit for matching posts
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
          error: error.message
        });
      }
    }
    
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
      details: error.message,
      stack: error.stack
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
