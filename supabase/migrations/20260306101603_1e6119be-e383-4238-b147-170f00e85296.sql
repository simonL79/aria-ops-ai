
-- Batch 6: More missing tables and columns

-- data_retention_schedule
CREATE TABLE public.data_retention_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT,
  data_type TEXT,
  retention_period TEXT,
  review_frequency TEXT,
  last_review_date TIMESTAMPTZ,
  next_review_date TIMESTAMPTZ,
  deletion_job_name TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.data_retention_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to data_retention_schedule" ON public.data_retention_schedule FOR ALL USING (true) WITH CHECK (true);

-- Missing columns on dpia_records  
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS assessment_title TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS data_types TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS legal_basis TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS necessity_justification TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS proportionality_assessment TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS consultation_required BOOLEAN DEFAULT false;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS dpo_opinion TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS residual_risk TEXT;

-- Missing columns on data_subject_requests for DSR management
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_subject_name TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_subject_email TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS request_details TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS response_sent BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS response_date TIMESTAMPTZ;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_categories TEXT[] DEFAULT '{}';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS processing_notes TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS systems_affected TEXT[] DEFAULT '{}';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_exported BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_deleted BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS third_parties_notified BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS automated_decisions_reviewed BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS objection_grounds TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS restriction_applied BOOLEAN DEFAULT false;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Database function for compliance logging
CREATE OR REPLACE FUNCTION public.log_compliance_activity(
  p_activity_type TEXT DEFAULT '',
  p_description TEXT DEFAULT '',
  p_entity_name TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_logs (action, entity_type, details)
  VALUES (p_activity_type, p_entity_name, p_description);
END;
$$;

-- trigger
CREATE TRIGGER update_data_retention_schedule_updated_at BEFORE UPDATE ON public.data_retention_schedule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
