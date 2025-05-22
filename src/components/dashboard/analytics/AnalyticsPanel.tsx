
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DataSourceStats, ThreatVector } from '@/types/intelligence';
import { ContentAlert } from '@/types/dashboard';
import { AreaChart, Area } from 'recharts';
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";

// Colors for charts
const COLORS = {
  primary: 'var(--brand)',
  secondary: '#6366F1',
  negative: 'var(--alert-negative)',
  positive: 'var(--alert-positive)',
  neutral: '#94A3B8',
  twitter: '#1DA1F2',
  reddit: '#FF4500',
  news: '#6B7280',
  reviews: '#8B5CF6',
  pie: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
};

// Mock data (replace with real data in production)
const threatsByDayData = [
  { date: '5/12', count: 8, highSeverity: 2, mediumSeverity: 3, lowSeverity: 3 },
  { date: '5/13', count: 12, highSeverity: 4, mediumSeverity: 5, lowSeverity: 3 },
  { date: '5/14', count: 10, highSeverity: 2, mediumSeverity: 6, lowSeverity: 2 },
  { date: '5/15', count: 15, highSeverity: 5, mediumSeverity: 7, lowSeverity: 3 },
  { date: '5/16', count: 9, highSeverity: 3, mediumSeverity: 4, lowSeverity: 2 },
  { date: '5/17', count: 11, highSeverity: 4, mediumSeverity: 4, lowSeverity: 3 },
  { date: '5/18', count: 14, highSeverity: 6, mediumSeverity: 5, lowSeverity: 3 },
  { date: '5/19', count: 10, highSeverity: 3, mediumSeverity: 4, lowSeverity: 3 },
];

const platformData = [
  { name: 'Twitter', value: 42 },
  { name: 'Reddit', value: 28 },
  { name: 'News', value: 15 },
  { name: 'Reviews', value: 10 },
  { name: 'Forums', value: 5 },
];

interface AnalyticsPanelProps {
  alerts?: ContentAlert[];
  sourceStats?: DataSourceStats[];
  threatVectors?: ThreatVector[];
  reputationHistory?: { date: string; score: number; mentions: number }[];
  onRefresh?: () => void;
}

