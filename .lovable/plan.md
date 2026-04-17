

# EIDETIC™ Full Transformation — Build Plan (6 Tiers)

Sequential, each tier independently shippable. All AI work routed through Lovable AI Gateway (default `google/gemini-2.5-flash`, free during promo).

---

## Tier 1 — Semantic Memory Foundation

**Goal:** Give every memory a vector embedding for semantic recall + de-duplication.

**DB migration (additive only):**
- Enable `vector` extension
- Add to `memory_footprints`: `embedding vector(1536)`, `narrative_summary text`, `content_hash text`, `cluster_id uuid`
- New table `memory_clusters` (id, entity_name, narrative_theme, centroid_embedding, footprint_count, created_at)
- HNSW index on embedding column

**Edge function:** `eidetic-embed`
- Input: footprint_id(s) — fetches content, calls Lovable AI `text-embedding-3-small`, writes embedding + summary + hash, assigns/creates cluster via cosine similarity (>0.85 = same cluster)
- `requireAdmin` guard, generic errors

**UI:** New "Semantic Search" input on EideticDashboard — vector search via RPC `match_memories(query_embedding, threshold, count)`.

---

## Tier 2 — AI-Powered Scoring

**Goal:** Replace static scores with model-judged dimensions.

**DB migration:**
- Add to `memory_footprints`: `sentiment_trajectory jsonb`, `narrative_category text`, `threat_persistence_30d/90d/365d numeric`, `authority_weight numeric`, `ai_scored_at timestamptz`

**Edge function:** Rewrite `enhanced-intelligence` scoring path (or new `eidetic-ai-score`)
- Uses Lovable AI tool-calling (structured output) to extract all dimensions in one call per footprint
- Batch-processes active footprints

**UI:** Footprint cards show category badge, persistence forecast bars, authority weight, sentiment trend sparkline.

---

## Tier 3 — Autonomous Recalibration Loop

**Goal:** Self-running memory hygiene.

**Setup:**
- Enable `pg_cron` + `pg_net` extensions
- New edge function `eidetic-autopilot` (every 6h):
  - Pull active footprints due for re-check
  - Re-fetch URL → re-embed → re-score → detect changes
  - Write run summary to `memory_recalibrators`
- Cron schedule via SQL (per skill template)

**UI:** "Autopilot" status panel — last run, next run, footprints processed, anomalies surfaced.

---

## Tier 4 — Resurfacing Detection + Alerts

**Goal:** Catch dead memories coming back to life.

**DB migration:**
- New table `memory_resurfacing_events` (id, footprint_id, entity_name, prior_decay_score, new_velocity_score, resurface_vector, detected_at, alert_sent)

**Logic:** Inside `eidetic-autopilot` — if footprint with decay >0.7 suddenly shows velocity spike, write event + trigger transactional email via existing `notify.ariaops.co.uk` pipeline.

**UI:** New "Resurfacing Alerts" tab + red-pulse indicator on dashboard header.

---

## Tier 5 — Visualization Upgrade

**Goal:** Operator-grade memory intelligence views.

Three new tabs in `EideticDashboard` (recharts + react-force-graph for the graph):
- **Memory Graph** — force-directed cluster graph, node size = footprint count, edge thickness = embedding similarity, color = narrative category
- **Decay Timeline** — stacked area chart over time, per-entity volume + average decay
- **Narrative Map** — grouped cards by AI category with drill-in

All match dark/orange aesthetic (#000000 / #F97316), glassmorphism.

---

## Tier 6 — Cross-System Integration

**Goal:** EIDETIC becomes a force multiplier across A.R.I.A.

Hooks (small additions, no rewrites):
- **→ Requiem**: high-decay negative memories → push to Requiem suppression queue (existing table)
- **→ RSI / Persona Saturation**: persistent threats (persistence_90d > 0.7) → flag for RSI campaign
- **→ Legal Ops**: GDPR-eligible memories (EU source + personal data category) → auto-create `data_subject_requests` draft
- **→ Public Threat Score**: aggregate live memory load contributes to homepage score
- **→ Anubis**: register `eidetic-autopilot` as a validated Anubis background job

Each hook is one edge function call or one DB insert from `eidetic-autopilot`.

---

## Build Order & Sequencing

```text
Tier 1 (foundation) → Tier 2 (intelligence) → Tier 3 (autopilot)
   → Tier 4 (alerts) → Tier 5 (visualization) → Tier 6 (integration)
```

I'll ship one tier per turn, each fully working before moving on.

## Technical Notes

- All migrations strictly additive (per Data Integrity rule)
- All edge functions use `npm:` specifier, `requireAdmin`, generic errors
- AI calls via Lovable AI Gateway only — no direct OpenAI/Google calls
- Supabase types use `as any` casting where needed
- pgvector with HNSW for sub-100ms semantic search at scale
- Cron job uses `pg_cron` + `pg_net` per Lovable scheduled-functions skill

## Manual Step (informational, non-blocking)

After Tier 3 ships you'll need to enable the cron job by running the provided SQL snippet in the SQL editor — I'll provide the exact SQL.

## Ready to Execute

On approval I'll start with **Tier 1**: pgvector migration + `eidetic-embed` edge function + Semantic Search UI.

