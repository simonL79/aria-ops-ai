
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Globe, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const overallMetrics = {
    totalDeployments: 2847,
    successRate: 97.8,
    avgResponseTime: 1.24,
    activeTargets: 12,
    dailyAverage: 156,
    peakThroughput: 342
  };

  const platformMetrics = [
    {
      name: 'GitHub Pages',
      deployments: 845,
      successRate: 99.2,
      avgTime: 0.89,
      status: 'excellent',
      trend: 'up'
    },
    {
      name: 'Netlify',
      deployments: 623,
      successRate: 98.5,
      avgTime: 1.12,
      status: 'good',
      trend: 'up'
    },
    {
      name: 'Vercel',
      deployments: 456,
      successRate: 97.1,
      avgTime: 1.34,
      status: 'good',
      trend: 'stable'
    },
    {
      name: 'Cloudflare Pages',
      deployments: 234,
      successRate: 95.8,
      avgTime: 1.67,
      status: 'warning',
      trend: 'down'
    }
  ];

  const recentActivity = [
    { time: '14:23', action: 'Bulk deployment completed', platform: 'GitHub Pages', articles: 25, success: true },
    { time: '14:18', action: 'Review posts deployed', platform: 'Netlify', articles: 12, success: true },
    { time: '14:15', action: 'Deployment failed', platform: 'Cloudflare', articles: 8, success: false },
    { time: '14:10', action: 'Custom target tested', platform: 'WordPress API', articles: 1, success: true },
    { time: '14:05', action: 'Scheduled deployment', platform: 'Vercel', articles: 15, success: true }
  ];

  const hourlyStats = [
    { hour: '08:00', deployments: 45, success: 44 },
    { hour: '09:00', deployments: 78, success: 76 },
    { hour: '10:00', deployments: 92, success: 90 },
    { hour: '11:00', deployments: 67, success: 65 },
    { hour: '12:00', deployments: 54, success: 53 },
    { hour: '13:00', deployments: 83, success: 81 },
    { hour: '14:00', deployments: 96, success: 93 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-400';
      case 'good': return 'bg-blue-500/20 text-blue-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Target className="h-4 w-4 text-corporate-accent" />
              Total Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallMetrics.totalDeployments.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs corporate-subtext">Avg {overallMetrics.dailyAverage}/day</p>
              <TrendingUp className="h-3 w-3 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{overallMetrics.successRate}%</div>
            <Progress value={overallMetrics.successRate} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
              <Zap className="h-4 w-4 text-corporate-accent" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallMetrics.avgResponseTime}s</div>
            <p className="text-xs corporate-subtext">Peak: {overallMetrics.peakThroughput}/hr</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent" />
            Platform Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformMetrics.map((platform, index) => (
              <div key={index} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-corporate-accent" />
                    <div>
                      <h3 className="font-medium text-white">{platform.name}</h3>
                      <Badge className={getStatusColor(platform.status)}>
                        {platform.status}
                      </Badge>
                    </div>
                  </div>
                  {getTrendIcon(platform.trend)}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-corporate-lightGray">Deployments</div>
                    <div className="text-white font-bold">{platform.deployments}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Success Rate</div>
                    <div className="text-white font-bold">{platform.successRate}%</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Avg Time</div>
                    <div className="text-white font-bold">{platform.avgTime}s</div>
                  </div>
                </div>
                
                <Progress value={platform.successRate} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Activity Chart */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <BarChart3 className="h-5 w-5 text-corporate-accent" />
            Hourly Deployment Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hourlyStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm text-corporate-lightGray">{stat.hour}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{stat.deployments} deployments</span>
                    <span className="text-green-400">{stat.success} successful</span>
                  </div>
                  <Progress value={(stat.success / stat.deployments) * 100} className="h-2" />
                </div>
                <div className="w-16 text-right text-sm text-white">
                  {Math.round((stat.success / stat.deployments) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Clock className="h-5 w-5 text-corporate-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-corporate-darkSecondary rounded">
                <div className="w-12 text-xs text-corporate-lightGray">{activity.time}</div>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.action}</div>
                  <div className="text-xs text-corporate-lightGray">
                    {activity.platform} • {activity.articles} articles
                  </div>
                </div>
                {activity.success ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
