
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, Clock, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const RSIAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock data for analytics
  const threatResponseData = [
    { date: '2024-01-15', threats: 12, responses: 11, effectiveness: 92 },
    { date: '2024-01-16', threats: 8, responses: 8, effectiveness: 100 },
    { date: '2024-01-17', threats: 15, responses: 13, effectiveness: 87 },
    { date: '2024-01-18', threats: 6, responses: 6, effectiveness: 100 },
    { date: '2024-01-19', threats: 9, responses: 8, effectiveness: 89 },
    { date: '2024-01-20', threats: 11, responses: 10, effectiveness: 91 },
    { date: '2024-01-21', threats: 7, responses: 7, effectiveness: 100 }
  ];

  const platformData = [
    { platform: 'Twitter', threats: 32, responses: 30, rate: 94 },
    { platform: 'Reddit', threats: 18, responses: 16, rate: 89 },
    { platform: 'Facebook', threats: 12, responses: 12, rate: 100 },
    { platform: 'News Sites', threats: 8, responses: 6, rate: 75 },
    { platform: 'Forums', threats: 5, responses: 5, rate: 100 }
  ];

  const sentimentData = [
    { name: 'Positive', value: 45, color: '#10b981' },
    { name: 'Neutral', value: 35, color: '#6b7280' },
    { name: 'Negative', value: 20, color: '#ef4444' }
  ];

  const responseTimeData = [
    { time: '0-5min', count: 28 },
    { time: '5-15min', count: 18 },
    { time: '15-30min', count: 12 },
    { time: '30-60min', count: 8 },
    { time: '1h+', count: 4 }
  ];

  const keyMetrics = {
    totalThreats: 75,
    threatsResolved: 67,
    avgResponseTime: '8.5 minutes',
    effectivenessRate: 89.3,
    activeCampaigns: 4,
    sentimentImprovement: '+12%'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">RSI Deep Analytics</h3>
          <p className="text-sm text-muted-foreground">Comprehensive threat intelligence and performance analytics</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-3 py-1 text-xs rounded-md ${
                selectedTimeframe === period 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Threats</p>
                <p className="text-lg font-semibold">{keyMetrics.totalThreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Resolved</p>
                <p className="text-lg font-semibold">{keyMetrics.threatsResolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-lg font-semibold">{keyMetrics.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Effectiveness</p>
                <p className="text-lg font-semibold">{keyMetrics.effectivenessRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs text-muted-foreground">Campaigns</p>
                <p className="text-lg font-semibold">{keyMetrics.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Sentiment ↑</p>
                <p className="text-lg font-semibold">{keyMetrics.sentimentImprovement}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Threat Response Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={threatResponseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Threats Detected" />
                    <Line type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={2} name="Responses Deployed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{platform.platform}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{platform.responses}/{platform.threats} responses</span>
                        <Badge variant={platform.rate >= 90 ? "default" : platform.rate >= 75 ? "secondary" : "destructive"}>
                          {platform.rate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={platform.rate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sentiment Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Before RSI Activation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Positive</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    <div className="flex justify-between">
                      <span>Neutral</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between">
                      <span>Negative</span>
                      <span>37%</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">After RSI Activation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Positive</span>
                      <span className="text-green-600">45% (+17%)</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between">
                      <span>Neutral</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between">
                      <span>Negative</span>
                      <span className="text-green-600">20% (-17%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Response Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSIAnalytics;
