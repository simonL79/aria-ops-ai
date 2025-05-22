
// Supabase Edge Function to check if a column exists in a table
// This avoids direct access to information_schema which is restricted in the client

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { p_table_name, p_column_name } = await req.json()
    
    // Get database connection string from environment variable
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // Initialize Supabase client with service role key for direct database access
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Execute SQL query to check if column exists in table
    const { data, error } = await supabase.rpc('column_exists', {
      p_table_name,
      p_column_name
    })

    if (error) throw error

    return new Response(JSON.stringify({ exists: Boolean(data) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
