# Edge Function Deletion Dependency Report

Generated to confirm the deletion candidates have **no active callers** across
all four dependency vectors before removal.

Scope: Supabase project `nphqcwigrxcguztkscak`.

## Method

| Vector | How it was checked |
| --- | --- |
| Frontend invokes | `rg` over `src/**` for each function name (`functions.invoke`, URL strings) |
| Cross-function invokes | `rg` over `supabase/functions/**`, excluding each function's own dir |
| pg_cron jobs | `select ... from cron.job` — inspected every scheduled `net.http_post` URL |
| Webhook calls | `information_schema.triggers` (public) + repo-wide reference sweep (workflows, scripts, config) |

## pg_cron jobs found (none target a candidate)

| Job | Schedule | Target function |
| --- | --- | --- |
| eidetic-autopilot-6h | `0 */6 * * *` | eidetic-autopilot |
| eidetic-send-digest-quarterly | `*/15 * * * *` | eidetic-send-digest |
| gsc-weekly-sync | `0 6 * * 1` | google-search-crawler |
| requiem-cron-15min | `*/15 * * * *` | requiem-cron |

Database triggers/webhooks in `public`: **none**.

## Results — safe to delete

All 19 candidates: **0 frontend invokes, 0 cross-function invokes, 0 pg_cron jobs, 0 webhook triggers.**

| Function | Frontend | Cross-fn | pg_cron | Webhook | Verdict |
| --- | :---: | :---: | :---: | :---: | :---: |
| classify-ai-command | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| column_exists | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| companies-house-daily-import | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| companies-house-scan | ✅ none | ✅ none¹ | ✅ none | ✅ none | Safe |
| companies-house-scanner | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| creeper-agent | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| execute-batch-strikes | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| fixpath-ai | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| founder-reputation-scan | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| generate-rss | ✅ none | ✅ none | ✅ none | ✅ none | Safe² |
| generate-sitemap | ✅ none | ✅ none | ✅ none | ✅ none | Safe² |
| genesis-verify | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| get-prospect-entities | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| intelligence-workbench | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| process-threat-ingestion | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| recursive-ai-scanner | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| serp-monitor | ✅ none | ✅ none | ✅ none | ✅ none | Safe |
| submit-contact | ✅ none | ✅ none | ✅ none | ✅ none | Safe³ |
| zero-day-scanner | ✅ none | ✅ none | ✅ none | ✅ none | Safe |

### Notes
1. The single raw substring hit on `companies-house-scan` was a false positive:
   it matched `companies-house-scanner`'s own log line. Word-boundary search
   confirms no real reference.
2. `generate-rss` / `generate-sitemap` have no in-repo caller. If either feed URL
   is fetched by an **external** service (search engines, RSS readers) it is
   served at build time from `public/`, not this function — verify the live feed
   still resolves before deleting.
3. `submit-contact` is superseded; the live contact form posts to
   `send-transactional-email`. No stanza in `config.toml`.
