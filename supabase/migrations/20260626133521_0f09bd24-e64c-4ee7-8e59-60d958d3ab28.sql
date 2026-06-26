CREATE TABLE public.legal_shield_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_type TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  desired_outcome TEXT,
  evidence_summary TEXT,
  urgency TEXT DEFAULT 'normal',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent_given BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT, SELECT ON public.legal_shield_intakes TO anon;
GRANT ALL ON public.legal_shield_intakes TO service_role;

ALTER TABLE public.legal_shield_intakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous users can submit Legal Shield intakes"
  ON public.legal_shield_intakes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own Legal Shield intakes"
  ON public.legal_shield_intakes
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all Legal Shield intakes"
  ON public.legal_shield_intakes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::text))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::text));

CREATE TRIGGER update_legal_shield_intakes_updated_at
  BEFORE UPDATE ON public.legal_shield_intakes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();