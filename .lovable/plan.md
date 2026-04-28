## Goal

Consolidate the remaining duplicated pages so each concept (Dashboard, Clients/Intake, Mentions, Contact) maps to **one canonical file + route**. Remove the leftover variants registered in `nav-items.tsx` that nothing actually navigates to.

## Audit results

After the previous cleanup, no two files share the same basename anymore — but several **conceptual duplicates** remain:

### A. Mentions (3 files, 2 implementations)
- `src/pages/dashboard/MentionsPage.tsx` — 3-line re-export shim → `./mentions`
- `src/pages/dashboard/mentions.tsx` — 383-line full implementation
- `src/pages/dashboard/mentions/index.tsx` — 218-line different implementation (uses `MentionsTab` + `ClassifyTab`)

`./mentions` resolves to the **directory** (`mentions/index.tsx`), not the `mentions.tsx` file. So `mentions.tsx` is dead — its 383 lines are never imported. The shim + directory version is the live one.

### B. Contact (3 files, only one reachable)
- `src/pages/ContactPage.tsx` (99 lines) → routed at `/contact` — **linked from Footer, PricingPage, PricingSection** ✅ keep
- `src/pages/Contact.tsx` (192 lines) → routed at `/contact-us` — no link anywhere ❌
- `src/pages/ContactFormPage.tsx` (252 lines) → routed at `/contact-form` — no link anywhere ❌

### C. Dashboard variants registered but unreachable
`nav-items.tsx` still registers 4 admin-only `/dashboard/*-page` routes that nothing links to:
- `/dashboard/dashboard-page` → `DashboardPage`
- `/dashboard/aria-ingest-page` → `AriaIngestPage`
- `/dashboard/analytics-page` → `AnalyticsPage`
- `/dashboard/mentions-page` → `MentionsPage` (shim)

The real dashboards in use are `/admin` (`AdminDashboardPage`), `/admin/shield` (`ShieldDashboard`), `/admin/requiem` (`RequiemDashboardPage`), and `/portal` (`PortalDashboard`). The four `/dashboard/*-page` URLs are dead.

### D. Client intake variants
- `src/pages/ClientIntakePage.tsx` → `/client-intake` (registered in nav-items, no link)
- `src/pages/SmartIntakePage.tsx` → `/smart-intake` (App.tsx)
- `src/pages/SecureClientIntakePage.tsx` → `/secure-intake` (App.tsx)
- `src/pages/ClientOnboardingPage.tsx` → `/admin/client-onboarding` (App.tsx)

All four exist; `ClientIntakePage` is the unlinked one. The other three serve different intake flows. **Will only remove `ClientIntakePage`.**

## Changes

### Delete (7 files)
1. `src/pages/dashboard/mentions.tsx` — orphan implementation, superseded by `mentions/index.tsx`
2. `src/pages/dashboard/MentionsPage.tsx` — re-export shim no longer needed
3. `src/pages/dashboard/DashboardPage.tsx` — only referenced by the dead `/dashboard/dashboard-page` nav entry
4. `src/pages/dashboard/AriaIngestPage.tsx` — only referenced by the dead `/dashboard/aria-ingest-page` nav entry
5. `src/pages/dashboard/AnalyticsPage.tsx` — only referenced by the dead `/dashboard/analytics-page` nav entry
6. `src/pages/Contact.tsx` — `/contact-us` route is unlinked
7. `src/pages/ContactFormPage.tsx` — `/contact-form` route is unlinked
8. `src/pages/ClientIntakePage.tsx` — `/client-intake` route is unlinked

### Update routes
- Add a **route alias** in `App.tsx`: `/dashboard/mentions` → the canonical `mentions/index.tsx` (admin-protected). This preserves the existing `navigate('/dashboard/mentions?alert=...')` call in `src/components/dashboard/MentionMonitor/index.tsx`.
- Remove the four `/dashboard/*-page` entries and their imports from `nav-items.tsx`.
- Remove the `/contact-us`, `/contact-form`, `/client-intake` entries and their imports from `nav-items.tsx`.

### Keep (canonical mapping)
| Concept | File | Route |
|---|---|---|
| Public homepage | `Index.tsx` (wraps `HomePage.tsx`) | `/` |
| Marketing home | `HomePage.tsx` | `/home` |
| Public contact | `ContactPage.tsx` | `/contact` |
| Admin dashboard | `admin/AdminDashboardPage.tsx` | `/admin` |
| Shield dashboard | `admin/shield/ShieldDashboard.tsx` | `/admin/shield` |
| Requiem dashboard | `admin/RequiemDashboardPage.tsx` | `/admin/requiem` |
| Client portal dashboard | `portal/PortalDashboard.tsx` | `/portal` |
| Mentions workspace | `dashboard/mentions/index.tsx` | `/dashboard/mentions` |
| Client management | `admin/ClientManagementPage.tsx` | `/admin/clients` |
| Intake flows | `SmartIntakePage`, `SecureClientIntakePage`, `ClientOnboardingPage` | `/smart-intake`, `/secure-intake`, `/admin/client-onboarding` |

## Verification

1. `rg "from .*['\"].*pages/(Contact\b|ContactFormPage|ClientIntakePage|dashboard/MentionsPage|dashboard/DashboardPage|dashboard/AriaIngestPage|dashboard/AnalyticsPage)['\"]"` returns nothing after cleanup.
2. `rg "dashboard/mentions"` shows the new `App.tsx` route + the existing `MentionMonitor` navigate call resolve to `mentions/index.tsx`.
3. Build passes (auto-run by harness).
4. Footer and Pricing page "Contact" links still work (`/contact` → `ContactPage`).
5. `/admin`, `/admin/shield`, `/portal`, `/dashboard/mentions` all load.

## Out of scope

- Not touching legacy nav-link references in `Sidebar.tsx`, `MainNav.tsx`, `Navbar.tsx`, `DashboardSidebar.tsx`, `MobileNav.tsx`, `DashboardSidebarContent.tsx`, `DashboardNavigation.tsx` (they point to many of the routes already removed in the previous turn — that's a separate cleanup pass; will surface as a follow-up).
- Not removing intake flows (they each serve a different funnel step).
- No DB / edge-function changes.
- No styling changes.
