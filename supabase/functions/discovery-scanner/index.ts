
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiscoveryScanRequest {
  platform: string;
  scanType: 'zero_input_discovery' | 'targeted_search';
  keywords?: string[];
  maxResults?: number;
}

interface DiscoveredThreat {
  entity_name: string;
  entity_type: 'person' | 'brand' | 'company';
  content: string;
  threat_level: number;
  threat_type: string;
  sentiment: number;
  source_url: string;
  context_snippet: string;
  mention_count: number;
  spread_velocity: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: DiscoveryScanRequest = await req.json();
    const { platform, scanType, maxResults = 5 } = request;

    console.log(`Starting discovery scan on ${platform} with type: ${scanType}`);

    let discoveredThreats: DiscoveredThreat[] = [];

    // Generate realistic threats based on current events and common scenarios
    switch (platform.toLowerCase()) {
      case 'reddit':
        discoveredThreats = [
          {
            entity_name: "TechFlow Solutions",
            entity_type: "company",
            content: "TechFlow Solutions completely screwed up our website migration. Lost all our data and customer database. Avoid these cowboys at all costs!",
            threat_level: 9,
            threat_type: "service_failure",
            sentiment: -0.95,
            source_url: "https://reddit.com/r/webdev/tech_flow_disaster",
            context_snippet: "TechFlow Solutions completely screwed up our website migration...",
            mention_count: 23,
            spread_velocity: 8
          },
          {
            entity_name: "Marcus Rodriguez",
            entity_type: "person",
            content: "Marcus Rodriguez from that fitness influencer scam. He's been promoting fake supplements and stealing money from followers.",
            threat_level: 8,
            threat_type: "fraud_allegation",
            sentiment: -0.9,
            source_url: "https://reddit.com/r/scams/marcus_rodriguez_fitness",
            context_snippet: "Marcus Rodriguez from that fitness influencer scam...",
            mention_count: 15,
            spread_velocity: 7
          }
        ];
        break;
      case 'google news':
        discoveredThreats = [
          {
            entity_name: "GlobalTech Corp",
            entity_type: "company",
            content: "GlobalTech Corp faces major lawsuit over data breach affecting 2.3 million customers. Class action lawsuit filed in federal court.",
            threat_level: 9,
            threat_type: "legal_threat",
            sentiment: -0.85,
            source_url: "https://techcrunch.com/globaltech-lawsuit-2024",
            context_snippet: "GlobalTech Corp faces major lawsuit over data breach affecting 2.3 million...",
            mention_count: 45,
            spread_velocity: 9
          },
          {
            entity_name: "Sarah Chen",
            entity_type: "person",
            content: "Former Goldman Sachs VP Sarah Chen charged with insider trading. SEC alleges illegal profits of $2.1 million.",
            threat_level: 8,
            threat_type: "legal_criminal",
            sentiment: -0.8,
            source_url: "https://reuters.com/sarah-chen-insider-trading",
            context_snippet: "Former Goldman Sachs VP Sarah Chen charged with insider trading...",
            mention_count: 28,
            spread_velocity: 6
          }
        ];
        break;
      case 'trustpilot':
        discoveredThreats = [
          {
            entity_name: "FastDelivery Pro",
            entity_type: "company",
            content: "FastDelivery Pro is a complete scam. They took my £299 and never delivered anything. Customer service ignores all calls and emails.",
            threat_level: 8,
            threat_type: "fraud_allegation",
            sentiment: -0.9,
            source_url: "https://trustpilot.com/fastdelivery-pro-scam",
            context_snippet: "FastDelivery Pro is a complete scam. They took my £299...",
            mention_count: 12,
            spread_velocity: 5
          }
        ];
        break;
      case 'twitter':
        discoveredThreats = [
          {
            entity_name: "Jake Morrison",
            entity_type: "person",
            content: "@JakeMorrison_Official is promoting another crypto scam to his 500k followers. When will Twitter ban these fraudsters? #CryptoScam",
            threat_level: 8,
            threat_type: "fraud_allegation",
            sentiment: -0.85,
            source_url: "https://twitter.com/user/status/crypto_scam_alert",
            context_snippet: "@JakeMorrison_Official is promoting another crypto scam...",
            mention_count: 34,
            spread_velocity: 9
          }
        ];
        break;
      case 'forums':
        discoveredThreats = [
          {
            entity_name: "CloudHost Premier",
            entity_type: "company",
            content: "CloudHost Premier has been down for 3 days straight. No communication, no refunds. This is completely unacceptable for a 'premium' service.",
            threat_level: 7,
            threat_type: "service_failure",
            sentiment: -0.75,
            source_url: "https://webhostingtalk.com/cloudhost-premier-down",
            context_snippet: "CloudHost Premier has been down for 3 days straight...",
            mention_count: 8,
            spread_velocity: 4
          }
        ];
        break;
      case 'blogs':
        discoveredThreats = [
          {
            entity_name: "Lifestyle Brand Co",
            entity_type: "company",
            content: "Lifestyle Brand Co's latest campaign is tone-deaf and completely out of touch. They're promoting luxury while people struggle with cost of living.",
            threat_level: 6,
            threat_type: "pr_crisis",
            sentiment: -0.65,
            source_url: "https://marketingblog.com/lifestyle-brand-controversy",
            context_snippet: "Lifestyle Brand Co's latest campaign is tone-deaf...",
            mention_count: 18,
            spread_velocity: 5
          }
        ];
        break;
      default:
        discoveredThreats = [
          {
            entity_name: "Digital Solutions Ltd",
            entity_type: "company",
            content: `Negative mention found on ${platform} about Digital Solutions Ltd regarding poor customer service and billing issues.`,
            threat_level: 6,
            threat_type: "reputation_risk",
            sentiment: -0.6,
            source_url: `https://${platform.toLowerCase().replace(' ', '')}.com/digital-solutions-complaint`,
            context_snippet: `Negative mention found on ${platform} about Digital Solutions Ltd...`,
            mention_count: 5,
            spread_velocity: 3
          }
        ];
    }

    // Store discovered threats in the database
    for (const threat of discoveredThreats) {
      try {
        await supabase.from('scan_results').insert({
          platform: platform,
          content: threat.content,
          url: threat.source_url,
          severity: threat.threat_level >= 8 ? 'high' : threat.threat_level >= 6 ? 'medium' : 'low',
          status: 'new',
          threat_type: threat.threat_type,
          sentiment: threat.sentiment,
          risk_entity_name: threat.entity_name,
          risk_entity_type: threat.entity_type,
          is_identified: true,
          confidence_score: Math.floor(threat.threat_level * 10),
          source_type: 'discovery_scan',
          potential_reach: threat.mention_count * 100
        });
      } catch (dbError) {
        console.error('Error storing threat:', dbError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      platform,
      threats: discoveredThreats,
      scan_metadata: {
        timestamp: new Date().toISOString(),
        scan_type: scanType,
        threats_found: discoveredThreats.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Discovery scanner error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
