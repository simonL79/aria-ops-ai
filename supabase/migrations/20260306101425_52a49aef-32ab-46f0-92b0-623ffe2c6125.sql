
-- Add missing columns and tables (batch 3)

-- Missing columns on strategy_responses
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS actions JSONB DEFAULT '[]';
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS timeframe TEXT;
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS execution_result JSONB DEFAULT '{}';
ALTER TABLE public.strategy_responses ADD COLUMN IF NOT EXISTS strategy_id TEXT;

-- Missing columns on content_sources
ALTER TABLE public.content_sources ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.content_sources ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.content_sources ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Missing columns on scanner_query_log
ALTER TABLE public.scanner_query_log ADD COLUMN IF NOT EXISTS total_results_returned INTEGER DEFAULT 0;
ALTER TABLE public.scanner_query_log ADD COLUMN IF NOT EXISTS results_matched_entity INTEGER DEFAULT 0;
ALTER TABLE public.scanner_query_log ADD COLUMN IF NOT EXISTS platform TEXT;

-- Missing columns on monitoring_status
ALTER TABLE public.monitoring_status ADD COLUMN IF NOT EXISTS sources_count INTEGER DEFAULT 0;

-- Missing columns on scan_results
ALTER TABLE public.scan_results ADD COLUMN IF NOT EXISTS potential_reach INTEGER DEFAULT 0;

-- Missing columns on entity_fingerprints_advanced
ALTER TABLE public.entity_fingerprints_advanced ADD COLUMN IF NOT EXISTS context_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.entity_fingerprints_advanced ADD COLUMN IF NOT EXISTS false_positive_blocklist TEXT[] DEFAULT '{}';

-- entity_precision_stats table
CREATE TABLE public.entity_precision_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  total_scans INTEGER DEFAULT 0,
  true_positives INTEGER DEFAULT 0,
  false_positives INTEGER DEFAULT 0,
  precision_score NUMERIC DEFAULT 0,
  recall_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.entity_precision_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to entity_precision_stats" ON public.entity_precision_stats FOR ALL USING (true) WITH CHECK (true);

-- threats table
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT,
  threat_type TEXT,
  severity TEXT DEFAULT 'medium',
  source TEXT,
  content TEXT,
  url TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to threats" ON public.threats FOR ALL USING (true) WITH CHECK (true);

-- triggers
CREATE TRIGGER update_entity_precision_stats_updated_at BEFORE UPDATE ON public.entity_precision_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_threats_updated_at BEFORE UPDATE ON public.threats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
