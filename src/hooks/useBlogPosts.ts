
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from '@/types/blog';

const SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const PAGE_SIZE = 12;

export const syncBlogPosts = async (): Promise<{ success: boolean; synced?: number; deleted?: number; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('sync-blog-posts');
    if (error) throw error;
    return data;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Sync failed' };
  }
};

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: queryError } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .range(from, to);

      if (queryError) throw queryError;

      const posts: BlogPost[] = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        content_html: p.content_html,
        image_url: p.image_url,
        canonical_url: p.canonical_url,
        tags: p.tags || [],
        language: p.language || 'en',
        meta_description: p.meta_description,
        meta_keywords: p.meta_keywords || [],
        faq_schema: p.faq_schema,
        reading_time: p.reading_time || 1,
        published_at: p.published_at,
        modified_at: p.modified_at,
        synced_at: p.synced_at,
      }));

      if (append) {
        setBlogPosts(prev => [...prev, ...posts]);
      } else {
        setBlogPosts(posts);
      }
      setHasMore(posts.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    }
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, true);
  }, [page, fetchPosts]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Always load existing posts first
        await fetchPosts(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchPosts]);

  return { blogPosts, loading, syncing, error, hasMore, loadMore, refetch: () => fetchPosts(0) };
};

export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await (supabase as any)
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (queryError) throw queryError;

        if (data) {
          setPost({
            id: data.id,
            title: data.title,
            slug: data.slug,
            summary: data.summary,
            content_html: data.content_html,
            image_url: data.image_url,
            canonical_url: data.canonical_url,
            tags: data.tags || [],
            language: data.language || 'en',
            meta_description: data.meta_description,
            meta_keywords: data.meta_keywords || [],
            faq_schema: data.faq_schema,
            reading_time: data.reading_time || 1,
            published_at: data.published_at,
            modified_at: data.modified_at,
            synced_at: data.synced_at,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

export const useRelatedPosts = (currentPost: BlogPost | null) => {
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!currentPost) return;

    const fetchRelated = async () => {
      try {
        // Get recent posts excluding current
        const { data } = await (supabase as any)
          .from('blog_posts')
          .select('*')
          .neq('id', currentPost.id)
          .order('published_at', { ascending: false })
          .limit(10);

        if (!data || data.length === 0) return;

        const posts: BlogPost[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          content_html: p.content_html,
          image_url: p.image_url,
          canonical_url: p.canonical_url,
          tags: p.tags || [],
          language: p.language || 'en',
          meta_description: p.meta_description,
          meta_keywords: p.meta_keywords || [],
          faq_schema: p.faq_schema,
          reading_time: p.reading_time || 1,
          published_at: p.published_at,
          modified_at: p.modified_at,
          synced_at: p.synced_at,
        }));

        // Sort by tag overlap
        const currentTags = new Set(currentPost.tags || []);
        if (currentTags.size > 0) {
          posts.sort((a, b) => {
            const overlapA = (a.tags || []).filter(t => currentTags.has(t)).length;
            const overlapB = (b.tags || []).filter(t => currentTags.has(t)).length;
            return overlapB - overlapA;
          });
        }

        setRelated(posts.slice(0, 3));
      } catch {
        // Silently fail
      }
    };

    fetchRelated();
  }, [currentPost]);

  return related;
};
