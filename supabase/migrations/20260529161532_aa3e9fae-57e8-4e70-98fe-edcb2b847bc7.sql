-- Harden SECURITY DEFINER helper functions: remove direct execute access
-- from anon/authenticated/public. They remain usable inside RLS policies
-- (evaluated in the table owner's context) and by service_role.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_user_client_ids(uuid) FROM anon, authenticated, public;

-- Ensure the internal service role retains execute (idempotent).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_client_ids(uuid) TO service_role;

-- Prevent future functions in public from being auto-granted to anon/authenticated.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, public;