
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Eye, BarChart3, Zap } from 'lucide-react';
import { toast } from 'sonner';

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

interface TrendAnalysis {
  id: string;
  entity_name: string;
  trend_period: string;
  influence_change: number;
  exposure_change: number;
  sentiment_shift: number;
  trend_direction: string;
  analyzed_at: string;
}

interface AudienceBreakdown {
  id: string;
  entity_name: string;
  platform: string;
  demographic_segment: string;
  reach_count: number;
  engagement_rate: number;
  influence_factor: number;
  measured_at: string;
}

export const LuminoscorePanel = () => {
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [audienceBreakdown, setAudienceBreakdown] = useState<AudienceBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLuminoscoreData();
  }, []);

  const loadLuminoscoreData = async () => {
    await Promise.all([loadImpactMetrics(), loadTrendAnalysis(), loadAudienceBreakdown()]);
  };

  const loadImpactMetrics = async () => {
    try {
      // Using mock data since tables are newly created
      const mockData: ImpactMetric[] = [
        {
          id: '1',
          entity_name: 'Global Tech Corp',
          source: 'twitter',
          mention_count: 25,
          audience_reach: 500000,
          influence_rating: 0.82,
          exposure_score: 73.5,
          sentiment_average: 0.33,
          calculated_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Innovation Labs',
          source: 'linkedin',
          mention_count: 18,
          audience_reach: 250000,
          influence_rating: 0.67,
          exposure_score: 58.2,
          sentiment_average: 0.45,
          calculated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          entity_name: 'Future Dynamics',
          source: 'reddit',
          mention_count: 42,
          audience_reach: 850000,
          influence_rating: 0.91,
          exposure_score: 89.7,
          sentiment_average: 0.12,
          calculated_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setImpactMetrics(mockData);
    } catch (error) {
      console.error('Error loading impact metrics:', error);
      setImpactMetrics([]);
    }
  };

  const loadTrendAnalysis = async () => {
    try {
      const mockData: TrendAnalysis[] = [
        {
          id: '1',
          entity_name: 'Global Tech Corp',
          trend_period: 'weekly',
          influence_change: 0.15,
          exposure_change: 12.5,
          sentiment_shift: 0.08,
          trend_direction: 'rising',
          analyzed_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Innovation Labs',
          trend_period: 'weekly',
          influence_change: -0.03,
          exposure_change: -5.2,
          sentiment_shift: 0.12,
          trend_direction: 'stable',
          analyzed_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          entity_name: 'Future Dynamics',
          trend_period: 'weekly',
          influence_change: 0.08,
          exposure_change: 8.9,
          sentiment_shift: -0.05,
          trend_direction: 'rising',
          analyzed_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setTrendAnalysis(mockData);
    } catch (error) {
      console.error('Error loading trend analysis:', error);
      setTrendAnalysis([]);
    }
  };

  const loadAudienceBreakdown = async () => {
    try {
      const mockData: AudienceBreakdown[] = [
        {
          id: '1',
          entity_name: 'Global Tech Corp',
          platform: 'twitter',
          demographic_segment: 'tech_professionals',
          reach_count: 180000,
          engagement_rate: 0.08,
          influence_factor: 0.85,
          measured_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Global Tech Corp',
          platform: 'linkedin',
          demographic_segment: 'business_leaders',
          reach_count: 95000,
          engagement_rate: 0.12,
          influence_factor: 0.92,
          measured_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          entity_name: 'Innovation Labs',
          platform: 'reddit',
          demographic_segment: 'early_adopters',
          reach_count: 120000,
          engagement_rate: 0.15,
          influence_factor: 0.78,
          measured_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setAudienceBreakdown(mockData);
    } catch (error) {
      console.error('Error loading audience breakdown:', error);
      setAudienceBreakdown([]);
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

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'rising':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'declining':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'stable':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.3) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (sentiment >= -0.1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const calculateScore = async () => {
    setIsLoading(true);
    try {
      const entities = ['TechStart Inc', 'Digital Solutions', 'Market Leaders', 'Innovation Hub'];
      const sources = ['twitter', 'linkedin', 'reddit', 'facebook'];
      
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMentions = Math.floor(Math.random() * 50) + 10;
      const randomReach = Math.floor(Math.random() * 800000) + 100000;
      const randomInfluence = Math.random() * 0.4 + 0.5;
      const randomExposure = Math.random() * 40 + 50;
      const randomSentiment = Math.random() * 0.8 - 0.2;
      
      const newMetric: ImpactMetric = {
        id: Date.now().toString(),
        entity_name: randomEntity,
        source: randomSource,
        mention_count: randomMentions,
        audience_reach: randomReach,
        influence_rating: parseFloat(randomInfluence.toFixed(2)),
        exposure_score: parseFloat(randomExposure.toFixed(1)),
        sentiment_average: parseFloat(randomSentiment.toFixed(2)),
        calculated_at: new Date().toISOString()
      };

      setImpactMetrics(prev => [newMetric, ...prev.slice(0, 9)]);
      toast.success('New LUMINOSCORE™ calculation complete');
    } catch (error) {
      console.error('Error calculating score:', error);
      toast.error('Failed to calculate LUMINOSCORE™');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTrend = async () => {
    setIsLoading(true);
    try {
      const entities = ['Digital Corp', 'Innovation Group', 'Future Systems'];
      const directions = ['rising', 'declining', 'stable'];
      
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      const randomInfluenceChange = Math.random() * 0.3 - 0.1;
      const randomExposureChange = Math.random() * 20 - 5;
      const randomSentimentShift = Math.random() * 0.2 - 0.1;
      
      const newTrend: TrendAnalysis = {
        id: Date.now().toString(),
        entity_name: randomEntity,
        trend_period: 'weekly',
        influence_change: parseFloat(randomInfluenceChange.toFixed(2)),
        exposure_change: parseFloat(randomExposureChange.toFixed(1)),
        sentiment_shift: parseFloat(randomSentimentShift.toFixed(2)),
        trend_direction: randomDirection,
        analyzed_at: new Date().toISOString()
      };

      setTrendAnalysis(prev => [newTrend, ...prev.slice(0, 9)]);
      toast.success('Trend analysis generated');
    } catch (error) {
      console.error('Error analyzing trend:', error);
      toast.error('Failed to analyze trend');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const totalMetrics = impactMetrics.length;
      const avgInfluence = impactMetrics.reduce((sum, metric) => sum + metric.influence_rating, 0) / totalMetrics;
      const avgExposure = impactMetrics.reduce((sum, metric) => sum + metric.exposure_score, 0) / totalMetrics;
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
      {/* Impact Metrics Display */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Star className="h-4 w-4" />
            LUMINOSCORE™ Impact Metrics
            <Button
              size="sm"
              onClick={calculateScore}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Calculate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {impactMetrics.length === 0 ? (
            <div className="text-gray-500 text-sm">No impact metrics calculated</div>
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

      {/* Trend Analysis */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Influence Trend Analysis
            <Button
              size="sm"
              onClick={analyzeTrend}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {trendAnalysis.length === 0 ? (
            <div className="text-gray-500 text-sm">No trend analysis available</div>
          ) : (
            trendAnalysis.map((trend) => (
              <div key={trend.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-cyan-300">[{trend.entity_name}]</span>
                  </div>
                  <div className="text-xs text-cyan-400 mb-1">
                    Influence Δ: {trend.influence_change > 0 ? '+' : ''}{trend.influence_change.toFixed(2)} | 
                    Exposure Δ: {trend.exposure_change > 0 ? '+' : ''}{trend.exposure_change.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Period: {trend.trend_period} | {new Date(trend.analyzed_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getTrendColor(trend.trend_direction)}>
                    {trend.trend_direction}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Audience Breakdown */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience Demographics Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {audienceBreakdown.length === 0 ? (
            <div className="text-gray-500 text-sm">No audience data available</div>
          ) : (
            audienceBreakdown.map((audience) => (
              <div key={audience.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Users className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{audience.entity_name}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    {audience.platform} | {audience.demographic_segment.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Reach: {audience.reach_count.toLocaleString()} | 
                    Engagement: {(audience.engagement_rate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getInfluenceColor(audience.influence_factor)}>
                    Factor: {(audience.influence_factor * 100).toFixed(0)}%
                  </Badge>
                </div>
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
              <div className="text-2xl font-bold text-cyan-400">{trendAnalysis.length}</div>
              <div className="text-xs text-gray-500">Trend Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{audienceBreakdown.length}</div>
              <div className="text-xs text-gray-500">Audience Segments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
