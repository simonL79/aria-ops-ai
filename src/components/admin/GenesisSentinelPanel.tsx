import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle, TrendingUp, Users, Globe, Target, Brain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { performLiveScan } from '@/services/aiScraping/liveScanner';
import { runMonitoringScan } from '@/services/monitoring/scan';

interface GenesisEntity {
  id: string;
  full_name: string;
  aliases: string[];
  primary_industry: string;
  risk_profile: string;
  discovery_source: string;
  created_at: string;
  is_guarded: boolean;
}

interface ThreatReport {
  id: string;
  entity_id: string;
  threat_summary: string;
  threat_level: string;
  sentiment_score: number;
  evidence_links: string[];
  report_generated_at: string;
}

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [targetEntity, setTargetEntity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [entities, setEntities] = useState<GenesisEntity[]>([]);
  const [threatReports, setThreatReports] = useState<ThreatReport[]>([]);

  useEffect(() => {
    loadGenesisData();
  }, []);

  const loadGenesisData = async () => {
    try {
      // Load entities
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('genesis_entities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (entitiesError) throw entitiesError;
      setEntities(entitiesData || []);

      // Load threat reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('genesis_threat_reports')
        .select('*')
        .order('report_generated_at', { ascending: false })
        .limit(10);

      if (reportsError) throw reportsError;
      setThreatReports(reportsData || []);

    } catch (error) {
      console.error('Error loading Genesis data:', error);
    }
  };

  const runGenesisDiscovery = async () => {
    if (!targetEntity.trim()) {
      toast.error('Please enter a target entity');
      return;
    }

    setIsScanning(true);
    try {
      console.log('🔍 Genesis Sentinel: Starting live intelligence discovery for:', targetEntity);
      
      // Create or find entity first
      let entityId: string;
      const { data: existingEntity } = await supabase
        .from('genesis_entities')
        .select('id')
        .eq('full_name', targetEntity)
        .single();

      if (existingEntity) {
        entityId = existingEntity.id;
        console.log('✅ Found existing entity:', entityId);
      } else {
        const { data: newEntity, error: entityError } = await supabase
          .from('genesis_entities')
          .insert({
            full_name: targetEntity,
            discovery_source: 'genesis_discovery',
            risk_profile: 'assessing'
          })
          .select()
          .single();

        if (entityError) throw entityError;
        entityId = newEntity.id;
        console.log('✅ Created new entity:', entityId);
      }

      // Perform LIVE intelligence scans using existing live scanner
      console.log('🔍 Performing live OSINT scan...');
      const liveResults = await performLiveScan(
        targetEntity, 
        ['Reddit', 'News', 'Forums'], 
        { maxResults: 20, includeRealTimeAlerts: true }
      );

      console.log(`✅ Live scan completed: ${liveResults.length} results`);

      // Also run the monitoring scan for additional coverage
      console.log('🔍 Running monitoring scan...');
      const monitoringResults = await runMonitoringScan(targetEntity);
      console.log(`✅ Monitoring scan completed: ${monitoringResults.length} results`);

      // Combine and process all results
      const allResults = [...liveResults];

      // Add monitoring results that aren't duplicates
      for (const monResult of monitoringResults) {
        const isDuplicate = allResults.some(lr => 
          lr.content === monResult.content || 
          lr.url === monResult.url
        );
        if (!isDuplicate) {
          allResults.push({
            id: monResult.id,
            platform: monResult.platform,
            content: monResult.content,
            url: monResult.url,
            severity: monResult.severity,
            sentiment: monResult.sentiment || 0,
            confidence_score: monResult.confidenceScore || 75,
            detected_entities: monResult.detectedEntities || [],
            source_type: 'live_monitoring',
            entity_name: targetEntity,
            created_at: monResult.date
          });
        }
      }

      console.log(`📊 Total live intelligence gathered: ${allResults.length} items`);

      // Create threat reports from live results
      if (allResults.length > 0) {
        for (const result of allResults) {
          // Only create reports for moderate to high severity items - fix severity comparison
          if (['moderate', 'high'].includes(result.severity) || result.severity === 'critical') {
            try {
              await supabase
                .from('genesis_threat_reports')
                .insert({
                  entity_id: entityId,
                  threat_summary: `Live threat detected on ${result.platform}: ${result.content.substring(0, 200)}...`,
                  threat_level: result.severity === 'critical' ? 'critical' : result.severity,
                  sentiment_score: typeof result.sentiment === 'number' ? result.sentiment : 0,
                  evidence_links: [result.url].filter(Boolean),
                  is_live: true
                });
            } catch (reportError) {
              console.warn('Failed to create threat report:', reportError);
            }
          }
        }
      }

      toast.success(`Genesis Sentinel live discovery completed for ${targetEntity}`, {
        description: `${allResults.length} live intelligence items processed, ${allResults.filter(r => ['moderate', 'high'].includes(r.severity) || r.severity === 'critical').length} threat reports generated`
      });
      
      // Create notification
      await supabase.from('aria_notifications').insert({
        event_type: 'genesis_live_discovery',
        entity_name: targetEntity,
        summary: `Genesis Sentinel processed ${allResults.length} live intelligence items for ${targetEntity}`,
        priority: allResults.some(r => r.severity === 'critical') ? 'critical' : 
                 allResults.some(r => r.severity === 'high') ? 'high' : 'medium'
      });

      // Reload data to show new results
      await loadGenesisData();

    } catch (error) {
      console.error('❌ Genesis discovery scan failed:', error);
      toast.error('Genesis discovery scan failed', {
        description: error.message || 'Unknown error occurred during live intelligence gathering'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const generateResponsePlan = async (threatId: string, responseType: 'soft' | 'hard' | 'nuclear') => {
    try {
      const threat = threatReports.find(t => t.id === threatId);
      if (!threat) return;

      await supabase.from('genesis_response_log').insert({
        entity_id: threat.entity_id,
        response_type: responseType,
        action_summary: `${responseType.toUpperCase()} response plan generated for live threat: ${threat.threat_summary.substring(0, 100)}`,
        deployed_by: 'genesis_sentinel'
      });

      await supabase.from('activity_logs').insert({
        action: 'response_plan_generated',
        details: `${responseType} response plan generated for live threat ${threatId}`,
        entity_type: 'genesis_response'
      });

      toast.success(`${responseType.toUpperCase()} response plan generated for live threat`);
    } catch (error) {
      console.error('Error generating response plan:', error);
      toast.error('Failed to generate response plan');
    }
  };

  return (
    <Card className="bg-corporate-darkTertiary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-corporate-accent">
          <Shield className="h-5 w-5" />
          Genesis Sentinel Live Intelligence System
        </CardTitle>
        <p className="text-sm text-corporate-lightGray">
          Live OSINT intelligence platform for real-time threat detection and prospect identification
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Target className="h-4 w-4 mr-2" />
              Live Discovery
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Brain className="h-4 w-4 mr-2" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="preemptive" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Preemptive
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Globe className="h-4 w-4 mr-2" />
              Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-4 mt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter target entity (person, company, brand)"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="flex-1 bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <Button
                onClick={runGenesisDiscovery}
                disabled={isScanning}
                className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
              >
                <Search className="h-4 w-4 mr-2" />
                {isScanning ? 'Live Scanning...' : 'Discover Live'}
              </Button>
            </div>

            {isScanning && (
              <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">Live Intelligence Gathering in Progress</span>
                </div>
                <p className="text-sm text-blue-300 mt-1">
                  • Scanning Reddit OSINT feeds<br/>
                  • Processing news intelligence<br/>
                  • Analyzing forum discussions<br/>
                  • Running monitoring sweeps<br/>
                  • Generating threat assessments
                </p>
              </div>
            )}

            {threatReports.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Live Threat Intelligence</h3>
                {threatReports.map((report) => (
                  <Card key={report.id} className="bg-corporate-darkSecondary border-corporate-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${
                              report.threat_level === 'critical' ? 'bg-red-600' :
                              report.threat_level === 'high' ? 'bg-orange-600' :
                              report.threat_level === 'moderate' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            } text-white`}>
                              {report.threat_level?.toUpperCase()} LIVE
                            </Badge>
                            <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                              Sentiment: {(report.sentiment_score * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-corporate-lightGray text-sm mb-2">
                            {report.threat_summary}
                          </p>
                          <p className="text-xs text-corporate-subtext">
                            Live Detection: {new Date(report.report_generated_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(report.id, 'soft')}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Soft Response
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(report.id, 'hard')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                          >
                            Hard Response
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(report.id, 'nuclear')}
                            className="bg-red-600 hover:bg-red-700 text-xs"
                          >
                            Nuclear Response
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="intelligence" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Live Risk Intelligence Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-corporate-accent" />
                      <span className="text-white font-medium">Live Threats</span>
                    </div>
                    <p className="text-2xl font-bold text-corporate-accent">{threatReports.length}</p>
                    <p className="text-xs text-corporate-subtext">Active live intelligence</p>
                  </CardContent>
                </Card>
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium">High Risk Live</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">
                      {threatReports.filter(t => ['high', 'critical'].includes(t.threat_level)).length}
                    </p>
                    <p className="text-xs text-corporate-subtext">Require immediate attention</p>
                  </CardContent>
                </Card>
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">Live Response Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">100%</p>
                    <p className="text-xs text-corporate-subtext">Live intelligence only</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preemptive" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Live Preemptive Intelligence</h3>
              <p className="text-corporate-subtext">
                Real-time early warning systems detecting threats before they emerge into public consciousness.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Live Reddit OSINT monitoring<br/>
                  • Real-time news intelligence<br/>
                  • Forum discussion analysis<br/>
                  • Social media sentiment tracking<br/>
                  • Legal proceeding early detection<br/>
                  • Domain registration surveillance
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Live Lead Generation Pipeline</h3>
              <p className="text-corporate-subtext">
                Real-time prospect identification and qualification based on live intelligence indicators.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Live auto-risk scoring of new entities<br/>
                  • Real-time prospect qualification<br/>
                  • Instant outreach brief generation<br/>
                  • Live conversion tracking to Watchtower<br/>
                  • Real-time client lifecycle management
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Live Strategic Mapping</h3>
              <p className="text-corporate-subtext">
                Real-time relationship and influence mapping for strategic positioning.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Live entity relationship visualization<br/>
                  • Real-time influence network analysis<br/>
                  • Live sector risk pattern identification<br/>
                  • Dynamic geographic vulnerability assessment<br/>
                  • Real-time strategic response planning
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenesisSentinelPanel;
