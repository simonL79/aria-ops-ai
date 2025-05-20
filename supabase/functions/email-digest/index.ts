
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import { Resend } from "npm:resend@1.0.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailDigestRequest {
  recipients: string[];
  minRiskScore?: number;
  since?: string; // ISO date string
  clientName?: string;
}

interface ScrapingResult {
  id: string;
  entityName: string;
  category?: string;
  content: string;
  url?: string;
  timestamp: string;
  sentiment: number;
  riskScore?: number;
  aiAnalysis?: {
    summary?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Initialize Resend for email delivery
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }
    const resend = new Resend(RESEND_API_KEY);
    
    // Parse request body
    const { recipients, minRiskScore = 5, since, clientName = 'Your Company' }: EmailDigestRequest = await req.json();
    
    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided');
    }
    
    // Calculate default date range if not provided (last 24 hours)
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sinceISOString = sinceDate.toISOString();
    
    console.log(`Fetching results since ${sinceISOString} with risk score >= ${minRiskScore}`);
    
    // Query high-risk results from the database
    const { data: results, error } = await supabase
      .from('scraping_results') // This table would need to be created
      .select('*')
      .gte('timestamp', sinceISOString)
      .gte('riskScore', minRiskScore)
      .order('riskScore', { ascending: false })
      .limit(10);
    
    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }
    
    // For demo purposes, generate mock data if no results found
    const highRiskResults = results?.length ? results : generateMockResults();
    
    // Format the email digest content
    const digestContent = formatEmailDigest(highRiskResults, new Date().toISOString());
    
    // Send the email via Resend
    const emailResult = await resend.emails.send({
      from: `A.R.I.A™ <notifications@${clientName.toLowerCase().replace(/\s+/g, '-')}.com>`,
      to: recipients,
      subject: `🛡️ A.R.I.A™ Daily Reputation Risk Digest - ${new Date().toLocaleDateString()}`,
      text: digestContent,
    });
    
    console.log('Email digest sent:', emailResult);
    
    // Update notified status for these results (in a real implementation)
    // This would mark these results as having been included in a notification
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email digest sent to ${recipients.length} recipients`,
        emailId: emailResult.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
    
  } catch (error) {
    console.error('Error generating or sending email digest:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

function formatEmailDigest(results: ScrapingResult[], date: string): string {
  // Create the email header
  let digest = `🛡️ A.R.I.A™ Daily Reputation Risk Digest\n`;
  digest += `Date: ${new Date(date).toISOString().split('T')[0]}\n\n`;
  digest += `Flagged Mentions:\n\n`;
  
  // Add each high-risk result
  results.forEach((result) => {
    const sentimentText = result.sentiment < -0.5 ? 'Negative' :
                         result.sentiment > 0.5 ? 'Positive' : 'Neutral';
    const riskLevel = result.riskScore && result.riskScore >= 8 ? 'High' :
                    result.riskScore && result.riskScore >= 5 ? 'Medium' : 'Low';
    
    digest += `🔸 ${result.entityName}\n`;
    digest += `    📅 Published: ${new Date(result.timestamp).toISOString().split('T')[0]}\n`;
    
    if (result.url) {
      digest += `    🔗 ${result.url}\n`;
    }
    
    digest += `    📊 Sentiment: ${sentimentText}. Risk: ${riskLevel}. Classification: ${result.category || 'Unclassified'}.\n`;
    digest += `    Summary: ${result.aiAnalysis?.summary || result.content.substring(0, 150).trim() + '...'}\n\n`;
  });
  
  // Add footer
  digest += `\n--- \nThis digest was automatically generated by A.R.I.A™ Reputation Intelligence.\n`;
  digest += `To modify your notification settings, visit your dashboard.`;
  
  return digest;
}

function generateMockResults(): ScrapingResult[] {
  return [
    {
      id: '1',
      entityName: 'Former CEO Faces Backlash Over Old Tweets',
      category: 'Controversy',
      content: 'The article discusses past controversial tweets by the former CEO, resurfaced amid a new product launch.',
      url: 'https://example.com/article1',
      timestamp: new Date().toISOString(),
      sentiment: -0.8,
      riskScore: 8.5,
      aiAnalysis: {
        summary: 'The article discusses past controversial tweets by the former CEO, resurfaced amid a new product launch.'
      }
    },
    {
      id: '2',
      entityName: 'Brand Criticized for Customer Service Failures',
      category: 'Complaint',
      content: 'Several customers reported unresolved issues on public forums, prompting negative buzz.',
      url: 'https://example.com/article2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sentiment: -0.6,
      riskScore: 6.2,
      aiAnalysis: {
        summary: 'Several customers reported unresolved issues on public forums, prompting negative buzz.'
      }
    }
  ];
}
