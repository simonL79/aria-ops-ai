# ARIA Shield — Integrated Build Plan

ARIA Shield becomes the **defensive cybersecurity workflow layer** inside the existing A.R.I.A platform. It does not replace `threats`, EIDETIC, Requiem, Oblivion, Legal Ops, or the client portal — it sits on top of them and turns raw signals into typed, scored, evidenced, routed, auditable incidents.

This plan delivers **Phase 1 (Shield Core)** and **Phase 2 (Evidence Vault)** as working, shippable functionality, while laying down the full database schema for Phases 3–5 so later phases are additive UI/edge-function work only.

---

## Scope of this build

### In scope (shipping now)

1. Full Shield database schema (all 13 tables + enums) — additive, non-destructive.
2. RLS policies on every Shield table mirroring existing `has_role()` / `user_owns_client()` patterns.
3. Private storage bucket `shield-evidence`.
4. Edge functions: `shield-promote-threat`, `shield-score-alert`, `shield-capture-url-metadata`.
5. Admin UI under `/admin/shield`:
   - Dashboard (P1 alerts, open takedowns, evidence required, etc.)
   - Alerts list with filters (status, severity, type, client)
   - Alert detail page (overview, scoring, lifecycle timeline, evidence tab)
   - Evidence Vault upload (file, URL, pasted text, notes)
6. "Promote to Shield Alert" action surfaced on existing threat records.
7. Lifecycle state machine enforced in edge functions (allowed transitions only) with `shield_alert_events` audit row on every change.
8. Multi-dimensional severity scoring (harm, reach, public risk, legal risk, confidence, urgency → total → severity band).

### Schema laid down now, UI deferred to later phases

- Takedown cases + submissions (Phase 3)
- Incidents, incident-alerts, tasks, decision logs (Phase 4)
- Public warnings, route templates, AI outputs (Phase 5)

This means Phases 3–5 require no further migrations — only edge functions and UI.

### Explicitly out of scope (this build)

- External screenshot/capture API integration (Phase 2 stretch — MVP captures URL metadata only via fetch).
- Auto-submission of takedowns, legal letters, public warnings — never automatic; always human-approved.
- Removing or altering existing `threats`, `oblivion_takedowns`, Requiem, or portal tables.
- Renaming "Aggressive/Nuclear" RSI modes (cosmetic, separate task).

---

## Database changes (single additive migration)

**Enums:** `shield_alert_type`, `shield_alert_status`, `shield_severity`, `shield_takedown_status` — exactly as specified in the blueprint.

**Tables (all new, all RLS-enabled):**

```text
shield_alerts              — typed alerts with scoring + lifecycle
shield_alert_events        — append-only audit of every status/edit
shield_evidence_items      — vault entries (file/url/text/note)
shield_score_events        — score recalculation history
shield_takedown_cases      — Phase 3 (schema only)
shield_takedown_submissions— Phase 3 (schema only)
shield_incidents           — Phase 4 (schema only)
shield_incident_alerts     — Phase 4 (schema only)
shield_incident_tasks      — Phase 4 (schema only)
shield_decision_logs       — Phase 4 (schema only)
shield_public_warnings     — Phase 5 (schema only)
shield_route_templates     — Phase 5 (schema only)
shield_ai_outputs          — Phase 5 (schema only)
```

**Key FKs:**
- `shield_alerts.source_threat_id` → `threats.id` (nullable, ON DELETE SET NULL — preserves Shield record if raw threat is purged)
- `shield_alerts.client_id` → `clients.id` (nullable)
- `shield_takedown_cases.oblivion_takedown_id` → `oblivion_takedowns.id` (Phase 3 link)
- All `actor_id` / `created_by` / `assigned_to` → `profiles.id` ON DELETE SET NULL

**RLS model:**
- `admin` role (via `has_role(auth.uid(), 'admin')`) — full access on all Shield tables.
- `client_portal_users` / `clients.primary_contact_user_id` — read-only on `shield_alerts WHERE client_visible = true AND client_id IN user's clients`. No evidence access by default.
- All other roles — denied by default.

A new `analyst` role is **not** introduced in this build — existing `admin`-or-nothing model is kept for MVP. Adding `analyst` / `case_manager` / `security_lead` is a follow-up that can be done with a second migration without touching tables.

**Storage:** create private bucket `shield-evidence` with RLS policies allowing only admins to read/write objects under `alert/{alert_id}/...`.

---

## Edge functions

