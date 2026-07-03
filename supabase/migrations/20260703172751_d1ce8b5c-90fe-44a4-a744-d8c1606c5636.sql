-- ============ AUTHORS ============
CREATE TABLE public.content_authors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  title text,
  bio text,
  credentials text[] NOT NULL DEFAULT '{}',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_authors TO anon, authenticated;
GRANT ALL ON public.content_authors TO service_role;
ALTER TABLE public.content_authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors are publicly readable" ON public.content_authors FOR SELECT USING (true);
CREATE POLICY "Admins manage authors" ON public.content_authors FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ CATEGORIES ============
CREATE TABLE public.content_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'intelligence',
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_categories TO anon, authenticated;
GRANT ALL ON public.content_categories TO service_role;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.content_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.content_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ CONTENT ITEMS (the one engine) ============
CREATE TABLE public.content_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'brief',
  category_id uuid REFERENCES public.content_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.content_authors(id) ON DELETE SET NULL,
  title text NOT NULL,
  subtitle text,
  excerpt text,
  body text,
  cover_image text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  featured boolean NOT NULL DEFAULT false,
  -- authority metadata
  threat_level text,
  executive_risk text,
  detection_confidence int,
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz,
  verified boolean NOT NULL DEFAULT false,
  -- seo
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  -- flexible structured blocks
  tags text[] NOT NULL DEFAULT '{}',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  references_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  downloads jsonb NOT NULL DEFAULT '[]'::jsonb,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  viz jsonb NOT NULL DEFAULT '[]'::jsonb,
  reading_minutes int,
  view_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_items_type ON public.content_items(type);
CREATE INDEX idx_content_items_status ON public.content_items(status);
CREATE INDEX idx_content_items_category ON public.content_items(category_id);
CREATE INDEX idx_content_items_published_at ON public.content_items(published_at DESC);
GRANT SELECT ON public.content_items TO anon, authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published content is publicly readable" ON public.content_items FOR SELECT USING (status = 'published');
CREATE POLICY "Admins read all content" ON public.content_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage content" ON public.content_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ KNOWLEDGE GRAPH EDGES ============
CREATE TABLE public.content_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  relation text NOT NULL DEFAULT 'related',
  weight int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, target_id, relation)
);
CREATE INDEX idx_content_links_source ON public.content_links(source_id);
CREATE INDEX idx_content_links_target ON public.content_links(target_id);
GRANT SELECT ON public.content_links TO anon, authenticated;
GRANT ALL ON public.content_links TO service_role;
ALTER TABLE public.content_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Graph links are publicly readable" ON public.content_links FOR SELECT USING (true);
CREATE POLICY "Admins manage graph links" ON public.content_links FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ TAXONOMY (programmatic entities) ============
CREATE TABLE public.content_taxonomy (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  kind text NOT NULL,
  name text NOT NULL,
  description text,
  overview text,
  common_risks jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_monitoring jsonb NOT NULL DEFAULT '[]'::jsonb,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  threat_level text,
  meta_title text,
  meta_description text,
  published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
CREATE INDEX idx_content_taxonomy_kind ON public.content_taxonomy(kind);
GRANT SELECT ON public.content_taxonomy TO anon, authenticated;
GRANT ALL ON public.content_taxonomy TO service_role;
ALTER TABLE public.content_taxonomy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published taxonomy is publicly readable" ON public.content_taxonomy FOR SELECT USING (published = true);
CREATE POLICY "Admins read all taxonomy" ON public.content_taxonomy FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage taxonomy" ON public.content_taxonomy FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ LEADS ============
CREATE TABLE public.content_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  source text,
  content_id uuid REFERENCES public.content_items(id) ON DELETE SET NULL,
  tool text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.content_leads TO anon, authenticated;
GRANT ALL ON public.content_leads TO service_role;
ALTER TABLE public.content_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.content_leads FOR INSERT WITH CHECK (char_length(email) > 3 AND char_length(email) < 320);
CREATE POLICY "Admins read leads" ON public.content_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage leads" ON public.content_leads FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ REDIRECTS ============
CREATE TABLE public.redirects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  status_code int NOT NULL DEFAULT 301,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redirects TO anon, authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Redirects are publicly readable" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Admins manage redirects" ON public.redirects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ updated_at triggers ============
CREATE TRIGGER trg_content_authors_updated BEFORE UPDATE ON public.content_authors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_content_categories_updated BEFORE UPDATE ON public.content_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_content_items_updated BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_content_taxonomy_updated BEFORE UPDATE ON public.content_taxonomy FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_redirects_updated BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();