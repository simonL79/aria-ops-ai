
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompaniesHouseConfig {
  apiKey?: string;
  date?: string; // ISO format YYYY-MM-DD
  maxResults?: number;
}

interface CompanyResult {
  name: string;
  number: string;
  status: string;
  date: string;
  officers_url: string;
  address?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const config: CompaniesHouseConfig = await req.json();
    
    // Get API key from environment or request
    const apiKey = Deno.env.get("COMPANIES_HOUSE_API_KEY") || config.apiKey;
    
    if (!apiKey) {
      throw new Error("Companies House API key is required");
    }
    
    // Get today's date if not specified
    const date = config.date || new Date().toISOString().split('T')[0];
    const maxResults = config.maxResults || 10;
    
    console.log(`Scanning for companies incorporated on ${date}`);
    
    // Construct the API URL
    const baseUrl = 'https://api.company-information.service.gov.uk';
    const url = `${baseUrl}/advanced-search/companies?incorporated_from=${date}&size=${maxResults}`;
    
    // Make the API request
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the response
    const companies: CompanyResult[] = data.items.map((company: any) => ({
      name: company.company_name,
      number: company.company_number,
      status: company.company_status,
      date: company.date_of_creation,
      officers_url: `${baseUrl}/company/${company.company_number}/officers`,
      address: company.address_snippet
    }));
    
    console.log(`Found ${companies.length} new companies`);
    
    return new Response(JSON.stringify({
      date,
      companies,
      total: companies.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in companies-house-scanner function:', error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
