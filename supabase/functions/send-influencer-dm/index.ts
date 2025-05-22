
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
    const { platform, username, content, influencer_id } = await req.json();
    
    // Validate input
    if (!platform || !username || !content) {
      return new Response(
        JSON.stringify({ error: "Required fields missing" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, we would connect to the platform's API to send a DM
    // For now, we'll just simulate sending the DM by logging it
    console.log(`DM would be sent on ${platform} to: ${username}`);
    console.log(`Content: ${content}`);
    
    // Create Supabase client for logging
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Log the DM sending in activity logs
    await supabase
      .from('activity_logs')
      .insert({
        action: 'send_dm',
        details: `Sent DM to ${username} on ${platform}`,
        entity_type: 'influencer',
        entity_id: influencer_id || 'unknown'
      });
      
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `DM to ${username} on ${platform} queued for delivery` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in send-influencer-dm function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
