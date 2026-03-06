
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from '@/types/blog';

type BlogPostListProps = {
  onEditPost: (post: BlogPost) => void;
  filter: 'all';
};

const BlogPostsList = ({ onEditPost, filter = 'all' }: BlogPostListProps) => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState('published_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
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
        setBlogPosts(posts);
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        <p>Error loading blog posts: {error}</p>
        <Button onClick={fetchBlogPosts} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  const filteredPosts = [...blogPosts].sort((a, b) => {
    const fieldA = sortField === 'published_at' ? new Date(a.published_at || '').getTime() : (a as any)[sortField];
    const fieldB = sortField === 'published_at' ? new Date(b.published_at || '').getTime() : (b as any)[sortField];
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString() : '—';
  
  return (
    <div>
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-lg">No posts found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('title')}>Title</th>
              <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('published_at')}>Published</th>
              <th className="text-left p-3">Reading Time</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-3">
                  <div className="font-medium text-foreground">{post.title}</div>
                  <div className="text-sm text-muted-foreground">{post.slug}</div>
                </td>
                <td className="p-3 text-muted-foreground">{formatDate(post.published_at)}</td>
                <td className="p-3 text-muted-foreground">{post.reading_time} min</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/blog/${post.slug}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlogPostsList;
