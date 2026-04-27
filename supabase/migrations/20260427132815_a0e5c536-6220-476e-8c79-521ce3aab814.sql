
-- =========================================
-- PHASE 0: ARCHIVE LEGACY TABLES (reversible)
-- =========================================
ALTER TABLE IF EXISTS public.anubis_entity_memory RENAME TO _archived_anubis_entity_memory;
ALTER TABLE IF EXISTS public.anubis_pattern_log RENAME TO _archived_anubis_pattern_log;
ALTER TABLE IF EXISTS public.eris_attack_simulations RENAME TO _archived_eris_attack_simulations;
ALTER TABLE IF EXISTS public.eris_response_strategies RENAME TO _archived_eris_response_strategies;
ALTER TABLE IF EXISTS public.graveyard_simulations RENAME TO _archived_graveyard_simulations;
ALTER TABLE IF EXISTS public.sentience_memory_log RENAME TO _archived_sentience_memory_log;
ALTER TABLE IF EXISTS public.sentience_recalibration_decisions RENAME TO _archived_sentience_recalibration_decisions;
ALTER TABLE IF EXISTS public.narrative_clusters RENAME TO _archived_narrative_clusters;
ALTER TABLE IF EXISTS public.multilingual_threats RENAME TO _archived_multilingual_threats;
ALTER TABLE IF EXISTS public.llm_watchdog_logs RENAME TO _archived_llm_watchdog_logs;
ALTER TABLE IF EXISTS public.persona_saturation_campaigns RENAME TO _archived_persona_saturation_campaigns;
ALTER TABLE IF EXISTS public.rsi_queue RENAME TO _archived_rsi_queue;
ALTER TABLE IF EXISTS public.genesis_entities RENAME TO _archived_genesis_entities;
ALTER TABLE IF EXISTS public.darkweb_agents RENAME TO _archived_darkweb_agents;
ALTER TABLE IF EXISTS public.employee_scan_queue RENAME TO _archived_employee_scan_queue;
ALTER TABLE IF EXISTS public.prospect_alerts RENAME TO _archived_prospect_alerts;
ALTER TABLE IF EXISTS public.strike_requests RENAME TO _archived_strike_requests;

-- =========================================
-- PHASE 1: NEW TABLES
-- =========================================

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete profiles" ON public.profiles FOR DELETE USING (has_role(auth.uid(),'admin'));

-- client_identities
CREATE TABLE IF NOT EXISTS public.client_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  identity_type TEXT NOT NULL DEFAULT 'name',
  value TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_identities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only client_identities" ON public.client_identities FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- reputation_scores
CREATE TABLE IF NOT EXISTS public.reputation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  entity_name TEXT,
  threat_score NUMERIC DEFAULT 0,
  sentiment_score NUMERIC DEFAULT 0,
  visibility_score NUMERIC DEFAULT 0,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reputation_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only reputation_scores" ON public.reputation_scores FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- requiem_jobs
CREATE TABLE IF NOT EXISTS public.requiem_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  entity_name TEXT NOT NULL,
  query TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  serpapi_payload JSONB DEFAULT '{}'::jsonb,
  result_summary JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.requiem_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only requiem_jobs" ON public.requiem_jobs FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- requiem_serp_snapshots
CREATE TABLE IF NOT EXISTS public.requiem_serp_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.requiem_jobs(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  search_engine TEXT DEFAULT 'google',
  raw_response JSONB DEFAULT '{}'::jsonb,
  parsed_results JSONB DEFAULT '[]'::jsonb,
  total_results INTEGER DEFAULT 0,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.requiem_serp_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only requiem_serp_snapshots" ON public.requiem_serp_snapshots FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- black_vertex_actions
CREATE TABLE IF NOT EXISTS public.black_vertex_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_url TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB DEFAULT '{}'::jsonb,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.black_vertex_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only black_vertex_actions" ON public.black_vertex_actions FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- oblivion_takedowns
CREATE TABLE IF NOT EXISTS public.oblivion_takedowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  target_url TEXT NOT NULL,
  platform TEXT,
  legal_basis TEXT,
  request_type TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  evidence JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.oblivion_takedowns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only oblivion_takedowns" ON public.oblivion_takedowns FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- ops_audit_log
CREATE TABLE IF NOT EXISTS public.ops_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ops_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only ops_audit_log" ON public.ops_audit_log FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- =========================================
-- EXTEND EXISTING TABLES
-- =========================================
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS primary_contact_user_id UUID;

ALTER TABLE public.scan_results
  ADD COLUMN IF NOT EXISTS serpapi_query_id TEXT,
  ADD COLUMN IF NOT EXISTS rank_position INTEGER,
  ADD COLUMN IF NOT EXISTS domain_authority NUMERIC;

ALTER TABLE public.executive_reports
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pdf_url TEXT;

ALTER TABLE public.eidetic_resurfacing_events
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- =========================================
-- TRIGGERS
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DO $$ DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles','client_identities','requiem_jobs','black_vertex_actions','oblivion_takedowns']) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t);
  END LOOP;
END $$;

-- handle_new_user → auto profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
