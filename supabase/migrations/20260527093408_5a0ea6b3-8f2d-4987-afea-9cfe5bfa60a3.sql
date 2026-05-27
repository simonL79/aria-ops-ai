
CREATE TABLE public.outdated_content_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_url TEXT NOT NULL,
  reason TEXT,
  expected_change TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  google_ticket_ref TEXT,
  notes TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.outdated_content_requests TO authenticated;
GRANT ALL ON public.outdated_content_requests TO service_role;

ALTER TABLE public.outdated_content_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view outdated content requests"
  ON public.outdated_content_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert outdated content requests"
  ON public.outdated_content_requests FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update outdated content requests"
  ON public.outdated_content_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete outdated content requests"
  ON public.outdated_content_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX outdated_content_requests_status_idx ON public.outdated_content_requests (status, created_at DESC);
