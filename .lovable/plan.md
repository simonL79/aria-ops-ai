# A.R.I.A Ops Executive — Phase 0 & 1 Plan

Confirmed:
- **Archive, don't drop** legacy tables (rename to `_archived_<name>`)
- **SerpApi** as the search provider for Requiem (key added later)

---

## Phase 0 — Codebase & Database Pruning

### 0.1 Archive legacy tables (rename only — fully reversible)
Rename to `_archived_<name>`:
- **Anubis layer**: `anubis_entity_memory`, `anubis_pattern_log`
- **Eris layer**: `eris_attack_simulations`, `eris_response_strategies`
- **Graveyard**: `graveyard_simulations`
- **Sentience / experiments**: `sentience_*`, `narrative_clusters`, `multilingual_threats`, `llm_watchdog_*`, `recalibrator_*` (whichever exist)
- **Persona / RSI**: `persona_saturation_campaigns`, `rsi_*`
- **Genesis / Darkweb**: `genesis_entities`, `darkweb_agents`
- **Employee/B2B**: `employee_scan_queue`, `prospect_alerts`, `strike_requests` (if present)

Keep untouched: `clients`, `client_entities`, `entities`, `entity_*`, `eidetic_*`, `executive_reports`, `aria_*`, `contact_submissions`, `lead_magnets`, `blog_posts`, `data_subject_requests`, `dpia_records`, `lia_records`, `data_retention_schedule`, `data_breach_incidents`, `activity_logs`, `live_status`, `counter_narratives`, `content_sources`.

### 0.2 Delete edge functions
- `anubis-*` (all)
- `rsi-threat-simulator`
- `headless-scraper`
- `local-memory-search`, `local-threat-analysis`, `local-inference` (Ollama fallback — switching to cloud-only)
- Any `eris-*`, `graveyard-*`, `sentience-*`, `persona-saturation-*` if present

### 0.3 Delete frontend pages & routes
Remove from `App.tsx` and delete the files:
- `AnubisCockpitPage`, `GraveyardPage`, `RSI.tsx`
- Legacy product pages: `HyperCorePage`, `SovraPage`, `CleanLaunch`, `EngagementHubPage`, `SeoCenterPage`, `OutreachPipelinePage`
- Any sidebar/nav links pointing to the above

### 0.4 Cron / workflow cleanup
- Edit `.github/workflows/aria-health-check.yml` to remove pings to deleted functions
- Remove cron schedules (in `supabase/config.toml` or pg_cron) referencing archived tables

---

## Phase 1 — Schema alignment for Ops Executive

### New tables
1. `profiles` — user metadata (id → auth.users.id, email, display_name, avatar_url)
2. `client_identities` — primary names, aliases, handles per client (FK clients.id)
3. `reputation_scores` — periodic threat/sentiment score snapshots per client
4. `requiem_jobs` — SEO/reputation suppression job queue (entity, query, status, serpapi_payload)
5. `requiem_serp_snapshots` — captured SERP results per query (raw + parsed)
6. `black_vertex_actions` — offensive/defensive content actions (status, target_url, action_type)
7. `oblivion_takedowns` — takedown requests lifecycle (legal basis, target, status, evidence)
8. `ops_audit_log` — unified audit trail across Requiem/Vertex/Oblivion

All tables: RLS enabled, admin-only via `has_role(auth.uid(),'admin')`.

### Extend existing
- `clients`: add `tier` (individual|pro|enterprise), `onboarded_at`, `primary_contact_user_id`
- `scan_results`: add `serpapi_query_id`, `rank_position`, `domain_authority`
- `executive_reports`: add `client_id` FK, `pdf_url`
- `eidetic_resurfacing_events`: add `client_id` FK

### Triggers / functions
- `update_updated_at_column()` triggers on new tables
- `handle_new_user()` → auto-insert `profiles` on auth signup

---

## Phase 2+ (preview, built later)
- **Phase 2 — Requiem engine**: SerpApi integration edge function (`requiem-scan`), cron, dashboard at `/admin/requiem`
- **Phase 3 — Black Vertex**: counter-content dispatch
- **Phase 4 — Oblivion**: takedown automation tied to Legal Ops module

---

## Required from you later
- `SERPAPI_API_KEY` (added via Lovable secrets when Phase 2 starts)

## Risk notes
- Archive-rename is reversible: `ALTER TABLE _archived_x RENAME TO x;`
- Edge function & page deletions are git-tracked and recoverable
- No live cron will break — health-check workflow updated in same phase

Approving this plan switches to build mode and I execute Phase 0 → Phase 1 in order.