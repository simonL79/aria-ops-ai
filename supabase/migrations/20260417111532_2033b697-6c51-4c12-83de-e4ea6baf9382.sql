-- Tier 2: AI scoring columns
ALTER TABLE public.memory_footprints
  ADD COLUMN IF NOT EXISTS sentiment_trajectory jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS narrative_category text,
  ADD COLUMN IF NOT EXISTS threat_persistence_30d numeric,
  ADD COLUMN IF NOT EXISTS threat_persistence_90d numeric,
  ADD COLUMN IF NOT EXISTS threat_persistence_365d numeric,
  ADD COLUMN IF NOT EXISTS authority_weight numeric,
  ADD COLUMN IF NOT EXISTS ai_scored_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_autopilot_at timestamptz;

CREATE INDEX IF NOT EXISTS memory_footprints_ai_scored_at_idx
  ON public.memory_footprints(ai_scored_at);

CREATE INDEX IF NOT EXISTS memory_footprints_last_autopilot_at_idx
  ON public.memory_footprints(last_autopilot_at);

-- Tier 3: autopilot run log
CREATE TABLE IF NOT EXISTS public.eidetic_autopilot_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  footprints_processed integer NOT NULL DEFAULT 0,
  footprints_changed integer NOT NULL DEFAULT 0,
  anomalies_detected integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'running',
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.eidetic_autopilot_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to eidetic_autopilot_runs"
  ON public.eidetic_autopilot_runs
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS eidetic_autopilot_runs_started_at_idx
  ON public.eidetic_autopilot_runs(started_at DESC);

-- Required extensions for cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;