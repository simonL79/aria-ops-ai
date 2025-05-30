
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[RSS-SCRAPER] === NEW REQUEST ===');
  console.log('[RSS-SCRAPER] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, sources = [], scan_type = 'entity_monitoring' } = await req.json();
    console.log('[RSS-SCRAPER] Starting generic RSS scan for:', entity);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Default RSS feeds for business/technology/general news
    const defaultFeeds = [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'Business Insider', url: 'https://feeds.businessinsider.com/custom/all' },
      { name: 'Forbes', url: 'https://www.forbes.com/real-time/feed2/' },
      { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews' },
      { name: 'Financial Times', url: 'https://www.ft.com/rss/home/uk' }
    ];

    const results: any[] = [];
    const feedsToScan = sources.length > 0 ? sources.map(s => ({ name: s, url: `https://${s}.com/rss` })) : defaultFeeds;

    for (const feed of feedsToScan) {
      try {
        console.log('[RSS-SCRAPER] Scanning:', feed.name);
        
        const res = await fetch(feed.url, {
          headers: {
            'User-Agent': 'ARIA-OSINT/1.0'
          }
        });
        
        if (!res.ok) {
          console.warn('[RSS-SCRAPER] Failed to fetch', feed.name, ':', res.status);
          continue;
        }

        const xml = await res.text();
        const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)];
        
        console.log('[RSS-SCRAPER]', feed.name, 'found', items.length, 'items');

        for (const item of items) {
          const content = item[1].toLowerCase();
          if (!content.includes(entity.toLowerCase())) continue;

          const title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const link = item[1].match(/<link>(.*?)<\/link>/)?.[1] || '';
          const description = item[1].match(/<description[^>]*>(.*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const pubDate = item[1].match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

          // Calculate severity based on business risk keywords
          const riskKeywords = ['acquisition', 'merger', 'lawsuit', 'investigation', 'controversy', 'crisis', 'scandal'];
          const hasRiskKeywords = riskKeywords.some(keyword => content.includes(keyword));
          
          results.push({
            platform: feed.name,
            content: title,
            url: link,
            severity: hasRiskKeywords ? 'medium' : 'low',
            sentiment: hasRiskKeywords ? -0.3 : 0.1,
            confidence_score: 0.7,
            detected_entities: [entity],
            source_type: scan_type,
            entity_name: entity,
            created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('[RSS-SCRAPER] Error processing', feed.name, ':', error);
      }
    }

    console.log('[RSS-SCRAPER] Total results found:', results.length);

    if (results.length > 0) {
      const { error } = await supabase.from('scan_results').insert(results);
      if (error) {
        console.error('[RSS-SCRAPER] Database insert error:', error);
      } else {
        console.log('[RSS-SCRAPER] Successfully inserted', results.length, 'entries');
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: results.length, 
      results: results,
      feeds_scanned: feedsToScan.length,
      scan_type: scan_type,
      message: `RSS scan completed: ${results.length} items found from ${feedsToScan.length} feeds`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[RSS-SCRAPER] Error:', error);
    return new Response(JSON.stringify({
      error: 'RSS scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
