
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
  log_date: string;
  gsc_impressions: number;
  gsc_clicks: number;
  gsc_ctr: number;
  gsc_position: number;
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
      const { data, error } = await supabase
        .from('suppression_rank_history')
        .select(`
          *,
          suppression_assets!inner(asset_title)
        `)
        .order('log_date', { ascending: true })
        .limit(100);

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        asset_title: item.suppression_assets?.asset_title,
        log_date: new Date(item.log_date).toLocaleDateString(),
        gsc_ctr: item.gsc_ctr * 100 // Convert to percentage
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
        toast.error('No suppression assets found to generate tracking data for');
        return;
      }

      // Generate sample tracking data for the last 30 days
      const sampleData = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        for (const asset of assets) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          sampleData.push({
            asset_id: asset.id,
            log_date: date.toISOString().split('T')[0], // Date only
            gsc_impressions: Math.floor(Math.random() * 1000) + 100,
            gsc_clicks: Math.floor(Math.random() * 50) + 5,
            gsc_ctr: Math.random() * 0.1,
            gsc_position: Math.random() * 30 + 10
          });
        }
      }

      const { error } = await supabase
        .from('suppression_rank_history')
        .insert(sampleData);

      if (error) throw error;
      
      toast.success('Sample GSC tracking data generated');
      loadTrackingData();
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
                    {trackingData.reduce((sum, item) => sum + item.gsc_impressions, 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MousePointer className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Total Clicks</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {trackingData.reduce((sum, item) => sum + item.gsc_clicks, 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Avg CTR</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(trackingData.reduce((sum, item) => sum + item.gsc_ctr, 0) / trackingData.length).toFixed(2)}%
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Avg Position</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(trackingData.reduce((sum, item) => sum + item.gsc_position, 0) / trackingData.length).toFixed(1)}
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
                      <XAxis dataKey="log_date" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} reversed />
                      <Tooltip 
                        formatter={(value: number) => [value.toFixed(1), 'Position']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gsc_position" 
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
                      <XAxis dataKey="log_date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="gsc_impressions" 
                        stackId="1"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="gsc_clicks" 
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
