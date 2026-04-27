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
