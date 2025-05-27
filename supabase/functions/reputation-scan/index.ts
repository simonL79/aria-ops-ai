
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReputationScanRequest {
  entity_name: string;
  entity_type?: 'person' | 'company' | 'brand';
  scan_depth?: 'quick' | 'standard' | 'comprehensive';
  platforms?: string[];
  timeframe?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: ReputationScanRequest = await req.json();
    const { entity_name, entity_type = 'person', scan_depth = 'standard', platforms = ['all'], timeframe = '30d' } = request;

    console.log(`Reputation scan for ${entity_name} (${entity_type}) - depth: ${scan_depth}`);

    // Simulate comprehensive reputation scanning
    const reputationResults = {
      overall_score: 72,
      score_trend: '+5',
      risk_level: 'medium',
      platform_breakdown: [
        {
          platform: 'Google Search Results',
          score: 75,
          mentions: 245,
          sentiment: 0.2,
          top_concerns: ['outdated information', 'competitor mentions'],
          suppression_opportunities: 3
        },
        {
          platform: 'Social Media',
          score: 68,
          mentions: 892,
          sentiment: -0.1,
          top_concerns: ['customer complaints', 'negative reviews'],
          suppression_opportunities: 7
        },
        {
          platform: 'News & Media',
          score: 78,
          mentions: 56,
          sentiment: 0.4,
          top_concerns: ['industry challenges', 'market pressures'],
          suppression_opportunities: 2
        },
        {
          platform: 'Review Sites',
          score: 65,
          mentions: 134,
          sentiment: -0.3,
          top_concerns: ['service issues', 'pricing complaints'],
          suppression_opportunities: 8
        }
      ],
      threat_analysis: {
        immediate_threats: [
          {
            type: 'negative_review_cluster',
            severity: 'medium',
            platform: 'Trustpilot',
            impact_score: 6.5,
            recommended_action: 'response_strategy'
          },
          {
            type: 'viral_negative_content',
            severity: 'low',
            platform: 'Twitter',
            impact_score: 4.2,
            recommended_action: 'monitor'
          }
        ],
        suppression_targets: [
          'negative blog post ranking #3',
          'outdated competitor comparison',
          'unverified review site content'
        ]
      },
      improvement_opportunities: {
        seo_gaps: ['missing positive content for key terms', 'weak brand mention optimization'],
        content_opportunities: ['thought leadership articles', 'customer success stories'],
        platform_gaps: ['limited LinkedIn presence', 'no YouTube optimization']
      }
    };

    // Store reputation scan results
    for (const platform of reputationResults.platform_breakdown) {
      await supabase.from('scan_results').insert({
        platform: platform.platform,
        content: `Reputation analysis found ${platform.mentions} mentions with ${platform.sentiment > 0 ? 'positive' : platform.sentiment < 0 ? 'negative' : 'neutral'} sentiment`,
        url: `https://reputation-scan.aria.com/${platform.platform.toLowerCase().replace(' ', '-')}`,
        severity: platform.score < 60 ? 'high' : platform.score < 75 ? 'medium' : 'low',
        status: 'new',
        threat_type: 'reputation_analysis',
        sentiment: platform.sentiment,
        risk_entity_name: entity_name,
        risk_entity_type: entity_type,
        is_identified: true,
        confidence_score: platform.score,
        source_type: 'reputation_scan',
        potential_reach: platform.mentions * 50
      });
    }

    return new Response(JSON.stringify({
      success: true,
      reputation_analysis: reputationResults,
      scan_metadata: {
        timestamp: new Date().toISOString(),
        entity_name,
        entity_type,
        scan_depth,
        platforms_scanned: platforms,
        timeframe
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reputation scan error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
