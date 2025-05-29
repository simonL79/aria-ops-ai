
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Eye, BarChart3, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImpactMetric {
  id: string;
  entity_name: string;
  source: string;
  mention_count: number;
  audience_reach: number;
  influence_rating: number;
  exposure_score: number;
  sentiment_average: number;
  calculated_at: string;
}

export const LuminoscorePanel = () => {
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      // Load real scan results from the database
      const { data: scanData, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (scanError) {
        console.error('Error loading scan results:', scanError);
      } else {
        setScanResults(scanData || []);
        // Convert scan results to impact metrics format
        const metrics = scanData?.map((scan: any) => ({
          id: scan.id,
          entity_name: scan.detected_entities?.[0] || 'Unknown Entity',
          source: scan.platform,
          mention_count: 1,
          audience_reach: scan.potential_reach || 0,
          influence_rating: (scan.confidence_score || 75) / 100,
          exposure_score: scan.sentiment * 50 + 50, // Convert sentiment to exposure score
          sentiment_average: scan.sentiment || 0,
          calculated_at: scan.created_at
        })) || [];
        setImpactMetrics(metrics);
      }

      // Load content alerts as additional metrics
      const { data: alertData, error: alertError } = await supabase
        .from('content_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertError) {
        console.error('Error loading content alerts:', alertError);
      } else if (alertData) {
        const alertMetrics = alertData.map((alert: any) => ({
          id: alert.id,
          entity_name: alert.detected_entities?.[0] || 'Alert Entity',
          source: alert.platform,
          mention_count: 1,
          audience_reach: alert.potential_reach || 0,
          influence_rating: (alert.confidence_score || 75) / 100,
          exposure_score: alert.sentiment * 50 + 50,
          sentiment_average: alert.sentiment || 0,
          calculated_at: alert.created_at
        }));
        setImpactMetrics(prev => [...prev, ...alertMetrics]);
      }

    } catch (error) {
      console.error('Error loading real data:', error);
      toast.error('Failed to load impact metrics from database');
    }
  };

  const getInfluenceColor = (rating: number) => {
    if (rating >= 0.8) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (rating >= 0.6) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (rating >= 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getExposureColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 60) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.3) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (sentiment >= -0.1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const triggerRealScan = async () => {
    setIsLoading(true);
    try {
      // Call the real monitoring scan
      const { data, error } = await supabase.functions.invoke('monitoring-scan', {
        body: { 
          fullScan: true,
          source: 'luminoscore_panel'
        }
      });
      
      if (error) {
        console.error('Scan error:', error);
        toast.error('Failed to start real scan');
      } else {
        toast.success('Real scan initiated - results will appear shortly');
        // Reload data after scan
        setTimeout(() => {
          loadRealData();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering scan:', error);
      toast.error('Failed to trigger monitoring scan');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const totalMetrics = impactMetrics.length;
      const avgInfluence = totalMetrics > 0 ? impactMetrics.reduce((sum, metric) => sum + metric.influence_rating, 0) / totalMetrics : 0;
      const avgExposure = totalMetrics > 0 ? impactMetrics.reduce((sum, metric) => sum + metric.exposure_score, 0) / totalMetrics : 0;
      const totalReach = impactMetrics.reduce((sum, metric) => sum + metric.audience_reach, 0);
      
      toast.success(
        `LUMINOSCORE™ Report: ${totalMetrics} entities, avg influence: ${avgInfluence.toFixed(2)}, avg exposure: ${avgExposure.toFixed(1)}, total reach: ${totalReach.toLocaleString()}`
      );
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate LUMINOSCORE™ report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Real Impact Metrics Display */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Star className="h-4 w-4" />
            LUMINOSCORE™ Live Impact Metrics
            <Button
              size="sm"
              onClick={triggerRealScan}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              {isLoading ? 'Scanning...' : 'Real Scan'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {impactMetrics.length === 0 ? (
            <div className="text-gray-500 text-sm">
              No real impact metrics available. Click "Real Scan" to trigger monitoring scan.
            </div>
          ) : (
            impactMetrics.map((metric) => (
              <div key={metric.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Star className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{metric.entity_name}]</span>
                  </div>
                  <div className="text-xs text-orange-400 mb-1">
                    {metric.source} | {metric.mention_count} mentions | {metric.audience_reach.toLocaleString()} reach
                  </div>
                  <div className="text-xs text-gray-500">
                    Calculated: {new Date(metric.calculated_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getInfluenceColor(metric.influence_rating)}>
                    Inf: {(metric.influence_rating * 100).toFixed(0)}%
                  </Badge>
                  <Badge className={getExposureColor(metric.exposure_score)}>
                    Exp: {metric.exposure_score.toFixed(1)}
                  </Badge>
                  <Badge className={getSentimentColor(metric.sentiment_average)}>
                    Sent: {metric.sentiment_average.toFixed(2)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Real Scan Results Display */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Scan Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {scanResults.length === 0 ? (
            <div className="text-gray-500 text-sm">No scan results available</div>
          ) : (
            scanResults.slice(0, 5).map((result) => (
              <div key={result.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-cyan-300">[{result.platform}]</span>
                  </div>
                  <div className="text-xs text-cyan-400 mb-1">
                    {result.content?.substring(0, 100)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.created_at).toLocaleTimeString()} | {result.severity} severity
                  </div>
                </div>
                <Badge className={result.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {result.severity}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            LUMINOSCORE™ Analysis Engine
            <Button
              size="sm"
              onClick={generateReport}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{impactMetrics.length}</div>
              <div className="text-xs text-gray-500">Impact Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{scanResults.length}</div>
              <div className="text-xs text-gray-500">Scan Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {scanResults.filter(r => r.severity === 'high').length}
              </div>
              <div className="text-xs text-gray-500">High Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
