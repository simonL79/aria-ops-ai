
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, RefreshCw, Send, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { executiveReportingService, ExecutiveReport, ThreatSummary } from '@/services/intelligence/executiveReportingService';
import { driftAlertService } from '@/services/notifications/driftAlertService';
import { toast } from 'sonner';

const ExecutiveReportDashboard = () => {
  const [reports, setReports] = useState<ExecutiveReport[]>([]);
  const [threatSummary, setThreatSummary] = useState<ThreatSummary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExecutiveReport | null>(null);
  const [slackWebhook, setSlackWebhook] = useState('');
  const [customWebhook, setCustomWebhook] = useState('');

  useEffect(() => {
    loadReports();
    loadThreatSummary();
  }, []);

  const loadReports = async () => {
    const data = await executiveReportingService.getExecutiveReports();
    setReports(data);
    if (data.length > 0 && !selectedReport) {
      setSelectedReport(data[0]);
    }
  };

  const loadThreatSummary = async () => {
    const data = await executiveReportingService.getThreatSummary();
    setThreatSummary(data);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportId = await executiveReportingService.generateWeeklyReport();
      if (reportId) {
        // Auto-ingest summary data
        await executiveReportingService.autoIngestSummaryToReport(reportId);
        await loadReports();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshRoutines = async () => {
    setIsRefreshing(true);
    try {
      await executiveReportingService.scheduleRefreshRoutines();
      await loadThreatSummary();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRunAlertCheck = async () => {
    try {
      await driftAlertService.runAlertCheck(slackWebhook || undefined, customWebhook || undefined);
    } catch (error) {
      console.error('Error running alert check:', error);
      toast.error('Failed to run alert check');
    }
  };

  const handleAutoIngest = async (reportId: string) => {
    await executiveReportingService.autoIngestSummaryToReport(reportId);
    await loadReports();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Executive Intelligence Reports</h2>
          <p className="text-gray-600">Automated threat intelligence briefings and alerts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshRoutines}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="summary">Threat Summary</TabsTrigger>
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedReport?.id === report.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        <span className={`font-medium ${getRiskScoreColor(report.risk_score)}`}>
                          Risk: {report.risk_score}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedReport ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedReport.title}</CardTitle>
                        <CardDescription>
                          {selectedReport.period_start} to {selectedReport.period_end}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAutoIngest(selectedReport.id)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Auto-Ingest
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Executive Summary</h4>
                      <p className="text-sm text-gray-600">{selectedReport.executive_summary}</p>
                    </div>

                    {selectedReport.threat_highlights && selectedReport.threat_highlights.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Threat Highlights</h4>
                        <div className="space-y-2">
                          {selectedReport.threat_highlights.map((highlight: any, index: number) => (
                            <Alert key={index} className="border-l-4 border-l-orange-500">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>{highlight.type}:</strong> {highlight.description}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedReport.key_metrics && (
                      <div>
                        <h4 className="font-medium mb-2">Key Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedReport.key_metrics.total_threats || 0}
                            </div>
                            <div className="text-xs text-gray-500">Total Threats</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">
                              {selectedReport.key_metrics.avg_resolution_hours?.toFixed(1) || 'N/A'}h
                            </div>
                            <div className="text-xs text-gray-500">Avg Resolution</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedReport.key_metrics.overall_sentiment?.toFixed(2) || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Sentiment</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <div className={`text-2xl font-bold ${getRiskScoreColor(selectedReport.risk_score)}`}>
                              {selectedReport.risk_score}
                            </div>
                            <div className="text-xs text-gray-500">Risk Score</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a report to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {threatSummary.slice(0, 4).map((summary, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Week of {new Date(summary.week_period).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Total Threats:</span>
                      <span className="text-sm font-medium">{summary.total_threats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">High Severity:</span>
                      <span className="text-sm font-medium text-red-600">{summary.high_severity_threats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Resolved:</span>
                      <span className="text-sm font-medium text-green-600">{summary.resolved_threats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Sentiment:</span>
                      <span className={`text-sm font-medium ${getRiskScoreColor(Math.abs(summary.overall_sentiment * 100))}`}>
                        {summary.overall_sentiment?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>
                Configure Slack and webhook alerts for drift detection and sentiment changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slack Webhook URL</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Webhook URL</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  placeholder="https://your-webhook-endpoint.com/alerts"
                  value={customWebhook}
                  onChange={(e) => setCustomWebhook(e.target.value)}
                />
              </div>

              <Button onClick={handleRunAlertCheck} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Test Alert Check
              </Button>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Alerts will be sent when narrative drift scores exceed 0.5 or sentiment drops below -0.4.
                  Set up a cron job to run this check regularly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveReportDashboard;
