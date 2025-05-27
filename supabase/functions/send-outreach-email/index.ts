
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OutreachEmailRequest {
  threat_id: string;
  entity_name: string;
  subject: string;
  message: string;
  template_type: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: OutreachEmailRequest = await req.json();
    
    console.log('Sending outreach email for:', request.entity_name);

    // In a real implementation, you would:
    // 1. Use Resend or similar email service to send the email
    // 2. Attach the evidence report PDF
    // 3. Track email opens/clicks
    // 4. Store outreach record in database

    // Log the outreach attempt
    await supabase.from('activity_logs').insert({
      action: 'outreach_email_sent',
      entity_type: 'threat',
      entity_id: request.threat_id,
      details: `Outreach email sent for ${request.entity_name} using ${request.template_type} template`
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify({
      success: true,
      message_id: `outreach-${request.threat_id}-${Date.now()}`,
      entity_name: request.entity_name,
      template_used: request.template_type,
      sent_at: new Date().toISOString(),
      status: 'queued_for_delivery'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Outreach email error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
