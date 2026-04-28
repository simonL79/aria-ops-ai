# Cleanup Plan: Delete flagged pages & repair all references

Implements the audit report. Deletes orphans/duplicates, removes their imports + route registrations, and fixes the few inbound links so the app builds cleanly.

## 1. Files to delete (24)

**Orphan public pages (13):**
- `src/pages/BlogAdminPage.tsx`
- `src/pages/ReputationScanPage.tsx`
- `src/pages/ReputationScanForm.tsx`
- `src/pages/FreeScanResults.tsx`
- `src/pages/ThankYouPage.tsx`
- `src/pages/PaymentPage.tsx`
- `src/pages/DPARequestPage.tsx`
- `src/pages/CalendarPage.tsx`
- `src/pages/UsersPage.tsx`
- `src/pages/ExecutiveReportsPage.tsx`
- `src/pages/OperatorConsole.tsx`
- `src/pages/AiScrapingPage.tsx`
- `src/pages/EideticPage.tsx`
- `src/pages/EmergencyStrikePage.tsx`

**Duplicate/orphan admin pages (10):**
- `src/pages/admin/GenesisSentinel.tsx` (wrapper)
- `src/pages/admin/SentinelPage.tsx`
- `src/pages/admin/SentinelOperatorPage.tsx`
- `src/pages/admin/IntelligenceCorePage.tsx`
- `src/pages/admin/LegalOpsPage.tsx`
- `src/pages/admin/PersonaSaturationPage.tsx`
- `src/pages/admin/BlackVertexPage.tsx`
- `src/pages/admin/OblivionPage.tsx`
- `src/pages/admin/StrategyBrainStage3Page.tsx`
- `src/pages/admin/AIControlPage.tsx`

**Note — kept (despite no inbound link, per memory/active modules):**
- `RequiemDashboardPage` — referenced in project memory as canonical `/admin/requiem` surface.
- `ContentGenerationPage` — actively linked from `AdminDashboardPage`.

Also kept: `BlogPostPage` static `/blog-post` nav-items entry will be removed but the file stays (still mounted at `/blog/:slug` in App.tsx).

## 2. Routing updates

**`src/App.tsx`** — remove imports + `<Route>` lines for:
- `BlackVertexPage`, `OblivionPage`, `AIControlPage`, `StrategyBrainStage3Page`

`/admin/genesis-sentinel` keeps working: route updated to render `GenesisSentinelPage` directly (drop the wrapper).

**`src/nav-items.tsx`** — remove imports + nav entries for:
- `BlogAdminPage`, `BlogPostPage` (the `/blog-post` static entry only), `ReputationScanPage`, `ReputationScanForm`, `FreeScanResults`, `ThankYouPage`, `PaymentPage`, `DPARequestPage`, `CalendarPage`, `UsersPage`, `ExecutiveReportsPage`, `OperatorConsole`, `AiScrapingPage`, `EideticPage`, `EmergencyStrikePage`, `PersonaSaturationPage`, `GenesisSentinel` (wrapper), `GenesisSentinelPage` (`-page` suffix duplicate route), `SentinelPage`, `SentinelOperatorPage`, `IntelligenceCorePage`, `LegalOpsPage`.

The `/admin/genesis-sentinel` route is kept (declared in App.tsx now using `GenesisSentinelPage` directly).

## 3. Inbound link repairs

Discovered references that would break:

| File | Current link | Fix |
|---|---|---|
| `src/components/sections/EnhancedCTASection.tsx` | `<Link to="/calendar">` | Change to `<Link to="/contact">` (book consultation) |
| `src/components/admin/NotificationCenter.tsx` | `to="/admin/notifications"` | Keep (page retained) |
| `src/components/eidetic/EideticDashboard.tsx` | `to="/admin/eidetic/preferences"` | Keep (page retained) |

`/admin/genesis-sentinel` callers (TacticalActionPanel, AriaCommandCenter, AnubisValidationPanel, SigmaIntelligencePanel, AnubisCreeperLogViewer, DashboardMainContent) — no change, route still exists.

`PrivacyPolicyPage` link to `/request-data-access` — no change, page retained.

## 4. Verification

- `rg "from.*pages/(BlogAdminPage|ReputationScanPage|ReputationScanForm|FreeScanResults|ThankYouPage|PaymentPage|DPARequestPage|CalendarPage|UsersPage|ExecutiveReportsPage|OperatorConsole|AiScrapingPage|EideticPage|EmergencyStrikePage)"` returns no results.
- `rg "from.*pages/admin/(GenesisSentinel'|SentinelPage|SentinelOperatorPage|IntelligenceCorePage|LegalOpsPage|PersonaSaturationPage|BlackVertexPage|OblivionPage|StrategyBrainStage3Page|AIControlPage)"` returns no results.
- `rg "to=\"/calendar\"|to=\"/payment\"|to=\"/thank-you\"|to=\"/dpa-request\"|to=\"/blog-admin\"|to=\"/users\"|to=\"/eidetic\"|to=\"/operator-console\"|to=\"/ai-scraping\"|to=\"/emergency-strike\"|to=\"/executive-reports\"|to=\"/reputation-scan\"|to=\"/scan-results\"|to=\"/blog-post\""` returns no results.
- Build (auto-run by harness) succeeds with no missing-module errors.

## 5. Out of scope

- No memory updates (unless build reveals an issue with `/admin/ai-control` — its memory entry will stand as a known-removed surface noted in summary).
- No layout-component pruning beyond the one CTA fix above (DashboardSidebar/MainNav cleanup is a separate pass).
