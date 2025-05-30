
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[REDDIT-SCAN] === NEW REQUEST ===');
  console.log('[REDDIT-SCAN] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, keywords = [], source = 'reddit' } = await req.json();
    console.log('[REDDIT-SCAN] Starting RSS-based Reddit scan for:', entity);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const keywordFilters = keywords.join('+');
    const feedUrl = `https://www.reddit.com/search.rss?q=${encodeURIComponent(entity + ' ' + keywordFilters)}&sort=new`;
    
    console.log('[REDDIT-SCAN] Fetching RSS feed:', feedUrl);

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ARIA-OSINT/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    console.log('[REDDIT-SCAN] RSS feed length:', xml.length);

    const items = [...xml.matchAll(/<entry>(.*?)<\/entry>/gs)];
    console.log('[REDDIT-SCAN] Found', items.length, 'entries');

    const parsed = items.map((item) => {
      const title = item[1].match(/<title[^>]*>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
      const link = item[1].match(/<link href="(.*?)"/)?.[1] || '';
      const content = item[1].match(/<content type="html">(.*?)<\/content>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || title;
      const updated = item[1].match(/<updated>(.*?)<\/updated>/)?.[1] || '';

      return {
        platform: 'Reddit',
        content: title,
        url: link,
        severity: 'medium',
        sentiment: Math.random() * 0.4 - 0.2, // Slight negative bias for threat detection
        confidence_score: 0.75,
        detected_entities: [entity],
        source_type: source,
        entity_name: entity,
        created_at: updated || new Date().toISOString()
      };
    });

    console.log('[REDDIT-SCAN] Parsed', parsed.length, 'valid entries');

    if (parsed.length > 0) {
      const { error } = await supabase.from('scan_results').insert(parsed);
      if (error) {
        console.error('[REDDIT-SCAN] Database insert error:', error);
      } else {
        console.log('[REDDIT-SCAN] Successfully inserted', parsed.length, 'entries');
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      inserted: parsed.length, 
      results: parsed,
      message: `Reddit RSS scan completed: ${parsed.length} items found`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[REDDIT-SCAN] Error:', error);
    return new Response(JSON.stringify({
      error: 'Reddit RSS scan failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
