import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MODEL = 'google/gemini-2.5-flash';

const SCORING_TOOL = {
  type: 'function',
  function: {
    name: 'score_memory',
    description: 'Score a digital memory across multiple reputation dimensions.',
    parameters: {
      type: 'object',
      properties: {
        narrative_category: {
          type: 'string',
          enum: ['financial', 'personal', 'legal', 'operational', 'reputational', 'political', 'other'],
        },
        sentiment: { type: 'string', enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'] },
        sentiment_score: { type: 'number', description: '-1.0 to 1.0' },
        threat_persistence_30d: { type: 'number', description: '0-1 likelihood resurfaces in 30d' },
        threat_persistence_90d: { type: 'number', description: '0-1 likelihood resurfaces in 90d' },
        threat_persistence_365d: { type: 'number', description: '0-1 likelihood resurfaces in 365d' },
        authority_weight: { type: 'number', description: '0-1 source authority (0=anon blog, 1=tier-1 outlet)' },
      },
      required: [
        'narrative_category', 'sentiment', 'sentiment_score',
        'threat_persistence_30d', 'threat_persistence_90d', 'threat_persistence_365d',
        'authority_weight',
      ],
      additionalProperties: false,
    },
  },
};

async function scoreOne(text: string, url: string | null) {
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a reputation intelligence analyst. Score the memory using the score_memory tool. Be precise and conservative.' },
        { role: 'user', content: `URL: ${url ?? 'n/a'}\n\nContent:\n${text.slice(0, 4000)}` },
      ],
      tools: [SCORING_TOOL],
      tool_choice: { type: 'function', function: { name: 'score_memory' } },
    }),
  });
  if (r.status === 429) throw new Error('rate_limited');
  if (r.status === 402) throw new Error('credits_exhausted');
  if (!r.ok) throw new Error(`score failed ${r.status}`);
  const j = await r.json();
  const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error('no tool call');
  return JSON.parse(args);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const auth = await requireAdmin(req);
  if (!isAuthenticated(auth)) return auth;

  try {
    const { footprint_ids, all_unscored, limit = 25 } = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let query = supabase.from('memory_footprints').select('*');
    if (footprint_ids?.length) {
      query = query.in('id', footprint_ids);
    } else if (all_unscored) {
      query = query.is('ai_scored_at', null).limit(limit);
    } else {
      return new Response(JSON.stringify({ error: 'footprint_ids or all_unscored required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: footprints, error } = await query;
    if (error) throw error;

    const results: any[] = [];
    for (const fp of (footprints ?? [])) {
      try {
        const text = (fp as any).narrative_summary
          ?? (fp as any).memory_context
          ?? '';
        if (!text) { results.push({ id: fp.id, skipped: 'no_text' }); continue; }

        const scored = await scoreOne(text, (fp as any).content_url);

        const prevTraj = Array.isArray((fp as any).sentiment_trajectory) ? (fp as any).sentiment_trajectory : [];
        const newTraj = [
          ...prevTraj.slice(-9),
          { t: new Date().toISOString(), s: scored.sentiment_score, label: scored.sentiment },
        ];

        await (supabase.from('memory_footprints') as any).update({
          narrative_category: scored.narrative_category,
          threat_persistence_30d: scored.threat_persistence_30d,
          threat_persistence_90d: scored.threat_persistence_90d,
          threat_persistence_365d: scored.threat_persistence_365d,
          authority_weight: scored.authority_weight,
          sentiment_trajectory: newTraj,
          ai_scored_at: new Date().toISOString(),
        }).eq('id', fp.id);

        results.push({ id: fp.id, ok: true, scored });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'failed';
        if (msg === 'rate_limited' || msg === 'credits_exhausted') {
          return new Response(JSON.stringify({ error: msg, processed: results.length }), {
            status: msg === 'rate_limited' ? 429 : 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        console.error('score error', fp.id, e);
        results.push({ id: fp.id, error: 'failed' });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('eidetic-ai-score error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
