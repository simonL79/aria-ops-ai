
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IntelligenceRequest {
  entity_name?: string;
  scan_type: 'comprehensive' | 'targeted' | 'social_media' | 'news_only';
  platforms?: string[];
  depth?: 'surface' | 'standard' | 'deep';
  timeframe?: 'realtime' | '24h' | '7d' | '30d';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: IntelligenceRequest = await req.json();
    const { entity_name, scan_type, platforms = ['all'], depth = 'standard', timeframe = '24h' } = request;

    console.log(`Intelligence Workbench scan: ${scan_type} for entity: ${entity_name}`);

    // Simulate comprehensive intelligence gathering
    const intelligenceResults = {
      entity_analysis: {
        entity_name: entity_name || 'Target Entity',
        entity_type: 'person',
        confidence_score: 0.92,
        risk_assessment: 'medium',
        sentiment_overview: {
          positive: 45,
          neutral: 35,
          negative: 20
        }
      },
      platform_intelligence: [
        {
          platform: 'Social Media',
          mentions_found: 127,
          sentiment: -0.3,
          key_topics: ['reputation concerns', 'business practices', 'public statements'],
          risk_indicators: ['negative sentiment trend', 'viral potential']
        },
        {
          platform: 'News Media',
          mentions_found: 23,
          sentiment: -0.1,
          key_topics: ['industry news', 'company updates', 'market analysis'],
          risk_indicators: ['media scrutiny']
        },
        {
          platform: 'Forums & Communities',
          mentions_found: 89,
          sentiment: -0.5,
          key_topics: ['customer complaints', 'service issues', 'competitor discussions'],
          risk_indicators: ['community backlash', 'coordinated criticism']
        }
      ],
      threat_assessment: {
        immediate_threats: 2,
        potential_threats: 5,
        escalation_risk: 'moderate',
        recommended_actions: [
          'Monitor social media sentiment closely',
          'Prepare response strategy for negative feedback',
          'Engage with community concerns proactively'
        ]
      },
      narrative_tracking: {
        dominant_narratives: [
          'Service quality concerns',
          'Corporate responsibility questions',
          'Market competition dynamics'
        ],
        narrative_sentiment: -0.25,
        viral_potential: 0.7
      }
    };

    // Store results in database
    const { error: insertError } = await supabase.from('scan_results').insert({
      platform: 'Intelligence Workbench',
      content: `Comprehensive intelligence analysis for ${entity_name || 'target entity'}`,
      url: `https://intelligence-workbench.aria.com/analysis/${Date.now()}`,
      severity: intelligenceResults.threat_assessment.escalation_risk === 'high' ? 'high' : 
                intelligenceResults.threat_assessment.escalation_risk === 'moderate' ? 'medium' : 'low',
      status: 'new',
      threat_type: 'intelligence_analysis',
      sentiment: intelligenceResults.entity_analysis.sentiment_overview.negative > 50 ? -0.7 : 
                 intelligenceResults.entity_analysis.sentiment_overview.positive > 50 ? 0.7 : 0,
      risk_entity_name: entity_name || 'Target Entity',
      risk_entity_type: intelligenceResults.entity_analysis.entity_type,
      is_identified: true,
      confidence_score: Math.floor(intelligenceResults.entity_analysis.confidence_score * 100),
      source_type: 'intelligence_scan',
      potential_reach: intelligenceResults.platform_intelligence.reduce((sum, p) => sum + p.mentions_found, 0) * 10
    });

    if (insertError) {
      console.error('Error storing intelligence results:', insertError);
    }

    return new Response(JSON.stringify({
      success: true,
      intelligence_results: intelligenceResults,
      scan_metadata: {
        timestamp: new Date().toISOString(),
        scan_type,
        entity_analyzed: entity_name,
        platforms_scanned: platforms,
        depth_level: depth,
        timeframe
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Intelligence Workbench error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
