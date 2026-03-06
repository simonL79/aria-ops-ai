
-- Drop the old blog_posts table and recreate with feed schema
DROP TABLE IF EXISTS public.blog_posts CASCADE;

CREATE TABLE public.blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  content_html text,
  image_url text,
  canonical_url text,
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  meta_description text,
  meta_keywords text[] DEFAULT '{}',
  faq_schema jsonb,
  reading_time integer DEFAULT 1,
  published_at timestamptz,
  modified_at timestamptz,
  synced_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on blog_posts"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role full access (for sync function)
CREATE POLICY "Allow service role full access on blog_posts"
  ON public.blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts (published_at DESC);
