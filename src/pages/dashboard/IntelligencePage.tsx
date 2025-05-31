
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, RefreshCw, Search, Filter } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { performComprehensiveScan } from '@/services/monitoring/monitoringScanService';
import { toast } from 'sonner';
import { ContentAlert } from '@/types/dashboard';

const IntelligencePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  
  const {
    alerts,
    metrics,
    loading,
    error,
    fetchData
  } = useDashboardData();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);

  const handleIntelligenceScan = async () => {
    setIsScanning(true);
    try {
      toast.info("Starting comprehensive intelligence scan...");
      const results = await performComprehensiveScan();
      
      if (results.length > 0) {
        await fetchData(); // Refresh the data
        toast.success(`Intelligence scan complete: ${results.length} threats detected`);
      } else {
        toast.info("No new threats detected in current scan");
      }
    } catch (error) {
      console.error('Intelligence scan error:', error);
      toast.error("Intelligence scan failed - check system status");
    } finally {
      setIsScanning(false);
    }
  };

  // Filter alerts based on selected criteria
  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
      return false;
    }
    if (selectedPlatform !== 'all' && alert.platform !== selectedPlatform) {
      return false;
    }
    return true;
  });

  // Get unique platforms for filter
  const platforms = Array.from(new Set(alerts.map(alert => alert.platform)));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'destructive';
      case 'read':
        return 'secondary';
      case 'actioned':
        return 'default';
      case 'resolved':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Convert metrics to match expected types
  const convertedMetrics = metrics.map(metric => ({
    ...metric,
    value: typeof metric.value === 'string' ? 0 : metric.value
  }));

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading intelligence data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Intelligence System Error</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">A.R.I.A™ Intelligence Center</h1>
            <p className="text-gray-600 mt-2">Live threat intelligence and monitoring dashboard</p>
          </div>
          <Button
            onClick={handleIntelligenceScan}
            disabled={isScanning}
            className="gap-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Run Intelligence Scan
              </>
            )}
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {convertedMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                    <Activity className={`h-5 w-5 text-${metric.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Intelligence Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Live Intelligence Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Intelligence Alerts</h3>
                <p className="text-gray-600 mb-4">No threats match your current filters</p>
                <Button onClick={handleIntelligenceScan} disabled={isScanning}>
                  Run New Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert: ContentAlert) => (
                  <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity?.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(alert.status)}>
                          {alert.status?.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">{alert.platform}</span>
                      </div>
                      <span className="text-sm text-gray-500">{alert.date}</span>
                    </div>
                    
                    <p className="text-gray-900 mb-3">{alert.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        {alert.confidenceScore && (
                          <span>Confidence: {alert.confidenceScore}%</span>
                        )}
                        {alert.sentiment && (
                          <span>Sentiment: {alert.sentiment}</span>
                        )}
                      </div>
                      {alert.url && (
                        <a 
                          href={alert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Source
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IntelligencePage;
