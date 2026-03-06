
-- Create missing eidetic tables and executive_reports

-- memory_footprints
CREATE TABLE public.memory_footprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_url TEXT,
  memory_type TEXT,
  memory_context TEXT,
  ai_memory_tags TEXT[] DEFAULT '{}',
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  discovered_at TIMESTAMPTZ DEFAULT now(),
  decay_score NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  client_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memory_footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to memory_footprints" ON public.memory_footprints FOR ALL USING (true) WITH CHECK (true);

-- memory_decay_profiles
CREATE TABLE public.memory_decay_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  footprint_id UUID REFERENCES public.memory_footprints(id) ON DELETE CASCADE,
  relevancy_score NUMERIC DEFAULT 0,
  emotional_charge TEXT DEFAULT 'low',
  legal_outcome TEXT,
  social_velocity NUMERIC DEFAULT 0,
  recommended_action TEXT,
  action_status TEXT DEFAULT 'pending',
  scheduled_for TIMESTAMPTZ,
  decay_trigger TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memory_decay_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to memory_decay_profiles" ON public.memory_decay_profiles FOR ALL USING (true) WITH CHECK (true);

-- memory_recalibrators
CREATE TABLE public.memory_recalibrators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  footprint_id UUID REFERENCES public.memory_footprints(id) ON DELETE CASCADE,
  asset_url TEXT,
  recalibration_type TEXT,
  content_excerpt TEXT,
  full_text TEXT,
  is_deployed BOOLEAN DEFAULT false,
  deployed_at TIMESTAMPTZ,
  effectiveness_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memory_recalibrators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to memory_recalibrators" ON public.memory_recalibrators FOR ALL USING (true) WITH CHECK (true);

-- executive_reports
CREATE TABLE public.executive_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  report_type TEXT,
  executive_summary TEXT,
  period_start TEXT,
  period_end TEXT,
  key_metrics JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.executive_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to executive_reports" ON public.executive_reports FOR ALL USING (true) WITH CHECK (true);

-- Add scan_results missing columns for eidetic
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS source_credibility_score NUMERIC DEFAULT 0;
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS media_is_ai_generated BOOLEAN DEFAULT false;
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS ai_detection_confidence NUMERIC DEFAULT 0;
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS incident_playbook TEXT;
