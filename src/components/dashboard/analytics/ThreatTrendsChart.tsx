
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ContentAlert } from '@/types/dashboard';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface ThreatTrendsChartProps {
  alerts: ContentAlert[];
}

const ThreatTrendsChart: React.FC<ThreatTrendsChartProps> = ({ alerts }) => {
  // Process alerts to create trend data
  const getTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayAlerts = alerts.filter(alert => 
        alert.date.startsWith(date.split('-').reverse().join('/'))
      );
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: dayAlerts.filter(a => a.severity === 'high').length,
        medium: dayAlerts.filter(a => a.severity === 'medium').length,
        low: dayAlerts.filter(a => a.severity === 'low').length,
        total: dayAlerts.length
      };
    });
  };

  const getThreatTypeData = () => {
    const threatTypes = alerts.reduce((acc, alert) => {
      const type = alert.threatType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(threatTypes).map(([type, count]) => ({
      type: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      count
    }));
  };

  const trendData = getTrendData();
  const threatTypeData = getThreatTypeData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Threat Trends (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Threat Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={threatTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatTrendsChart;
