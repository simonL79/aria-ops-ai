-- Requiem pipeline job tracking
CREATE TABLE IF NOT EXISTS public.requiem_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL DEFAULT 'full_pipeline',
  status text NOT NULL DEFAULT 'pending',
  urls text[] NOT NULL DEFAULT '{}',
  variant_count integer NOT NULL DEFAULT 20,
  entity_config jsonb DEFAULT '{}',
  scan_results jsonb DEFAULT '[]',
  generated_pages jsonb DEFAULT '[]',
  deployed_domains jsonb DEFAULT '[]',
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.requiem_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to requiem_jobs"
  ON public.requiem_jobs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.requiem_scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.requiem_jobs(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  content_text text,
  is_negative boolean DEFAULT false,
  authority_score numeric DEFAULT 0.5,
  entity_identity jsonb DEFAULT '{}',
  paragraphs jsonb DEFAULT '[]',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.requiem_scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to requiem_scan_results"
  ON public.requiem_scan_results
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.requiem_payloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.requiem_jobs(id) ON DELETE CASCADE,
  scan_result_id uuid REFERENCES public.requiem_scan_results(id) ON DELETE CASCADE,
  filename text NOT NULL,
  title text,
  author_name text,
  pub_date text,
  html_content text,
  variant_index integer DEFAULT 0,
  deployed_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.requiem_payloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only access to requiem_payloads"
  ON public.requiem_payloads
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));