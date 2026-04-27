
-- 1. Mapping table linking auth users to clients
CREATE TABLE IF NOT EXISTS public.client_portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invited_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_client_portal_users_user ON public.client_portal_users(user_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_users_client ON public.client_portal_users(client_id);

ALTER TABLE public.client_portal_users ENABLE ROW LEVEL SECURITY;

-- 2. Security-definer helpers (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_client_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT client_id FROM public.client_portal_users WHERE user_id = _user_id
  UNION
  SELECT id FROM public.clients WHERE primary_contact_user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.user_owns_client(_user_id uuid, _client_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.get_user_client_ids(_user_id) cid WHERE cid = _client_id
  )
$$;

CREATE OR REPLACE FUNCTION public.user_owns_entity(_user_id uuid, _entity text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clients c
    WHERE c.name = _entity
      AND (
        c.primary_contact_user_id = _user_id
        OR EXISTS (
          SELECT 1 FROM public.client_portal_users cpu
          WHERE cpu.client_id = c.id AND cpu.user_id = _user_id
        )
      )
  )
$$;

-- 3. RLS for client_portal_users
CREATE POLICY "Portal users view own links"
  ON public.client_portal_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage portal user links"
  ON public.client_portal_users FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Safe view of clients for portal users (excludes notes, contact email, etc.)
CREATE OR REPLACE VIEW public.client_portal_clients
WITH (security_invoker = on) AS
  SELECT id, name, tier, industry, status, onboarded_at, website, created_at
  FROM public.clients;

GRANT SELECT ON public.client_portal_clients TO authenticated;

-- 5. Additive SELECT policies on existing tables (admin policies remain untouched)
CREATE POLICY "Portal users view own clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (public.user_owns_client(auth.uid(), id));

CREATE POLICY "Portal users view own executive reports"
  ON public.executive_reports FOR SELECT
  TO authenticated
  USING (client_id IS NOT NULL AND public.user_owns_client(auth.uid(), client_id));

CREATE POLICY "Portal users view own threats"
  ON public.threats FOR SELECT
  TO authenticated
  USING (entity_name IS NOT NULL AND public.user_owns_entity(auth.uid(), entity_name));

CREATE POLICY "Portal users view own scan results"
  ON public.scan_results FOR SELECT
  TO authenticated
  USING (entity_name IS NOT NULL AND public.user_owns_entity(auth.uid(), entity_name));
