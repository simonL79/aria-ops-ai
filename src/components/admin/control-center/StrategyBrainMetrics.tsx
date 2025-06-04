
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StrategyMetrics {
  totalStrategies: number;
  completedStrategies: number;
  activeStrategies: number;
  successRate: number;
  avgExecutionTime: string;
  recentActivity: any[];
}

interface StrategyBrainMetricsProps {
  selectedEntity: string;
}

const StrategyBrainMetrics: React.FC<StrategyBrainMetricsProps> = ({
  selectedEntity
}) => {
  const [metrics, setMetrics] = useState<StrategyMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedEntity) {
      loadMetrics();
    }
  }, [selectedEntity]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const { data: strategies, error } = await supabase
        .from('strategy_responses')
        .select('*')
        .eq('entity_name', selectedEntity)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalStrategies = strategies?.length || 0;
      const completedStrategies = strategies?.filter(s => s.status === 'completed').length || 0;
      const activeStrategies = strategies?.filter(s => ['executing', 'pending'].includes(s.status)).length || 0;
      const successRate = totalStrategies > 0 ? (completedStrategies / totalStrategies) * 100 : 0;

      // Calculate average execution time
      const executedStrategies = strategies?.filter(s => s.executed_at && s.status === 'completed') || [];
      let avgExecutionTime = 'N/A';
      
      if (executedStrategies.length > 0) {
        const totalTime = executedStrategies.reduce((acc, strategy) => {
          const executedAt = new Date(strategy.executed_at!);
          const createdAt = new Date(strategy.created_at);
          return acc + (executedAt.getTime() - createdAt.getTime());
        }, 0);
        
        const avgMs = totalTime / executedStrategies.length;
        const avgMinutes = Math.round(avgMs / (1000 * 60));
        avgExecutionTime = `${avgMinutes}m`;
      }

      const recentActivity = strategies?.slice(0, 5) || [];

      setMetrics({
        totalStrategies,
        completedStrategies,
        activeStrategies,
        successRate,
        avgExecutionTime,
        recentActivity
      });

    } catch (error) {
      console.error('Failed to load strategy metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'executing': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'pending': return <Target className="h-4 w-4 text-yellow-400" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'executing': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-corporate-accent"></div>
            <p className="text-corporate-lightGray">Loading metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || !selectedEntity) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="p-6 text-center">
          <p className="text-corporate-lightGray">Select an entity to view strategy metrics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-corporate-accent" />
              <span className="text-xs text-corporate-lightGray">Total Strategies</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{metrics.totalStrategies}</p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-xs text-corporate-lightGray">Completed</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{metrics.completedStrategies}</p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-corporate-lightGray">Active</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{metrics.activeStrategies}</p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-corporate-accent" />
              <span className="text-xs text-corporate-lightGray">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{metrics.successRate.toFixed(0)}%</p>
            <Progress 
              value={metrics.successRate} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white text-sm">Recent Strategy Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.recentActivity.length === 0 ? (
            <p className="text-corporate-lightGray text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {metrics.recentActivity.map((strategy, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-corporate-dark rounded border border-corporate-border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(strategy.status)}
                    <div>
                      <p className="text-white text-sm font-medium">{strategy.title}</p>
                      <p className="text-corporate-lightGray text-xs">
                        {new Date(strategy.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                    <Badge variant="outline" className="text-corporate-lightGray">
                      {strategy.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white text-sm">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-corporate-lightGray">Avg Execution Time:</p>
              <p className="text-white font-medium">{metrics.avgExecutionTime}</p>
            </div>
            <div>
              <p className="text-corporate-lightGray">Success Rate:</p>
              <p className="text-white font-medium">{metrics.successRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBrainMetrics;
