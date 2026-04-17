CREATE TABLE public.eidetic_resurfacing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  footprint_id uuid REFERENCES public.memory_footprints(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('decay_reversal','threat_spike','new_high_threat','content_drift')),
  severity text NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  prev_decay_score numeric,
  new_decay_score numeric,
  decay_delta numeric,
  prev_threat_30d numeric,
  new_threat_30d numeric,
  threat_delta numeric,
  narrative_category text,
  content_excerpt text,
  content_url text,
  acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_at timestamptz,
  acknowledged_by uuid,
  notified_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.eidetic_resurfacing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view resurfacing events"
  ON public.eidetic_resurfacing_events FOR SELECT
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can insert resurfacing events"
  ON public.eidetic_resurfacing_events FOR INSERT
  WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update resurfacing events"
  ON public.eidetic_resurfacing_events FOR UPDATE
  USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete resurfacing events"
  ON public.eidetic_resurfacing_events FOR DELETE
  USING (public.is_current_user_admin());

CREATE INDEX idx_resurfacing_events_inbox
  ON public.eidetic_resurfacing_events (acknowledged, created_at DESC);

CREATE INDEX idx_resurfacing_events_footprint
  ON public.eidetic_resurfacing_events (footprint_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.eidetic_resurfacing_events;
ALTER TABLE public.eidetic_resurfacing_events REPLICA IDENTITY FULL;