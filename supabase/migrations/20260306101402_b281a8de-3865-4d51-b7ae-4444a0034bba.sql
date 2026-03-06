
-- Additional tables needed by the codebase

-- 1. monitoring_status
CREATE TABLE public.monitoring_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  last_check TIMESTAMPTZ DEFAULT now(),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.monitoring_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to monitoring_status" ON public.monitoring_status FOR ALL USING (true) WITH CHECK (true);

-- 2. persona_saturation_campaigns
CREATE TABLE public.persona_saturation_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  campaign_name TEXT,
  status TEXT DEFAULT 'draft',
  platforms TEXT[] DEFAULT '{}',
  content JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.persona_saturation_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to persona_saturation_campaigns" ON public.persona_saturation_campaigns FOR ALL USING (true) WITH CHECK (true);

-- 3. narrative_clusters
CREATE TABLE public.narrative_clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  intent_label TEXT,
  narrative_snippet TEXT,
  source_platform TEXT,
  cluster_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.narrative_clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to narrative_clusters" ON public.narrative_clusters FOR ALL USING (true) WITH CHECK (true);

-- 4. anubis_entity_memory
CREATE TABLE public.anubis_entity_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  memory_type TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.anubis_entity_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to anubis_entity_memory" ON public.anubis_entity_memory FOR ALL USING (true) WITH CHECK (true);

-- 5. entity_fingerprints_advanced
CREATE TABLE public.entity_fingerprints_advanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id TEXT,
  primary_name TEXT,
  aliases TEXT[] DEFAULT '{}',
  organization TEXT,
  locations TEXT[] DEFAULT '{}',
  confidence_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entity_fingerprints_advanced ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to entity_fingerprints_advanced" ON public.entity_fingerprints_advanced FOR ALL USING (true) WITH CHECK (true);

-- Add missing columns to scan_results
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS detected_entities JSONB DEFAULT '[]';

-- Add missing columns to strategy_responses  
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS executed_at TIMESTAMPTZ;

-- Add updated_at triggers for new tables
CREATE TRIGGER update_monitoring_status_updated_at BEFORE UPDATE ON public.monitoring_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_persona_campaigns_updated_at BEFORE UPDATE ON public.persona_saturation_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_anubis_entity_memory_updated_at BEFORE UPDATE ON public.anubis_entity_memory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_entity_fingerprints_updated_at BEFORE UPDATE ON public.entity_fingerprints_advanced FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
