
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactDiscoveryRequest {
  entity_name: string;
  entity_type: 'person' | 'brand' | 'company';
  threat_id: string;
}

interface DiscoveredContact {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  company: string;
  type: 'pr_firm' | 'agent' | 'manager' | 'legal' | 'direct';
  confidence: number;
  source: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ContactDiscoveryRequest = await req.json();
    
    console.log('Discovering contacts for:', request.entity_name);

    // Simulate contact discovery based on entity type
    const contacts = await discoverContacts(request);
    
    return new Response(JSON.stringify({
      success: true,
      entity_name: request.entity_name,
      contacts: contacts,
      discovery_metadata: {
        timestamp: new Date().toISOString(),
        methods_used: ['website_crawl', 'linkedin_search', 'email_patterns'],
        confidence_threshold: 75
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact discovery error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function discoverContacts(request: ContactDiscoveryRequest): Promise<DiscoveredContact[]> {
  const contacts: DiscoveredContact[] = [];

  // Simulate different discovery patterns based on entity type
  if (request.entity_type === 'person') {
    // For celebrities/influencers, look for agents and PR
    contacts.push(
      {
        name: "Sarah Johnson",
        title: "Talent Agent",
        email: "sarah.johnson@talentplus.com",
        linkedin: "https://linkedin.com/in/sarah-johnson-agent",
        company: "TalentPlus Agency",
        type: "agent",
        confidence: 85,
        source: "website_crawl"
      },
      {
        name: "Michael Chen",
        title: "PR Manager",
        email: "m.chen@reputationpro.com",
        linkedin: "https://linkedin.com/in/michael-chen-pr",
        phone: "+1-555-0123",
        company: "Reputation Pro",
        type: "pr_firm",
        confidence: 90,
        source: "linkedin_search"
      }
    );
  } else {
    // For companies/brands, look for PR, legal, and management
    contacts.push(
      {
        name: "Jennifer Williams",
        title: "Head of Communications",
        email: "j.williams@company.com",
        linkedin: "https://linkedin.com/in/jennifer-williams-comms",
        company: request.entity_name,
        type: "direct",
        confidence: 95,
        source: "website_crawl"
      },
      {
        name: "Robert Davis",
        title: "General Counsel",
        email: "legal@company.com",
        linkedin: "https://linkedin.com/in/robert-davis-legal",
        phone: "+1-555-0456",
        company: request.entity_name,
        type: "legal",
        confidence: 88,
        source: "email_patterns"
      }
    );
  }

  // Add some variation to simulate real discovery
  return contacts.slice(0, Math.floor(Math.random() * 3) + 1);
}
