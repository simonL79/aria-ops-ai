import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Search, RefreshCw, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { runMonitoringScan } from '@/services/monitoring/scan';
import { toast } from 'sonner';

interface ThreatData {
  id: string;
  content: string;
  platform: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  created_at: string;
  detected_entities: string[];
  confidence_score: number;
}

const ThreatDetectionDashboard = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'critical'>('all');

  useEffect(() => {
    loadThreats();
  }, [filter]);

  const loadThreats = async () => {
    try {
      let query = supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('severity', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our interface
      const transformedThreats: ThreatData[] = (data || []).map(item => ({
        id: item.id,
        content: item.content || '',
        platform: item.platform || '',
        severity: ['low', 'medium', 'high', 'critical'].includes(item.severity) 
          ? item.severity as 'low' | 'medium' | 'high' | 'critical'
          : 'medium',
        status: item.status || 'new',
        created_at: item.created_at,
        detected_entities: Array.isArray(item.detected_entities) 
          ? item.detected_entities.map((entity: any) => String(entity))
          : [],
        confidence_score: item.confidence_score || 0
      }));

      setThreats(transformedThreats);
    } catch (error) {
      console.error('Failed to load threats:', error);
    }
  };

  const runLiveScan = async () => {
    setIsScanning(true);
    try {
      const results = await runMonitoringScan();
      toast.success(`Live scan completed: ${results.length} new intelligence items`);
      loadThreats();
    } catch (error) {
      toast.error('Live scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const markAsReviewed = async (threatId: string) => {
    try {
      const { error } = await supabase
        .from('scan_results')
        .update({ status: 'reviewed' })
        .eq('id', threatId);

      if (error) throw error;
      
      loadThreats();
      toast.success('Threat marked as reviewed');
    } catch (error) {
      toast.error('Failed to update threat status');
    }
  };

  const threatCounts = {
    total: threats.length,
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    new: threats.filter(t => t.status === 'new').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Threat Detection Dashboard
          </h2>
          <p className="text-muted-foreground">Real-time threat monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={runLiveScan} disabled={isScanning} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Run Live Scan'}
          </Button>
        </div>
      </div>

      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatCounts.total}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{threatCounts.critical}</div>
            <p className="text-xs text-muted-foreground">Immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{threatCounts.high}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Threats</CardTitle>
            <Search className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatCounts.new}</div>
            <p className="text-xs text-muted-foreground">Unreviewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Threats
        </Button>
        <Button 
          variant={filter === 'critical' ? 'default' : 'outline'}
          onClick={() => setFilter('critical')}
          size="sm"
        >
          Critical Only
        </Button>
        <Button 
          variant={filter === 'high' ? 'default' : 'outline'}
          onClick={() => setFilter('high')}
          size="sm"
        >
          High Priority
        </Button>
      </div>

      {/* Threats List */}
      <Card>
        <CardHeader>
          <CardTitle>Live Threat Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          {threats.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No threats detected</p>
              <p className="text-sm text-muted-foreground">All monitored sources are clean</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{threat.platform}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(threat.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">
                          {threat.content.substring(0, 200)}
                          {threat.content.length > 200 && '...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        Confidence: {(threat.confidence_score * 100).toFixed(1)}%
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReviewed(threat.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                  
                  {threat.detected_entities && threat.detected_entities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {threat.detected_entities.slice(0, 5).map((entity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatDetectionDashboard;
