import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
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
    const { companyNumber, companyName, maxCompanies = 5 } = await req.json().catch(() => ({
      companyNumber: null,
      companyName: null,
      maxCompanies: 5
    }));

    // If specific company is requested, process just that one
    if (companyNumber && companyName) {
      const result = await processCompanyReputation(companyNumber, companyName, supabase);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Processed reputation for ${companyName}`,
          result 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Otherwise, fetch pending companies and process them
    const { data: pendingCompanies, error: fetchError } = await supabase
      .from('clean_launch_targets')
      .select('company_number, company_name')
      .eq('scan_status', 'pending')
      .limit(maxCompanies);

    if (fetchError) {
      throw new Error(`Error fetching pending companies: ${fetchError.message}`);
    }

    console.log(`Found ${pendingCompanies?.length || 0} pending companies to scan`);

    if (!pendingCompanies || pendingCompanies.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No pending companies to process" 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Process each pending company
    const results = [];
    for (const company of pendingCompanies) {
      try {
        const result = await processCompanyReputation(company.company_number, company.company_name, supabase);
        results.push(result);
      } catch (companyError) {
        console.error(`Error processing company ${company.company_name}:`, companyError);
        results.push({ 
          company_number: company.company_number, 
          success: false, 
          error: companyError.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${results.length} companies`,
        results 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in reputation-scan function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

async function processCompanyReputation(companyNumber: string, companyName: string, supabase: any) {
  console.log(`Processing reputation for: ${companyName} (${companyNumber})`);

  // Update status to scanning
  const { error: updateError } = await supabase
    .from('clean_launch_targets')
    .update({ 
      scan_status: 'scanning',
      last_scanned: new Date().toISOString()
    })
    .eq('company_number', companyNumber);

  if (updateError) {
    throw new Error(`Error updating company status: ${updateError.message}`);
  }

  try {
    // Perform web search for company reputation
    const searchResults = await performWebSearch(companyName);
    
    // Analyze reputation with GPT
    const analysis = await analyzeCompanyReputation(companyName, searchResults);
    
    // Update company with analysis results
    const { error: saveError } = await supabase
      .from('clean_launch_targets')
      .update({ 
        risk_score: analysis.riskScore,
        risk_category: analysis.riskCategory,
        scan_status: 'scanned',
        last_scanned: new Date().toISOString()
      })
      .eq('company_number', companyNumber);

    if (saveError) {
      throw new Error(`Error saving analysis results: ${saveError.message}`);
    }

    // If risk category is red, send alert
    if (analysis.riskCategory === 'red') {
      await sendAlert(companyName, companyNumber, analysis);
    }

    return {
      company_number: companyNumber,
      company_name: companyName,
      success: true,
      risk_score: analysis.riskScore,
      risk_category: analysis.riskCategory
    };
  } catch (error) {
    // Update status to failed
    await supabase
      .from('clean_launch_targets')
      .update({ 
        scan_status: 'failed',
        last_scanned: new Date().toISOString()
      })
      .eq('company_number', companyNumber);
    
    throw error;
  }
}

async function performWebSearch(companyName: string) {
  // Simulate web search results for demo purposes
  // In production, this would call a real search API
  console.log(`Searching for information about: ${companyName}`);
  
  return [
    {
      title: `About ${companyName}`,
      snippet: `${companyName} is a newly incorporated company in the UK.`
    },
    {
      title: `${companyName} Corporate Information`,
      snippet: `Information about ${companyName}'s structure and operations.`
    }
  ];
}

async function analyzeCompanyReputation(companyName: string, searchResults: any[]) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  
  console.log(`Analyzing reputation for ${companyName} with ${searchResults.length} search results`);
  
  // Prepare context from search results
  const searchContext = searchResults
    .map(result => `${result.title}: ${result.snippet}`)
    .join('\n\n');
  
  // Create prompt for GPT
  const prompt = `
    You are A.R.I.A™, an AI that analyzes reputation risk for new companies.
    
    Company Name: ${companyName}
    
    Search Results:
    ${searchContext}
    
    Based on this information, assess the reputation risk for this company.
    Assign a risk score from 0-100 (higher = more risk) and a risk category (green, yellow, or red).
    
    For demonstration purposes, randomly assign a risk score and category to simulate real analysis.
    
    Return JSON only in this format:
    {
      "riskScore": number,
      "riskCategory": "green"|"yellow"|"red",
      "analysis": "brief explanation of your reasoning"
    }
  `;
  
  try {
    // For demo purposes, simulate GPT response with random values
    // In production, this would call the OpenAI API
    const riskScore = Math.floor(Math.random() * 100);
    let riskCategory;
    
    if (riskScore < 30) {
      riskCategory = "green";
    } else if (riskScore < 70) {
      riskCategory = "yellow";
    } else {
      riskCategory = "red";
    }
    
    return {
      riskScore,
      riskCategory,
      analysis: `Analyzed reputation for ${companyName} based on available information.`
    };
    
    // Production code would call OpenAI API:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI that analyzes company reputation risk. Return JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content;
    
    if (!resultText) {
      throw new Error("Empty response from GPT");
    }
    
    return JSON.parse(resultText);
    */
  } catch (error) {
    console.error("Error in reputation analysis:", error);
    throw new Error(`Reputation analysis failed: ${error.message}`);
  }
}

async function sendAlert(companyName: string, companyNumber: string, analysis: any) {
  console.log(`🚨 Sending alert for high-risk company: ${companyName} (${companyNumber})`);
  console.log(`Risk score: ${analysis.riskScore}, Category: ${analysis.riskCategory}`);
  
  // In production, this would send to Slack or email
  // For now, we just log it
  
  return true;
}
