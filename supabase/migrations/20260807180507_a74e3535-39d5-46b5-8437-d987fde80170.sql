-- Scope blog_comments policies to concrete roles so anonymous visitors are not
-- forced through the admin has_role() check (which anon cannot execute).

DROP POLICY IF EXISTS "Public can read visible comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can read all comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.blog_comments;

CREATE POLICY "Public can read visible comments"
ON public.blog_comments
FOR SELECT
TO anon, authenticated
USING (status = 'visible');

CREATE POLICY "Admins can read all comments"
ON public.blog_comments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update comments"
ON public.blog_comments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments"
ON public.blog_comments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));