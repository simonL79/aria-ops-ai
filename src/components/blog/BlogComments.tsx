import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Flag, MessageSquare, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaLoader: Promise<string | null> | null = null;
const loadRecaptcha = (): Promise<string | null> => {
  if (recaptchaLoader) return recaptchaLoader;
  recaptchaLoader = (async () => {
    try {
      const { data } = await supabase.functions.invoke('get-public-config');
      const siteKey: string | undefined = data?.recaptcha_site_key;
      if (!siteKey) return null;
      if (!document.querySelector(`script[data-recaptcha="${siteKey}"]`)) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
          s.async = true;
          s.defer = true;
          s.dataset.recaptcha = siteKey;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('recaptcha load failed'));
          document.head.appendChild(s);
        });
      }
      await new Promise<void>((resolve) => {
        const check = () => (window.grecaptcha ? window.grecaptcha.ready(resolve) : setTimeout(check, 100));
        check();
      });
      return siteKey;
    } catch {
      return null;
    }
  })();
  return recaptchaLoader;
};

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface Props {
  postId: string;
}

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const BlogComments: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reportingId, setReportingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('blog_comments')
      .select('id, author_name, content, created_at')
      .eq('post_id', postId)
      .eq('status', 'visible')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error) setComments((data ?? []) as Comment[]);
    setLoading(false);
  };

  useEffect(() => {
    if (postId) void load();
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || content.trim().length < 2) {
      toast.error('Please enter a name and comment');
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('submit-blog-comment', {
      body: { post_id: postId, author_name: name.trim(), content: content.trim() },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast.error(data?.error || 'Could not post comment');
      return;
    }
    if (data?.auto_hidden) {
      toast.warning('Your comment was held for review.');
    } else {
      toast.success('Comment posted');
    }
    setContent('');
    void load();
  };

  useEffect(() => {
    void loadRecaptcha();
  }, []);

  const report = async (id: string) => {
    setReportingId(id);
    let captcha_token = '';
    try {
      const siteKey = await loadRecaptcha();
      if (siteKey && window.grecaptcha) {
        captcha_token = await window.grecaptcha.execute(siteKey, { action: 'report_comment' });
      }
    } catch {
      // fall through; backend will reject if token missing
    }
    if (!captcha_token) {
      setReportingId(null);
      toast.error('Could not verify you are human. Please try again.');
      return;
    }
    const { data, error } = await supabase.functions.invoke('report-blog-comment', {
      body: { comment_id: id, captcha_token },
    });
    setReportingId(null);
    if (error || data?.error) {
      toast.error(data?.error || 'Could not submit report');
      return;
    }
    if (data?.already_reported) {
      toast.info('You have already reported this comment');
    } else if (data?.auto_hidden) {
      toast.success('Comment removed by community reports');
      void load();
    } else {
      toast.success('Report received. Thank you.');
    }
  };

  return (
    <section aria-labelledby="comments-heading" className="border-t border-border pt-10 mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 id="comments-heading" className="text-xl font-bold text-foreground">
          Discussion ({comments.length})
        </h2>
      </div>

      <form onSubmit={submit} className="space-y-3 mb-8 p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
        <Textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={3}
          required
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Comments are moderated. Hateful or spam content is removed automatically.
          </p>
          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Be the first to comment.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="p-4 rounded-lg border border-border bg-card/40">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{c.author_name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">{c.content}</p>
              <button
                type="button"
                onClick={() => report(c.id)}
                disabled={reportingId === c.id}
                className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                aria-label="Report this comment"
              >
                <Flag className="h-3 w-3" />
                {reportingId === c.id ? 'Reporting...' : 'Report'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogComments;
