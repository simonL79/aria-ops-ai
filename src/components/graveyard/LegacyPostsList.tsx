
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Target, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LegacyPost {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  source_domain: string;
  rank_score: number;
  resurfacing_score: number;
  times_mentioned: number;
  suppression_status: string;
  is_active: boolean;
  first_seen: string;
  last_seen: string;
  created_at: string;
}

interface LegacyPostsListProps {
  onPostAdded: () => void;
}

const LegacyPostsList = ({ onPostAdded }: LegacyPostsListProps) => {
  const [posts, setPosts] = useState<LegacyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('legacy_reputation_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading legacy posts:', error);
      toast.error('Failed to load legacy posts');
    } finally {
      setLoading(false);
    }
  };

  const updateSuppressionStatus = async (postId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('legacy_reputation_posts')
        .update({ suppression_status: status })
        .eq('id', postId);

      if (error) throw error;
      
      toast.success(`Post marked as ${status}`);
      loadPosts();
    } catch (error) {
      console.error('Error updating suppression status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'suppressed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRankScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.source_domain?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.suppression_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legacy Reputation Posts</CardTitle>
        
        {/* Filters */}
        <div className="flex gap-4">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="suppressed">Suppressed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No legacy posts found</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      {post.title || 'Untitled Post'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {post.source_domain}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.first_seen || post.created_at).toLocaleDateString()}
                      </span>
                      <span>Mentions: {post.times_mentioned}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getRankScoreColor(post.rank_score)}`}>
                        {post.rank_score}
                      </p>
                      <p className="text-xs text-muted-foreground">Rank Score</p>
                    </div>
                    
                    <Badge className={`${getStatusColor(post.suppression_status)} text-white`}>
                      {post.suppression_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Post
                  </a>
                  
                  <div className="flex gap-2">
                    {post.suppression_status !== 'suppressed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSuppressionStatus(post.id, 'in_progress')}
                        >
                          Start Suppression
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateSuppressionStatus(post.id, 'suppressed')}
                        >
                          Mark Suppressed
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegacyPostsList;
