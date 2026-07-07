CREATE TABLE public.client_error_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL DEFAULT 'unknown',
  route text,
  message text NOT NULL,
  stack text,
  component_stack text,
  user_agent text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_error_logs TO authenticated;
GRANT INSERT ON public.client_error_logs TO anon, authenticated;
GRANT ALL ON public.client_error_logs TO service_role;

ALTER TABLE public.client_error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read error logs"
  ON public.client_error_logs
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin());

CREATE POLICY "Anyone can record a crash they experienced"
  ON public.client_error_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_client_error_logs_created_at ON public.client_error_logs (created_at DESC);
CREATE INDEX idx_client_error_logs_section ON public.client_error_logs (section);