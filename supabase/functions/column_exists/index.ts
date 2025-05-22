
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
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
    const { p_table_name, p_column_name } = await req.json();

    if (!p_table_name || !p_column_name) {
      return new Response(
        JSON.stringify({ error: "Missing table_name or column_name" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the column exists in the specified table
    const { data, error } = await supabase
      .rpc('column_exists', { 
        p_table_name, 
        p_column_name 
      });

    if (error) {
      // If RPC fails, try to use direct SQL
      console.error("RPC failed, falling back to direct SQL check:", error);
      
      // Connect to the database
      const databaseUrl = Deno.env.get("DATABASE_URL") as string;
      const pool = new Pool(databaseUrl, 1, true);
      
      try {
        const connection = await pool.connect();
        try {
          // Safely check if the column exists
          const result = await connection.queryObject`
            SELECT EXISTS (
              SELECT 1 
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
                AND table_name = ${p_table_name} 
                AND column_name = ${p_column_name}
            ) as exists
          `;
          
          const exists = result.rows[0]?.exists || false;
          
          return new Response(
            JSON.stringify(exists),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } finally {
          connection.release();
        }
      } catch (sqlError) {
        console.error("SQL error:", sqlError);
        return new Response(
          JSON.stringify({ error: "Failed to check column existence", details: sqlError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } finally {
        await pool.end();
      }
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error checking column existence:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
