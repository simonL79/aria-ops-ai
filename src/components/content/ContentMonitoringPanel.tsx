
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Eye, RefreshCw, TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ContentMonitoringPanelProps {
  clientId?: string;
  onThreatUpdate: (threats: any[]) => void;
}

export const ContentMonitoringPanel = ({ 
  clientId, 
  onThreatUpdate 
}: ContentMonitoringPanelProps) => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [threats, setThreats] = useState<any[]>([]);
  const [monitoringKeywords, setMonitoringKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [stats, setStats] = useState({
    total_scanned: 0,
    threats_detected: 0,
    content_deployed: 0,
    effectiveness: 85
  });

  useEffect(() => {
    loadMonitoringData();
    if (isMonitoring) {
      const interval = setInterval(loadMonitoringData, 60000); // Monitor every minute
      return () => clearInterval(interval);
    }
  }, [isMonitoring, clientId]);

  const loadMonitoringData = async () => {
    try {
      // Load recent threats from live OSINT scanning
      const { data: threatData, error: threatError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (threatError) throw threatError;

      setThreats(threatData || []);
      onThreatUpdate(threatData || []);

      // Update monitoring stats
      setStats(prev => ({
        ...prev,
        total_scanned: (threatData?.length || 0) + prev.total_scanned,
        threats_detected: threatData?.filter(t => t.severity === 'high').length || 0
      }));

      console.log(`👁️ Live monitoring: ${threatData?.length || 0} new threats detected`);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    }
  };

  const addMonitoringKeyword = () => {
    if (newKeyword && !monitoringKeywords.includes(newKeyword)) {
      setMonitoringKeywords(prev => [...prev, newKeyword]);
      setNewKeyword('');
      toast.success(`Added "${newKeyword}" to live monitoring`);
    }
  };

  const removeKeyword = (keyword: string) => {
    setMonitoringKeywords(prev => prev.filter(k => k !== keyword));
  };

  const triggerManualScan = async () => {
    try {
      toast.info('Starting manual threat scan...');
      
      // Trigger live scanning
      const { data, error } = await supabase.functions.invoke('live-entity-validator', {
        body: {
          entityName: 'monitoring_scan',
          validationType: 'osint_scan',
          platforms: ['google', 'reddit', 'news', 'social']
        }
      });

      if (error) throw error;

      toast.success('Manual scan completed');
      loadMonitoringData();
    } catch (error) {
      console.error('Manual scan failed:', error);
      toast.error('Manual scan failed');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Status */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              Live Threat Monitoring System
            </CardTitle>
            <div className="flex items-center gap-2">
              {isMonitoring && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Live</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={triggerManualScan}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Manual Scan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_scanned}</div>
              <div className="text-xs text-muted-foreground">Sources Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.threats_detected}</div>
              <div className="text-xs text-muted-foreground">Active Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.content_deployed}</div>
              <div className="text-xs text-muted-foreground">Content Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.effectiveness}%</div>
              <div className="text-xs text-muted-foreground">Effectiveness</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Live Keyword Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add monitoring keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMonitoringKeyword()}
            />
            <Button onClick={addMonitoringKeyword}>Add</Button>
          </div>
          
          {monitoringKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {monitoringKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {keyword}
                  <button 
                    className="ml-2 text-xs hover:text-red-600" 
                    onClick={() => removeKeyword(keyword)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Threat Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Live Threat Detection Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threats.length > 0 ? (
              threats.slice(0, 10).map((threat, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity || 'medium'}
                      </Badge>
                      <span className="font-medium">{threat.platform}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(threat.created_at).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {threat.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Live OSINT</Badge>
                    {threat.url && (
                      <a 
                        href={threat.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">All Clear</h3>
                <p className="text-green-600">No active threats detected in recent monitoring</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
