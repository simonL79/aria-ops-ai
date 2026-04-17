import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const EMBED_MODEL = 'openai/text-embedding-3-small';
const CHAT_MODEL = 'google/gemini-2.5-flash';
const CLUSTER_THRESHOLD = 0.85;

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fetchContent(url: string): Promise<string> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'ARIA-EIDETIC/1.0' } });
    if (!r.ok) return '';
    const html = await r.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);
  } catch {
    return '';
  }
}

async function embed(text: string): Promise<number[]> {
  const r = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: text.slice(0, 8000) }),
  });
  if (!r.ok) throw new Error(`embed failed: ${r.status}`);
  const j = await r.json();
  return j.data[0].embedding;
}

async function summarize(text: string): Promise<string> {
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: 'Summarize the digital memory in 1-2 sentences focused on the narrative theme. No preamble.' },
        { role: 'user', content: text.slice(0, 4000) },
      ],
    }),
  });
  if (!r.ok) return '';
  const j = await r.json();
  return j.choices?.[0]?.message?.content?.trim() ?? '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const auth = await requireAdmin(req);
  if (!isAuthenticated(auth)) return auth;

  try {
    const { footprint_ids, all_unembedded } = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let query = supabase.from('memory_footprints').select('*');
    if (footprint_ids?.length) {
      query = query.in('id', footprint_ids);
    } else if (all_unembedded) {
      query = query.is('embedding', null).limit(50);
    } else {
      return new Response(JSON.stringify({ error: 'footprint_ids or all_unembedded required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: footprints, error } = await query;
    if (error) throw error;

    const results: any[] = [];

    for (const fp of (footprints ?? [])) {
      try {
        const url = (fp as any).content_url;
        const ctx = (fp as any).memory_context ?? '';
        const text = url ? await fetchContent(url) : '';
        const corpus = `${ctx}\n\n${text}`.trim();
        if (!corpus) { results.push({ id: fp.id, skipped: 'no_content' }); continue; }

        const hash = await sha256(corpus);
        const [embedding, narrative_summary] = await Promise.all([embed(corpus), summarize(corpus)]);

        // Find existing cluster via centroid similarity
        const { data: matches } = await supabase.rpc('match_memories' as any, {
          query_embedding: embedding as any,
          match_threshold: CLUSTER_THRESHOLD,
          match_count: 1,
        });
        let cluster_id = (matches as any)?.[0]?.cluster_id ?? null;

        if (!cluster_id) {
          const { data: newCluster } = await (supabase.from('memory_clusters') as any).insert({
            entity_name: null,
            narrative_theme: narrative_summary?.slice(0, 120) ?? null,
            centroid_embedding: embedding,
            footprint_count: 1,
          }).select('id').single();
          cluster_id = newCluster?.id ?? null;
        } else {
          await (supabase.from('memory_clusters') as any)
            .update({ footprint_count: ((matches as any)[0].footprint_count ?? 0) + 1 })
            .eq('id', cluster_id);
        }

        await (supabase.from('memory_footprints') as any).update({
          embedding,
          narrative_summary,
          content_hash: hash,
          cluster_id,
          embedded_at: new Date().toISOString(),
        }).eq('id', fp.id);

        results.push({ id: fp.id, cluster_id, ok: true });
      } catch (e) {
        console.error('fp error', fp.id, e);
        results.push({ id: fp.id, error: 'failed' });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('eidetic-embed error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
