
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Real RSS feeds for tech, AI, and reputation management content
const RSS_FEEDS = [
  { url: "https://techcrunch.com/feed/", name: "TechCrunch" },
  { url: "https://feeds.feedburner.com/venturebeat/SZYF", name: "VentureBeat AI" },
  { url: "https://www.wired.com/feed/rss", name: "Wired" },
  { url: "https://thenextweb.com/feed/", name: "The Next Web" },
  { url: "https://feeds.feedburner.com/oreilly/radar", name: "O'Reilly Radar" },
  { url: "https://www.axios.com/feeds/newsletter/axios-login.xml", name: "Axios Login" },
  { url: "https://feeds.feedburner.com/techradar/software-news", name: "TechRadar" },
  { url: "https://feeds.arstechnica.com/arstechnica/technology-lab", name: "Ars Technica" }
];

// Keywords to filter for relevant articles
const RELEVANT_KEYWORDS = [
  'ai', 'artificial intelligence', 'reputation', 'crisis', 'public relations',
  'brand management', 'social media', 'content moderation', 'misinformation',
  'sentiment analysis', 'digital marketing', 'seo', 'online presence',
  'cybersecurity', 'data privacy', 'corporate communications', 'pr',
  'chatgpt', 'openai', 'machine learning', 'automation', 'nlp'
];

interface ArticleData {
  title: string;
  url: string;
  summary: string;
  published_at?: string;
  source_name: string;
  tags: string[];
}

function extractTextFromXML(xmlString: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'is');
  const match = xmlString.match(regex);
  return match ? match[1].trim() : null;
}

function cleanHtmlContent(content: string): string {
  // Remove HTML tags and decode entities
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function isRelevantArticle(title: string, summary: string): boolean {
  const content = (title + ' ' + summary).toLowerCase();
  return RELEVANT_KEYWORDS.some(keyword => content.includes(keyword));
}

function extractTags(title: string, summary: string): string[] {
  const content = (title + ' ' + summary).toLowerCase();
  const foundTags = RELEVANT_KEYWORDS.filter(keyword => content.includes(keyword));
  
  // Add some additional context tags
  const contextTags = [];
  if (content.includes('ai') || content.includes('artificial intelligence')) {
    contextTags.push('artificial-intelligence');
  }
  if (content.includes('crisis') || content.includes('reputation')) {
    contextTags.push('reputation-management');
  }
  if (content.includes('social') || content.includes('media')) {
    contextTags.push('social-media');
  }
  
  return [...new Set([...foundTags, ...contextTags])];
}

async function fetchAndParseRSS(feedUrl: string, feedName: string): Promise<ArticleData[]> {
  try {
    console.log(`📡 Fetching RSS feed: ${feedName}`);
    
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ARIA-Watchtower/1.0 (+https://simonlindsay.com)'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch ${feedName}: ${response.status}`);
      return [];
    }
    
    const xmlText = await response.text();
    const articles: ArticleData[] = [];
    
    // Split by <item> tags to process each article
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches.slice(0, 10)) { // Limit to 10 articles per feed
      const title = extractTextFromXML(itemXml, 'title');
      const link = extractTextFromXML(itemXml, 'link');
      const description = extractTextFromXML(itemXml, 'description');
      const pubDate = extractTextFromXML(itemXml, 'pubDate');
      
      if (!title || !link) continue;
      
      const cleanTitle = cleanHtmlContent(title);
      const cleanSummary = description ? cleanHtmlContent(description).slice(0, 500) : '';
      
      // Only include articles relevant to AI/reputation/PR
      if (!isRelevantArticle(cleanTitle, cleanSummary)) continue;
      
      const tags = extractTags(cleanTitle, cleanSummary);
      tags.push('watchtower-ingested');
      
      articles.push({
        title: cleanTitle,
        url: link,
        summary: cleanSummary,
        published_at: pubDate ? new Date(pubDate).toISOString() : undefined,
        source_name: feedName,
        tags
      });
    }
    
    console.log(`✅ Extracted ${articles.length} relevant articles from ${feedName}`);
    return articles;
    
  } catch (error) {
    console.error(`❌ Error processing feed ${feedName}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 A.R.I.A™ Watchtower: Starting real article ingestion...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const allArticles: ArticleData[] = [];
    let successfulFeeds = 0;
    let totalNewArticles = 0;
    let duplicatesSkipped = 0;

    // Process each RSS feed
    for (const feed of RSS_FEEDS) {
      try {
        const articles = await fetchAndParseRSS(feed.url, feed.name);
        if (articles.length > 0) {
          allArticles.push(...articles);
          successfulFeeds++;
        }
        
        // Rate limiting between feeds
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to process feed ${feed.name}:`, error);
      }
    }

    console.log(`📊 Collected ${allArticles.length} relevant articles from ${successfulFeeds} feeds`);

    // Insert articles into database
    for (const article of allArticles) {
      try {
        // Check if article already exists
        const { data: existing } = await supabase
          .from('content_sources')
          .select('id')
          .eq('url', article.url)
          .maybeSingle();

        if (existing) {
          duplicatesSkipped++;
          continue;
        }

        // Insert new article
        const { error } = await supabase
          .from('content_sources')
          .insert({
            title: article.title,
            url: article.url,
            summary: article.summary,
            source_type: 'watchtower',
            published_at: article.published_at,
            tags: article.tags
          });

        if (error) {
          console.error(`❌ Failed to insert article: ${article.title}`, error);
        } else {
          totalNewArticles++;
          console.log(`✅ Inserted: ${article.title.substring(0, 60)}...`);
        }

      } catch (error) {
        console.error(`❌ Error processing article: ${article.title}`, error);
      }
    }

    console.log(`🎯 Watchtower scan complete: ${totalNewArticles} new articles, ${duplicatesSkipped} duplicates skipped`);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        feeds_processed: successfulFeeds,
        total_feeds: RSS_FEEDS.length,
        articles_found: allArticles.length,
        new_articles: totalNewArticles,
        duplicates_skipped: duplicatesSkipped
      },
      message: `Watchtower ingested ${totalNewArticles} new articles from ${successfulFeeds} RSS feeds`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Watchtower scan error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
