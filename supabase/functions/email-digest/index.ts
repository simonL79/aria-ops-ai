
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import { Resend } from "npm:resend@1.0.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const EMAIL_TO = Deno.env.get('EMAIL_TO') || 'simon@ariaops.co.uk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Initialize Resend for email delivery
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }
    const resend = new Resend(RESEND_API_KEY);
    
    // Parse request body or use defaults
    const { sinceDays = 1 } = await req.json().catch(() => ({
      sinceDays: 1
    }));
    
    // Calculate date range - default to last 24 hours
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);
    const sinceISOString = since.toISOString();
    
    console.log(`Generating email digest for companies since ${sinceISOString}`);
    
    // Query processed companies from the last period
    const { data: recentCompanies, error } = await supabase
      .from('clean_launch_dashboard')
      .select('*')
      .gte('date_of_incorporation', sinceISOString)
      .order('risk_score', { ascending: false })
      .limit(50);
    
    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }

    // Group companies by risk category for the digest
    const greenCompanies = recentCompanies?.filter(c => c.risk_category === 'green') || [];
    const yellowCompanies = recentCompanies?.filter(c => c.risk_category === 'yellow') || [];
    const redCompanies = recentCompanies?.filter(c => c.risk_category === 'red') || [];
    
    console.log(`Companies found: ${recentCompanies?.length || 0} total, ${redCompanies.length} red, ${yellowCompanies.length} yellow, ${greenCompanies.length} green`);
    
    // Format the email digest content
    const digestContent = formatEmailDigest(recentCompanies || [], since);
    
    // Send the email via Resend
    const emailResult = await resend.emails.send({
      from: 'A.R.I.A™ Clean Launch <notifications@aria-cleanlaunch.com>',
      to: [EMAIL_TO],
      subject: `🛡️ A.R.I.A™ Daily Clean Launch Digest - ${new Date().toISOString().split('T')[0]}`,
      html: digestContent,
    });
    
    console.log('Email digest sent:', emailResult);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email digest sent to ${EMAIL_TO}`,
        companiesProcessed: recentCompanies?.length || 0,
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

function formatEmailDigest(companies: any[], since: Date): string {
  // Create HTML email content
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; margin-bottom: 20px; }
      .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .risk-red { color: #e53e3e; }
      .risk-yellow { color: #dd6b20; }
      .risk-green { color: #38a169; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #f2f2f2; }
      .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🛡️ A.R.I.A™ Clean Launch Daily Digest</h1>
        <p>Date: ${new Date().toISOString().split('T')[0]}</p>
      </div>
      
      <div class="summary">
        <h2>Summary</h2>
        <p>Companies processed since ${since.toISOString().split('T')[0]}: <strong>${companies.length}</strong></p>
        <p>
          <span class="risk-red">⚠️ Red Risk: ${companies.filter(c => c.risk_category === 'red').length}</span> | 
          <span class="risk-yellow">⚠️ Yellow Risk: ${companies.filter(c => c.risk_category === 'yellow').length}</span> | 
          <span class="risk-green">✅ Green: ${companies.filter(c => c.risk_category === 'green').length}</span>
        </p>
      </div>`;
  
  // Red risk companies table
  const redCompanies = companies.filter(c => c.risk_category === 'red');
  if (redCompanies.length > 0) {
    html += `
      <h2 class="risk-red">⚠️ High Risk Companies</h2>
      <table>
        <tr>
          <th>Company</th>
          <th>Risk Score</th>
          <th>Incorporation Date</th>
        </tr>`;
        
    redCompanies.forEach(company => {
      html += `
        <tr>
          <td>${company.company_name}</td>
          <td>${company.risk_score}/100</td>
          <td>${new Date(company.date_of_incorporation).toLocaleDateString()}</td>
        </tr>`;
    });
        
    html += `</table>`;
  }
  
  // Yellow risk companies table
  const yellowCompanies = companies.filter(c => c.risk_category === 'yellow');
  if (yellowCompanies.length > 0) {
    html += `
      <h2 class="risk-yellow">⚠️ Medium Risk Companies</h2>
      <table>
        <tr>
          <th>Company</th>
          <th>Risk Score</th>
          <th>Incorporation Date</th>
        </tr>`;
        
    yellowCompanies.forEach(company => {
      html += `
        <tr>
          <td>${company.company_name}</td>
          <td>${company.risk_score}/100</td>
          <td>${new Date(company.date_of_incorporation).toLocaleDateString()}</td>
        </tr>`;
    });
        
    html += `</table>`;
  }
  
  // Green companies table
  const greenCompanies = companies.filter(c => c.risk_category === 'green');
  if (greenCompanies.length > 0) {
    html += `
      <h2 class="risk-green">✅ Low Risk Companies</h2>
      <table>
        <tr>
          <th>Company</th>
          <th>Risk Score</th>
          <th>Incorporation Date</th>
        </tr>`;
        
    greenCompanies.forEach(company => {
      html += `
        <tr>
          <td>${company.company_name}</td>
          <td>${company.risk_score}/100</td>
          <td>${new Date(company.date_of_incorporation).toLocaleDateString()}</td>
        </tr>`;
    });
        
    html += `</table>`;
  }
  
  // Footer
  html += `
      <div class="footer">
        <p>This digest was automatically generated by A.R.I.A™ Clean Launch.</p>
        <p>© ${new Date().getFullYear()} A.R.I.A™ Reputation Intelligence</p>
      </div>
    </div>
  </body>
  </html>`;
  
  return html;
}
