
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the structure of a scraping request
interface ScrapingRequest {
  url: string;
  selectors?: string[];
  waitForSelector?: string;
  userAgent?: string;
  proxy?: {
    url: string;
    username?: string;
    password?: string;
  };
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
}

// Define the structure of a scraping response
interface ScrapingResponse {
  title?: string;
  content?: string;
  extractedData?: Record<string, string | string[]>;
  metadata?: {
    url: string;
    timestamp: string;
    statusCode?: number;
    headers?: Record<string, string>;
  };
  error?: string;
}

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const requestData: ScrapingRequest = await req.json()
    
    if (!requestData.url) {
      throw new Error('URL is required')
    }
    
    console.log(`Scraping URL: ${requestData.url}`)
    
    // Set up request options
    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent': requestData.userAgent || 'A.R.I.A Headless Browser/1.0',
        ...requestData.headers
      }
    }
    
    // Make the request to fetch the page
    const response = await fetch(requestData.url, fetchOptions)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Parse the HTML
    const parser = new DOMParser()
    const document = parser.parseFromString(html, 'text/html')
    
    if (!document) {
      throw new Error('Failed to parse HTML')
    }
    
    // Extract data
    const result: ScrapingResponse = {
      title: document.querySelector('title')?.textContent || '',
      content: document.body?.textContent || '',
      extractedData: {},
      metadata: {
        url: requestData.url,
        timestamp: new Date().toISOString(),
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries())
      }
    }
    
    // Extract content from specific selectors if provided
    if (requestData.selectors && requestData.selectors.length > 0) {
      for (const selector of requestData.selectors) {
        const elements = document.querySelectorAll(selector)
        
        if (elements && elements.length > 0) {
          result.extractedData![selector] = Array.from(elements).map(el => el.textContent || '')
        } else {
          result.extractedData![selector] = []
        }
      }
    }
    
    console.log(`Successfully scraped ${requestData.url}. Title length: ${result.title?.length}, Content length: ${result.content?.length}`)
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error in headless-scraper function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
