# Page Audit Report

Audit of every page registered in `src/App.tsx` and `src/nav-items.tsx`. Each entry has been cross-checked against internal `<Link>`, `navigate()` and `href` references across `src/` (excluding the route registries themselves).

Pages with valid links from layouts, sections, or other pages are NOT flagged. Only orphans (no inbound link) and duplicates (multiple files implementing the same concept) appear below.

---

## A. Orphan public pages (registered route, no inbound link anywhere)

| Page file | Route | Why flagged |
|---|---|---|
| `BlogAdminPage.tsx` | `/blog-admin` | Admin-only blog editor; no link from any layout, sidebar, or admin dashboard. Reachable only by typing the URL. |
| `BlogPostPage.tsx` (nav-items copy) | `/blog-post` | Duplicate registration. Real blog posts use `/blog/:slug` (declared directly in `App.tsx`). The static `/blog-post` route renders the same component with no slug and no inbound links. |
| `ReputationScanPage.tsx` | `/reputation-scan` | No inbound link. All CTAs across the site point to `/scan`. Superseded by `ScanPage`. |
| `ReputationScanForm.tsx` | `/reputation-scan-form` | No inbound link. Same purpose as `/scan` (`ConcernSubmissionForm`). |
| `FreeScanResults.tsx` | `/scan-results` | No inbound link. Result rendering is handled inline by the scan flow. |
| `ThankYouPage.tsx` | `/thank-you` | No `navigate('/thank-you')` or `<Link>` references; never reached after form submissions. |
| `PaymentPage.tsx` | `/payment` | No inbound link. Payment is handled via Stripe redirect / pricing CTAs that go to `/contact`, not an in-app page. |
| `DPARequestPage.tsx` | `/dpa-request` | No inbound link. GDPR flows route users to `/request-data-access` instead. |
| `CalendarPage.tsx` | `/calendar` | Linked once from `EnhancedCTASection`, but is admin-protected (`!isPublic`) — anonymous CTA users hit the auth wall. Flag as orphan-from-public-CTA. |
| `UsersPage.tsx` | `/users` | No inbound link. User management is done in `/admin/clients` (`ClientManagementPage`). |
| `ExecutiveReportsPage.tsx` | `/executive-reports` | No inbound link. Reporting surfaces live under `/portal/reports` and `/admin/shield`. |
| `OperatorConsole.tsx` | `/operator-console` | No inbound link. Superseded by `/admin/shield` and `/admin/sentinel-operator-page`. |
| `AiScrapingPage.tsx` | `/ai-scraping` | No inbound link. Scraping config lives inside admin tools now. |
| `EideticPage.tsx` | `/eidetic` | No inbound link from any nav. The active Eidetic surface is `/admin/eidetic/preferences`. |
| `EmergencyStrikePage.tsx` | `/emergency-strike` | No inbound link. Strike actions are exposed inside Shield/Genesis panels. |
| `ContentGenerationPage.tsx` | `/content-generation` | Linked from `AdminDashboardPage` and one control-center module — keep, but note it has no nav-item entry (admin-only direct link). NOT flagged — kept here for completeness. |

## B. Duplicate / redundant admin pages

| Page file | Route | Why flagged |
|---|---|---|
| `admin/GenesisSentinel.tsx` | `/admin/genesis-sentinel` | Wrapper file — the entire body is `return <GenesisSentinelPage />`. Pure indirection. |
| `admin/GenesisSentinelPage.tsx` | `/admin/genesis-sentinel-page` | Same component reachable at two different routes. All inbound links (TacticalActionPanel, AriaCommandCenter, AnubisValidationPanel, SigmaIntelligencePanel, AnubisCreeperLogViewer, DashboardMainContent) point to `/admin/genesis-sentinel`. The `-page` suffix route is unreferenced. |
| `admin/SentinelPage.tsx` | `/admin/sentinel-page` | No inbound link. Older standalone Sentinel screen. Superseded by `SentinelOperatorPage` which uses the modern `SentinelOperatorConsole` component. |
| `admin/SentinelOperatorPage.tsx` | `/admin/sentinel-operator-page` | No inbound link from any layout/sidebar; only reachable by URL. Canonical operator surface is `/admin/shield`. Flag for review — keep one of {SentinelPage, SentinelOperatorPage} or fold into Shield. |
| `admin/IntelligenceCorePage.tsx` | `/admin/intelligence-core-page` | No inbound link. Conceptual overlap with Genesis Sentinel and Shield Dashboard. |
| `admin/LegalOpsPage.tsx` | `/admin/legal-ops-page` | No inbound link. Legal-ops surfaces appear inside Shield. Route uses `-page` suffix nobody links to. |
| `admin/PersonaSaturationPage.tsx` | `/admin/persona-saturation` | No inbound link. RSI / Persona Saturation is invoked from Shield/Genesis modules. |
| `admin/AIControlPage.tsx` | `/admin/ai-control` | No inbound link found in components. Reachable only by URL (documented in memory but unlinked). Flag for nav addition or removal. |
| `admin/BlackVertexPage.tsx` | `/admin/black-vertex` | No inbound link. Standalone module without nav entry. |
| `admin/OblivionPage.tsx` | `/admin/oblivion` | No inbound link. Standalone module without nav entry. |
| `admin/RequiemDashboardPage.tsx` | `/admin/requiem` | No inbound link in components (only the `mem://` reference). Flag — likely should be linked from Admin Dashboard. |
| `admin/StrategyBrainStage3Page.tsx` | `/admin/strategy-brain-stage3` | No inbound link. Stage-3 testing surface, likely legacy. |
| `admin/AdminNotificationsPage.tsx` | `/admin/notifications` | Linked once from `NotificationCenter` dropdown — keep. NOT flagged. |
| `admin/EideticAlertPreferencesPage.tsx` | `/admin/eidetic/preferences` | Linked from `EideticDashboard` — keep. NOT flagged. |

## C. Pages that are kept (verified inbound links)

For transparency:
`Index`, `HomePage`, `AboutPage`, `ContactPage`, `PricingPage`, `Features`, `HowItWorksPage`, `BlogPage`, `BlogPostPage` (at `/blog/:slug`), `ScanPage`, `SimonLindsayPage`, `BiographyPage`, `Terms`, `PrivacyPolicyPage`, `DisclaimerPage`, `CybersecurityFrameworkPage`, `RequestDataAccessPage`, `Authentication`, `AdminLogin`, `UnsubscribePage`, `NotFound`, `Settings`, `SecureClientIntakePage`, `SmartIntakePage`, `ContentGenerationPage`, `ClientOnboardingPage`, `AdminDashboardPage`, `ClientManagementPage`, `SystemSettingsPage`, all `portal/*` pages, all `admin/shield/*` pages, `dashboard/mentions/index`.

---

## Summary counts

- **Orphan public pages**: 14
- **Duplicate / orphan admin pages**: 12
- **Total flagged for review**: 26

## Next step

After you review this report, approve a follow-up plan to:
1. Delete the clear orphans in section A (no inbound links, superseded by other flows).
2. Resolve the Genesis Sentinel duplication (`GenesisSentinel.tsx` wrapper + `GenesisSentinelPage.tsx`) by keeping one route.
3. Decide per admin page in section B whether to (a) add a nav entry / dashboard link, or (b) delete.

No files will be changed in this plan — it is reporting only.
