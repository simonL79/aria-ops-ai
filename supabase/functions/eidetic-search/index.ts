import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const auth = await requireAdmin(req);
  if (!isAuthenticated(auth)) return auth;

  try {
    const { query, threshold = 0.6, count = 20 } = await req.json();
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'query required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const embedRes = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai/text-embedding-3-small', input: query.slice(0, 8000) }),
    });

    if (embedRes.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limited, try again shortly' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (embedRes.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!embedRes.ok) throw new Error('embed failed');

    const embedJson = await embedRes.json();
    const embedding = embedJson.data[0].embedding;

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: matches, error } = await supabase.rpc('match_memories' as any, {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: count,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ matches: matches ?? [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('eidetic-search error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
