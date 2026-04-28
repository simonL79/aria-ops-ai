## Goal

Stop login from landing on the old "ARIA Command" view. After login, admins go to the Shield Dashboard. The legacy ARIA Command page is fully removed, and the site is republished so the live domain reflects the change.

## Why this is happening

- The currently *deployed* build at `ariaops.co.uk` / `aria-ops-ai.lovable.app` is older than the current preview. In the current code, `/admin` already routes to `AdminDashboardPage`, but the published bundle still serves the old "ARIA Command" view. Republishing is required for any frontend change to go live.
- `src/pages/AriaCommand.tsx` and a `nav-items.tsx` entry for `/aria-command` still exist, plus a footer link in `SalesFunnelPage.tsx`. These need to be removed so the page can't be reached.

## Changes

### 1. Change admin landing target to `/admin/shield`
- `src/pages/Authentication.tsx` (line 44): change `isAdmin ? '/admin' : ...` to `isAdmin ? '/admin/shield' : ...`.
- `src/pages/AdminLogin.tsx` (line 23): change `<Navigate to="/admin" replace />` to `<Navigate to="/admin/shield" replace />`.
- `src/components/auth/AdminLoginGateway.tsx` (line 87): change `navigate('/admin', ...)` to `navigate('/admin/shield', ...)`.
- `src/components/auth/ClientPortalRoute.tsx` (line 22): change admin redirect from `/admin` to `/admin/shield`.

`/admin` itself stays available (AdminDashboardPage) for anyone who navigates there directly — only the post-login destination changes.

### 2. Retire the legacy ARIA Command page
- Delete `src/pages/AriaCommand.tsx`.
- Remove the `Aria Command` entry (title/to/page) from `src/nav-items.tsx` and drop the now-unused `AriaCommand` import.
- Remove the `<Link to="/aria-command">Intelligence Reports</Link>` line from `src/pages/SalesFunnelPage.tsx` footer.
- Confirm nothing else imports `AriaCommand` (rg already shows only the two references above).

### 3. Republish
- After the code changes land, open the Publish dialog and click **Update** so the live domains (`ariaops.co.uk`, `www.ariaops.co.uk`, `aria-ops-ai.lovable.app`) serve the new bundle. Edge functions and DB changes already deploy automatically — only the frontend needs the manual republish.

## Verification

1. In the live preview, log in as an admin → should land on `/admin/shield` (Shield Dashboard).
2. Visit `/aria-command` directly → should hit the catch-all 404 (no longer registered).
3. Sales funnel footer no longer shows "Intelligence Reports" linking to `/aria-command`.
4. After republish, repeat step 1 on `https://ariaops.co.uk` to confirm the old "ARIA Command" view is gone.

## Out of scope

- No backend/RLS/edge function changes.
- No styling changes to the Shield Dashboard itself.
- The standalone `/admin` dashboard page is left intact in case it's still wanted as a system-overview view.
