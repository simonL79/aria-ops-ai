-- Fix blog_posts RLS: the existing policies are RESTRICTIVE (Permissive: No),
-- which means they AND together and block anonymous reads.
-- Drop them and recreate as PERMISSIVE policies.

DROP POLICY IF EXISTS "Allow public read access on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow service role full access on blog_posts" ON public.blog_posts;

-- Permissive SELECT for everyone (public blog)
CREATE POLICY "blog_posts_public_read"
  ON public.blog_posts
  FOR SELECT
  USING (true);

-- Permissive ALL for service_role (sync function)
CREATE POLICY "blog_posts_service_role_all"
  ON public.blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);