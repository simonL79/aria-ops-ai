
REVOKE ALL ON FUNCTION public.get_user_client_ids(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_user_client_ids(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.user_owns_client(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_owns_client(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.user_owns_entity(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_owns_entity(uuid, text) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_user_client_ids(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) TO authenticated;
