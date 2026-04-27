# Phases 3 + 4 — Black Vertex (action engine) & Oblivion (takedowns)

Both use the same approval-gated action pattern, so we build them in one pass and share infrastructure.

## What gets built

### Phase 3 — Black Vertex (offensive/defensive action engine)

Black Vertex turns a SERP result (or any flagged URL) into a queued **action**: counter-content publish, comment reply, suppression boost, link-building push, or notify-only. Every action requires admin approval before execution.

**Action types (initial set):**
- `counter_content` — generate + publish a counter-narrative article (stub publisher this phase)
- `suppression_boost` — push a `suppression_assets` row to higher rank by linking from owned channels
- `notify_only` — log + email an alert, no action
- `manual_review` — flag for analyst, no execution

**Edge functions:**
1. `black-vertex-queue` — POST `{ client_id, action_type, target_url, payload }` → inserts row in `black_vertex_actions` with `status='pending'`. Admin-only (JWT verified via `_shared/auth.ts requireAdmin`).
2. `black-vertex-approve` — POST `{ action_id, decision: 'approve'|'reject' }` → sets `approved_by`, `approved_at`, status. On approve, dispatches to executor.
3. `black-vertex-execute` — internal (service-role only). Switches on `action_type`, runs the handler, stores `result` jsonb, sets `status='completed'|'failed'` and `executed_at`. Writes `aria_ops_log` entry.

**UI: `/admin/black-vertex`** (new page `src/pages/admin/BlackVertexPage.tsx`)
- "Queue action" form — pick client, action type, target URL, payload JSON
- Pending queue with Approve / Reject buttons (admin only)
- History tab showing completed/failed with result inspector
- Auto-refresh 20s

### Phase 4 — Oblivion (legal takedowns)

Oblivion drafts and tracks legal removal requests (GDPR Art.17, DMCA, defamation, platform-specific) against a target URL, captures evidence, and tracks status through the takedown lifecycle.

**Edge functions:**
1. `oblivion-draft` — POST `{ client_id, target_url, platform, request_type, legal_basis, evidence }` → inserts `oblivion_takedowns` row with `status='draft'`, generates the request letter via Lovable AI (`google/gemini-2.5-flash`) using the legal_basis + evidence, stores draft in `metadata.draft_letter`.
2. `oblivion-submit` — POST `{ takedown_id }` (admin) → marks `status='submitted'`, `submitted_at=now()`. (Actual platform submission is manual-paste this phase; we generate the letter + recipient email per platform from a small lookup table in the function.)
3. `oblivion-status-update` — POST `{ takedown_id, status, resolution_notes }` for analyst follow-up (`under_review`, `removed`, `rejected`, `appealing`).

**UI: `/admin/oblivion`** (new page `src/pages/admin/OblivionPage.tsx`)
- "New takedown" form — client, target URL, platform (YouTube, X, Reddit, Google, Facebook, Other), request_type (gdpr_erasure, dmca, defamation, harassment, impersonation), legal_basis textarea, evidence list (URL + description rows)
- Drafts list with "Generate letter" → opens drawer showing AI-drafted letter + recipient + copy buttons
- Active takedowns table with status badges and update controls
- Resolved tab with outcome stats

### Shared

- New helper `src/services/actions/actionApi.ts` — small wrapper around `supabase.functions.invoke` for both engines
- Add 2 routes to `App.tsx` inside the protected admin block:
  - `/admin/black-vertex` → `BlackVertexPage`
  - `/admin/oblivion` → `OblivionPage`
- Add nav entries in `src/nav-items.tsx` under Admin
- Audit every action to `aria_ops_log` (`module_source: 'black_vertex'` / `'oblivion'`)

## Required from you

**`LOVABLE_API_KEY`** — already provisioned (managed). Used by `oblivion-draft` to generate letters via the Lovable AI Gateway. No new secrets needed for either phase.

If you later want **automated** submission (vs copy-paste), that's a Phase 4.5 (per-platform API/email integrations: SendGrid for email-based DMCA, YouTube Data API, etc.). Out of scope here.

## Out of scope this phase
- Real automated submission to platforms (drafts + manual send only)
- Counter-content actual publishing pipeline (Black Vertex `counter_content` handler will create a `suppression_assets` draft row only this phase; live multi-platform publish is Phase 5)
- Appeals workflow UI (status field supports it, no dedicated UI yet)

## Order of execution after approval
1. Create the 5 edge functions, deploy
2. Build `BlackVertexPage` and `OblivionPage`, wire routes + nav
3. Verify queue → approve → execute flow with a test action via curl
4. Test `oblivion-draft` letter generation for a sample GDPR request
5. Confirm both dashboards live and hand back

Approve to switch to build mode.