ALTER TABLE public.requiem_jobs
  ADD COLUMN IF NOT EXISTS entity_name text,
  ADD COLUMN IF NOT EXISTS query text,
  ADD COLUMN IF NOT EXISTS client_id uuid,
  ADD COLUMN IF NOT EXISTS scheduled_for timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS result_summary jsonb DEFAULT '{}'::jsonb;

-- Make legacy columns nullable so new inserts don't need them
ALTER TABLE public.requiem_jobs
  ALTER COLUMN job_type DROP NOT NULL,
  ALTER COLUMN urls DROP NOT NULL;

-- Default job_type for new SerpApi jobs
ALTER TABLE public.requiem_jobs
  ALTER COLUMN job_type SET DEFAULT 'serp_scan';

CREATE INDEX IF NOT EXISTS idx_requiem_jobs_pending
  ON public.requiem_jobs (status, scheduled_for)
  WHERE status = 'pending';