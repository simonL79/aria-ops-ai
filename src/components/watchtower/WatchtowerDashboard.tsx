
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, AlertTriangle, TrendingUp, Eye, Search, Satellite, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveThreatData {
  id: string;
  entity_name: string;
  threat_level: number;
  content: string;
  confidence_score: number;
  created_at: string;
  platform: string;
  severity: string;
  url?: string;
  source_type: string;
}

interface ThreatAnalysisResult {
  entityName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number;
  identifiedThreats: string[];
  recommendations: string[];
  analysisDate: string;
}

const WatchtowerDashboard = () => {
  const [liveThreats, setLiveThreats] = useState<LiveThreatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);

  useEffect(() => {
    loadLiveThreats();
  }, []);

  const loadLiveThreats = async () => {
    setLoading(true);
    try {
      console.log('🔍 Watchtower: Loading live threat data...');
      
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .not('content', 'ilike', '%mock%')
        .not('content', 'ilike', '%demo%')
        .not('content', 'ilike', '%test%')
        .not('content', 'ilike', '%simulated%')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        id: item.id,
        entity_name: item.risk_entity_name || item.entity_name || 'Unknown Entity',
        threat_level: item.severity === 'critical' ? 95 : item.severity === 'high' ? 80 : item.severity === 'medium' ? 60 : 40,
        content: item.content || 'Live threat data',
        confidence_score: item.confidence_score || 75,
        created_at: item.created_at,
        platform: item.platform || 'OSINT',
        severity: item.severity || 'medium',
        url: item.url,
        source_type: item.source_type
      }));

      setLiveThreats(transformedData);
      console.log(`✅ Watchtower: Loaded ${transformedData.length} live threats`);
    } catch (error) {
      console.error('❌ Error loading live threats:', error);
      toast.error('Failed to load live threat data');
    } finally {
      setLoading(false);
    }
  };

  const runWatchtowerScan = async () => {
    setScanning(true);
    try {
      toast.info('🛰️ Watchtower: Running live scan...');
      
      const { data, error } = await supabase.functions.invoke('watchtower-scan', {
        body: { 
          scanType: 'live_watchtower',
          enableLiveData: true,
          blockMockData: true
        }
      });

      if (error) throw error;
      
      toast.success('✅ Watchtower scan completed');
      await loadLiveThreats();
    } catch (error) {
      console.error('❌ Watchtower scan failed:', error);
      toast.error('Watchtower scan failed');
    } finally {
      setScanning(false);
    }
  };

  const runLocalThreatAnalysis = async () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    setAnalyzing(true);
    try {
      toast.info('🔍 Running local AI threat analysis...');
      
      // Filter live threats for this entity
      const entityThreats = liveThreats.filter(threat => 
        threat.entity_name.toLowerCase().includes(entityName.toLowerCase()) ||
        threat.content.toLowerCase().includes(entityName.toLowerCase())
      );

      if (entityThreats.length === 0) {
        toast.warning('No threat data found for this entity');
        setAnalysisResult({
          entityName,
          riskLevel: 'Low',
          confidenceScore: 0,
          identifiedThreats: ['No current threats detected in live data'],
          recommendations: ['Continue monitoring', 'Establish baseline monitoring'],
          analysisDate: new Date().toISOString()
        });
        return;
      }

      // Calculate threat metrics from real data
      const avgThreatLevel = entityThreats.reduce((sum, t) => sum + t.threat_level, 0) / entityThreats.length;
      const avgConfidence = entityThreats.reduce((sum, t) => sum + t.confidence_score, 0) / entityThreats.length;
      
      const severeCounts = {
        critical: entityThreats.filter(t => t.severity === 'critical').length,
        high: entityThreats.filter(t => t.severity === 'high').length,
        medium: entityThreats.filter(t => t.severity === 'medium').length,
        low: entityThreats.filter(t => t.severity === 'low').length
      };

      let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (severeCounts.critical > 0 || avgThreatLevel >= 90) riskLevel = 'Critical';
      else if (severeCounts.high > 2 || avgThreatLevel >= 70) riskLevel = 'High';
      else if (severeCounts.medium > 3 || avgThreatLevel >= 50) riskLevel = 'Medium';

      const identifiedThreats = [
        ...severeCounts.critical > 0 ? [`${severeCounts.critical} critical severity threats detected`] : [],
        ...severeCounts.high > 0 ? [`${severeCounts.high} high severity threats found`] : [],
        ...severeCounts.medium > 0 ? [`${severeCounts.medium} medium severity issues identified`] : [],
        `Activity detected across ${new Set(entityThreats.map(t => t.platform)).size} platforms`
      ];

      const recommendations = [];
      if (riskLevel === 'Critical') {
        recommendations.push('Immediate escalation required', 'Activate crisis response team', 'Deploy counter-narrative strategy');
      } else if (riskLevel === 'High') {
        recommendations.push('Enhanced monitoring implementation', 'Stakeholder notification', 'Content strategy deployment');
      } else if (riskLevel === 'Medium') {
        recommendations.push('Increased monitoring frequency', 'Prepare response templates', 'Monitor trend development');
      } else {
        recommendations.push('Continue baseline monitoring', 'Regular assessment schedule', 'Maintain alert protocols');
      }

      setAnalysisResult({
        entityName,
        riskLevel,
        confidenceScore: Math.round(avgConfidence),
        identifiedThreats,
        recommendations,
        analysisDate: new Date().toISOString()
      });

      toast.success('✅ Local threat analysis completed');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      toast.error('Threat analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'High': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/20 border-green-500/30';
    }
  };

  const stats = {
    total: liveThreats.length,
    critical: liveThreats.filter(t => t.severity === 'critical').length,
    high: liveThreats.filter(t => t.severity === 'high').length,
    platforms: new Set(liveThreats.map(t => t.platform)).size
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Satellite className="h-5 w-5 text-corporate-accent" />
              A.R.I.A™ Watchtower - Threat Discovery & Intelligence
            </CardTitle>
            <Button 
              onClick={runWatchtowerScan} 
              disabled={scanning}
              className="bg-corporate-accent hover:bg-corporate-accentDark text-black"
            >
              {scanning ? (
                <>
                  <Eye className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Satellite className="h-4 w-4 mr-2" />
                  Run Live Scan
                </>
              )}
            </Button>
          </div>
          <p className="text-corporate-lightGray">Advanced threat discovery and intelligence gathering system</p>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Live Threats</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Shield className="h-8 w-8 text-corporate-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-corporate-lightGray">Critical</p>
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
                <p className="text-sm text-corporate-lightGray">Platforms</p>
                <p className="text-2xl font-bold text-blue-400">{stats.platforms}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid grid-cols-2 bg-corporate-darkSecondary border-corporate-border">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            Local AI Threat Analysis
          </TabsTrigger>
          <TabsTrigger value="feed" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
            Live Threat Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analysis Input */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Local AI Threat Analysis</CardTitle>
                <p className="text-corporate-lightGray">Run local inference analysis on entity threat patterns</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="entity" className="text-white">Entity Name</Label>
                  <Input
                    id="entity"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Enter entity name to analyze..."
                    className="bg-corporate-dark border-corporate-border text-white"
                  />
                </div>
                <Button 
                  onClick={runLocalThreatAnalysis}
                  disabled={analyzing}
                  className="w-full bg-corporate-accent hover:bg-corporate-accentDark text-black"
                >
                  {analyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getRiskColor(analysisResult.riskLevel)}>
                        {analysisResult.riskLevel} Risk
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-corporate-lightGray">Confidence Score:</p>
                        <p className="text-2xl font-bold text-white">{analysisResult.confidenceScore}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">Identified Threats</h4>
                      <ul className="space-y-1">
                        {analysisResult.identifiedThreats.map((threat, index) => (
                          <li key={index} className="text-sm text-corporate-lightGray flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-corporate-lightGray flex items-start gap-2">
                            <TrendingUp className="h-3 w-3 mt-0.5 text-corporate-accent flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-corporate-gray mx-auto mb-4" />
                    <p className="text-corporate-lightGray">Enter an entity name and click Analyze to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feed">
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white">Live Threat Feed</CardTitle>
              <p className="text-corporate-lightGray">Real-time threat intelligence from live sources</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-corporate-accent" />
                  <p className="text-corporate-lightGray">Loading live threats...</p>
                </div>
              ) : liveThreats.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-corporate-gray mx-auto mb-4" />
                  <p className="text-corporate-lightGray">No live threats detected</p>
                  <p className="text-sm text-corporate-lightGray mt-2">Run a scan to check for new threats</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {liveThreats.map((threat) => (
                    <div key={threat.id} className="border border-corporate-border rounded-lg p-4 bg-corporate-dark">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-white">{threat.entity_name}</h4>
                          <p className="text-sm text-corporate-lightGray">{threat.platform}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-corporate-lightGray">
                            {threat.confidence_score}%
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-corporate-lightGray line-clamp-2 mb-2">
                        {threat.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-corporate-lightGray">
                        <span>Source: {threat.source_type}</span>
                        <span>{new Date(threat.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WatchtowerDashboard;
