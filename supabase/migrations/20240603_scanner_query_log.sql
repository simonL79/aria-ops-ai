
-- Create scanner query log table for audit trail and debugging
CREATE TABLE IF NOT EXISTS public.scanner_query_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT NOT NULL,
  search_terms TEXT[] NOT NULL,
  platform TEXT NOT NULL,
  total_results_returned INTEGER DEFAULT 0,
  results_matched_entity INTEGER DEFAULT 0,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  query_duration_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scanner_query_log_entity ON public.scanner_query_log(entity_name);
CREATE INDEX IF NOT EXISTS idx_scanner_query_log_platform ON public.scanner_query_log(platform);
CREATE INDEX IF NOT EXISTS idx_scanner_query_log_executed_at ON public.scanner_query_log(executed_at);

-- Enable RLS
ALTER TABLE public.scanner_query_log ENABLE ROW LEVEL SECURITY;

-- Admin access policy
CREATE POLICY "Allow admin access to scanner query log" ON public.scanner_query_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON TABLE public.scanner_query_log IS 'Audit trail for all scanner queries to debug entity-specific targeting';
