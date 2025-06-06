
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationRequest {
  entityName: string;
  validationType: 'entity_validation' | 'osint_scan';
  platforms?: string[];
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  sources: string[];
  details: {
    googleResults: number;
    redditMentions: number;
    socialPresence: boolean;
    lastUpdated: string;
  };
  osintData?: {
    threats: any[];
    sentiment: number;
    riskScore: number;
  };
}

serve(async (req) => {
  console.log(`[LIVE-VALIDATOR] === NEW REQUEST ===`);
  console.log(`[LIVE-VALIDATOR] Method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ValidationRequest = await req.json();
    console.log('[LIVE-VALIDATOR] Request data:', requestData);
    
    if (!requestData.entityName || requestData.entityName.length < 2) {
      throw new Error('Entity name is required and must be at least 2 characters');
    }

    const result: ValidationResult = {
      isValid: false,
      confidence: 0,
      sources: [],
      details: {
        googleResults: 0,
        redditMentions: 0,
        socialPresence: false,
        lastUpdated: new Date().toISOString()
      }
    };

    // Google Search Validation
    console.log(`[LIVE-VALIDATOR] Validating entity: ${requestData.entityName}`);
    
    try {
      const googleResults = await performGoogleSearch(requestData.entityName);
      result.details.googleResults = googleResults.count;
      if (googleResults.count > 0) {
        result.sources.push('Google');
        result.confidence += 0.4;
        result.isValid = true;
      }
      console.log(`[LIVE-VALIDATOR] Google results: ${googleResults.count}`);
    } catch (error) {
      console.error('[LIVE-VALIDATOR] Google search error:', error);
    }

    // Reddit Search Validation
    try {
      const redditResults = await performRedditSearch(requestData.entityName);
      result.details.redditMentions = redditResults.count;
      if (redditResults.count > 0) {
        result.sources.push('Reddit');
        result.confidence += 0.3;
        result.isValid = true;
      }
      console.log(`[LIVE-VALIDATOR] Reddit mentions: ${redditResults.count}`);
    } catch (error) {
      console.error('[LIVE-VALIDATOR] Reddit search error:', error);
    }

    // Social Media Check
    try {
      const socialCheck = await checkSocialPresence(requestData.entityName);
      result.details.socialPresence = socialCheck.found;
      if (socialCheck.found) {
        result.sources.push('Social Media');
        result.confidence += 0.2;
        result.isValid = true;
      }
      console.log(`[LIVE-VALIDATOR] Social presence: ${socialCheck.found}`);
    } catch (error) {
      console.error('[LIVE-VALIDATOR] Social check error:', error);
    }

    // OSINT Scanning if requested
    if (requestData.validationType === 'osint_scan') {
      try {
        const osintResults = await performOSINTScan(requestData.entityName);
        result.osintData = osintResults;
        console.log(`[LIVE-VALIDATOR] OSINT scan completed: ${osintResults.threats.length} threats found`);
      } catch (error) {
        console.error('[LIVE-VALIDATOR] OSINT scan error:', error);
      }
    }

    // Normalize confidence score
    result.confidence = Math.min(result.confidence, 1.0);

    console.log(`[LIVE-VALIDATOR] Final result: Valid=${result.isValid}, Confidence=${result.confidence}`);
    
    return new Response(JSON.stringify({
      success: true,
      result: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[LIVE-VALIDATOR] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

/**
 * Perform real Google search using web scraping
 */
async function performGoogleSearch(entityName: string): Promise<{ count: number; results: any[] }> {
  try {
    // Use Google search without API key by scraping search results
    const searchQuery = encodeURIComponent(`"${entityName}"`);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}&num=10`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Google search failed: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse results count from HTML
    const resultsPattern = /About ([\d,]+) results/i;
    const match = html.match(resultsPattern);
    const count = match ? parseInt(match[1].replace(/,/g, '')) : 0;
    
    return { count, results: [] };
    
  } catch (error) {
    console.error('Google search error:', error);
    return { count: 0, results: [] };
  }
}

/**
 * Perform Reddit search using RSS feeds (no API key needed)
 */
async function performRedditSearch(entityName: string): Promise<{ count: number; results: any[] }> {
  try {
    // Search multiple Reddit RSS feeds
    const searchTerms = entityName.toLowerCase().split(' ');
    const subreddits = ['all', 'news', 'unitedkingdom', 'ukpolitics'];
    let totalMentions = 0;
    const results: any[] = [];
    
    for (const subreddit of subreddits) {
      try {
        const rssUrl = `https://www.reddit.com/r/${subreddit}/search.rss?q="${entityName}"&sort=new&t=month`;
        const response = await fetch(rssUrl, {
          headers: {
            'User-Agent': 'A.R.I.A Live Entity Validator/1.0'
          }
        });
        
        if (response.ok) {
          const rssText = await response.text();
          const mentionCount = (rssText.match(new RegExp(entityName, 'gi')) || []).length;
          totalMentions += mentionCount;
          
          if (mentionCount > 0) {
            results.push({
              subreddit,
              mentions: mentionCount,
              source: 'reddit_rss'
            });
          }
        }
      } catch (error) {
        console.error(`Reddit search error for r/${subreddit}:`, error);
      }
    }
    
    return { count: totalMentions, results };
    
  } catch (error) {
    console.error('Reddit search error:', error);
    return { count: 0, results: [] };
  }
}

/**
 * Check social media presence
 */
async function checkSocialPresence(entityName: string): Promise<{ found: boolean; platforms: string[] }> {
  try {
    const platforms: string[] = [];
    
    // Check for common social media indicators
    const searchQuery = encodeURIComponent(`"${entityName}" site:twitter.com OR site:linkedin.com OR site:facebook.com`);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}&num=5`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      
      if (html.includes('twitter.com')) platforms.push('Twitter');
      if (html.includes('linkedin.com')) platforms.push('LinkedIn');
      if (html.includes('facebook.com')) platforms.push('Facebook');
    }
    
    return { found: platforms.length > 0, platforms };
    
  } catch (error) {
    console.error('Social presence check error:', error);
    return { found: false, platforms: [] };
  }
}

/**
 * Perform comprehensive OSINT scan
 */
async function performOSINTScan(entityName: string): Promise<{
  threats: any[];
  sentiment: number;
  riskScore: number;
}> {
  try {
    const threats: any[] = [];
    let totalSentiment = 0;
    let sentimentCount = 0;
    
    // Scan news sources
    const newsSources = [
      'bbc.co.uk',
      'theguardian.com',
      'telegraph.co.uk',
      'independent.co.uk'
    ];
    
    for (const source of newsSources) {
      try {
        const searchQuery = encodeURIComponent(`"${entityName}" site:${source}`);
        const searchUrl = `https://www.google.com/search?q=${searchQuery}&num=10`;
        
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Simple sentiment analysis based on keyword presence
          const negativeKeywords = ['scandal', 'controversy', 'fraud', 'lawsuit', 'investigation', 'arrest', 'allegation'];
          const positiveKeywords = ['award', 'success', 'achievement', 'honor', 'praise', 'breakthrough'];
          
          let sentiment = 0;
          negativeKeywords.forEach(keyword => {
            if (html.toLowerCase().includes(keyword)) sentiment -= 0.1;
          });
          positiveKeywords.forEach(keyword => {
            if (html.toLowerCase().includes(keyword)) sentiment += 0.1;
          });
          
          if (sentiment !== 0) {
            threats.push({
              source: source,
              sentiment: sentiment,
              content: `Entity mentioned on ${source}`,
              severity: Math.abs(sentiment) > 0.3 ? 'high' : 'medium',
              url: searchUrl,
              detected_at: new Date().toISOString()
            });
            
            totalSentiment += sentiment;
            sentimentCount++;
          }
        }
      } catch (error) {
        console.error(`News scan error for ${source}:`, error);
      }
    }
    
    // Calculate overall sentiment and risk score
    const avgSentiment = sentimentCount > 0 ? totalSentiment / sentimentCount : 0;
    const riskScore = Math.max(0, Math.min(1, Math.abs(avgSentiment) * 2));
    
    return {
      threats,
      sentiment: avgSentiment,
      riskScore
    };
    
  } catch (error) {
    console.error('OSINT scan error:', error);
    return {
      threats: [],
      sentiment: 0,
      riskScore: 0
    };
  }
}
