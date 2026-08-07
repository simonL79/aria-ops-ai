-- Remove the ability for anonymous and signed-in users to read the internal
-- IP fingerprint stored on blog comments. Backend (service_role) keeps access
-- for moderation/rate-limiting logic inside edge functions.

REVOKE SELECT ON public.blog_comments FROM anon;
REVOKE SELECT ON public.blog_comments FROM authenticated;

GRANT SELECT (
  id,
  post_id,
  author_name,
  content,
  status,
  hidden_reason,
  report_count,
  created_at,
  updated_at
) ON public.blog_comments TO anon;

GRANT SELECT (
  id,
  post_id,
  author_name,
  content,
  status,
  hidden_reason,
  report_count,
  created_at,
  updated_at
) ON public.blog_comments TO authenticated;

GRANT ALL ON public.blog_comments TO service_role;