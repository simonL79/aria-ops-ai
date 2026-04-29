-- 1. Tighten client_intake_submissions to a dedicated intake_reviewer role
DROP POLICY IF EXISTS "Admin only access to client_intake_submissions" ON public.client_intake_submissions;

CREATE POLICY "Intake reviewers manage client_intake_submissions"
ON public.client_intake_submissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'intake_reviewer'))
WITH CHECK (public.has_role(auth.uid(), 'intake_reviewer'));

-- Defence-in-depth: restrictive policy ensures only intake_reviewer (or service_role bypass) can touch rows
CREATE POLICY "restrict client_intake_submissions to intake_reviewer"
ON public.client_intake_submissions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'intake_reviewer'))
WITH CHECK (public.has_role(auth.uid(), 'intake_reviewer'));

-- 2. Remove eidetic_resurfacing_events from realtime publication to stop broadcasting per-client threat data
ALTER PUBLICATION supabase_realtime DROP TABLE public.eidetic_resurfacing_events;