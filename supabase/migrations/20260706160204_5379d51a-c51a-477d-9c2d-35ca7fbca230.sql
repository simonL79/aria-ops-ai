-- 1. Rate-limit tracking table for anonymous intake evidence uploads
CREATE TABLE public.shield_intake_upload_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_shield_intake_upload_rl_ip_time
  ON public.shield_intake_upload_rate_limits (ip_hash, created_at);

GRANT ALL ON public.shield_intake_upload_rate_limits TO service_role;
GRANT SELECT ON public.shield_intake_upload_rate_limits TO authenticated;

ALTER TABLE public.shield_intake_upload_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read intake upload rate limits"
  ON public.shield_intake_upload_rate_limits
  FOR SELECT
  TO authenticated
  USING (is_current_user_admin());

-- 2. Remove direct anonymous upload access to the private evidence bucket.
--    Uploads now flow only through the upload-shield-evidence edge function
--    (service role), which enforces reCAPTCHA, rate limiting and validation.
DROP POLICY IF EXISTS "Intake submitters can upload evidence" ON storage.objects;
