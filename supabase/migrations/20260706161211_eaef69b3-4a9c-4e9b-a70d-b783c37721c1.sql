CREATE POLICY "Clients can view their own resurfacing events"
ON public.eidetic_resurfacing_events
FOR SELECT
TO authenticated
USING (
  client_id IS NOT NULL
  AND public.user_owns_client(auth.uid(), client_id)
);