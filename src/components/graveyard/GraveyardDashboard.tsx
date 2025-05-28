
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, TrendingDown, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LegacyPostsList from './LegacyPostsList';
import AddLegacyPostDialog from './AddLegacyPostDialog';
import SuppressionAssets from './SuppressionAssets';
import GSCRankTracker from './GSCRankTracker';

const GraveyardDashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    suppressedPosts: 0,
    averageRank: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('graveyard_legacy_posts')
        .select('is_active, suppression_status, rank_score');

      if (error) throw error;

      if (posts) {
        const totalPosts = posts.length;
        const activePosts = posts.filter(post => post.is_active).length;
        const suppressedPosts = posts.filter(post => post.suppression_status === 'suppressed').length;
        const averageRank = posts.length > 0 
          ? Math.round(posts.reduce((sum, post) => sum + (post.rank_score || 0), 0) / posts.length)
          : 0;

        setStats({
          totalPosts,
          activePosts,
          suppressedPosts,
          averageRank
        });
      }
    } catch (error) {
      console.error('Error fetching graveyard stats:', error);
      toast.error('Failed to load graveyard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return <div className="p-6">Loading graveyard dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🪦 Digital Graveyard</h1>
          <p className="text-muted-foreground">Manage and suppress legacy content</p>
        </div>
        <div className="flex gap-2">
          <AddLegacyPostDialog onPostAdded={handleRefresh} />
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Legacy content tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePosts}</div>
            <p className="text-xs text-muted-foreground">Still visible online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppressed</CardTitle>
            <Trash2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suppressedPosts}</div>
            <p className="text-xs text-muted-foreground">Successfully removed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rank</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRank}</div>
            <p className="text-xs text-muted-foreground">Search ranking position</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Legacy Posts Management</CardTitle>
          </CardHeader>
          <CardContent>
            <LegacyPostsList onStatsChange={handleRefresh} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppression Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <SuppressionAssets />
          </CardContent>
        </Card>
      </div>

      {/* GSC Rank Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Google Search Console Rank Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <GSCRankTracker />
        </CardContent>
      </Card>
    </div>
  );
};

export default GraveyardDashboard;
