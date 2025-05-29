
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Search, Users } from 'lucide-react';
import { MetricValue } from '@/types/dashboard';

interface MetricsOverviewProps {
  metrics: MetricValue[];
  loading?: boolean;
}

const MetricsOverview = ({ metrics, loading = false }: MetricsOverviewProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Only show metrics if we have real live data
  if (!metrics || metrics.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-gray-600">No live intelligence metrics available</p>
          <p className="text-sm text-gray-500">Trigger an OSINT sweep from Operator Console to populate metrics</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'search': return <Search className="h-4 w-4" />;
      case 'alert-triangle': return <AlertTriangle className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'shield': return <Shield className="h-4 w-4" />;
      case 'trending-up': return <TrendingUp className="h-4 w-4" />;
      case 'trending-down': return <TrendingDown className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-50';
      case 'red': return 'text-red-600 bg-red-50';
      case 'yellow': return 'text-yellow-600 bg-yellow-50';
      case 'green': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${getColorClasses(metric.color)}`}>
              {getIcon(metric.icon)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Badge variant="outline" className="text-xs">
                Live OSINT
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
