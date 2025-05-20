
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const COMPANIES_HOUSE_API_KEY = Deno.env.get('COMPANIES_HOUSE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(
    SUPABASE_URL || '',
    SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    // Parse request body or use defaults
    const { date, maxResults = 10 } = await req.json().catch(() => ({
      date: new Date().toISOString().split('T')[0], // Default to today
      maxResults: 10
    }));

    console.log(`Fetching new companies incorporated on: ${date}`);

    if (!COMPANIES_HOUSE_API_KEY) {
      throw new Error("Companies House API key not configured");
    }

    // Call Companies House API to get new companies
    const response = await fetch(
      `https://api.company-information.service.gov.uk/advanced-search/companies?incorporation_from=${date}&incorporation_to=${date}&size=${maxResults}`,
      {
        headers: {
          Authorization: `Basic ${btoa(COMPANIES_HOUSE_API_KEY + ':')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Companies House API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const companies = data.items || [];
    console.log(`Found ${companies.length} new companies`);

    // Format companies for database insertion
    const formattedCompanies = companies.map(company => ({
      company_name: company.title,
      company_number: company.company_number,
      date_of_incorporation: company.date_of_creation,
      officers: JSON.stringify([]), // Empty array initially
      scan_status: 'pending'
    }));

    // Insert companies into database
    if (formattedCompanies.length > 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from('clean_launch_targets')
        .upsert(formattedCompanies, { 
          onConflict: 'company_number',
          ignoreDuplicates: true 
        });

      if (insertError) {
        throw new Error(`Error inserting companies: ${insertError.message}`);
      }

      console.log(`Inserted/updated ${formattedCompanies.length} companies`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${companies.length} companies from Companies House`,
        companies: formattedCompanies 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in companies-house-daily-import function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
