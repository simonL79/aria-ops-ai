

# Audit & Consolidate Duplicate Admin Routes

## Problem

The routing is split across two systems — explicit routes in `App.tsx` and dynamic routes from `navItems` in `nav-items.tsx` — with significant overlap. Many pages are registered twice (or more) under slightly different paths, pointing to the same component.

## Identified Duplicates

### Exact path collisions (App.tsx + navItems both define the same path)
| Path | Effect |
|------|--------|
| `/admin/strategy-brain-stage3` | Defined in both — App.tsx wins (rendered first) |
| `/admin/strategy-brain-test` | Same |
| `/admin/clients` | Same |
| `/admin/settings` | Same |
| `/secure-intake` | Same |

### Same component, different paths
| Paths | Component | Keep |
|-------|-----------|------|
| `/admin/control-center` + `/control-center` + `/admin/control-center-page` | ControlCenterPage | `/admin/control-center` |
| `/admin` + `/admin/dashboard` + `/admin/admin-dashboard` | AdminDashboard variants | `/admin` |
| `/admin/keyword-to-article` + `/admin/keyword-to-article-system` | KeywordToArticleSystemPage | `/admin/keyword-to-article` |
| `/admin/clients` + `/admin/client-management` | ClientManagementPage | `/admin/clients` |
| `/admin/settings` + `/admin/system-settings` | SystemSettingsPage | `/admin/settings` |
| `/admin/client-onboarding` + `/client-onboarding` | ClientOnboardingPage | `/admin/client-onboarding` |
| `/genesis-sentinel-page` + `/genesis-sentinel` + `/sentinel-page` + `/sentinel-operator-page` | Sentinel variants | consolidate to 2 |
| `/monitor` + `/monitoring` | Monitor variants | `/monitor` |
| `/reports` + `/reports-page` | Reports variants | `/reports` |
| `/clients` + `/clients-page` | Clients variants | `/clients` |
| `/clean-launch` + `/clean-launch-page` | CleanLaunch variants | `/clean-launch` |
| `/anubis-gpt-cockpit` + `/anubis-cockpit` | Anubis variants | `/anubis-cockpit` |
| `/intelligence-workbench` + `/intelligence/intelligence-workbench-page` | Same | `/intelligence-workbench` |
| `/offensive-operations` + `/intelligence/offensive-operations-page` | Same | `/offensive-operations` |

## Plan

### 1. Consolidate App.tsx explicit routes
- Remove `/control-center` (keep `/admin/control-center`)
- Keep all other explicit App.tsx admin routes as the canonical source — they take priority

### 2. Remove duplicates from navItems
Remove entries from `nav-items.tsx` where the same path or same component is already registered in App.tsx:
- Remove `/admin/strategy-brain-stage3` (exact dup)
- Remove `/admin/strategy-brain-test` (exact dup)
- Remove `/admin/clients` (exact dup of App.tsx)
- Remove `/admin/settings` (exact dup of App.tsx)
- Remove `/secure-intake` (exact dup)
- Remove `/admin/control-center-page` (variant dup)
- Remove `/admin/admin-dashboard` (variant dup)
- Remove `/admin/keyword-to-article-system` (variant dup — keep App.tsx's `/admin/keyword-to-article`)
- Remove `/admin/system-settings` (variant dup — keep App.tsx's `/admin/settings`)
- Remove `/admin/client-management` (variant dup — keep App.tsx's `/admin/clients`)

### 3. Consolidate non-admin duplicates in navItems
- Remove `/monitoring` (keep `/monitor`)
- Remove `/reports-page` (keep `/reports`)
- Remove `/clients-page` (keep `/clients`)
- Remove `/clean-launch-page` (keep `/clean-launch`)
- Remove `/anubis-gpt-cockpit` (keep `/anubis-cockpit`)
- Remove `/intelligence/intelligence-workbench-page` (keep `/intelligence-workbench`)
- Remove `/intelligence/offensive-operations-page` (keep `/offensive-operations`)

### 4. Clean up AdminDashboard.tsx internal router
`AdminDashboard.tsx` has its own nested `<Routes>` that duplicate App.tsx routes. Since App.tsx handles all admin routing directly, simplify `AdminDashboard.tsx` to just render `<ControlCenterPage />` (the default admin landing) without its own router.

### 5. Remove unused imports
Clean up imports in `App.tsx` and `nav-items.tsx` for any removed pages/components.

## Files Changed

| File | Action |
|------|--------|
| `src/App.tsx` | Remove `/control-center` duplicate route |
| `src/nav-items.tsx` | Remove ~17 duplicate entries + unused imports |
| `src/components/admin/AdminDashboard.tsx` | Simplify — remove internal Routes |

## Risk

Low. No functionality is removed — only duplicate paths that resolve to the same components. The canonical (shorter/cleaner) path is always preserved.

