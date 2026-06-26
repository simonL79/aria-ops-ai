# A.R.I.A™ — Operational OS, AI Readiness & Competitor Positioning

Three workstreams, all wired to live Supabase data (no mock data). Built on the existing `src/pages/admin/*` and `src/pages/portal/*` surfaces rather than new shells.

## Workstream 1 — Operational dashboard (admin OS)

The current `AdminDashboardPage` shows hardcoded numbers (`activeThreatScans: 12`, `clientsMonitored: 8`, etc.) and a fake "Recent Activity" list. Replace all of it with live queries.

- **Live KPI cards**, each from a real table:
  - Clients monitored → `clients` count
  - Active threats → `threats` where `status = 'active'`
  - New findings (7d) → `scan_results` where `created_at >= now()-7d`
  - Open Shield alerts → `shield_alerts` active count
- **Recent activity** → real rows from `activity_logs` (action / entity_type / details / created_at), newest first.
- **System health** → driven by `system_health_checks` / `live_status` instead of the static "Ollama Online" block.
- A small `useAdminDashboardData` hook centralises the queries; loading + empty states handled (no silent zeros).
- Quick Actions kept, pointed at existing routes.

### Portal dashboard bug fix
`PortalDashboard` queries `client_portal_clients`, which does not exist — it should be `clients` filtered by `clientIds`. Fix the table name and the `tier` lookup so the client-facing overview actually populates.

## Workstream 2 — AI Reputation Readiness (the differentiator)

Promote "what do LLMs say about you?" from a sub-feature to a named entry point.

- **Public lead-magnet page** `/ai-reputation-readiness` (route already referenced in related links but not built): name + entity input → kicks off a readiness check, captures the lead into `reputation_scan_submissions`, and renders a **Readiness Score (0–100)** across categories: Search presence, LLM answer accuracy, Negative-content exposure, Authority/structured-data coverage.
- **Edge function** `ai-readiness-scan`: takes an entity name, calls the Lovable AI gateway (`LOVABLE_API_KEY`, already set) to assess how an LLM currently describes the entity, returns category scores + summary. Generic error handling, JWT validated in code, `npm:` specifiers per project rules.
- **Admin readiness report view** inside the operator OS so Simon can review/queue results before they reach a client.
- Prominent nav/CTA placement so it reads as a headline product, not a buried tool.

## Workstream 3 — Competitor positioning

- A reusable `ComparisonTable` (extending the pattern already in the stealth pages' `comparison` config) rendering A.R.I.A vs **Reputation.com, DeleteMe, BrandYourself** across: AI-native monitoring, LLM readiness, real-time threat scoring, human crisis response, GDPR/RTBF removal, UK base, price.
- Surfaced as a section on the home/pricing area and as standalone content, with the data defined in one config object for easy editing.

## Suggested sequence
1. Portal dashboard table-name fix (fast win, unblocks client view).
2. Admin dashboard → live data + activity feed.
3. AI Readiness scan (edge function + public page + admin view).
4. Competitor comparison surface.

## Technical notes
- New table likely needed: `ai_readiness_reports` (entity, scores jsonb, summary, client_id nullable, created_at) with GRANTs + RLS (admin full; portal users read own via `user_owns_client`). Migration will include GRANT + RLS in the correct order.
- Reuse `useAuth().clientIds`, `has_role`, and `user_owns_client` for access control — no new auth model.
- Cast Supabase table refs with `as any` per project convention to avoid TS deep-instantiation errors.
- All scores/metrics come from real scans or stored rows; nothing hardcoded.

## Open question
For pricing optimization (the 4th brief priority you didn't select): leave PRO at £397 for now and revisit after the readiness feature ships? I've excluded it from this plan unless you want it folded in.