const AnalyticsPanel = ({
  alerts = [],
  sourceStats = [],
  threatVectors = [],
  reputationHistory = [],
  onRefresh
}: AnalyticsPanelProps) => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  
  // Chart configuration
  const chartConfig = {
    primary: { color: COLORS.primary },
    secondary: { color: COLORS.secondary },
    negative: { color: COLORS.negative },
    positive: { color: COLORS.positive },
    neutral: { color: COLORS.neutral },
    highSeverity: { color: COLORS.negative },
    mediumSeverity: { color: '#F59E0B' },
    lowSeverity: { color: '#10B981' },
  };
  
  // Count alerts by platform
  const alertsByPlatform = alerts.reduce((acc, alert) => {
    const platform = alert.platform || 'Unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const alertsByPlatformData = Object.entries(alertsByPlatform).map(([name, value]) => ({
    name,
    value
  }));
  
  // Count alerts by severity
  const alertsBySeverity = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const severityData = [
    { name: 'High', value: alertsBySeverity.high || 0 },
    { name: 'Medium', value: alertsBySeverity.medium || 0 },
    { name: 'Low', value: alertsBySeverity.low || 0 },
  ];
  
  // Calculate aggregate data for heatmap
  const generateHeatmapData = () => {
    const platforms = ['Twitter', 'Reddit', 'Google News', 'Review Sites', 'Forums'];
    const heatmapData = [];
    
    for (const platform of platforms) {
      const row: Record<string, any> = { platform };
      
      // Add mentions and sentiment
      const stats = sourceStats.find(s => s.source === platform);
      row.mentions = stats?.mentions || 0;
      row.sentiment = stats?.sentiment || 0;
      
      // Calculate intensity (0-10 scale)
      row.intensity = Math.min(10, Math.max(0, (row.mentions / 10) * (Math.abs(row.sentiment) / 5) * 10));
      
      heatmapData.push(row);
    }
    
    return heatmapData;
  };
  
  const heatmapData = generateHeatmapData();
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // This would typically trigger data refetching
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="threats">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="threats">Threats by Day</TabsTrigger>
            <TabsTrigger value="platforms">Platform Analysis</TabsTrigger>
            <TabsTrigger value="heatmap">Platform Heatmap</TabsTrigger>
            <TabsTrigger value="reputation">Reputation Score</TabsTrigger>
          </TabsList>
          
          {/* Threats by Day Tab */}
          <TabsContent value="threats" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Threats by Day</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">High</Badge>
                  <Badge className="bg-yellow-500">Medium</Badge>
                  <Badge className="bg-green-500">Low</Badge>
                </div>
              </div>
              
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatsByDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="highSeverity" name="High Severity" stackId="a" fill={COLORS.negative} />
                    <Bar dataKey="mediumSeverity" name="Medium Severity" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="lowSeverity" name="Low Severity" stackId="a" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Summary cards */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Threats</div>
                    <div className="text-2xl font-bold">{threatsByDayData.reduce((acc, day) => acc + day.count, 0)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Last 7 days</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">High Severity</div>
                    <div className="text-2xl font-bold text-red-500">
                      {threatsByDayData.reduce((acc, day) => acc + day.highSeverity, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">37% of total threats</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Daily Average</div>
                    <div className="text-2xl font-bold">
                      {Math.round(threatsByDayData.reduce((acc, day) => acc + day.count, 0) / threatsByDayData.length)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Trending upward</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Platform Analysis Tab */}
          <TabsContent value="platforms" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-4">Content by Platform</h3>
                <div className="h-56 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={alertsByPlatformData.length > 0 ? alertsByPlatformData : platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {alertsByPlatformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-4">Content by Severity</h3>
                <div className="h-56 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell key="high" fill={COLORS.negative} />
                        <Cell key="medium" fill="#F59E0B" />
                        <Cell key="low" fill="#10B981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-4">Platform Engagement Trend</h3>
              <div className="h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={threatsByDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Total Mentions" 
                      stroke={COLORS.primary} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          {/* Platform Heatmap Tab */}
          <TabsContent value="heatmap" className="pt-4">
            <h3 className="text-md font-medium mb-4">Platform Engagement Heatmap</h3>
            <div className="overflow-x-auto">
              <table className="w-full mb-6">
                <thead>
                  <tr>
                    <th className="text-left p-2">Platform</th>
                    <th className="text-left p-2">Mentions</th>
                    <th className="text-left p-2">Sentiment</th>
                    <th className="text-left p-2">Intensity</th>
                    <th className="text-left p-2">Heatmap</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                      <td className="p-2 font-medium">{row.platform}</td>
                      <td className="p-2">{row.mentions}</td>
                      <td className="p-2">
                        <span className={row.sentiment > 0 ? 'text-green-500' : row.sentiment < 0 ? 'text-red-500' : ''}>
                          {row.sentiment > 0 ? '+' : ''}{row.sentiment}
                        </span>
                      </td>
                      <td className="p-2">{row.intensity.toFixed(1)}/10</td>
                      <td className="p-2">
                        <div 
                          className="h-6 rounded-sm" 
                          style={{ 
                            width: `${Math.max(5, row.intensity * 10)}%`, 
                            backgroundColor: row.sentiment >= 0 ? 
                              `rgba(16, 185, 129, ${Math.min(1, row.intensity/5)})` : 
                              `rgba(239, 68, 68, ${Math.min(1, row.intensity/5)})`
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="h-56 md:h-64 mt-6">
              <h3 className="text-md font-medium mb-4">Platform Activity Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatsByDayData}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Mentions" 
                    stroke={COLORS.primary} 
                    fillOpacity={1} 
                    fill="url(#colorPrimary)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Reputation Score Tab */}
          <TabsContent value="reputation" className="pt-4">
            <h3 className="text-md font-medium mb-4">Reputation Score Trend</h3>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reputationHistory.length > 0 ? reputationHistory : threatsByDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={reputationHistory.length > 0 ? "score" : "count"} 
                    name="Reputation Score" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Current Score</div>
                  <div className="text-2xl font-bold">68/100</div>
                  <div className="text-xs text-green-500 mt-1">↑ 7 points from last week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Score Trend</div>
                  <div className="text-2xl font-bold text-green-500">Improving</div>
                  <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Industry Average</div>
                  <div className="text-2xl font-bold">62/100</div>
                  <div className="text-xs text-green-500 mt-1">You're above average</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPanel;
