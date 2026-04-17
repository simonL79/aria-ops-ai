import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
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
  if (!OPENAI_API_KEY) { console.warn('embed skipped: no OPENAI_API_KEY'); return null; }
  try {
    const r = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
    });
    if (!r.ok) { console.error('embed failed', r.status, await r.text().catch(()=>'')); return null; }
    const j = await r.json();
    return j.data[0].embedding;
  } catch (e) { console.error('embed exception', e); return null; }
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

function severityFromDelta(delta: number): 'low'|'medium'|'high'|'critical' {
  const a = Math.abs(delta);
  if (a >= 0.6) return 'critical';
  if (a >= 0.4) return 'high';
  if (a >= 0.2) return 'medium';
  return 'low';
}

async function emitEvent(supabase: any, payload: any) {
  try {
    const { data: ev } = await supabase
      .from('eidetic_resurfacing_events')
      .insert(payload)
      .select('id, severity')
      .single();

    if (ev) {
      // Mirror to aria_notifications for in-app feed
      await supabase.from('aria_notifications').insert({
        event_type: `eidetic_${payload.event_type}`,
        priority: payload.severity === 'critical' ? 'high' : payload.severity,
        summary: `${payload.event_type.replace('_',' ')}: ${payload.narrative_category ?? 'memory'} (${(payload.content_url ?? '').slice(0,80)})`,
        metadata: { event_id: ev.id, footprint_id: payload.footprint_id },
      });

      // Notify by email for high/critical
      if (ev.severity === 'high' || ev.severity === 'critical') {
        try {
          await fetch(`${SUPABASE_URL}/functions/v1/eidetic-notify-resurfacing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE}` },
            body: JSON.stringify({ event_id: ev.id }),
          });
        } catch (e) { console.error('notify dispatch failed', e); }
      }
    }
    return ev;
  } catch (e) {
    console.error('emitEvent failed', e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Optional: seed a footprint inline before the run (useful for E2E testing)
  let seededId: string | null = null;
  try {
    const body = await req.json().catch(() => ({}));
    if (body && typeof body === 'object' && body.seed_url) {
      const nowIso = new Date().toISOString();
      const { data: seeded } = await (supabase.from('memory_footprints') as any)
        .insert({
          content_url: body.seed_url,
          memory_context: body.seed_context ?? 'Seeded via autopilot inline seed.',
          memory_type: body.seed_type ?? 'test_seed',
          is_active: true,
          discovered_at: nowIso,
          first_seen: nowIso,
          last_seen: nowIso,
        })
        .select('id')
        .single();
      seededId = seeded?.id ?? null;
    }
  } catch (e) { console.warn('inline seed skipped', e); }

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

  let processed = 0, changed = 0, anomalies = 0, eventsEmitted = 0;
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
          const prevThreat30 = Number((fp as any).threat_persistence_30d ?? 0);
          const prevCategory = (fp as any).narrative_category as string | null;
          const wasNeverScored = !(fp as any).ai_scored_at;

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

          const baseEvent = {
            footprint_id: fp.id,
            narrative_category: scored.narrative_category,
            content_excerpt: text.slice(0, 280),
            content_url: url ?? null,
          };

          // 1. Decay reversal
          if (prevDecay > 0.7 && scored.decay_score < 0.4) {
            anomalies += 1;
            const delta = scored.decay_score - prevDecay;
            await emitEvent(supabase, {
              ...baseEvent,
              event_type: 'decay_reversal',
              severity: severityFromDelta(delta),
              prev_decay_score: prevDecay,
              new_decay_score: scored.decay_score,
              decay_delta: delta,
            });
            eventsEmitted += 1;
          }

          // 2. Threat spike
          const threatDelta = scored.threat_persistence_30d - prevThreat30;
          if (threatDelta > 0.3) {
            await emitEvent(supabase, {
              ...baseEvent,
              event_type: 'threat_spike',
              severity: severityFromDelta(threatDelta),
              prev_threat_30d: prevThreat30,
              new_threat_30d: scored.threat_persistence_30d,
              threat_delta: threatDelta,
            });
            eventsEmitted += 1;
          }

          // 3. Content drift with category change
          if (contentChanged && prevCategory && prevCategory !== scored.narrative_category) {
            await emitEvent(supabase, {
              ...baseEvent,
              event_type: 'content_drift',
              severity: 'medium',
              metadata: { prev_category: prevCategory, new_category: scored.narrative_category },
            });
            eventsEmitted += 1;
          }

          // 4. New high threat (first scoring)
          if (wasNeverScored && scored.threat_persistence_30d >= 0.7) {
            await emitEvent(supabase, {
              ...baseEvent,
              event_type: 'new_high_threat',
              severity: scored.threat_persistence_30d >= 0.85 ? 'critical' : 'high',
              new_threat_30d: scored.threat_persistence_30d,
            });
            eventsEmitted += 1;
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
      metadata: { events_emitted: eventsEmitted },
    }).eq('id', runId);

    return new Response(JSON.stringify({ runId, processed, changed, anomalies, eventsEmitted, seededId }), {
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
