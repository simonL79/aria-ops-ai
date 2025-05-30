
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log('Fetching blog posts from database...');
        
        // First try to fetch from blog_posts table
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blog posts:', error);
          setError(error.message);
        } else {
          console.log('Blog posts fetched:', data);
          setBlogPosts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return { blogPosts, loading, error };
};
