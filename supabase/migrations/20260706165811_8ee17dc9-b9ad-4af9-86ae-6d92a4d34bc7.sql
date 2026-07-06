CREATE TABLE public.portal_notification_reads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_id uuid NOT NULL REFERENCES public.eidetic_resurfacing_events(id) ON DELETE CASCADE,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_notification_reads TO authenticated;
GRANT ALL ON public.portal_notification_reads TO service_role;

ALTER TABLE public.portal_notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own notification reads"
ON public.portal_notification_reads
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_portal_notification_reads_user ON public.portal_notification_reads(user_id);