-- Revoke anon (and PUBLIC) EXECUTE on SECURITY DEFINER functions that are not meant to be called by signed-out users.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.guard_user_roles_bootstrap() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.match_memories(vector, double precision, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.log_compliance_activity(text, text, text, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_client_ids(uuid) FROM anon, public;

-- Ensure the helpers remain callable by authenticated users and service role where required.
GRANT EXECUTE ON FUNCTION public.match_memories(vector, double precision, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_compliance_activity(text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_client_ids(uuid) TO authenticated;

-- increment_content_view is intentionally public (anonymous article view counting) and remains executable by anon.