
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our BlogPost interface
        const transformedPosts: BlogPost[] = (data || []).map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description || '',
          content: post.content || '',
          author: post.author,
          date: post.date,
          image: post.image || '',
          category: post.category,
          status: post.status as 'draft' | 'published',
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          meta_keywords: post.meta_keywords,
          medium_url: post.medium_url,
          created_at: post.created_at,
          updated_at: post.updated_at
        }));

        setBlogPosts(transformedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return { blogPosts, loading, error };
};
