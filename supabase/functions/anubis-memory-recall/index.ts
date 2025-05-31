
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity_id, entity_name } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    console.log('Recalling Anubis memory for:', { entity_id, entity_name });

    let query = supabase
      .from('anubis_entity_memory')
      .select('*')
      .order('last_seen', { ascending: false })

    if (entity_id) {
      query = query.eq('entity_id', entity_id)
    } else if (entity_name) {
      query = query.ilike('entity_name', `%${entity_name}%`)
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error('Error recalling memory:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${data?.length || 0} memory entries`);
    return new Response(JSON.stringify({ memory: data, count: data?.length || 0 }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
