
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, scan_type = 'reputation_threats', source = 'news' } = await req.json();
    
    console.log('[UK-NEWS-SCANNER] Starting RSS-based news scan for:', entity);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const sources = [
      { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
      { name: 'The Guardian UK', url: 'https://www.theguardian.com/uk/rss' },
      { name: 'The Telegraph', url: 'https://www.telegraph.co.uk/news/rss.xml' },
      { name: 'Reuters UK', url: 'https://feeds.reuters.com/reuters/UKTopNews' },
      { name: 'Independent UK', url: 'https://www.independent.co.uk/news/uk/rss' }
    ];

    const results: any[] = [];

    for (const source of sources) {
      try {
        console.log('[UK-NEWS-SCANNER] Scanning:', source.name);
        
        const res = await fetch(source.url, {
          headers: {
            'User-Agent': 'ARIA-OSINT/1.0'
          }
        });
        
        if (!res.ok) {
          console.warn('[UK-NEWS-SCANNER] Failed to fetch', source.name, ':', res.status);
          continue;
        }

        const xml = await res.text();
        const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)];
        
        console.log('[UK-NEWS-SCANNER]', source.name, 'found', items.length, 'items');

        for (const item of items) {
          const content = item[1].toLowerCase();
          if (!content.includes(entity.toLowerCase())) continue;

          const title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const link = item[1].match(/<link>(.*?)<\/link>/)?.[1] || '';
          const description = item[1].match(/<description[^>]*>(.*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
          const pubDate = item[1].match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

          // Calculate severity based on threat keywords
          const threatKeywords = ['scandal', 'controversy', 'investigation', 'allegation', 'lawsuit', 'fraud', 'crisis'];
          const hasThreatKeywords = threatKeywords.some(keyword => content.includes(keyword));
          
          results.push({
            platform: source.name,
            content: title,
            url: link,
            severity: hasThreatKeywords ? 'high' : 'medium',
            sentiment: hasThreatKeywords ? -0.6 : -0.2,
            confidence_score: 0.9,
            detected_entities: [entity],
            source_type: source,
            entity_name: entity,
            created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('[UK-NEWS-SCANNER] Error processing', source.name, ':', error);
      }
    }

    console.log('[UK-NEWS-SCANNER] Total results found:', results.length);

    if (results.length > 0) {
      const { error } = await supabase.from('scan_results').insert(results);
      if (error) {
        console.error('[UK-NEWS-SCANNER] Database insert error:', error);
      } else {
        console.log('[UK-NEWS-SCANNER] Successfully inserted', results.length, 'entries');
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: results.length, 
      results: results,
      sources_scanned: sources.length,
      scan_type: scan_type,
      message: `UK News RSS scan completed: ${results.length} items found`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[UK-NEWS-SCANNER] Error:', error);
    return new Response(JSON.stringify({
      error: 'UK News RSS scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
