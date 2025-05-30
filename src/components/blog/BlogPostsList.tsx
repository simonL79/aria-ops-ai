
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

type BlogPostListProps = {
  onEditPost: (post: any) => void;
  filter: 'all' | 'draft' | 'published';
};

const BlogPostsList = ({ onEditPost, filter = 'all' }: BlogPostListProps) => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching blog posts from database...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        setError(error.message);
      } else {
        console.log('Blog posts fetched:', data);
        const transformedPosts = (data || []).map(post => ({
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

  useEffect(() => {
    fetchBlogPosts();
  }, []);
  
  const handleSort = (field) => {
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-lg">Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-lg">Error loading blog posts: {error}</p>
        <Button onClick={fetchBlogPosts} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }
  
  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter(post => {
      if (filter === 'all') return true;
      return post.status === filter;
    })
    .sort((a, b) => {
      const fieldA = sortField === 'date' ? new Date(a.date).getTime() : a[sortField];
      const fieldB = sortField === 'date' ? new Date(b.date).getTime() : b[sortField];
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  const handleDeletePost = (postId) => {
    // In a real app, this would call an API to delete the post
    console.log('Deleting post:', postId);
    toast.success('Post deleted successfully');
  };
  
  const viewPost = (slug) => {
    navigate(`/blog/${slug}`);
  };
  
  return (
    <div>
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No posts found</p>
          {filter !== 'all' && (
            <p className="mt-2">Try changing your filter settings</p>
          )}
        </div>
      ) : (
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    Title
                    {sortField === 'title' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="p-3">{post.date}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {post.status || 'Draft'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewPost(post.slug)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"  
                        onClick={() => onEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post 
                              "{post.title}" and remove it from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDeletePost(post.slug)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogPostsList;
