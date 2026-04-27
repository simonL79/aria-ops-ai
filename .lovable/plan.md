# QA Test Plan — Phases 2, 3, 4 across all device sizes

Verify Requiem (Phase 2), Black Vertex (Phase 3), and Oblivion (Phase 4) work end-to-end on Desktop, Tablet, and Mobile viewports before moving on.

## Scope

Three admin pages, three viewports each = 9 verification passes:

| Page | Route | Phase |
|---|---|---|
| Requiem Dashboard | `/admin/requiem` | 2 |
| Black Vertex | `/admin/black-vertex` | 3 |
| Oblivion | `/admin/oblivion` | 4 |

Viewports:
- Desktop: 1366×768
- Tablet: 820×1180
- Mobile: 390×844

## What gets tested per page

**Layout & responsiveness**
- Header, back button, refresh button visible and tappable
- Form fields (Select, Input, Textarea) stack correctly on narrow widths
- Tabs (Pending / History) remain usable on mobile
- Cards in queue/history don't overflow horizontally; long URLs truncate
- Action buttons (Approve/Reject, Submit, Draft) reachable without horizontal scroll

**Functional smoke test (live, no mocks)**
- Requiem: queue a scan for a benign query (`ariaops.co.uk`), confirm job row appears, snapshot drawer opens
- Black Vertex: queue a `notify_only` action, approve it, confirm status flips to `completed` and result JSON renders
- Oblivion: draft a takedown for a test URL, verify Gemini-generated letter renders and copy-to-clipboard works; do NOT submit to real platforms

**Backend checks**
- Edge function logs clean (no 500s) for: `requiem-scan`, `black-vertex-queue`, `black-vertex-approve`, `black-vertex-execute`, `oblivion-draft`
- `aria_ops_log` / `ops_audit_log` receive entries for each action
- RLS still blocks non-admin access (spot check via anon call)

## Process

1. Use the browser tool to navigate to each route at each viewport size
2. Screenshot + observe layout issues
3. Execute one functional action per page (live data, benign inputs)
4. Tail edge function logs after each action
5. Compile a single QA report listing: ✅ pass, ⚠️ minor issue, ❌ blocker — per page per viewport

## Fix policy

- **Blockers** (broken layout, function errors, data not persisting): fix immediately in the same loop, then re-test that viewport
- **Minor issues** (cosmetic spacing, truncation tweaks): list in report, fix in a follow-up pass
- **Pass**: move on

## Out of scope

- Real takedown submissions to YouTube/Google/etc.
- Load/perf testing
- Cross-browser (Chrome only via the browser tool)
- Phase 5 work — gated on this QA passing

## Deliverable

A QA report in chat with a 3×3 matrix (page × viewport) of statuses, screenshots of any issues found, and a summary of fixes applied. Then await your go-ahead for Phase 5.

---

## Phase 5 — DEFERRED (parked for later)

**Client Portal** — role-isolated read-only experience for end clients.

- New `client` value on `user_roles.role` + new `client_accounts` table linking `auth.users.id` → existing client/entity record
- Helper functions: `is_current_user_client()`, `current_user_client_id()` (SECURITY DEFINER, no recursion)
- Additive RLS SELECT policies on reports / sentiment / findings / scans tables, scoped by `current_user_client_id()`
- Routes: `/portal/*` (Overview, Reports, Findings, Sentiment, Account) behind new `ClientProtectedRoute`
- Post-login redirect: admin → `/admin`, client → `/portal`
- `useAuth` extended with `isClient`, `clientId`
- Admin-gated `invite-client` edge function (creates auth user + role + link + sends invite via existing transactional email)
- `portal-report-download` edge function returns short-lived signed URLs from a private storage bucket
- No admin surface exposure to clients (UI hidden + RLS enforced — defense in depth)

Open questions to resolve before starting Phase 5:
1. Confirm exact existing table names for reports / sentiment / findings to attach client-read RLS policies
2. Confirm v1 portal scope (5 sections above vs. trimmed)
3. Confirm report storage format (existing files vs. on-demand render)
