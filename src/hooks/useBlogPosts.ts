
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
        
        // Use the generic from() method to query the blog_posts table
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blog posts:', error);
          setError(error.message);
        } else {
          console.log('Blog posts fetched:', data);
          // Transform the database data to match BlogPost interface
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
            status: post.status as 'draft' | 'published'
          }));
          setBlogPosts(transformedPosts);
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
