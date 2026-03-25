-- Drop overly permissive INSERT policies
DROP POLICY IF EXISTS "Allow public contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public lead magnet submissions" ON public.lead_magnets;

-- Recreate with field-level constraints:
-- 1. Require mandatory fields to be non-empty
-- 2. Prevent anonymous users from setting admin-controlled fields (status)

CREATE POLICY "Allow public contact form submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(first_name)) > 0
  AND length(trim(last_name)) > 0
  AND length(trim(email)) > 0
  AND length(trim(message)) > 0
  AND (status IS NULL OR status = 'new')
);

CREATE POLICY "Allow public lead magnet submissions"
ON public.lead_magnets
FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((email IS NOT NULL AND length(trim(email)) > 0)
   OR (name IS NOT NULL AND length(trim(name)) > 0))
  AND (status IS NULL OR status = 'new')
);