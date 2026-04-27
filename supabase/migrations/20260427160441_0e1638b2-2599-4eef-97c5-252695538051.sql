-- Restrict Realtime channel subscriptions to admin users only.
-- Without policies on realtime.messages, any authenticated JWT holder can subscribe to any channel
-- and receive postgres_changes broadcasts (e.g. eidetic_resurfacing_events).

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins only realtime" ON realtime.messages;

CREATE POLICY "Admins only realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::text));

DROP POLICY IF EXISTS "Admins only realtime broadcast" ON realtime.messages;

CREATE POLICY "Admins only realtime broadcast"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::text));