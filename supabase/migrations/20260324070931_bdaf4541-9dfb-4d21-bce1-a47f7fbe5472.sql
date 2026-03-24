
-- Add missing columns to blog_posts (preserving all existing data and columns)
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS content_markdown text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS hero_image_url text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS hero_image_alt text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS infographic_url text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS received_at timestamptz DEFAULT now();
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS updated_at timestamptz;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS created_at timestamptz;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC);
