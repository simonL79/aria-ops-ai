
-- Create missing tables for build errors

-- contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to contact_submissions" ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);

-- user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- genesis_entities table
CREATE TABLE IF NOT EXISTS public.genesis_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  entity_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.genesis_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to genesis_entities" ON public.genesis_entities FOR ALL USING (true) WITH CHECK (true);

-- graveyard_simulations table
CREATE TABLE IF NOT EXISTS public.graveyard_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leak_title text,
  expected_trigger_module text,
  suppression_status text DEFAULT 'pending',
  injected_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.graveyard_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to graveyard_simulations" ON public.graveyard_simulations FOR ALL USING (true) WITH CHECK (true);

-- eidetic_footprint_queue table
CREATE TABLE IF NOT EXISTS public.eidetic_footprint_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_name text,
  content_excerpt text,
  decay_score numeric DEFAULT 0,
  routed_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.eidetic_footprint_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to eidetic_footprint_queue" ON public.eidetic_footprint_queue FOR ALL USING (true) WITH CHECK (true);

-- prospect_alerts table
CREATE TABLE IF NOT EXISTS public.prospect_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text,
  alert_type text,
  status text DEFAULT 'pending',
  source_module text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prospect_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to prospect_alerts" ON public.prospect_alerts FOR ALL USING (true) WITH CHECK (true);

-- Add user_email column to activity_logs if missing
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_email text;

-- Add missing columns to reputation_scan_submissions
ALTER TABLE public.reputation_scan_submissions ADD COLUMN IF NOT EXISTS keywords text DEFAULT '';
ALTER TABLE public.reputation_scan_submissions ADD COLUMN IF NOT EXISTS admin_notes text;

-- has_role function for RBAC
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- is_current_user_admin function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;
