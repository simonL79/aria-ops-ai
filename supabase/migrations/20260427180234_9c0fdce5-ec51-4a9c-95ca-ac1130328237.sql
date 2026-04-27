-- ============== ENUMS ==============
DO $$ BEGIN
  CREATE TYPE public.shield_alert_type AS ENUM (
    'impersonation','spoofed_domain','phishing','scam_ad','fake_endorsement',
    'deepfake','data_leak','doxxing','harassment','defamation_risk',
    'misinformation','hostile_narrative','account_takeover','dark_web_exposure',
    'search_result_risk','unknown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.shield_alert_status AS ENUM (
    'new','triaged','evidence_required','evidence_captured','action_required',
    'takedown_opened','legal_review','law_enforcement_review','monitoring',
    'resolved','false_positive'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.shield_severity AS ENUM ('p1_critical','p2_high','p3_medium','p4_low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.shield_takedown_status AS ENUM (
    'draft','submitted','acknowledged','removed','rejected','escalated','closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============== CORE: ALERTS ==============
CREATE TABLE IF NOT EXISTS public.shield_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_threat_id uuid,
  client_id uuid,
  entity_name text,
  alert_type public.shield_alert_type NOT NULL DEFAULT 'unknown',
  title text NOT NULL,
  summary text,
  source text,
  source_url text,
  source_platform text,
  status public.shield_alert_status NOT NULL DEFAULT 'new',
  severity public.shield_severity NOT NULL DEFAULT 'p4_low',
  harm_score int NOT NULL DEFAULT 0,
  reach_score int NOT NULL DEFAULT 0,
  public_risk_score int NOT NULL DEFAULT 0,
  legal_risk_score int NOT NULL DEFAULT 0,
  confidence_score int NOT NULL DEFAULT 50,
  urgency_score int NOT NULL DEFAULT 0,
  total_score int NOT NULL DEFAULT 0,
  client_visible boolean NOT NULL DEFAULT false,
  assigned_to uuid,
  created_by uuid,
  detected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_alerts_status ON public.shield_alerts(status);
CREATE INDEX IF NOT EXISTS idx_shield_alerts_severity ON public.shield_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_shield_alerts_client ON public.shield_alerts(client_id);
CREATE INDEX IF NOT EXISTS idx_shield_alerts_source_threat ON public.shield_alerts(source_threat_id);
CREATE INDEX IF NOT EXISTS idx_shield_alerts_created ON public.shield_alerts(created_at DESC);

CREATE TRIGGER trg_shield_alerts_updated_at
  BEFORE UPDATE ON public.shield_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.shield_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access shield_alerts" ON public.shield_alerts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Portal users read client-visible alerts" ON public.shield_alerts
  FOR SELECT TO authenticated
  USING (
    client_visible = true
    AND client_id IS NOT NULL
    AND public.user_owns_client(auth.uid(), client_id)
  );

-- ============== ALERT EVENTS ==============
CREATE TABLE IF NOT EXISTS public.shield_alert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  actor_id uuid,
  from_status public.shield_alert_status,
  to_status public.shield_alert_status,
  event_type text NOT NULL,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_alert_events_alert ON public.shield_alert_events(alert_id, created_at DESC);
ALTER TABLE public.shield_alert_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_alert_events" ON public.shield_alert_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== EVIDENCE VAULT ==============
CREATE TABLE IF NOT EXISTS public.shield_evidence_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  evidence_type text NOT NULL,
  source_url text,
  source_platform text,
  storage_path text,
  captured_text text,
  content_hash text,
  captured_by uuid,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}',
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_evidence_alert ON public.shield_evidence_items(alert_id, captured_at DESC);
ALTER TABLE public.shield_evidence_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_evidence" ON public.shield_evidence_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== SCORE EVENTS ==============
CREATE TABLE IF NOT EXISTS public.shield_score_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  actor_id uuid,
  harm_score int NOT NULL DEFAULT 0,
  reach_score int NOT NULL DEFAULT 0,
  public_risk_score int NOT NULL DEFAULT 0,
  legal_risk_score int NOT NULL DEFAULT 0,
  confidence_score int NOT NULL DEFAULT 0,
  urgency_score int NOT NULL DEFAULT 0,
  total_score int NOT NULL DEFAULT 0,
  severity public.shield_severity NOT NULL DEFAULT 'p4_low',
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_score_events_alert ON public.shield_score_events(alert_id, created_at DESC);
ALTER TABLE public.shield_score_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_score_events" ON public.shield_score_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== TAKEDOWN CASES (Phase 3 schema) ==============
CREATE TABLE IF NOT EXISTS public.shield_takedown_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  oblivion_takedown_id uuid,
  route text NOT NULL,
  target_provider text,
  target_url text,
  abuse_contact text,
  legal_basis text,
  status public.shield_takedown_status NOT NULL DEFAULT 'draft',
  submitted_at timestamptz,
  response_due_at timestamptz,
  removed_at timestamptz,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_takedown_alert ON public.shield_takedown_cases(alert_id);
CREATE INDEX IF NOT EXISTS idx_shield_takedown_status ON public.shield_takedown_cases(status);
CREATE TRIGGER trg_shield_takedown_cases_updated_at
  BEFORE UPDATE ON public.shield_takedown_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.shield_takedown_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_takedown_cases" ON public.shield_takedown_cases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_takedown_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  takedown_case_id uuid NOT NULL REFERENCES public.shield_takedown_cases(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'draft',
  recipient text,
  subject text,
  body text NOT NULL,
  submitted_by uuid,
  external_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shield_takedown_subs_case ON public.shield_takedown_submissions(takedown_case_id);
ALTER TABLE public.shield_takedown_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_takedown_subs" ON public.shield_takedown_submissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== INCIDENTS / CRISIS ROOM (Phase 4 schema) ==============
CREATE TABLE IF NOT EXISTS public.shield_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid,
  title text NOT NULL,
  severity public.shield_severity NOT NULL DEFAULT 'p3_medium',
  status text NOT NULL DEFAULT 'open',
  owner_id uuid,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_shield_incidents_updated_at
  BEFORE UPDATE ON public.shield_incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.shield_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_incidents" ON public.shield_incidents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_incident_alerts (
  incident_id uuid NOT NULL REFERENCES public.shield_incidents(id) ON DELETE CASCADE,
  alert_id uuid NOT NULL REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, alert_id)
);
ALTER TABLE public.shield_incident_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_incident_alerts" ON public.shield_incident_alerts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_incident_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.shield_incidents(id) ON DELETE CASCADE,
  owner_id uuid,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shield_incident_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_incident_tasks" ON public.shield_incident_tasks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_decision_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES public.shield_incidents(id) ON DELETE CASCADE,
  alert_id uuid REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  actor_id uuid,
  decision text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shield_decision_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_decision_logs" ON public.shield_decision_logs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== PUBLIC WARNINGS / TEMPLATES / AI OUTPUTS (Phase 5 schema) ==============
CREATE TABLE IF NOT EXISTS public.shield_public_warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid,
  alert_id uuid REFERENCES public.shield_alerts(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  approved_by uuid,
  approved_at timestamptz,
  published_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shield_public_warnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_public_warnings" ON public.shield_public_warnings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_route_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL,
  provider text,
  title text NOT NULL,
  template_body text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shield_route_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_route_templates" ON public.shield_route_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.shield_ai_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.shield_alerts(id) ON DELETE CASCADE,
  function_name text NOT NULL,
  input_summary text,
  output_text text,
  model_used text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shield_ai_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access shield_ai_outputs" ON public.shield_ai_outputs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== STORAGE BUCKET ==============
INSERT INTO storage.buckets (id, name, public)
VALUES ('shield-evidence','shield-evidence', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins read shield evidence" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'shield-evidence' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins write shield evidence" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shield-evidence' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update shield evidence" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'shield-evidence' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete shield evidence" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'shield-evidence' AND public.has_role(auth.uid(),'admin'));