CREATE TABLE public.eidetic_notification_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.eidetic_resurfacing_events(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_user_id uuid,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.eidetic_notification_log TO authenticated;
GRANT ALL ON public.eidetic_notification_log TO service_role;

ALTER TABLE public.eidetic_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notification log"
ON public.eidetic_notification_log
FOR SELECT
TO authenticated
USING (is_current_user_admin());

CREATE INDEX idx_eidetic_notification_log_event ON public.eidetic_notification_log(event_id);
CREATE INDEX idx_eidetic_notification_log_sent_at ON public.eidetic_notification_log(sent_at DESC);