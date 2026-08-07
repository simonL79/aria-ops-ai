CREATE TABLE public.error_alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text,
  threshold integer NOT NULL DEFAULT 5,
  window_minutes integer NOT NULL DEFAULT 60,
  cooldown_minutes integer NOT NULL DEFAULT 60,
  notify_email text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.error_alert_rules TO authenticated;
GRANT ALL ON public.error_alert_rules TO service_role;

ALTER TABLE public.error_alert_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage error alert rules"
ON public.error_alert_rules FOR ALL TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

CREATE TRIGGER trg_error_alert_rules_updated
BEFORE UPDATE ON public.error_alert_rules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.error_alert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES public.error_alert_rules(id) ON DELETE SET NULL,
  section text,
  error_count integer NOT NULL,
  threshold integer NOT NULL,
  window_minutes integer NOT NULL,
  notify_email text,
  email_sent boolean NOT NULL DEFAULT false,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.error_alert_events TO authenticated;
GRANT ALL ON public.error_alert_events TO service_role;

ALTER TABLE public.error_alert_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view error alert events"
ON public.error_alert_events FOR SELECT TO authenticated
USING (public.is_current_user_admin());

CREATE INDEX idx_client_error_logs_section_created
ON public.client_error_logs (section, created_at DESC);