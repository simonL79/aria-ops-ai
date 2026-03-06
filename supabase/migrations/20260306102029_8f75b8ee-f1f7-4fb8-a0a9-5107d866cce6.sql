
-- entity_graph
CREATE TABLE public.entity_graph (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_entity TEXT,
  related_entity TEXT,
  relationship_type TEXT,
  frequency INTEGER DEFAULT 0,
  last_seen TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entity_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to entity_graph" ON public.entity_graph FOR ALL USING (true) WITH CHECK (true);

-- eris_attack_simulations
CREATE TABLE public.eris_attack_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attack_vector TEXT,
  target_entity TEXT,
  origin_source TEXT,
  scenario_description TEXT,
  threat_score NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.eris_attack_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to eris_attack_simulations" ON public.eris_attack_simulations FOR ALL USING (true) WITH CHECK (true);

-- eris_response_strategies
CREATE TABLE public.eris_response_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID,
  strategy_type TEXT,
  gpt_recommendation TEXT,
  effectiveness_score NUMERIC DEFAULT 0,
  executed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.eris_response_strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to eris_response_strategies" ON public.eris_response_strategies FOR ALL USING (true) WITH CHECK (true);

-- suppression_assets missing columns
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS asset_url TEXT;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS publishing_channel TEXT;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS engagement_score NUMERIC DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS visibility_score NUMERIC DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS target_keyword TEXT;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS current_rank INTEGER DEFAULT 0;

-- reputation_scan_submissions missing column
ALTER TABLE public.reputation_scan_submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
