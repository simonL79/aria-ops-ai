
-- Batch 5: All remaining missing tables and columns

-- Missing columns on blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS medium_url TEXT;

-- aria_client_intakes
CREATE TABLE public.aria_client_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  contact_email TEXT,
  contact_name TEXT,
  service_type TEXT,
  urgency TEXT DEFAULT 'normal',
  details TEXT,
  status TEXT DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.aria_client_intakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aria_client_intakes" ON public.aria_client_intakes FOR ALL USING (true) WITH CHECK (true);

-- data_breach_incidents
CREATE TABLE public.data_breach_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT,
  severity TEXT DEFAULT 'medium',
  description TEXT,
  affected_records INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  reported_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.data_breach_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to data_breach_incidents" ON public.data_breach_incidents FOR ALL USING (true) WITH CHECK (true);

-- data_subject_requests
CREATE TABLE public.data_subject_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type TEXT,
  subject_name TEXT,
  subject_email TEXT,
  status TEXT DEFAULT 'pending',
  details TEXT,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to data_subject_requests" ON public.data_subject_requests FOR ALL USING (true) WITH CHECK (true);

-- dpia_records
CREATE TABLE public.dpia_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  entity_name TEXT,
  processing_purpose TEXT,
  data_categories TEXT,
  identified_risks JSONB DEFAULT '[]',
  mitigation_measures JSONB DEFAULT '[]',
  data_retention_period TEXT,
  data_minimization_measures TEXT,
  security_measures TEXT,
  review_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dpia_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to dpia_records" ON public.dpia_records FOR ALL USING (true) WITH CHECK (true);

-- strike_requests
CREATE TABLE public.strike_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  platform TEXT,
  url TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.strike_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to strike_requests" ON public.strike_requests FOR ALL USING (true) WITH CHECK (true);

-- counter_narratives
CREATE TABLE public.counter_narratives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  narrative_type TEXT,
  content TEXT,
  theme TEXT,
  status TEXT DEFAULT 'draft',
  platform TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.counter_narratives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to counter_narratives" ON public.counter_narratives FOR ALL USING (true) WITH CHECK (true);

-- anubis_pattern_log
CREATE TABLE public.anubis_pattern_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  pattern_fingerprint TEXT,
  pattern_type TEXT,
  confidence NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.anubis_pattern_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anubis_pattern_log" ON public.anubis_pattern_log FOR ALL USING (true) WITH CHECK (true);

-- multilingual_threats
CREATE TABLE public.multilingual_threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  language TEXT,
  content TEXT,
  translated_content TEXT,
  severity TEXT DEFAULT 'medium',
  source TEXT,
  detected_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.multilingual_threats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to multilingual_threats" ON public.multilingual_threats FOR ALL USING (true) WITH CHECK (true);

-- darkweb_agents
CREATE TABLE public.darkweb_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT,
  target TEXT,
  status TEXT DEFAULT 'active',
  results JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.darkweb_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to darkweb_agents" ON public.darkweb_agents FOR ALL USING (true) WITH CHECK (true);

-- llm_watchdog_logs
CREATE TABLE public.llm_watchdog_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  llm_provider TEXT,
  query TEXT,
  response TEXT,
  entity_name TEXT,
  risk_level TEXT DEFAULT 'low',
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.llm_watchdog_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to llm_watchdog_logs" ON public.llm_watchdog_logs FOR ALL USING (true) WITH CHECK (true);

-- lead_magnets
CREATE TABLE public.lead_magnets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  phone TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lead_magnets" ON public.lead_magnets FOR ALL USING (true) WITH CHECK (true);

-- privacy_notices
CREATE TABLE public.privacy_notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT,
  version TEXT,
  status TEXT DEFAULT 'draft',
  effective_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.privacy_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to privacy_notices" ON public.privacy_notices FOR ALL USING (true) WITH CHECK (true);

-- system_health_checks
CREATE TABLE public.system_health_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  check_type TEXT,
  status TEXT,
  details JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to system_health_checks" ON public.system_health_checks FOR ALL USING (true) WITH CHECK (true);

-- Add missing column on anubis_entity_memory
ALTER TABLE public.anubis_entity_memory ADD COLUMN IF NOT EXISTS memory_summary TEXT;

-- triggers for updated_at
CREATE TRIGGER update_aria_client_intakes_updated_at BEFORE UPDATE ON public.aria_client_intakes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dpia_records_updated_at BEFORE UPDATE ON public.dpia_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_strike_requests_updated_at BEFORE UPDATE ON public.strike_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_counter_narratives_updated_at BEFORE UPDATE ON public.counter_narratives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_privacy_notices_updated_at BEFORE UPDATE ON public.privacy_notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
