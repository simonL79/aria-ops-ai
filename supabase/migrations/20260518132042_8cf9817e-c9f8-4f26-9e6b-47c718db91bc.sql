CREATE TABLE IF NOT EXISTS public.blog_report_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  reported_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_report_rate_limits_ip_time ON public.blog_report_rate_limits (ip_hash, reported_at DESC);
ALTER TABLE public.blog_report_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read rate limits" ON public.blog_report_rate_limits FOR SELECT USING (public.is_current_user_admin());