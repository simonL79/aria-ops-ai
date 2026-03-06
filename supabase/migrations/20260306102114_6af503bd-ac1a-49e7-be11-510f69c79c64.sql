
-- operator_command_log
CREATE TABLE public.operator_command_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command_text TEXT,
  intent TEXT,
  target TEXT,
  priority TEXT DEFAULT 'medium',
  response_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.operator_command_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to operator_command_log" ON public.operator_command_log FOR ALL USING (true) WITH CHECK (true);

-- operator_response_log
CREATE TABLE public.operator_response_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  command_id UUID,
  response_text TEXT,
  processed_by TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.operator_response_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to operator_response_log" ON public.operator_response_log FOR ALL USING (true) WITH CHECK (true);

-- panoptica_sensor_events
CREATE TABLE public.panoptica_sensor_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT,
  source_detail TEXT,
  event_content TEXT,
  detected_at TIMESTAMPTZ DEFAULT now(),
  relevance_score INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'low',
  flagged BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.panoptica_sensor_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to panoptica_sensor_events" ON public.panoptica_sensor_events FOR ALL USING (true) WITH CHECK (true);

-- panoptica_system_health
CREATE TABLE public.panoptica_system_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_name TEXT,
  last_sync TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'ok',
  diagnostic TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.panoptica_system_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to panoptica_system_health" ON public.panoptica_system_health FOR ALL USING (true) WITH CHECK (true);

-- sentience_memory_log
CREATE TABLE public.sentience_memory_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  context TEXT,
  reflection TEXT,
  insight_level INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sentience_memory_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sentience_memory_log" ON public.sentience_memory_log FOR ALL USING (true) WITH CHECK (true);

-- sentience_recalibration_decisions
CREATE TABLE public.sentience_recalibration_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_log_id UUID,
  decision_type TEXT,
  rationale TEXT,
  confidence NUMERIC DEFAULT 0,
  applied BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sentience_recalibration_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sentience_recalibration_decisions" ON public.sentience_recalibration_decisions FOR ALL USING (true) WITH CHECK (true);
