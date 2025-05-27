
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Eye, MousePointer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GSCTrackingData {
  id: string;
  recorded_at: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  asset_title?: string;
}

const GSCRankTracker = () => {
  const [trackingData, setTrackingData] = useState<GSCTrackingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      
      // Since gsc_rank_tracking doesn't exist in the current schema, 
      // let's use suppression_assets data for now
      const { data, error } = await supabase
        .from('suppression_assets')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to match our interface
      const formattedData = data?.map(item => ({
        id: item.id,
        recorded_at: new Date(item.created_at).toLocaleDateString(),
        impressions: item.gsc_impressions || 0,
        clicks: item.gsc_clicks || 0,
        ctr: (item.gsc_ctr || 0) * 100, // Convert to percentage
        position: item.rank_goal || 0,
        asset_title: item.asset_title
      })) || [];

      setTrackingData(formattedData);
    } catch (error) {
      console.error('Error loading GSC tracking data:', error);
      toast.error('Failed to load GSC tracking data');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = async () => {
    try {
      // Get existing suppression assets
      const { data: assets, error: assetsError } = await supabase
        .from('suppression_assets')
        .select('id')
        .limit(3);

      if (assetsError) throw assetsError;

      if (!assets || assets.length === 0) {
        // Create some sample suppression assets
        const sampleAssets = [
          {
            asset_url: 'https://example.com/positive-article-1',
            asset_title: 'Sample Positive Article 1',
            asset_type: 'article',
            publishing_channel: 'blog',
            rank_goal: 1,
            gsc_impressions: Math.floor(Math.random() * 1000) + 100,
            gsc_clicks: Math.floor(Math.random() * 50) + 5,
            gsc_ctr: Math.random() * 0.1,
            published_at: new Date().toISOString(),
            engagement_score: Math.random() * 100,
            visibility_score: Math.random() * 100
          },
          {
            asset_url: 'https://example.com/positive-article-2',
            asset_title: 'Sample Positive Article 2',
            asset_type: 'press_release',
            publishing_channel: 'news',
            rank_goal: 2,
            gsc_impressions: Math.floor(Math.random() * 1000) + 100,
            gsc_clicks: Math.floor(Math.random() * 50) + 5,
            gsc_ctr: Math.random() * 0.1,
            published_at: new Date().toISOString(),
            engagement_score: Math.random() * 100,
            visibility_score: Math.random() * 100
          }
        ];

        const { error: insertError } = await supabase
          .from('suppression_assets')
          .insert(sampleAssets);

        if (insertError) throw insertError;
        
        toast.success('Sample GSC tracking data generated');
        loadTrackingData();
      } else {
        toast.success('Sample data already exists');
        loadTrackingData();
      }
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast.error('Failed to generate sample data');
    }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>GSC Rank Tracking Overview</CardTitle>
            {trackingData.length === 0 && (
              <Button onClick={generateSampleData} variant="outline">
                Generate Sample Data
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {trackingData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No GSC tracking data available</p>
              <p className="text-sm">Generate sample data or connect your Google Search Console</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Total Impressions</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {trackingData.reduce((sum, item) => sum + item.impressions, 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MousePointer className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Total Clicks</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {trackingData.reduce((sum, item) => sum + item.clicks, 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Avg CTR</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {trackingData.length > 0 ? (trackingData.reduce((sum, item) => sum + item.ctr, 0) / trackingData.length).toFixed(2) : 0}%
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Avg Position</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {trackingData.length > 0 ? (trackingData.reduce((sum, item) => sum + item.position, 0) / trackingData.length).toFixed(1) : 0}
                  </p>
                </div>
              </div>

              {/* Position Tracking Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Position Tracking Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trackingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="recorded_at" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} reversed />
                      <Tooltip 
                        formatter={(value: number) => [value.toFixed(1), 'Position']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="position" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Impressions & Clicks Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impressions & Clicks Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trackingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="recorded_at" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="impressions" 
                        stackId="1"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="clicks" 
                        stackId="2"
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GSCRankTracker;
