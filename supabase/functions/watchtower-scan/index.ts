
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WatchtowerScanRequest {
  mode: 'auto' | 'manual';
  keywords?: string[];
  industries?: string[];
  maxCandidates: number;
  useLocalInference?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    const { 
      mode, 
      keywords = [], 
      industries = [], 
      maxCandidates,
      useLocalInference = false
    }: WatchtowerScanRequest = requestBody;

    console.log(`🔍 Starting Watchtower ${mode} scan with ${maxCandidates} max candidates`);

    // Simulate discovery process
    const mockEntities = [
      'TechCorp Inc',
      'Global Finance Ltd',
      'Innovation Systems',
      'Digital Solutions Co',
      'Enterprise Networks'
    ];

    const entitiesDiscovered = Math.min(mockEntities.length, maxCandidates);
    const candidatesStored = Math.floor(entitiesDiscovered * 0.7); // 70% conversion rate

    // Store discovered candidates in watchtower_candidates table
    const candidates = [];
    for (let i = 0; i < candidatesStored; i++) {
      const entityName = mockEntities[i];
      const threatScore = Math.random() * 0.9 + 0.1; // 0.1 to 1.0
      
      const candidate = {
        entity_name: entityName,
        discovery_source: mode === 'auto' ? 'automated_scan' : 'manual_discovery',
        threat_summary: `Potential reputation risk identified for ${entityName} through ${mode} discovery`,
        threat_score: threatScore,
        confidence_score: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        potential_value: Math.floor(Math.random() * 100000) + 50000,
        outreach_status: 'not_contacted',
        scan_results: [],
        threat_details: {
          riskFactors: ['negative_mentions', 'competitor_activity'],
          platforms: ['twitter', 'linkedin', 'news_sites'],
          urgency: threatScore > 0.7 ? 'high' : threatScore > 0.4 ? 'medium' : 'low'
        }
      };
      
      candidates.push(candidate);
    }

    // Insert candidates into database
    if (candidates.length > 0) {
      const { error: insertError } = await supabase
        .from('watchtower_candidates')
        .insert(candidates);

      if (insertError) {
        console.error('Error inserting candidates:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        entitiesDiscovered,
        candidatesStored,
        mode,
        useLocalInference,
        message: `Watchtower scan completed: ${candidatesStored} candidates stored from ${entitiesDiscovered} entities discovered`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Watchtower scan error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
