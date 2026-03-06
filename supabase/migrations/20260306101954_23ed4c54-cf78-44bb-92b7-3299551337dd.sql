
-- employee_scan_queue
CREATE TABLE public.employee_scan_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 5,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.employee_scan_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to employee_scan_queue" ON public.employee_scan_queue FOR ALL USING (true) WITH CHECK (true);

-- threat_ingestion_queue
CREATE TABLE public.threat_ingestion_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT,
  status TEXT DEFAULT 'pending',
  detected_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.threat_ingestion_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to threat_ingestion_queue" ON public.threat_ingestion_queue FOR ALL USING (true) WITH CHECK (true);

-- Add missing columns to suppression_assets for GSC tracking
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS gsc_impressions INTEGER DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS gsc_clicks INTEGER DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS gsc_ctr NUMERIC DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS rank_goal INTEGER DEFAULT 0;
ALTER TABLE public.suppression_assets ADD COLUMN IF NOT EXISTS asset_title TEXT;

-- Add missing columns to live_status
ALTER TABLE public.live_status ADD COLUMN IF NOT EXISTS active_threats INTEGER DEFAULT 0;
ALTER TABLE public.live_status ADD COLUMN IF NOT EXISTS last_threat_seen TIMESTAMPTZ;

-- Add missing columns to system_health_checks
ALTER TABLE public.system_health_checks ADD COLUMN IF NOT EXISTS module TEXT;
ALTER TABLE public.system_health_checks ADD COLUMN IF NOT EXISTS check_time TIMESTAMPTZ DEFAULT now();
