
-- Per-user EIDETIC alert preferences
CREATE TABLE public.eidetic_alert_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email_enabled boolean NOT NULL DEFAULT true,
  email_min_severity text NOT NULL DEFAULT 'high',
  event_type_filter text[],
  narrative_category_filter text[],
  quiet_hours_start time,
  quiet_hours_end time,
  quiet_hours_timezone text NOT NULL DEFAULT 'Europe/London',
  digest_frequency text NOT NULL DEFAULT 'daily',
  digest_send_time time NOT NULL DEFAULT '08:00',
  digest_last_sent_at timestamptz,
  mute_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT eidetic_alert_preferences_severity_chk CHECK (email_min_severity IN ('low','medium','high','critical')),
  CONSTRAINT eidetic_alert_preferences_digest_chk CHECK (digest_frequency IN ('off','daily','weekly'))
);

ALTER TABLE public.eidetic_alert_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own preferences"
  ON public.eidetic_alert_preferences FOR SELECT
  USING (auth.uid() = user_id OR public.is_current_user_admin());

CREATE POLICY "Users insert own preferences"
  ON public.eidetic_alert_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own preferences"
  ON public.eidetic_alert_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own preferences"
  ON public.eidetic_alert_preferences FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_eidetic_alert_preferences_updated_at
  BEFORE UPDATE ON public.eidetic_alert_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Digest send audit/idempotency log
CREATE TABLE public.eidetic_digest_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  digest_type text NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  event_count integer NOT NULL DEFAULT 0,
  critical_count integer NOT NULL DEFAULT 0,
  high_count integer NOT NULL DEFAULT 0,
  resolved_count integer NOT NULL DEFAULT 0,
  email_sent boolean NOT NULL DEFAULT false,
  email_message_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT eidetic_digest_log_type_chk CHECK (digest_type IN ('daily','weekly'))
);

ALTER TABLE public.eidetic_digest_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view digest log"
  ON public.eidetic_digest_log FOR SELECT
  USING (public.is_current_user_admin());

CREATE INDEX idx_eidetic_digest_log_user_created
  ON public.eidetic_digest_log (user_id, created_at DESC);
