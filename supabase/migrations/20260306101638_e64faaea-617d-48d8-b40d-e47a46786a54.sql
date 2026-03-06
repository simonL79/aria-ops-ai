
-- Batch 7: Missing columns for compliance tables + remaining tables

-- dpia_records missing columns
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS automated_decision_making TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS profiling_activities TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS assessment_date TIMESTAMPTZ;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS assessor_name TEXT;
ALTER TABLE public.dpia_records ADD COLUMN IF NOT EXISTS assessor_role TEXT;

-- data_subject_requests missing columns  
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS legal_basis_for_refusal TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS processing_systems TEXT[] DEFAULT '{}';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS response_method TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS request_date TIMESTAMPTZ;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS communication_log JSONB DEFAULT '[]';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS data_mapping JSONB DEFAULT '{}';
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS impact_assessment TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS regulatory_authority TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS appeal_status TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE public.data_subject_requests ADD COLUMN IF NOT EXISTS closure_reason TEXT;

-- data_retention_schedule missing columns
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS data_category TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS retention_justification TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS deletion_method TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS legal_basis TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS cross_border_considerations TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS automated_deletion BOOLEAN DEFAULT false;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS exceptions TEXT;
ALTER TABLE public.data_retention_schedule ADD COLUMN IF NOT EXISTS responsible_team TEXT;

-- lia_records missing columns
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS purpose_description TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS legitimate_interest TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS necessity_test TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS balancing_test TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS data_subject_impact TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS mitigation_measures TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS processing_methods TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS data_categories TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS retention_period TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS safeguards TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS opt_out_mechanism TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS review_date TIMESTAMPTZ;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS assessor_name TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS assessor_role TEXT;
ALTER TABLE public.lia_records ADD COLUMN IF NOT EXISTS data_sources TEXT[] DEFAULT '{}';

-- privacy_notices missing columns
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS notice_type TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS jurisdiction TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS data_controller TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS contact_details TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS purposes TEXT[] DEFAULT '{}';
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS legal_bases TEXT[] DEFAULT '{}';
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS data_categories_covered TEXT[] DEFAULT '{}';
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS recipients TEXT[] DEFAULT '{}';
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS international_transfers TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS retention_periods TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS individual_rights TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS automated_decisions TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS cookies_policy TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS last_reviewed TIMESTAMPTZ;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS review_frequency TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE public.privacy_notices ADD COLUMN IF NOT EXISTS publication_url TEXT;
