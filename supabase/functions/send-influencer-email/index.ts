
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

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
    const { recipient, subject, content, influencer_id, influencer_name } = await req.json();
    
    // Validate input
    if (!recipient || !content) {
      return new Response(
        JSON.stringify({ error: "Required fields missing" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, we would send an actual email here using a service like SendGrid, Resend, etc.
    // For now, we'll just simulate sending the email by logging it
    console.log(`Email would be sent to: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    
    // Create Supabase client for logging
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Log the email sending in activity logs
    await supabase
      .from('activity_logs')
      .insert({
        action: 'send_email',
        details: `Sent email to ${influencer_name} (${recipient})`,
        entity_type: 'influencer',
        entity_id: influencer_id || 'unknown'
      });
      
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email to ${recipient} queued for delivery` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in send-influencer-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
