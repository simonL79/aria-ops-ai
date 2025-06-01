
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, TrendingUp, AlertTriangle, Zap, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveIntelligenceData {
  id: string;
  content: string;
  platform: string;
  severity: string;
  confidence_score: number;
  entity_name: string;
  created_at: string;
  threat_type: string;
  source_type: string;
}

const LiveIntelligenceDashboard = () => {
  const [liveData, setLiveData] = useState<LiveIntelligenceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadLiveIntelligence();
  }, []);

  const loadLiveIntelligence = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading live intelligence data...');
      
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .not('content', 'ilike', '%mock%')
        .not('content', 'ilike', '%demo%')
        .not('content', 'ilike', '%test%')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setLiveData(data || []);
      console.log(`✅ Loaded ${data?.length || 0} live intelligence items`);
    } catch (error) {
      console.error('❌ Error loading live intelligence:', error);
      toast.error('Failed to load live intelligence data');
    } finally {
      setLoading(false);
    }
  };

  const runLiveIntelligenceScan = async () => {
    setScanning(true);
    try {
      toast.info('🔍 A.R.I.A™ OSINT: Running live intelligence scan...');
      
      // Execute multiple live intelligence functions
      const scanPromises = [
        supabase.functions.invoke('enhanced-intelligence', {
          body: { 
            scanType: 'live_intelligence',
            enableLiveData: true,
            blockMockData: true
          }
        }),
        supabase.functions.invoke('monitoring-scan', {
          body: { 
            scanType: 'live_intelligence_sweep'
          }
        }),
        supabase.functions.invoke('discovery-scanner', {
          body: { 
            scanType: 'live_threat_discovery'
          }
        }),
        supabase.functions.invoke('reddit-scan', {
          body: { 
            scanType: 'live_intelligence'
          }
        }),
        supabase.functions.invoke('uk-news-scanner', {
          body: { 
            scanType: 'live_news_intelligence'
          }
        })
      ];

      const results = await Promise.allSettled(scanPromises);
      const successfulScans = results.filter(result => result.status === 'fulfilled').length;

      if (successfulScans > 0) {
        toast.success(`✅ Live intelligence scan completed: ${successfulScans}/5 modules executed`);
        await loadLiveIntelligence();
      } else {
        toast.error('❌ Live intelligence scan failed: No modules executed successfully');
      }
    } catch (error) {
      console.error('❌ Live intelligence scan failed:', error);
      toast.error('Live intelligence scan failed');
    } finally {
      setScanning(false);
    }
  };

  const getThreatLevelColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const stats = {
    total: liveData.length,
    critical: liveData.filter(d => d.severity === 'critical').length,
    high: liveData.filter(d => d.severity === 'high').length,
    platforms: [...new Set(liveData.map(d => d.platform))].length,
    entities: [...new Set(liveData.map(d => d.entity_name))].length
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Scan Controls */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-corporate-accent" />
              Live Intelligence Core
            </CardTitle>
            <Button 
              onClick={runLiveIntelligenceScan} 
              disabled={scanning}
              className="bg-corporate-accent hover:bg-corporate-accentDark text-black"
            >
              {scanning ? (
                <>
                  <Eye className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning Live Data...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Live Intelligence Scan
                </>
              )}
            </Button>
          </div>
          <p className="text-corporate-lightGray">Real-time intelligence from live OSINT sources</p>
        </CardHeader>
      </Card>

      {/* Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Total Intelligence</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-corporate-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Critical Threats</p>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">High Priority</p>
                <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Active Platforms</p>
                <p className="text-2xl font-bold text-blue-400">{stats.platforms}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Entities</p>
                <p className="text-2xl font-bold text-purple-400">{stats.entities}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Intelligence Data */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Live Intelligence Feed</CardTitle>
          <p className="text-corporate-lightGray">Real-time intelligence from OSINT sources</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-corporate-accent" />
              <p className="text-corporate-lightGray">Loading live intelligence...</p>
            </div>
          ) : liveData.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-corporate-lightGray">No live intelligence data available</p>
              <p className="text-sm text-corporate-lightGray mt-2">Run a live scan to collect intelligence</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {liveData.map((item) => (
                <div key={item.id} className="border border-corporate-border rounded-lg p-4 bg-corporate-dark">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{item.entity_name}</h4>
                      <p className="text-sm text-corporate-lightGray">{item.platform}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getThreatLevelColor(item.severity)}>
                        {item.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {item.confidence_score}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-corporate-lightGray line-clamp-2 mb-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-corporate-lightGray">
                    <div className="flex items-center gap-4">
                      <span>Type: {item.threat_type}</span>
                      <span>Source: {item.source_type}</span>
                    </div>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveIntelligenceDashboard;