All follow existing patterns: `requireAdmin`, `corsHeaders` from supabase-js, generic external errors, `aria_ops_log` writes, JWT validated in code.

| Function | Purpose |
|---|---|
| `shield-promote-threat` | Input `{ threat_id }`. Loads threat, maps flat type → Shield taxonomy, creates `shield_alerts` row, calls scorer, writes `shield_alert_events` (`new`), returns `alert_id`. |
| `shield-score-alert` | Input `{ alert_id, scores? }`. Computes `total_score` and severity band, updates alert, writes `shield_score_events`. |
| `shield-capture-url-metadata` | Input `{ alert_id, url }`. MVP: server-side fetch of URL, captures HTTP status, title, content-type, response headers; stores as `shield_evidence_items` row of type `url_metadata` with content hash of body. No external screenshot API yet. |

Lifecycle transitions are enforced inside `shield-promote-threat` and a small helper used by the alert detail UI's status-change action (calls a thin `shield-transition-alert` function — added to the list).

---

## Frontend (admin only)

New routes registered in `src/App.tsx` under existing admin protection:

```text
/admin/shield                       Dashboard
/admin/shield/alerts                Alerts list
/admin/shield/alerts/:id            Alert detail (tabs: Overview, Scoring, Evidence, Timeline)
```

Components:
- `src/pages/admin/shield/ShieldDashboard.tsx`
- `src/pages/admin/shield/ShieldAlertsList.tsx`
- `src/pages/admin/shield/ShieldAlertDetail.tsx`
- `src/components/shield/AlertScoreCard.tsx`
- `src/components/shield/AlertLifecycleTimeline.tsx`
- `src/components/shield/EvidenceUploadDialog.tsx`
- `src/components/shield/EvidenceList.tsx`
- `src/components/shield/PromoteToShieldButton.tsx` — drop-in for existing threat detail screens
- `src/lib/shield/taxonomy.ts` — enums, severity bands, allowed transitions, type → label maps

Style: existing dark/orange A.R.I.A aesthetic, glass panels, severity badges (`p1_critical` red, `p2_high` orange, `p3_medium` amber, `p4_low` slate), dense tables.

---

## "Promote to Shield Alert" integration

Locate existing threat detail/admin threat list components (likely under `src/pages/admin/` or `src/components/threats/`) and inject `<PromoteToShieldButton threatId={...} />`. Button is admin-gated, calls `shield-promote-threat`, then navigates to the new alert detail.

If a threat has already been promoted, the button shows "View Shield Alert" instead (lookup by `source_threat_id`).

---

## AI safety guardrails (baked in from day one)

Even though Phase 1 doesn't ship AI drafting yet, the `shield_ai_outputs` table and the system-prompt convention are added now so Phase 3+ functions plug in cleanly. Standard preamble used by all future Shield AI calls:

> You assist defensive cyber reputation analysts. Do not invent evidence. Do not make final legal determinations. Separate confirmed facts from analyst judgement. All outputs are drafts requiring human approval. Never produce takedown submissions, public warnings, or law enforcement notifications as final actions.

---

## Definition of done (this build)

1. Migration applied; all 13 Shield tables exist with RLS enabled.
2. `shield-evidence` storage bucket exists, private, admin-only policies.
3. An admin can open any existing threat and click **Promote to Shield Alert** → lands on `/admin/shield/alerts/:id` with a `new`-status alert and a scored severity band.
4. Admin can upload a screenshot, paste a URL (auto-fetches metadata + hash), paste captured text, and add a note — each appears in the Evidence tab with `captured_at` / `captured_by`.
5. Admin can transition the alert through allowed lifecycle states; every transition appears in the Timeline tab and writes to `shield_alert_events`.
6. Dashboard shows live counts: P1 critical, evidence required, action required, etc.
7. Non-admin users cannot read any Shield row (verified via RLS).
8. No existing table, function, or route is modified destructively.

---

## What you'll need to confirm or provide

- **Nothing external this build** — no new API keys required. Phase 2 stretch (real screenshot capture via ScrapingBee/Browserless) would need a key, but is deferred.
- Confirm we should **not** introduce the `analyst` / `case_manager` roles yet (admin-only MVP).

---

## After approval

I'll execute in this order: (1) migration, (2) storage bucket + policies, (3) edge functions, (4) `taxonomy.ts` + shared UI primitives, (5) dashboard + list + detail pages, (6) Evidence Vault dialog, (7) Promote button injection on existing threat screens, (8) smoke test the full flow end-to-end.