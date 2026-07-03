CREATE OR REPLACE FUNCTION public.increment_content_view(item_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.content_items SET view_count = view_count + 1 WHERE id = item_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_content_view(uuid) TO anon, authenticated;