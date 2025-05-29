
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, TrendingDown, AlertCircle, Plus, Scan } from 'lucide-react';
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
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'legacy_content');

      if (error) throw error;

      const total = scanResults?.length || 0;
      const active = scanResults?.filter(r => r.status === 'new').length || 0;
      const suppressed = scanResults?.filter(r => r.status === 'resolved').length || 0;

      setStats({
        totalPosts: total,
        activePosts: active,
        suppressedPosts: suppressed,
        averageRank: total > 0 ? Math.round((active + suppressed) / total * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch graveyard statistics');
    } finally {
      setLoading(false);
    }
  };

  const scanForLegacyContent = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-search-crawler', {
        body: {
          query: 'negative content legacy posts',
          scan_type: 'legacy_content',
          maxResults: 50
        }
      });

      if (error) throw error;

      toast.success(`Legacy content scan completed: ${data?.results?.length || 0} items found`);
      fetchStats();
    } catch (error) {
      console.error('Legacy content scan failed:', error);
      toast.error('Legacy content scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading GRAVEYARD™ data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-red-600" />
            GRAVEYARD™ Legacy Signal Suppressor
          </h1>
          <p className="text-muted-foreground">
            Advanced legacy content identification and suppression system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={scanForLegacyContent} disabled={isScanning}>
            <Scan className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Legacy Content'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Legacy Posts</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Identified legacy content items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppressors</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.suppressedPosts}</div>
            <p className="text-xs text-muted-foreground">
              Successfully suppressed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.activePosts}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting suppression
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppression Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageRank}%</div>
            <p className="text-xs text-muted-foreground">
              Overall effectiveness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Legacy Posts Management
                <AddLegacyPostDialog onPostAdded={fetchStats} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LegacyPostsList />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suppression Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <SuppressionAssets />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GSC Rank Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <GSCRankTracker />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GraveyardDashboard;
