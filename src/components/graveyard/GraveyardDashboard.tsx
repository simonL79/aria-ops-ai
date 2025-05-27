import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skull, TrendingDown, Eye, Target, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LegacyPostsList from './LegacyPostsList';
import SuppressionAssets from './SuppressionAssets';
import GSCRankTracker from './GSCRankTracker';
import AddLegacyPostDialog from './AddLegacyPostDialog';

interface GraveyardStats {
  totalPosts: number;
  activePosts: number;
  suppressedPosts: number;
  averageRankScore: number;
  totalImpressions: number;
  averagePosition: number;
}

const GraveyardDashboard = () => {
  const [stats, setStats] = useState<GraveyardStats>({
    totalPosts: 0,
    activePosts: 0,
    suppressedPosts: 0,
    averageRankScore: 0,
    totalImpressions: 0,
    averagePosition: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get basic post stats
      const { data: posts, error: postsError } = await supabase
        .from('legacy_reputation_posts')
        .select('rank_score, suppression_status, is_active');

      if (postsError) throw postsError;

      // Get GSC stats from suppression assets
      const { data: assets, error: assetsError } = await supabase
        .from('suppression_assets')
        .select('gsc_impressions, rank_goal');

      if (assetsError) throw assetsError;

      const totalPosts = posts?.length || 0;
      const activePosts = posts?.filter(p => p.is_active).length || 0;
      const suppressedPosts = posts?.filter(p => p.suppression_status === 'suppressed').length || 0;
      const averageRankScore = posts?.length ? 
        posts.reduce((sum, p) => sum + (p.rank_score || 0), 0) / posts.length : 0;

      const totalImpressions = assets?.reduce((sum, a) => sum + (a.gsc_impressions || 0), 0) || 0;
      const averagePosition = assets?.length ? 
        assets.reduce((sum, a) => sum + (a.rank_goal || 0), 0) / assets.length : 0;

      setStats({
        totalPosts,
        activePosts,
        suppressedPosts,
        averageRankScore: Math.round(averageRankScore),
        totalImpressions,
        averagePosition: Math.round(averagePosition * 10) / 10
      });

    } catch (error) {
      console.error('Error loading graveyard stats:', error);
      toast.error('Failed to load graveyard statistics');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      toast.success('Graveyard data refreshed');
      loadStats();
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Skull className="h-8 w-8 animate-pulse mx-auto mb-2" />
            <p>Loading GRAVEYARD...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Skull className="h-8 w-8" />
            A.R.I.A™ GRAVEYARD™
          </h1>
          <p className="text-muted-foreground mt-1">
            Legacy content suppression & GSC rank monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Legacy Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
              <Skull className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activePosts}</p>
              </div>
              <Eye className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suppressed</p>
                <p className="text-2xl font-bold">{stats.suppressedPosts}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rank</p>
                <p className="text-2xl font-bold">{stats.averageRankScore}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GSC Impressions</p>
                <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Goal</p>
                <p className="text-2xl font-bold">{stats.averagePosition}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Legacy Posts</TabsTrigger>
          <TabsTrigger value="assets">Suppression Assets</TabsTrigger>
          <TabsTrigger value="tracking">GSC Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <LegacyPostsList onPostAdded={loadStats} />
        </TabsContent>

        <TabsContent value="assets">
          <SuppressionAssets />
        </TabsContent>

        <TabsContent value="tracking">
          <GSCRankTracker />
        </TabsContent>
      </Tabs>

      <AddLegacyPostDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onPostAdded={loadStats}
      />
    </div>
  );
};

export default GraveyardDashboard;
