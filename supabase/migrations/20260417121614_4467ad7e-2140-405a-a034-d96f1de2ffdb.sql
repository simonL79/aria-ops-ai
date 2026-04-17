-- Tier 5: extend resurfacing events
ALTER TABLE public.eidetic_resurfacing_events
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS snoozed_until timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid,
  ADD COLUMN IF NOT EXISTS resolution_notes text;

CREATE INDEX IF NOT EXISTS idx_resurfacing_status ON public.eidetic_resurfacing_events(status);
CREATE INDEX IF NOT EXISTS idx_resurfacing_snoozed ON public.eidetic_resurfacing_events(snoozed_until) WHERE snoozed_until IS NOT NULL;

-- Tier 5: audit trail
CREATE TABLE IF NOT EXISTS public.eidetic_alert_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.eidetic_resurfacing_events(id) ON DELETE CASCADE,
  action_type text NOT NULL, -- acknowledge | snooze | unsnooze | assign | resolve | reopen | dispatch
  actor uuid,
  prior_status text,
  new_status text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alert_actions_alert ON public.eidetic_alert_actions(alert_id, created_at DESC);
ALTER TABLE public.eidetic_alert_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view alert actions" ON public.eidetic_alert_actions
  FOR SELECT USING (public.is_current_user_admin());
CREATE POLICY "Admins insert alert actions" ON public.eidetic_alert_actions
  FOR INSERT WITH CHECK (public.is_current_user_admin());

-- Tier 7: response hooks
CREATE TABLE IF NOT EXISTS public.eidetic_response_hooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  trigger_event_types text[] NOT NULL DEFAULT '{}',
  trigger_min_severity text NOT NULL DEFAULT 'high', -- low|medium|high|critical
  trigger_narrative_categories text[] DEFAULT '{}',
  action_type text NOT NULL, -- requiem | legal_erasure | counter_narrative
  action_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  requires_approval boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.eidetic_response_hooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage hooks" ON public.eidetic_response_hooks
  FOR ALL USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());

CREATE TRIGGER trg_response_hooks_updated
  BEFORE UPDATE ON public.eidetic_response_hooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tier 7: dispatch log
CREATE TABLE IF NOT EXISTS public.eidetic_dispatched_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_id uuid REFERENCES public.eidetic_response_hooks(id) ON DELETE SET NULL,
  event_id uuid REFERENCES public.eidetic_resurfacing_events(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | dispatched | failed | rejected
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb DEFAULT '{}'::jsonb,
  approved_by uuid,
  approved_at timestamptz,
  dispatched_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dispatched_status ON public.eidetic_dispatched_responses(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dispatched_event ON public.eidetic_dispatched_responses(event_id);
ALTER TABLE public.eidetic_dispatched_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view dispatches" ON public.eidetic_dispatched_responses
  FOR SELECT USING (public.is_current_user_admin());
CREATE POLICY "Admins insert dispatches" ON public.eidetic_dispatched_responses
  FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "Admins update dispatches" ON public.eidetic_dispatched_responses
  FOR UPDATE USING (public.is_current_user_admin());