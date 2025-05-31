
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Shield } from 'lucide-react';
import { MetricValue } from '@/types/dashboard';

interface MetricsOverviewProps {
  metrics: MetricValue[];
  loading: boolean;
}

const MetricsOverview = ({ metrics, loading }: MetricsOverviewProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="h-4 w-4" />;
      case 'trending-down':
        return <TrendingDown className="h-4 w-4" />;
      case 'activity':
        return <Activity className="h-4 w-4" />;
      case 'shield':
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-400';
      case 'red':
        return 'text-red-400';
      case 'green':
        return 'text-green-400';
      case 'yellow':
        return 'text-yellow-400';
      default:
        return 'text-corporate-accent';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-corporate-darkTertiary border-corporate-border animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-corporate-lightGray">Loading...</CardTitle>
              <div className="h-4 w-4 bg-corporate-gray rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-corporate-gray rounded mb-1"></div>
              <div className="h-4 bg-corporate-gray rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <Card key={metric.id} className="bg-corporate-darkTertiary border-corporate-border hover:border-corporate-accent transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-corporate-lightGray">
              {metric.title}
            </CardTitle>
            <div className={getColorClasses(metric.color)}>
              {getIcon(metric.icon)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value.toLocaleString()}
            </div>
            <p className="text-xs text-corporate-gray">
              {metric.delta > 0 ? '+' : ''}{metric.delta} from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
