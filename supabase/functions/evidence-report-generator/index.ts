
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvidenceReportRequest {
  threat_id: string;
  entity_name: string;
  entity_type: string;
  platform: string;
  content: string;
  threat_level: number;
  source_url: string;
  include_screenshot?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: EvidenceReportRequest = await req.json();
    
    console.log('Generating evidence report for:', request.entity_name);

    // Generate HTML report content
    const reportHtml = generateReportHtml(request);
    
    // In a real implementation, you would:
    // 1. Convert HTML to PDF using WeasyPrint or similar
    // 2. Store the PDF in Supabase Storage
    // 3. Return the public URL
    
    // For now, we'll return a mock report URL
    const reportUrl = `https://aria-reports.example.com/evidence-report-${request.threat_id}.pdf`;
    
    return new Response(JSON.stringify({
      success: true,
      report_url: reportUrl,
      report_id: `evidence-${request.threat_id}`,
      entity_name: request.entity_name,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Evidence report generation error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateReportHtml(request: EvidenceReportRequest): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>ARIA Intelligence Evidence Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .threat-level-high { color: #dc2626; font-weight: bold; }
        .threat-level-medium { color: #ea580c; font-weight: bold; }
        .threat-level-low { color: #16a34a; font-weight: bold; }
        .section { margin: 30px 0; }
        .evidence-box { background: #f9fafb; border: 1px solid #d1d5db; padding: 15px; margin: 10px 0; }
        .recommendation { background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">ARIA™ INTELLIGENCE</div>
        <h1>Evidence Report</h1>
        <p>Generated on ${currentDate}</p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p><strong>Entity:</strong> ${request.entity_name}</p>
        <p><strong>Entity Type:</strong> ${request.entity_type}</p>
        <p><strong>Threat Level:</strong> <span class="threat-level-${request.threat_level >= 8 ? 'high' : request.threat_level >= 6 ? 'medium' : 'low'}">${request.threat_level}/10</span></p>
        <p><strong>Platform:</strong> ${request.platform}</p>
        <p><strong>Detection Date:</strong> ${currentDate}</p>
    </div>

    <div class="section">
        <h2>Threat Evidence</h2>
        <div class="evidence-box">
            <h3>Original Content</h3>
            <p>${request.content}</p>
            <p><strong>Source:</strong> <a href="${request.source_url}">${request.source_url}</a></p>
        </div>
    </div>

    <div class="section">
        <h2>Risk Assessment</h2>
        <p>This threat has been classified as <strong>${request.threat_level >= 8 ? 'HIGH PRIORITY' : request.threat_level >= 6 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY'}</strong> based on:</p>
        <ul>
            <li>Content sentiment analysis</li>
            <li>Platform reach and influence</li>
            <li>Potential for viral spread</li>
            <li>Historical threat patterns</li>
        </ul>
    </div>

    <div class="section">
        <h2>Recommended Actions</h2>
        <div class="recommendation">
            ${generateRecommendations(request.threat_level)}
        </div>
    </div>

    <div class="section">
        <h2>Contact Information</h2>
        <p>For immediate assistance or questions regarding this report:</p>
        <p><strong>ARIA Intelligence Team</strong><br>
        Email: crisis@aria-intelligence.com<br>
        Phone: 1-800-ARIA-911<br>
        Available 24/7 for emergency response</p>
    </div>
</body>
</html>`;
}

function generateRecommendations(threatLevel: number): string {
  if (threatLevel >= 8) {
    return `
      <h3>IMMEDIATE ACTION REQUIRED</h3>
      <ul>
        <li>Contact legal team within 2 hours</li>
        <li>Prepare crisis communication strategy</li>
        <li>Monitor for content spread across platforms</li>
        <li>Consider emergency PR response</li>
        <li>Implement 24/7 monitoring</li>
      </ul>
    `;
  } else if (threatLevel >= 6) {
    return `
      <h3>HIGH PRIORITY RESPONSE</h3>
      <ul>
        <li>Review threat within 24 hours</li>
        <li>Assess need for public response</li>
        <li>Monitor spread and engagement</li>
        <li>Prepare counter-narrative if necessary</li>
        <li>Consider direct outreach to source</li>
      </ul>
    `;
  } else {
    return `
      <h3>STANDARD MONITORING</h3>
      <ul>
        <li>Continue routine monitoring</li>
        <li>Track sentiment trends</li>
        <li>Document for pattern analysis</li>
        <li>Review weekly for escalation</li>
      </ul>
    `;
  }
}
