
-- Add entity recognition columns to scan_results table
ALTER TABLE IF EXISTS public.scan_results ADD COLUMN IF NOT EXISTS detected_entities JSONB;
ALTER TABLE IF EXISTS public.scan_results ADD COLUMN IF NOT EXISTS risk_entity_name TEXT;
ALTER TABLE IF EXISTS public.scan_results ADD COLUMN IF NOT EXISTS risk_entity_type TEXT;
ALTER TABLE IF EXISTS public.scan_results ADD COLUMN IF NOT EXISTS is_identified BOOLEAN DEFAULT false;
