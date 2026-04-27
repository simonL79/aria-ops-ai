## Plan: restore admin authorization after login

I found that your Supabase login succeeds for `simon@ariaops.co.uk`, and the database already has an `admin` role row for your user ID. The failure is happening after sign-in when the frontend checks `is_current_user_admin()` and the route guard waits/redirects based on that result.

### What I will change

1. **Make the admin check more reliable in `useAuth.tsx`**
   - Stop relying only on the zero-argument RPC `is_current_user_admin()` immediately after login.
   - Check the signed-in user’s role directly with:
     - `user_roles.user_id = current user id`
     - `role = 'admin'`
   - Keep using the existing Supabase session token, so this remains server/RLS-backed rather than client-side bypass logic.
   - Ensure `isAdminLoading` is always cleared, even when the role query errors.

2. **Fix the login/routing timing issue**
   - After a successful password sign-in, have `signIn()` return the session/user from Supabase so the auth provider can synchronously verify the admin role.
   - Prevent `/auth` from redirecting to `/admin` before the admin check has finished.
   - Keep the post-login redirect to the originally requested admin page.

3. **Remove non-admin dashboard fallbacks from admin-only flows**
   - Because only admins log in, replace old `/dashboard` redirects in admin auth components with `/auth` or `/` as appropriate.
   - This avoids users being bounced to legacy dashboard routes when the admin check is simply still loading.

4. **Add a database hardening migration if needed**
   - Confirm `user_roles` RLS allows users to read their own role, which appears to already exist.
   - If the deployed DB function is inconsistent, add/refresh a safe `SECURITY DEFINER` function:
     - `public.is_current_user_admin()` checks `public.user_roles` for `auth.uid()` + `admin`
     - fixed `search_path = public`
   - No data will be deleted or dropped.

### Validation

After implementation, I’ll verify the flow by checking:

```text
Unauthenticated /admin/requiem -> /auth
Successful login -> returns to /admin/requiem
Direct /auth while already signed in -> /admin
Admin role query returns true for your current user
```

### Files likely touched

- `src/hooks/useAuth.tsx`
- `src/pages/Authentication.tsx`
- possibly `src/components/auth/AdminGuard.tsx` / `src/pages/AdminLogin.tsx` for legacy `/dashboard` redirects
- possibly one additive Supabase migration to refresh the admin-check function