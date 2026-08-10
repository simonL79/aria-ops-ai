-- 1. Blog comments: hide moderation-internal columns from anonymous readers.
REVOKE SELECT (hidden_reason, report_count) ON public.blog_comments FROM anon;

-- 2. Client error logs: stop identity spoofing on anonymous inserts.
DROP POLICY IF EXISTS "Anyone can record a crash they experienced" ON public.client_error_logs;

CREATE POLICY "Anyone can record a crash they experienced"
ON public.client_error_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());