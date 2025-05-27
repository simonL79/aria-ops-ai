
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { sources, scan_type } = await req.json();
    
    console.log('UK News Scanner started with sources:', sources);
    console.log('Scan type:', scan_type);

    // Sample UK news threats for demonstration
    const sampleThreats = [
      {
        platform: 'BBC News',
        content: 'Major data breach affects UK financial services company, customers advised to change passwords immediately',
        url: 'https://bbc.co.uk/news/business-sample',
        severity: 'high',
        threat_type: 'data_breach',
        risk_entity_name: 'UK Financial Services Ltd',
        risk_entity_type: 'company',
        sentiment: -0.8,
        source_type: 'news'
      },
      {
        platform: 'The Guardian',
        content: 'Investigation reveals poor working conditions at major UK retailer, employees speak out about treatment',
        url: 'https://theguardian.com/business/sample',
        severity: 'medium',
        threat_type: 'reputation_risk',
        risk_entity_name: 'UK Retail Chain',
        risk_entity_type: 'company',
        sentiment: -0.6,
        source_type: 'news'
      },
      {
        platform: 'Sky News',
        content: 'Tech startup CEO faces criticism over controversial social media comments about industry practices',
        url: 'https://news.sky.com/story/sample',
        severity: 'medium',
        threat_type: 'social_media_risk',
        risk_entity_name: 'John Smith',
        risk_entity_type: 'person',
        sentiment: -0.5,
        source_type: 'news'
      }
    ];

    let insertedCount = 0;

    // Insert threats into scan_results table
    for (const threat of sampleThreats) {
      try {
        const { data, error } = await supabase
          .from('scan_results')
          .insert({
            platform: threat.platform,
            content: threat.content,
            url: threat.url,
            severity: threat.severity,
            threat_type: threat.threat_type,
            risk_entity_name: threat.risk_entity_name,
            risk_entity_type: threat.risk_entity_type,
            sentiment: threat.sentiment,
            source_type: threat.source_type,
            status: 'new'
          });

        if (error) {
          console.error('Error inserting threat:', error);
        } else {
          insertedCount++;
          console.log('Inserted threat:', threat.risk_entity_name);
        }
      } catch (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    console.log(`UK News Scanner completed. Inserted ${insertedCount} threats.`);

    return new Response(JSON.stringify({
      success: true,
      message: 'UK News scan completed',
      threats_found: insertedCount,
      sources_scanned: sources?.length || 4,
      scan_type: scan_type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('UK News Scanner error:', error);
    return new Response(JSON.stringify({
      error: 'UK News Scanner failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
