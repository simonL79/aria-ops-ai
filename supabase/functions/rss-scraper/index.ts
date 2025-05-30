
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { parseRSSFeed } from './parser.ts';

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
    // Environment validation
    console.log('[RSS-SCRAPER] Environment check:');
    console.log('[RSS-SCRAPER] SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'));
    console.log('[RSS-SCRAPER] ARIA_INGEST_KEY exists:', !!Deno.env.get('ARIA_INGEST_KEY'));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { entity, sources, scan_type } = await req.json();
    console.log('[RSS-SCRAPER] Starting UK celebrity/sports/news scan...');

    // Define RSS feeds for UK news, sports, and celebrity content
    const rssFeeds = [
      // News sources
      { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
      { name: 'The Guardian - UK News', url: 'https://www.theguardian.com/uk/rss' },
      { name: 'The Independent - UK News', url: 'https://www.independent.co.uk/news/uk/rss' },
      { name: 'The Telegraph - News', url: 'https://www.telegraph.co.uk/news/rss.xml' },
      { name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
      { name: 'The Guardian - Politics', url: 'https://www.theguardian.com/politics/rss' },
      { name: 'BBC Politics', url: 'https://feeds.bbci.co.uk/news/politics/rss.xml' },
      { name: 'Financial Times - UK', url: 'https://www.ft.com/rss/home/uk' },
      
      // Sports sources
      { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/rss.xml' },
      { name: 'The Guardian - UK Sport', url: 'https://www.theguardian.com/uk/sport/rss' },
      { name: 'Sky Sports News', url: 'https://www.skysports.com/rss/12040' },
      { name: 'The Independent - Sport', url: 'https://www.independent.co.uk/sport/rss' },
      { name: 'talkSPORT', url: 'https://talksport.com/feed/' },
      { name: 'The Telegraph - Sport', url: 'https://www.telegraph.co.uk/sport/rss.xml' },
      { name: 'BBC Sport - Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml' },
      { name: 'The Guardian - Football', url: 'https://www.theguardian.com/football/rss' },
      { name: 'Sky Sports - Premier League', url: 'https://www.skysports.com/rss/12691' },
      
      // Celebrity/Entertainment sources
      { name: 'The Sun - TV & Showbiz', url: 'https://www.thesun.co.uk/tvandshowbiz/feed/' },
      { name: 'Daily Mail - TV & Showbiz', url: 'https://www.dailymail.co.uk/tvshowbiz/index.rss' },
      { name: 'The Mirror - 3AM Celebrity News', url: 'https://www.mirror.co.uk/3am/feed/' },
      { name: 'OK! Magazine Celebrity News', url: 'https://www.ok.co.uk/celebrity-news/rss.xml' },
      { name: 'Hello! Magazine - Celebrities', url: 'https://www.hellomagazine.com/rss/celebrities/' },
      { name: 'Digital Spy - Showbiz', url: 'https://www.digitalspy.com/rss/showbiz.xml' }
    ];

    const allResults: any[] = [];
    let totalProcessed = 0;

    // Keywords to look for threat-related content
    const threatKeywords = [
      entity || '',
      'scandal', 'controversy', 'investigation', 'allegation', 'lawsuit', 
      'fraud', 'misconduct', 'crisis', 'threat', 'risk', 'reputation',
      'criminal', 'court', 'legal', 'police', 'arrest', 'charge'
    ].filter(Boolean);

    // Process each RSS feed
    for (const feed of rssFeeds) {
      try {
        console.log(`[RSS-SCRAPER] Scanning ${feed.name}: ${feed.url}`);
        
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ARIA-RSS-Scanner/1.0)',
            'Accept': 'application/rss+xml, application/xml, text/xml'
          }
        });

        if (!response.ok) {
          console.log(`[RSS-SCRAPER] Failed to fetch ${feed.name}: ${response.status}`);
          continue;
        }

        const xmlText = await response.text();
        const items = parseRSSFeed(xmlText);
        
        console.log(`[RSS-SCRAPER] Retrieved ${items.length} items from ${feed.name}`);
        
        // Filter for relevant content
        const relevantItems = items.filter(item => {
          const content = `${item.title} ${item.description}`.toLowerCase();
          return threatKeywords.some(keyword => 
            keyword && content.includes(keyword.toLowerCase())
          );
        });

        // Convert to our format and add to results
        relevantItems.forEach(item => {
          allResults.push({
            id: `rss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            platform: feed.name,
            content: item.content || item.title,
            url: item.link || feed.url,
            severity: 'medium',
            sentiment: -0.2, // Slightly negative as these are threat-related
            confidence_score: 0.7,
            detected_entities: [entity].filter(Boolean),
            source_type: 'live_osint',
            entity_name: entity,
            created_at: new Date().toISOString()
          });
        });

        totalProcessed += items.length;

      } catch (error) {
        console.error(`[RSS-SCRAPER] Error processing ${feed.name}:`, error);
      }
    }

    // Store results in database
    if (allResults.length > 0) {
      const { error: dbError } = await supabase
        .from('scan_results')
        .insert(allResults.map(result => ({
          platform: result.platform,
          content: result.content,
          url: result.url,
          severity: result.severity,
          sentiment: result.sentiment,
          confidence_score: result.confidence_score,
          detected_entities: result.detected_entities,
          source_type: result.source_type,
          entity_name: result.entity_name,
          threat_type: 'rss_intelligence'
        })));

      if (dbError) {
        console.error('[RSS-SCRAPER] Database insert error:', dbError);
      } else {
        console.log(`[RSS-SCRAPER] Successfully stored ${allResults.length} RSS intelligence items`);
      }
    }

    console.log(`[RSS-SCRAPER] Found ${allResults.length} UK celebrity/sports/news threat items total`);
    console.log('[RSS-SCRAPER] UK celebrity/sports/news scan completed successfully');

    return new Response(JSON.stringify({
      success: true,
      results: allResults,
      total_processed: totalProcessed,
      relevant_items: allResults.length,
      message: `RSS scan completed: ${allResults.length} threat-related items found from ${rssFeeds.length} sources`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[RSS-SCRAPER] RSS scan error:', error);
    return new Response(JSON.stringify({
      error: 'RSS scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
