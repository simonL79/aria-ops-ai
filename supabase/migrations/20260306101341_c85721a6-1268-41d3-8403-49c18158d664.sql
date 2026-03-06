
-- =============================================
-- ARIA TM Complete Database Schema
-- =============================================

-- 1. system_config
CREATE TABLE public.system_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to system_config" ON public.system_config FOR ALL USING (true) WITH CHECK (true);

-- 2. live_status
CREATE TABLE public.live_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  system_status TEXT NOT NULL DEFAULT 'LIVE',
  last_report TIMESTAMPTZ DEFAULT now(),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.live_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to live_status" ON public.live_status FOR ALL USING (true) WITH CHECK (true);

-- 3. clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contactname TEXT,
  contactemail TEXT,
  industry TEXT DEFAULT 'Technology',
  client_type TEXT DEFAULT 'brand',
  keywordtargets TEXT,
  website TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- 4. client_entities
CREATE TABLE public.client_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  entity_name TEXT NOT NULL,
  entity_type TEXT DEFAULT 'person',
  alias TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to client_entities" ON public.client_entities FOR ALL USING (true) WITH CHECK (true);

-- 5. entities
CREATE TABLE public.entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  entity_type TEXT DEFAULT 'person',
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to entities" ON public.entities FOR ALL USING (true) WITH CHECK (true);

-- 6. scan_results
CREATE TABLE public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  platform TEXT,
  content TEXT,
  url TEXT,
  severity TEXT DEFAULT 'low',
  status TEXT DEFAULT 'new',
  threat_type TEXT,
  source_type TEXT,
  sentiment TEXT,
  confidence_score NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to scan_results" ON public.scan_results FOR ALL USING (true) WITH CHECK (true);

-- 7. aria_notifications
CREATE TABLE public.aria_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  event_type TEXT NOT NULL,
  summary TEXT,
  priority TEXT DEFAULT 'medium',
  seen BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.aria_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aria_notifications" ON public.aria_notifications FOR ALL USING (true) WITH CHECK (true);

-- 8. activity_logs
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- 9. content_sources
CREATE TABLE public.content_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT,
  title TEXT,
  source_type TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to content_sources" ON public.content_sources FOR ALL USING (true) WITH CHECK (true);

-- 10. aria_ops_log
CREATE TABLE public.aria_ops_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL,
  entity_name TEXT,
  module_source TEXT,
  success BOOLEAN DEFAULT true,
  operation_data JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.aria_ops_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to aria_ops_log" ON public.aria_ops_log FOR ALL USING (true) WITH CHECK (true);

-- 11. client_intake_submissions
CREATE TABLE public.client_intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand_or_alias TEXT,
  focus_scope TEXT,
  operational_mode TEXT,
  status TEXT DEFAULT 'new',
  known_aliases TEXT[] DEFAULT '{}',
  topics_to_flag TEXT[] DEFAULT '{}',
  prior_attacks BOOLEAN DEFAULT false,
  problematic_platforms TEXT[] DEFAULT '{}',
  consent_to_process BOOLEAN DEFAULT false,
  gdpr_agreed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_intake_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to client_intake_submissions" ON public.client_intake_submissions FOR ALL USING (true) WITH CHECK (true);

-- 12. strategy_responses
CREATE TABLE public.strategy_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  strategy_type TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.strategy_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to strategy_responses" ON public.strategy_responses FOR ALL USING (true) WITH CHECK (true);

-- 13. suppression_assets
CREATE TABLE public.suppression_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  url TEXT,
  asset_type TEXT,
  status TEXT DEFAULT 'active',
  published_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.suppression_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to suppression_assets" ON public.suppression_assets FOR ALL USING (true) WITH CHECK (true);

-- 14. reputation_scan_submissions
CREATE TABLE public.reputation_scan_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  scan_type TEXT,
  details TEXT,
  status TEXT DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reputation_scan_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reputation_scan_submissions" ON public.reputation_scan_submissions FOR ALL USING (true) WITH CHECK (true);

-- 15. scanner_query_log
CREATE TABLE public.scanner_query_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT,
  source TEXT,
  results_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.scanner_query_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to scanner_query_log" ON public.scanner_query_log FOR ALL USING (true) WITH CHECK (true);

-- 16. lia_records
CREATE TABLE public.lia_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  entity_name TEXT,
  assessment_type TEXT,
  risk_level TEXT DEFAULT 'medium',
  details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lia_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to lia_records" ON public.lia_records FOR ALL USING (true) WITH CHECK (true);

-- 17. rsi_queue
CREATE TABLE public.rsi_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  task_type TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rsi_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to rsi_queue" ON public.rsi_queue FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON public.system_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_live_status_updated_at BEFORE UPDATE ON public.live_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_entities_updated_at BEFORE UPDATE ON public.client_entities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON public.entities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scan_results_updated_at BEFORE UPDATE ON public.scan_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_sources_updated_at BEFORE UPDATE ON public.content_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_intake_updated_at BEFORE UPDATE ON public.client_intake_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_strategy_responses_updated_at BEFORE UPDATE ON public.strategy_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppression_assets_updated_at BEFORE UPDATE ON public.suppression_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lia_records_updated_at BEFORE UPDATE ON public.lia_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rsi_queue_updated_at BEFORE UPDATE ON public.rsi_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
