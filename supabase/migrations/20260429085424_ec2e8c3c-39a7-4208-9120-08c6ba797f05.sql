
DROP POLICY IF EXISTS "Only admins can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.guard_user_roles_bootstrap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_count int;
  jwt_role text;
BEGIN
  SELECT count(*) INTO existing_count FROM public.user_roles;
  jwt_role := current_setting('request.jwt.claim.role', true);

  IF existing_count = 0 AND coalesce(jwt_role, '') <> 'service_role' THEN
    RAISE EXCEPTION 'user_roles bootstrap requires service_role'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_bootstrap_guard ON public.user_roles;
CREATE TRIGGER user_roles_bootstrap_guard
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_user_roles_bootstrap();

REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
