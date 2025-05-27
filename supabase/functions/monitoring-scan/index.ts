
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting monitoring scan...');

    const { scanType } = await req.json();

    // Simulate scanning multiple platforms
    const platforms = ['Twitter', 'Facebook', 'Reddit', 'News', 'Forums'];
    const results = [];

    for (const platform of platforms) {
      const resultCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < resultCount; i++) {
        const content = `Monitoring scan detected potential threat on ${platform}. Content analysis shows reputation risk indicators.`;
        const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
        
        const scanResult = {
          id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          platform,
          content,
          url: `https://${platform.toLowerCase()}.com/post/${Math.random().toString(36).substring(2, 9)}`,
          severity,
          status: 'new',
          threat_type: 'reputation_risk',
          sentiment: Math.random() * 100 - 50,
          date: new Date().toISOString(),
          sourceType: platform.toLowerCase().includes('news') ? 'news' : 'social',
          threatType: 'reputation_risk',
          confidenceScore: Math.floor(Math.random() * 30) + 70,
          detectedEntities: ['Entity Name'],
          potentialReach: Math.floor(Math.random() * 10000) + 1000
        };

        results.push(scanResult);

        // Store in database
        await supabase
          .from('scan_results')
          .insert({
            platform,
            content,
            url: scanResult.url,
            severity,
            status: 'new',
            threat_type: 'reputation_risk',
            sentiment: scanResult.sentiment
          });
      }
    }

    // Update monitoring status
    await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: true,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    console.log(`Monitoring scan completed. Found ${results.length} results.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        stats: {
          platformsScanned: platforms.length,
          resultsFound: results.length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Monitoring scan error:', error);
    return new Response(
      JSON.stringify({ error: 'Monitoring scan failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
