# Phase 2 — Requiem Engine (SerpApi)

## What gets built

### 1. Edge function: `requiem-scan`
- Input: `{ entity_name, query, client_id? }` **or** `{ job_id }` (rerun an existing job)
- Calls SerpApi `engine=google&q=<query>&num=20`
- Stores raw + parsed results into `requiem_serp_snapshots`
- Mirrors top results into `scan_results` (rank_position, serpapi_query_id, domain) for ranking history
- Updates `requiem_jobs` (running → completed/failed)
- Writes audit row to `ops_audit_log`
- Reads key from `SERPAPI_API_KEY` env var

### 2. Edge function: `requiem-cron`
- Selects up to 5 `requiem_jobs` where `status='pending'` and `scheduled_for <= now()`
- Invokes `requiem-scan` for each (service-role auth)
- Returns dispatch summary

### 3. pg_cron schedule
- Runs `requiem-cron` every 15 minutes
- Uses `pg_cron` + `pg_net`, scheduled via the `supabase--read_query`/insert pattern (not migration, since it embeds the project URL + anon key)

### 4. Admin UI: `/admin/requiem`
- Page `src/pages/admin/RequiemDashboardPage.tsx` (file already imported in `App.tsx` but currently a stub — will be implemented)
- Sections:
  - **New scan form**: entity_name, query, client (dropdown from `clients`), submit → calls `requiem-scan` directly
  - **Job queue table**: latest 50 `requiem_jobs` with status badges, started/completed times, results count
  - **Snapshot drawer**: click a job → side panel listing parsed_results (rank, title, link, domain, snippet)
  - **Auto-refresh** every 20s while a job is running

### 5. Route
- Add `<Route path="/admin/requiem" element={<RequiemDashboardPage />} />` inside the protected admin block in `App.tsx`

## Required from you

**`SERPAPI_API_KEY`** — get it from https://serpapi.com/manage-api-key. Once you confirm you have it, I'll trigger the secret prompt so you can paste it into Lovable. The edge function will read it via `Deno.env.get("SERPAPI_API_KEY")` — never exposed to the browser.

## Out of scope this phase
- Black Vertex (Phase 3)
- Oblivion takedowns (Phase 4)
- Suppression actions on results (just monitoring this phase)

## Order of execution after approval
1. Prompt you to add `SERPAPI_API_KEY`
2. Write both edge functions, deploy them
3. Build `RequiemDashboardPage` and wire the route
4. Test `requiem-scan` with a sample query via curl
5. Schedule pg_cron job for `requiem-cron` (every 15 min)
6. Confirm end-to-end and hand back

Approve to switch to build mode and execute.