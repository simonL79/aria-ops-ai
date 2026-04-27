# Client Portal — Read-Only

A separate, locked-down area at `/portal` where a client signs in and sees **only their own** data: executive reports, threats/mentions, sentiment scores, and new findings. No admin pages, no other clients' data, no write access.

## How it works

```text
Client signs in at /auth
        │
        ▼
useAuth checks role
        │
   ┌────┴─────┐
   │          │
 admin     client (has row in client_portal_users)
   │          │
   ▼          ▼
 /admin     /portal  ← read-only dashboard
```

A client account is just a Supabase auth user that has been **linked to a `clients` row** via the existing `clients.primary_contact_user_id` column (we'll also add a `client_portal_users` mapping table for multi-user-per-client support). They have **no** row in `user_roles`, so they cannot access `/admin/*`.

## Pages (all under `/portal`)

1. **`/portal`** — Overview dashboard
   - Their entity name + tier
   - Headline sentiment score (avg from `scan_results.sentiment` over last 30d)
   - Counts: open threats, new findings this week, total reports
   - Recent activity feed

2. **`/portal/reports`** — list of `executive_reports` for their `client_id`, with PDF download links

3. **`/portal/threats`** — `threats` + `scan_results` filtered to their entity, with severity, source, URL, sentiment

4. **`/portal/findings`** — newest discoveries (last 30 days), sorted by created_at

5. **`/portal/account`** — view-only profile + sign out

## Database changes (additive only — per data integrity rule)

1. **New table `client_portal_users`** — links auth users to a client (one client can have multiple portal users; one user can belong to multiple clients if needed)
   ```sql
   create table public.client_portal_users (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null,           -- auth.users.id
     client_id uuid not null references public.clients(id) on delete cascade,
     created_at timestamptz default now(),
     unique(user_id, client_id)
   );
   alter table public.client_portal_users enable row level security;
   ```

2. **Security definer helpers**
   ```sql
   -- Get the client_ids a user can see
   create or replace function public.get_user_client_ids(_user_id uuid)
   returns setof uuid language sql stable security definer set search_path=public as $$
     select client_id from public.client_portal_users where user_id = _user_id
     union
     select id from public.clients where primary_contact_user_id = _user_id
   $$;

   create or replace function public.user_owns_client(_user_id uuid, _client_id uuid)
   returns boolean language sql stable security definer set search_path=public as $$
     select exists(select 1 from public.get_user_client_ids(_user_id) cid where cid = _client_id)
   $$;

   create or replace function public.user_owns_entity(_user_id uuid, _entity text)
   returns boolean language sql stable security definer set search_path=public as $$
     select exists(
       select 1 from public.clients c
       where c.name = _entity
         and (c.primary_contact_user_id = _user_id
              or exists(select 1 from public.client_portal_users cpu
                        where cpu.client_id = c.id and cpu.user_id = _user_id))
     )
   $$;
   ```

3. **Additive RLS policies** (do not touch existing admin policies)
   - `executive_reports`: add SELECT policy `user_owns_client(auth.uid(), client_id)`
   - `clients`: add SELECT policy `user_owns_client(auth.uid(), id)` (limited columns via a view)
   - `threats` & `scan_results`: add SELECT policy `user_owns_entity(auth.uid(), entity_name)`
   - `client_portal_users`: SELECT only own rows; INSERT/UPDATE/DELETE admin-only

4. **Public view `client_portal_clients`** (`security_invoker=on`) exposing only safe columns: `id, name, tier, industry, status, onboarded_at` — never internal notes, contact emails of others, etc.

## Frontend changes

1. **`useAuth`** — add `isClientPortalUser` boolean + `clientIds` array. Computed by querying `get_user_client_ids` RPC after sign-in.

2. **New `ClientPortalRoute` guard** (`src/components/auth/ClientPortalRoute.tsx`) — requires authenticated + `clientIds.length > 0`; redirects admins to `/admin`, unlinked users to a "no access yet" page.

3. **Routing in `App.tsx`** — add `/portal` route group:
   ```tsx
   <Route element={<ClientPortalRoute />}>
     <Route path="/portal" element={<PortalDashboard />} />
     <Route path="/portal/reports" element={<PortalReports />} />
     <Route path="/portal/threats" element={<PortalThreats />} />
     <Route path="/portal/findings" element={<PortalFindings />} />
     <Route path="/portal/account" element={<PortalAccount />} />
   </Route>
   ```

4. **Post-login redirect** — `Authentication.tsx` already redirects to `/admin`. Update so admins go to `/admin`, portal users go to `/portal`, others stay on `/`.

5. **New layout** `PortalLayout.tsx` — sidebar with Dashboard / Reports / Threats / Findings / Account; visually consistent with the dark/orange brand but distinct from admin (e.g. "Client Portal" header, no admin nav items).

6. **All portal queries are SELECT-only** — no mutations anywhere in `/portal`. Use `supabase.from(...).select(...)`; RLS enforces row scope server-side regardless.

## Admin-side support (small additions)

In `/admin/clients`, add a "Portal Access" section per client:
- Show linked portal users
- "Invite portal user" button → admin enters email → calls new edge function `invite-portal-user` which:
  1. `requireAdmin` guard
  2. Sends Supabase auth invite (`admin.inviteUserByEmail`) using service role
  3. Inserts row into `client_portal_users` linking that user to the client

This is the only write path; clients themselves never insert anything.

## Out of scope (deferred)
- Client-initiated scan requests (could be a later phase)
- In-portal messaging / support chat
- File upload by clients
- Multi-factor for portal users (recommended later)

## Files to create
- `supabase/migrations/<ts>_client_portal.sql` (table + functions + RLS + view)
- `supabase/functions/invite-portal-user/index.ts`
- `src/components/auth/ClientPortalRoute.tsx`
- `src/components/portal/PortalLayout.tsx`
- `src/pages/portal/PortalDashboard.tsx`
- `src/pages/portal/PortalReports.tsx`
- `src/pages/portal/PortalThreats.tsx`
- `src/pages/portal/PortalFindings.tsx`
- `src/pages/portal/PortalAccount.tsx`
- `src/components/admin/clients/PortalAccessPanel.tsx`

## Files to modify
- `src/hooks/useAuth.tsx` — add portal-user detection
- `src/App.tsx` — add `/portal` route group
- `src/pages/Authentication.tsx` — role-based post-login redirect
- `src/pages/admin/ClientManagementPage.tsx` (or its detail view) — add PortalAccessPanel
