
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LegacyPost {
  id: string;
  title: string;
  url: string;
  platform: string;
  content_snippet?: string;
  rank_score: number;
  suppression_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const LegacyPostsList = ({ onStatsChange }: { onStatsChange: () => void }) => {
  const [posts, setPosts] = useState<LegacyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('graveyard_legacy_posts' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching legacy posts:', error);
      toast.error('Failed to load legacy posts');
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId: string, updates: Partial<LegacyPost>) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('graveyard_legacy_posts' as any)
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post updated successfully');
      fetchPosts();
      onStatsChange();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setActionLoading(null);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('graveyard_legacy_posts' as any)
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post deleted successfully');
      fetchPosts();
      onStatsChange();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading legacy posts...</div>;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No legacy posts found. Add your first one using the button above.
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <Badge variant={post.is_active ? "destructive" : "secondary"}>
                      {post.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={
                      post.suppression_status === 'suppressed' ? "default" :
                      post.suppression_status === 'pending' ? "secondary" : "destructive"
                    }>
                      {post.suppression_status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Platform: {post.platform} | Rank: {post.rank_score}
                  </p>
                  
                  {post.content_snippet && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.content_snippet}
                    </p>
                  )}
                  
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Original <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePostStatus(post.id, { is_active: !post.is_active })}
                    disabled={actionLoading === post.id}
                    className="w-full"
                  >
                    {post.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePostStatus(post.id, { 
                      suppression_status: post.suppression_status === 'suppressed' ? 'pending' : 'suppressed'
                    })}
                    disabled={actionLoading === post.id}
                    className="w-full"
                  >
                    {post.suppression_status === 'suppressed' ? 'Restore' : 'Suppress'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePost(post.id)}
                    disabled={actionLoading === post.id}
                    className="w-full"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default LegacyPostsList;
