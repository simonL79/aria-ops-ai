-- Harden the public view-counter: it must only increment a single item's counter.
CREATE OR REPLACE FUNCTION public.increment_content_view(item_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  UPDATE public.content_items
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = item_id;
$function$;

-- Remove the redundant, overly-broad PUBLIC execute grant.
REVOKE EXECUTE ON FUNCTION public.increment_content_view(uuid) FROM PUBLIC;

-- Keep only the explicit roles the app needs (anon = anonymous content viewers).
GRANT EXECUTE ON FUNCTION public.increment_content_view(uuid) TO anon, authenticated, service_role;