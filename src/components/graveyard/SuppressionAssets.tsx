import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, TrendingUp, Eye, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SuppressionAsset {
  id: string;
  asset_url: string;
  asset_title: string;
  asset_type: string;
  publishing_channel: string;
  rank_goal: number;
  published_at: string;
  engagement_score: number;
  visibility_score: number;
  gsc_impressions: number;
  gsc_clicks: number;
  gsc_ctr: number;
  gsc_last_checked: string;
  created_at: string;
  legacy_post_id: string;
}

interface SuppressionAssetsProps {
  onStatsChange?: () => void;
}

const SuppressionAssets = ({ onStatsChange }: SuppressionAssetsProps) => {
  const [assets, setAssets] = useState<SuppressionAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppression_assets')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading suppression assets:', error);
      toast.error('Failed to load suppression assets');
    } finally {
      setLoading(false);
    }
  };

  const updateGSCData = async (assetId: string) => {
    try {
      // Simulate GSC data update with the actual schema
      const mockGSCData = {
        gsc_impressions: Math.floor(Math.random() * 10000) + 500,
        gsc_clicks: Math.floor(Math.random() * 500) + 10,
        gsc_ctr: Math.random() * 0.1,
        gsc_last_checked: new Date().toISOString()
      };

      const { error } = await supabase
        .from('suppression_assets')
        .update(mockGSCData)
        .eq('id', assetId);

      if (error) throw error;
      
      toast.success('GSC data updated');
      loadAssets();
      onStatsChange?.(); // Call the callback to refresh parent stats
    } catch (error) {
      console.error('Error updating GSC data:', error);
      toast.error('Failed to update GSC data');
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'article': return 'bg-blue-500';
      case 'press_release': return 'bg-green-500';
      case 'social_media': return 'bg-purple-500';
      case 'video': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (current: number, goal: number) => {
    if (!current || !goal) return 'text-gray-500';
    const percentage = (current / goal) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

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
        <CardTitle>Suppression Assets & GSC Performance</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {assets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No suppression assets deployed</p>
            </div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{asset.asset_title}</h3>
                      <Badge className={`${getAssetTypeColor(asset.asset_type)} text-white`}>
                        {asset.asset_type?.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Published via {asset.publishing_channel} • 
                      {asset.published_at && ` ${new Date(asset.published_at).toLocaleDateString()}`}
                    </p>
                    
                    <a 
                      href={asset.asset_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Asset
                    </a>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateGSCData(asset.id)}
                  >
                    Update GSC Data
                  </Button>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Impressions</span>
                    </div>
                    <p className="text-lg font-bold">{asset.gsc_impressions?.toLocaleString() || 0}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">Clicks</span>
                    </div>
                    <p className="text-lg font-bold">{asset.gsc_clicks || 0}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">CTR</span>
                    </div>
                    <p className="text-lg font-bold">
                      {asset.gsc_ctr ? (asset.gsc_ctr * 100).toFixed(2) + '%' : '0%'}
                    </p>
                  </div>
                </div>

                {/* Rank Goal Progress */}
                {asset.rank_goal && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rank Goal Progress</span>
                      <span>Goal: Position {asset.rank_goal}</span>
                    </div>
                    <Progress 
                      value={50}
                      className="h-2"
                    />
                  </div>
                )}

                {asset.gsc_last_checked && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(asset.gsc_last_checked).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuppressionAssets;
