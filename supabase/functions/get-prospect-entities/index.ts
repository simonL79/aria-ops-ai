
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth guard
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching prospect entities from database...');

    // Only return real data from the database - no mock data
    const { data, error } = await supabase
      .from('prospect_entities')
      .select('*')
      .order('sales_opportunity_score', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Return empty array if no data - never return mock data
    const prospectData = data || [];
    
    console.log(`Returning ${prospectData.length} real prospect entities`);

    return new Response(JSON.stringify(prospectData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching prospect entities:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
