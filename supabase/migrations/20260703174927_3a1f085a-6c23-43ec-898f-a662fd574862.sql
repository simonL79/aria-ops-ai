
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS is_seed_content boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_notes text,
  ADD COLUMN IF NOT EXISTS fact_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS fact_checked_by text,
  ADD COLUMN IF NOT EXISTS legal_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS legal_reviewed_by text,
  ADD COLUMN IF NOT EXISTS content_risk_level text NOT NULL DEFAULT 'low';
