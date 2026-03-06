
-- Batch 4: More missing tables

-- blog_posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  content TEXT,
  author TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  image TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

-- monitored_platforms
CREATE TABLE public.monitored_platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL,
  platform_type TEXT,
  url TEXT,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.monitored_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to monitored_platforms" ON public.monitored_platforms FOR ALL USING (true) WITH CHECK (true);

-- triggers
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monitored_platforms_updated_at BEFORE UPDATE ON public.monitored_platforms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
