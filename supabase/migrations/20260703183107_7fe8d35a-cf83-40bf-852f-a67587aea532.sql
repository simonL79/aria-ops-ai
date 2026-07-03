-- Weekly per-keyword performance snapshots from Google Search Console
CREATE TABLE public.gsc_weekly_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url text NOT NULL,
  keyword text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  ctr numeric NOT NULL DEFAULT 0,
  position numeric NOT NULL DEFAULT 0,
  is_tracked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_url, keyword, period_start)
);

CREATE INDEX idx_gsc_snapshots_period ON public.gsc_weekly_snapshots (period_start DESC);
CREATE INDEX idx_gsc_snapshots_keyword ON public.gsc_weekly_snapshots (keyword);
CREATE INDEX idx_gsc_snapshots_tracked ON public.gsc_weekly_snapshots (is_tracked) WHERE is_tracked = true;

GRANT SELECT ON public.gsc_weekly_snapshots TO authenticated;
GRANT ALL ON public.gsc_weekly_snapshots TO service_role;

ALTER TABLE public.gsc_weekly_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view GSC snapshots"
ON public.gsc_weekly_snapshots FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Log of each weekly sync run
CREATE TABLE public.gsc_sync_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url text NOT NULL,
  period_start date,
  period_end date,
  rows_upserted integer NOT NULL DEFAULT 0,
  tracked_matched integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'success',
  error text,
  triggered_by text NOT NULL DEFAULT 'cron',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_gsc_sync_runs_created ON public.gsc_sync_runs (created_at DESC);

GRANT SELECT ON public.gsc_sync_runs TO authenticated;
GRANT ALL ON public.gsc_sync_runs TO service_role;

ALTER TABLE public.gsc_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view GSC sync runs"
ON public.gsc_sync_runs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- keep updated_at fresh on snapshots
CREATE TRIGGER trg_gsc_snapshots_updated_at
BEFORE UPDATE ON public.gsc_weekly_snapshots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();