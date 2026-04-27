-- Removal request workflow for client portal users
CREATE TABLE IF NOT EXISTS public.portal_removal_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft | scanning | reviewing | confirmed | dispatched | failed
  source_url text,
  source_text text,
  notes text,
  scan_started_at timestamptz,
  scan_completed_at timestamptz,
  confirmed_at timestamptz,
  dispatched_at timestamptz,
  requiem_run_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_removal_submissions_user ON public.portal_removal_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_removal_submissions_client ON public.portal_removal_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_removal_submissions_status ON public.portal_removal_submissions(status);

ALTER TABLE public.portal_removal_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portal users view own submissions"
  ON public.portal_removal_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.user_owns_client(auth.uid(), client_id) OR public.is_current_user_admin());

CREATE POLICY "Portal users create own submissions"
  ON public.portal_removal_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.user_owns_client(auth.uid(), client_id));

CREATE POLICY "Portal users update own submissions"
  ON public.portal_removal_submissions FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_current_user_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_current_user_admin());

CREATE POLICY "Admins delete submissions"
  ON public.portal_removal_submissions FOR DELETE TO authenticated
  USING (public.is_current_user_admin());

CREATE TRIGGER trg_portal_removal_submissions_updated_at
  BEFORE UPDATE ON public.portal_removal_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Flagged items produced by the AI scan, reviewed and toggled by the user
CREATE TABLE IF NOT EXISTS public.portal_removal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.portal_removal_submissions(id) ON DELETE CASCADE,
  url text,
  excerpt text,
  category text, -- defamation | misinformation | privacy | harassment | other
  severity int NOT NULL DEFAULT 5,
  ai_rationale text,
  user_confirmed boolean NOT NULL DEFAULT false,
  user_dismissed boolean NOT NULL DEFAULT false,
  removal_status text NOT NULL DEFAULT 'pending', -- pending | queued | failed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_removal_items_submission ON public.portal_removal_items(submission_id);

ALTER TABLE public.portal_removal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portal users view own items"
  ON public.portal_removal_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_removal_submissions s
      WHERE s.id = submission_id
        AND (s.user_id = auth.uid() OR public.user_owns_client(auth.uid(), s.client_id) OR public.is_current_user_admin())
    )
  );

CREATE POLICY "Portal users insert own items"
  ON public.portal_removal_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_removal_submissions s
      WHERE s.id = submission_id
        AND (s.user_id = auth.uid() OR public.is_current_user_admin())
    )
  );

CREATE POLICY "Portal users update own items"
  ON public.portal_removal_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_removal_submissions s
      WHERE s.id = submission_id
        AND (s.user_id = auth.uid() OR public.is_current_user_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_removal_submissions s
      WHERE s.id = submission_id
        AND (s.user_id = auth.uid() OR public.is_current_user_admin())
    )
  );

CREATE POLICY "Admins delete items"
  ON public.portal_removal_items FOR DELETE TO authenticated
  USING (public.is_current_user_admin());

CREATE TRIGGER trg_portal_removal_items_updated_at
  BEFORE UPDATE ON public.portal_removal_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();