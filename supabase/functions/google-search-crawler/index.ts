
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  maxResults?: number;
  useProxy?: boolean;
}

interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: SearchRequest = await req.json();
    
    if (!requestData.query) {
      throw new Error('Search query is required');
    }
    
    console.log(`Processing search: "${requestData.query}"`);
    
    // Construct the search URL
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(requestData.query)}`;
    const maxResults = requestData.maxResults || 10;
    
    // Fetch the search results page
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');
    
    if (!document) {
      throw new Error('Failed to parse HTML');
    }
    
    // Extract search results
    const results: SearchResult[] = [];
    const resultElements = document.querySelectorAll('div.g');
    
    for (const element of Array.from(resultElements).slice(0, maxResults)) {
      const titleElement = element.querySelector('h3');
      const linkElement = element.querySelector('a');
      const snippetElement = element.querySelector('div.VwiC3b');
      
      if (titleElement && linkElement && snippetElement) {
        results.push({
          title: titleElement.textContent || '',
          link: linkElement.getAttribute('href') || '',
          snippet: snippetElement.textContent || ''
        });
      }
    }
    
    console.log(`Found ${results.length} search results for "${requestData.query}"`);
    
    return new Response(JSON.stringify({
      query: requestData.query,
      results: results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in google-search-crawler function:', error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
