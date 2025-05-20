
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { parse } from "https://deno.land/x/xml@2.1.3/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the structure of an RSS request
interface RssFeedRequest {
  url: string;
  maxItems?: number;
  filterKeywords?: string[];
  includeContent?: boolean;
}

// Define the structure for an RSS item
interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  content?: string;
  author?: string;
  categories?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const requestData: RssFeedRequest = await req.json()
    
    if (!requestData.url) {
      throw new Error('Feed URL is required')
    }
    
    console.log(`Fetching RSS feed from: ${requestData.url}`)
    
    // Fetch the RSS feed
    const response = await fetch(requestData.url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    
    // Parse the XML
    let feedData;
    try {
      feedData = parse(xmlText);
    } catch (parseError) {
      throw new Error(`Failed to parse XML: ${parseError.message}`);
    }
    
    // Extract the RSS items
    const channel = feedData.rss?.channel;
    
    if (!channel) {
      throw new Error('Invalid RSS format');
    }
    
    // Extract feed information
    const feedInfo = {
      title: channel.title?._text || '',
      description: channel.description?._text || '',
      link: channel.link?._text || '',
      language: channel.language?._text || '',
      lastBuildDate: channel.lastBuildDate?._text || '',
      items: []
    };
    
    // Extract items
    const items: RssItem[] = [];
    
    // Handle both single item and item array cases
    const itemsArray = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);
    
    for (const item of itemsArray) {
      if (!item) continue;
      
      const rssItem: RssItem = {
        title: item.title?._text || '',
        link: item.link?._text || '',
        pubDate: item.pubDate?._text || '',
        description: item.description?._text || '',
        content: item['content:encoded']?._text || item.content?._text || '',
        author: item.author?._text || item['dc:creator']?._text || '',
        categories: Array.isArray(item.category) 
          ? item.category.map((cat: any) => cat._text || '') 
          : (item.category?._text ? [item.category._text] : [])
      };
      
      // Filter by keywords if specified
      if (requestData.filterKeywords && requestData.filterKeywords.length > 0) {
        const text = `${rssItem.title} ${rssItem.description} ${rssItem.content}`.toLowerCase();
        const matchesKeyword = requestData.filterKeywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        );
        
        if (!matchesKeyword) continue;
      }
      
      // Remove content if not requested (to reduce payload size)
      if (!requestData.includeContent) {
        delete rssItem.content;
      }
      
      items.push(rssItem);
    }
    
    // Limit the number of items if specified
    const limitedItems = requestData.maxItems 
      ? items.slice(0, requestData.maxItems) 
      : items;
    
    // Build the response
    const result = {
      feed: feedInfo,
      items: limitedItems,
      count: limitedItems.length,
      metadata: {
        requestUrl: requestData.url,
        timestamp: new Date().toISOString(),
      }
    };
    
    console.log(`Successfully fetched RSS feed: ${result.feed.title}. Found ${result.items.length} items.`);
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error in rss-scraper function:', error)
    
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
