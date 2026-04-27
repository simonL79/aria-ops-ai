
REVOKE EXECUTE ON FUNCTION public.get_user_client_ids(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_client_ids(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_client(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_entity(uuid, text) TO authenticated;
