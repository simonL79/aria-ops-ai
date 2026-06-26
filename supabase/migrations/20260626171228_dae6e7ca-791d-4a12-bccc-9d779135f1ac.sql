-- Tighten anon insert policy on legal_shield_intakes: enforce consent and prevent
-- anonymous submitters from spoofing workflow status, instead of WITH CHECK (true)
DROP POLICY IF EXISTS "Anonymous users can submit Legal Shield intakes" ON public.legal_shield_intakes;
CREATE POLICY "Anonymous users can submit Legal Shield intakes"
ON public.legal_shield_intakes
FOR INSERT
TO anon
WITH CHECK (
  consent_given = true
  AND status = 'new'
  AND length(full_name) > 0
  AND length(email) > 0
  AND length(issue_type) > 0
  AND length(issue_description) > 0
);

-- Remove redundant service_role policy on blog_posts. The service_role bypasses RLS,
-- so this USING(true)/WITH CHECK(true) policy grants nothing extra and only trips the linter.
DROP POLICY IF EXISTS "blog_posts_service_role_all" ON public.blog_posts;