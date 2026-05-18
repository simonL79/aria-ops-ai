
-- Comments on blog posts
CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id text NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'visible' CHECK (status IN ('visible','hidden','removed')),
  hidden_reason text,
  report_count integer NOT NULL DEFAULT 0,
  reporter_ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id, created_at DESC);
CREATE INDEX idx_blog_comments_status ON public.blog_comments(status, created_at DESC);

-- Reports on comments
CREATE TABLE public.blog_comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  reason text,
  reporter_ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, reporter_ip_hash)
);
CREATE INDEX idx_blog_comment_reports_comment ON public.blog_comment_reports(comment_id);

-- Admin-managed blocklist
CREATE TABLE public.moderation_blocklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL UNIQUE,
  severity text NOT NULL DEFAULT 'block' CHECK (severity IN ('block','flag')),
  added_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Audit trail
CREATE TABLE public.moderation_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES public.blog_comments(id) ON DELETE SET NULL,
  action text NOT NULL,
  reason text,
  actor_user_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_moderation_audit_comment ON public.moderation_audit_log(comment_id, created_at DESC);

-- updated_at trigger
CREATE TRIGGER trg_blog_comments_updated
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_audit_log ENABLE ROW LEVEL SECURITY;

-- blog_comments policies
CREATE POLICY "Public can read visible comments"
ON public.blog_comments FOR SELECT
USING (status = 'visible');

CREATE POLICY "Admins can read all comments"
ON public.blog_comments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update comments"
ON public.blog_comments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments"
ON public.blog_comments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
-- Inserts handled by edge function with service role; no public INSERT policy.

-- blog_comment_reports policies
CREATE POLICY "Admins can read reports"
ON public.blog_comment_reports FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
-- Inserts handled by edge function with service role.

-- moderation_blocklist policies
CREATE POLICY "Admins can manage blocklist"
ON public.moderation_blocklist FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- moderation_audit_log policies
CREATE POLICY "Admins can read audit log"
ON public.moderation_audit_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Seed starter blocklist
INSERT INTO public.moderation_blocklist (term, severity) VALUES
  ('nigger','block'),('faggot','block'),('kike','block'),('chink','block'),
  ('retard','block'),('tranny','block'),
  ('kill yourself','block'),('kys','block'),
  ('viagra','block'),('porn','block'),('xxx','block'),
  ('crypto giveaway','block'),('telegram me','block')
ON CONFLICT (term) DO NOTHING;
