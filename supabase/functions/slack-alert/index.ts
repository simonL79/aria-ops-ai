
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  companyName: string;
  companyNumber?: string;
  riskScore: number;
  riskCategory: string;
  analysis?: string;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Slack webhook URL is configured
    if (!SLACK_WEBHOOK_URL) {
      throw new Error("Slack webhook URL not configured");
    }

    // Parse the alert payload
    const payload: AlertPayload = await req.json();
    
    // Validate required fields
    if (!payload.companyName || !payload.riskScore || !payload.riskCategory) {
      throw new Error("Missing required fields in alert payload");
    }
    
    // Format Slack message
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚨 A.R.I.A™ RISK ALERT",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Company:* ${payload.companyName}`
            },
            {
              type: "mrkdwn",
              text: `*Risk Category:* ${payload.riskCategory.toUpperCase()}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Risk Score:* ${payload.riskScore}/100`
            },
            {
              type: "mrkdwn",
              text: `*Date:* ${payload.timestamp || new Date().toISOString()}`
            }
          ]
        }
      ]
    };
    
    // Add analysis if provided
    if (payload.analysis) {
      message.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Analysis:* ${payload.analysis}`
        }
      });
    }
    
    // Add company number if provided
    if (payload.companyNumber) {
      message.blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Company Number:* ${payload.companyNumber}`
          }
        ]
      });
    }
    
    // Send alert to Slack
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send Slack alert: ${response.status} - ${errorText}`);
    }
    
    console.log("Slack alert sent successfully");
    
    return new Response(
      JSON.stringify({ success: true, message: "Alert sent to Slack" }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error("Error sending Slack alert:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
