import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MODEL = 'google/gemini-2.5-flash';
const RECHECK_HOURS = 6;
const BATCH = 30;

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
  } catch { return ''; }
}

async function embed(text: string): Promise<number[] | null> {
  try {
    const r = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai/text-embedding-3-small', input: text.slice(0, 8000) }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.data[0].embedding;
  } catch { return null; }
}

const SCORING_TOOL = {
  type: 'function',
  function: {
    name: 'score_memory',
    description: 'Score a digital memory.',
    parameters: {
      type: 'object',
      properties: {
        narrative_category: { type: 'string', enum: ['financial','personal','legal','operational','reputational','political','other'] },
        sentiment_score: { type: 'number' },
        sentiment_label: { type: 'string', enum: ['very_negative','negative','neutral','positive','very_positive'] },
        threat_persistence_30d: { type: 'number' },
        threat_persistence_90d: { type: 'number' },
        threat_persistence_365d: { type: 'number' },
        authority_weight: { type: 'number' },
        decay_score: { type: 'number', description: '0-1; 0=fresh/active, 1=fully faded' },
      },
      required: ['narrative_category','sentiment_score','sentiment_label','threat_persistence_30d','threat_persistence_90d','threat_persistence_365d','authority_weight','decay_score'],
      additionalProperties: false,
    },
  },
};

async function score(text: string, url: string | null) {
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'Score the memory with the score_memory tool. Be precise.' },
        { role: 'user', content: `URL: ${url ?? 'n/a'}\n\n${text.slice(0, 4000)}` },
      ],
      tools: [SCORING_TOOL],
      tool_choice: { type: 'function', function: { name: 'score_memory' } },
    }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  return args ? JSON.parse(args) : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  // Cron-callable: no auth required, but rate-limit by checking a recent run exists is not necessary here
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: run, error: runErr } = await (supabase.from('eidetic_autopilot_runs') as any)
    .insert({ status: 'running' })
    .select('id')
    .single();
  if (runErr) {
    console.error(runErr);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const runId = run.id;

  let processed = 0, changed = 0, anomalies = 0;
  let errorMessage: string | null = null;

  try {
    const cutoff = new Date(Date.now() - RECHECK_HOURS * 3600 * 1000).toISOString();

    const { data: footprints } = await supabase
      .from('memory_footprints')
      .select('*')
      .eq('is_active', true)
      .or(`last_autopilot_at.is.null,last_autopilot_at.lt.${cutoff}`)
      .limit(BATCH);

    for (const fp of (footprints ?? [])) {
      try {
        const url = (fp as any).content_url;
        const ctx = (fp as any).memory_context ?? '';
        const text = url ? await fetchContent(url) : ctx;
        if (!text) continue;

        const newHash = await sha256(text);
        const oldHash = (fp as any).content_hash;
        const contentChanged = newHash !== oldHash;

        const updates: any = { last_autopilot_at: new Date().toISOString() };

        if (contentChanged) {
          const emb = await embed(text);
          if (emb) {
            updates.embedding = emb;
            updates.content_hash = newHash;
            updates.embedded_at = new Date().toISOString();
          }
          changed += 1;
        }

        const scored = await score(text, url);
        if (scored) {
          const prevTraj = Array.isArray((fp as any).sentiment_trajectory) ? (fp as any).sentiment_trajectory : [];
          const prevDecay = Number((fp as any).decay_score ?? 0);

          updates.narrative_category = scored.narrative_category;
          updates.threat_persistence_30d = scored.threat_persistence_30d;
          updates.threat_persistence_90d = scored.threat_persistence_90d;
          updates.threat_persistence_365d = scored.threat_persistence_365d;
          updates.authority_weight = scored.authority_weight;
          updates.decay_score = scored.decay_score;
          updates.ai_scored_at = new Date().toISOString();
          updates.sentiment_trajectory = [
            ...prevTraj.slice(-9),
            { t: new Date().toISOString(), s: scored.sentiment_score, label: scored.sentiment_label },
          ];

          // Anomaly: was decayed, now fresh again
          if (prevDecay > 0.7 && scored.decay_score < 0.4) {
            anomalies += 1;
          }
        }

        await (supabase.from('memory_footprints') as any).update(updates).eq('id', fp.id);

        await (supabase.from('memory_recalibrators') as any).insert({
          footprint_id: fp.id,
          recalibration_type: contentChanged ? 'autopilot_content_drift' : 'autopilot_rescore',
          content_excerpt: text.slice(0, 280),
          effectiveness_score: scored?.decay_score ?? null,
        });

        processed += 1;
      } catch (e) {
        console.error('autopilot fp error', fp.id, e);
      }
    }

    await (supabase.from('eidetic_autopilot_runs') as any).update({
      completed_at: new Date().toISOString(),
      footprints_processed: processed,
      footprints_changed: changed,
      anomalies_detected: anomalies,
      status: 'completed',
    }).eq('id', runId);

    return new Response(JSON.stringify({ runId, processed, changed, anomalies }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'unknown';
    console.error('autopilot error', e);
    await (supabase.from('eidetic_autopilot_runs') as any).update({
      completed_at: new Date().toISOString(),
      status: 'failed',
      error_message: errorMessage,
      footprints_processed: processed,
      footprints_changed: changed,
      anomalies_detected: anomalies,
    }).eq('id', runId);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
