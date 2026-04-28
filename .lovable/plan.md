## Goal

Remove pages that are no longer used. Scope per your selections:
1. QA / system-test pages
2. Duplicate dashboards / clients / intelligence files
3. Old standalone tool pages superseded by Shield + Portal

I'll also delete the 11 pages that have **zero** references anywhere in the codebase (true orphans), since they're objectively dead weight.

## Method

For every candidate I:
1. Confirm it isn't imported anywhere except its own definition (or only by `nav-items.tsx`).
2. Delete the file.
3. Remove its `nav-items.tsx` entry + import.
4. Remove any `<Route>` in `App.tsx` and any nav links in `Navbar.tsx`, `Sidebar.tsx`, `MainNav.tsx`, `AdminDashboardPage.tsx`, `SalesFunnelPage.tsx` etc.
5. After all deletions, run a final `rg` sweep to ensure no broken imports or dead links remain.

## Deletion list (60 files)

### A. Zero-reference orphan files (11) — safe, nothing imports them
- `src/pages/AdminPasswordResetPage.tsx`
- `src/pages/ContactInquiries.tsx`
- `src/pages/GDPRCompliancePage.tsx`
- `src/pages/MonitoringPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/pages/ResourcesPage.tsx`
- `src/pages/SalesFunnelPage.tsx` *(the homepage uses `HomePage.tsx`/`Index.tsx`, not this; will verify before delete)*
- `src/pages/ThreatsManagement.tsx`
- `src/pages/admin/WatchtowerPage.tsx`
- `src/pages/dashboard/mentions/MentionDetailsDialog.tsx`
- `src/pages/intelligence/EnhancedIntelligenceWorkbench.tsx`

### B. QA / system-test pages (7)
- `src/pages/QASystemTestPage.tsx`
- `src/pages/QATestPage.tsx`
- `src/pages/SystemCheckPage.tsx`
- `src/pages/admin/SystemAuditPage.tsx`
- `src/pages/admin/SystemOptimizationPage.tsx`
- `src/pages/admin/SystemCompletionPage.tsx`
- `src/pages/admin/StrategyBrainTestPage.tsx`

### C. Duplicate dashboards / clients / intelligence (8)
Keep the one inside the subfolder (the modern one), drop the legacy root copy.

| Keep | Delete |
|---|---|
| `src/pages/admin/AdminDashboardPage.tsx` | `src/pages/AdminDashboard.tsx`, `src/pages/admin/AdminDashboard.tsx`, `src/pages/Dashboard.tsx` |
| `src/pages/dashboard/AnalyticsPage.tsx` | `src/pages/AnalyticsPage.tsx` |
| `src/pages/admin/ClientManagementPage.tsx` | `src/pages/Clients.tsx`, `src/pages/ClientsPage.tsx`, `src/pages/admin/ClientsPage.tsx` |
| (none — drop both) | `src/pages/IntelligenceWorkbench.tsx`, `src/pages/intelligence/IntelligenceWorkbench.tsx` |
| (none — drop both) | `src/pages/OffensiveOperations.tsx`, `src/pages/intelligence/OffensiveOperations.tsx` |
| `src/pages/Settings.tsx` (or `admin/SettingsPage.tsx` — will pick whichever is currently routed) | the other |
| `src/pages/EnhancedIntelligence.tsx` | superseded — drop |

### D. Old standalone tool pages superseded by Shield/Portal (12)
- `src/pages/Discovery.tsx`
- `src/pages/Monitor.tsx`
- `src/pages/Threats.tsx` *(if present; otherwise skip)*
- `src/pages/ThreatsPage.tsx`
- `src/pages/InfluencerRadar.tsx`
- `src/pages/Removal.tsx`
- `src/pages/Reports.tsx`
- `src/pages/dashboard/CommandCenterPage.tsx`
- `src/pages/dashboard/RadarPage.tsx`
- `src/pages/dashboard/ThreatResponsePage.tsx`
- `src/pages/dashboard/IntelligencePage.tsx`
- `src/pages/dashboard/ScanSubmissionsPage.tsx`

These currently have nav links in `Navbar.tsx`, `Sidebar.tsx`, `MainNav.tsx`. Those entries will be removed too.

## Pages explicitly KEPT (not touched)

- All public marketing: `HomePage`, `Index`, `AboutPage`, `Features`, `PricingPage`, `HowItWorksPage`, `Contact`/`ContactPage`/`ContactFormPage` (will keep one), `BlogPage`, `BlogPostPage`, `BlogAdminPage`, `SimonLindsayPage`, `BiographyPage`, `CybersecurityFrameworkPage`
- All legal: `Terms`, `PrivacyPolicyPage`, `DisclaimerPage`, `DPARequestPage`, `RequestDataAccessPage`, `UnsubscribePage`
- Auth: `Authentication`, `AdminLogin`
- Scan funnel: `ScanPage`, `ReputationScanPage`, `ReputationScanForm`, `FreeScanResults`, `ThankYouPage`, `PaymentPage`
- Intake: `ClientIntakePage`, `ClientOnboardingPage`, `SecureClientIntakePage`, `SmartIntakePage`, `ContentGenerationPage`
- Portal (all 8 in `src/pages/portal/`)
- Shield (all in `src/pages/admin/shield/`)
- Active admin modules: `AdminDashboardPage`, `AIControlPage`, `AdminNotificationsPage`, `BlackVertexPage`, `EideticAlertPreferencesPage`, `RequiemDashboardPage`, `SystemSettingsPage`, `OperatorConsole`, `EmergencyStrikePage`, `AiScrapingPage`, `EideticPage`, `ExecutiveReportsPage`, `UsersPage`, `CalendarPage`, `NotFound`
- Legacy admin modules from category 1 (Genesis Sentinel, Persona Saturation, Legal Ops, Intelligence Core, Oblivion, Strategy Brain, Sentinel) — **kept**, since you didn't tick that box. Tell me later if you want them gone too.

## Verification after deletion

- `rg "import .* from .* (DeletedName)"` returns nothing for each removed file.
- `npm run build` (auto-run by harness) succeeds with no missing-module errors.
- Manually walk: `/`, `/auth`, `/admin/shield`, `/portal` — all load.
- Sidebar/Navbar render without broken links.

## Out of scope

- No DB / RLS / edge-function changes.
- No styling changes.
- Legacy admin modules listed above remain, pending your call.
- `nav-items.tsx` will be cleaned of removed entries but not otherwise reorganized.
