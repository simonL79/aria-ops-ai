
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
    const { platform, scanType, maxResults = 10 } = request;

    console.log(`Starting discovery scan on ${platform} with type: ${scanType}`);

    let discoveredThreats: DiscoveredThreat[] = [];

    // Simulate different platform scanning based on the platform
    switch (platform.toLowerCase()) {
      case 'reddit':
        discoveredThreats = await scanReddit(maxResults);
        break;
      case 'google news':
        discoveredThreats = await scanGoogleNews(maxResults);
        break;
      case 'trustpilot':
        discoveredThreats = await scanTrustPilot(maxResults);
        break;
      case 'twitter':
        discoveredThreats = await scanTwitter(maxResults);
        break;
      case 'forums':
        discoveredThreats = await scanForums(maxResults);
        break;
      case 'blogs':
        discoveredThreats = await scanBlogs(maxResults);
        break;
      default:
        discoveredThreats = await scanGeneric(platform, maxResults);
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
          source_type: 'discovery_scan'
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

async function scanReddit(maxResults: number): Promise<DiscoveredThreat[]> {
  // Simulate Reddit scanning for reputation threats
  const mockThreats = [
    {
      entity_name: "TechCorp Inc",
      entity_type: "company" as const,
      content: "TechCorp is a complete scam. They took my money and never delivered the product. Avoid at all costs!",
      threat_level: 8,
      threat_type: "fraud_allegation",
      sentiment: -0.9,
      source_url: "https://reddit.com/r/scams/techcorp_warning",
      context_snippet: "TechCorp is a complete scam. They took my money and never delivered...",
      mention_count: 15,
      spread_velocity: 7
    },
    {
      entity_name: "Celebrity Jane Doe",
      entity_type: "person" as const,
      content: "Jane Doe is so fake and pretentious. Can't stand her influence on young people.",
      threat_level: 6,
      threat_type: "reputation_damage",
      sentiment: -0.7,
      source_url: "https://reddit.com/r/InfluencerSnark/jane_doe_discussion",
      context_snippet: "Jane Doe is so fake and pretentious. Can't stand her influence...",
      mention_count: 8,
      spread_velocity: 4
    }
  ];

  // Return a random subset up to maxResults
  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanGoogleNews(maxResults: number): Promise<DiscoveredThreat[]> {
  const mockThreats = [
    {
      entity_name: "MegaBrand Corp",
      entity_type: "company" as const,
      content: "MegaBrand Corp faces lawsuit over alleged data privacy violations affecting millions of users",
      threat_level: 9,
      threat_type: "legal_threat",
      sentiment: -0.8,
      source_url: "https://news.example.com/megabrand-lawsuit",
      context_snippet: "MegaBrand Corp faces lawsuit over alleged data privacy violations...",
      mention_count: 50,
      spread_velocity: 9
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanTrustPilot(maxResults: number): Promise<DiscoveredThreat[]> {
  const mockThreats = [
    {
      entity_name: "QuickService Ltd",
      entity_type: "company" as const,
      content: "Terrible customer service. They charged my card twice and refuse to refund. Stay away!",
      threat_level: 7,
      threat_type: "service_complaint",
      sentiment: -0.8,
      source_url: "https://trustpilot.com/review/quickservice-review",
      context_snippet: "Terrible customer service. They charged my card twice and refuse...",
      mention_count: 12,
      spread_velocity: 5
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanTwitter(maxResults: number): Promise<DiscoveredThreat[]> {
  const mockThreats = [
    {
      entity_name: "Influencer Mike Smith",
      entity_type: "person" as const,
      content: "@mikesmith is promoting crypto scams to his followers. This needs to stop! #scamalert",
      threat_level: 8,
      threat_type: "fraud_allegation",
      sentiment: -0.9,
      source_url: "https://twitter.com/user/status/123456789",
      context_snippet: "@mikesmith is promoting crypto scams to his followers. This needs...",
      mention_count: 25,
      spread_velocity: 8
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanForums(maxResults: number): Promise<DiscoveredThreat[]> {
  const mockThreats = [
    {
      entity_name: "StartupX",
      entity_type: "company" as const,
      content: "StartupX promised revolutionary technology but it's just vaporware. Don't invest!",
      threat_level: 7,
      threat_type: "investment_warning",
      sentiment: -0.7,
      source_url: "https://techforum.com/startupx-discussion",
      context_snippet: "StartupX promised revolutionary technology but it's just vaporware...",
      mention_count: 6,
      spread_velocity: 3
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanBlogs(maxResults: number): Promise<DiscoveredThreat[]> {
  const mockThreats = [
    {
      entity_name: "Fashion Brand Alpha",
      entity_type: "company" as const,
      content: "Fashion Brand Alpha's latest campaign is tone-deaf and offensive. Time for a boycott.",
      threat_level: 6,
      threat_type: "pr_crisis",
      sentiment: -0.6,
      source_url: "https://fashionblog.com/alpha-campaign-criticism",
      context_snippet: "Fashion Brand Alpha's latest campaign is tone-deaf and offensive...",
      mention_count: 10,
      spread_velocity: 4
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}

async function scanGeneric(platform: string, maxResults: number): Promise<DiscoveredThreat[]> {
  // Generic scanning for other platforms
  const mockThreats = [
    {
      entity_name: "Generic Entity",
      entity_type: "brand" as const,
      content: `Negative mention found on ${platform} about Generic Entity`,
      threat_level: 5,
      threat_type: "reputation_risk",
      sentiment: -0.5,
      source_url: `https://${platform.toLowerCase()}.com/generic-mention`,
      context_snippet: `Negative mention found on ${platform} about Generic Entity...`,
      mention_count: 3,
      spread_velocity: 2
    }
  ];

  return mockThreats.slice(0, Math.min(maxResults, mockThreats.length));
}
