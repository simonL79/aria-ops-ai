ALTER TABLE public.legal_shield_intakes ADD COLUMN IF NOT EXISTS evidence_files jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Allow anonymous and authenticated intake submitters to upload evidence files
-- into the private shield-evidence bucket under the intake/ prefix only.
CREATE POLICY "Intake submitters can upload evidence"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'shield-evidence'
  AND (storage.foldername(name))[1] = 'intake'
);