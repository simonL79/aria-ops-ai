# A.R.I.A SIGMA — Ops Plan ("Ease of Usage")

A combined handbook covering daily ops for the whole team — operators, on-call, and new hires. Single source of truth in the repo, mirrored as a searchable in-app page so admins never have to leave the dashboard.

## Goals

- Anyone on the team can perform a routine task (onboard a client, triage a Shield alert, dispatch an EIDETIC response, run a Requiem sweep, publish a blog post) without asking another operator.
- New hires can be productive on day 1 by reading one document.
- On-call has a quick-glance recovery checklist for the most common breakages.

## Deliverables

1. **`docs/OPS.md`** — version-controlled markdown handbook (source of truth).
2. **`/admin/ops`** — in-app page that renders the same handbook with search, anchor links, and a left-hand section nav. Admin-gated via existing `ProtectedRoute` + `requireAdmin` pattern.
3. **Sidebar entry** — "Ops Handbook" link in the admin layout for one-click access.

Both surfaces stay in sync: the React page imports the markdown at build time (via Vite's `?raw` import) and renders it with `react-markdown` + `remark-gfm`, so editing `docs/OPS.md` is the only place changes are made.

## Handbook structure (sections)

Each section follows the same shape: **What it is → Where to click → Daily checklist → Common issues → Who to escalate to**.

1. **At-a-glance map** — one-page diagram of the platform: Public site → Intake → Admin (Clients, Shield, EIDETIC, Requiem, Blog/AutoSEO, Genesis Sentinel) → Edge Functions → Supabase.
2. **Access & login** — `/admin/login`, admin role grant via `user_roles` table, password reset, lockout recovery.
3. **Client onboarding** — `/admin/client-onboarding` walkthrough: client info → entity discovery → threat assessment → defense config → activation.
4. **Client management** — `/admin/clients`: searching, editing, archiving (additive only — never delete), exporting.
5. **Shield (alerts & evidence)** — `/admin/shield`: triage queue, capturing URL evidence (uses SSRF-guarded `shield-capture-url-metadata`), promoting threats, transitioning alert states.
6. **EIDETIC (memory & dispatches)** — preferences at `/admin/eidetic/preferences`, approving pending dispatches, retrying failed ones, reading the decay timeline.
7. **Requiem (bulk SEO defense)** — `/admin/requiem`: launching a sweep, monitoring runs, reading the pipeline log.
8. **Genesis Sentinel** — `/admin/genesis-sentinel`: verification queue, approval workflow.
9. **Blog & AutoSEO** — webhook-driven publishing via `receive-article`, manually triggering `sync-blog-posts`, sanitization notes.
10. **Notifications** — `/admin/notifications`: digest cadence, transactional email via `notify.ariaops.co.uk`.
11. **Daily / weekly / monthly checklists** — short tickable lists (e.g. daily: clear Shield triage, check EIDETIC pending dispatches, scan notifications; weekly: Requiem sweep review; monthly: rotate secrets, review user_roles).
12. **Common issues & quick fixes** — top 10 things that break in production, with the exact button/page that resolves each.
13. **Escalation matrix** — who owns Shield, EIDETIC, Requiem, billing, infra; how to reach them; severity definitions.
14. **Glossary** — Shield, EIDETIC, Requiem, Anubis, Genesis Sentinel, RSI, Clean Launch, AutoSEO.

(Edge functions, cron, and security internals are intentionally **out of scope** per the chosen scope — they will get their own separate runbook later if needed.)

## In-app page details

- Route: `/admin/ops` (admin-only, wrapped by existing protection).
- Layout: existing dark/glassmorphism aesthetic, orange (#F97316) accents, no new design tokens.
- Components: sticky left nav (auto-generated from `##` headings), markdown body in the main column, top search box that filters visible sections by substring match.
- Print-friendly CSS so an operator can print the handbook for offline reference.

## Files to add / change (technical)

- `docs/OPS.md` — new file, the handbook content.
- `src/pages/admin/OpsHandbookPage.tsx` — new page, imports `../../../docs/OPS.md?raw`, renders with `react-markdown` + `remark-gfm` and a small TOC component.
- `src/App.tsx` — register `<Route path="/admin/ops" element={<OpsHandbookPage />} />`.
- `src/components/admin/AdminLayout.tsx` (or whichever sidebar component is used) — add "Ops Handbook" nav link.
- `package.json` — add `react-markdown` and `remark-gfm` if not already present.

No database changes, no edge function changes, no schema migrations.

## Out of scope (explicit)

- Edge function reference / cron schedules / log locations.
- Security internals (RLS, SSRF guard, secret rotation procedures).
- Incident-response runbooks beyond the "common issues" quick fixes.

These can be added as `docs/OPS-EDGE.md` and `docs/OPS-SECURITY.md` in a follow-up if the team wants them.

## Acceptance criteria

- `docs/OPS.md` exists and covers all 14 sections above.
- `/admin/ops` renders the handbook for admin users and 404s/redirects for non-admins.
- Admin sidebar shows an "Ops Handbook" link.
- Edits to `docs/OPS.md` show up on `/admin/ops` after the next build with no other changes required.
