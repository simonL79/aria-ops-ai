-- Revoke anon EXECUTE on all SECURITY DEFINER public functions
REVOKE EXECUTE ON FUNCTION public.guard_user_roles_bootstrap() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.log_compliance_activity(text, text, text, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.match_memories(vector, double precision, integer) FROM anon, public;

-- Revoke authenticated EXECUTE on trigger-only and sensitive helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_user_roles_bootstrap() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.match_memories(vector, double precision, integer) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.log_compliance_activity(text, text, text, jsonb) FROM authenticated;