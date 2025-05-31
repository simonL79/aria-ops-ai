
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle, TrendingUp, Users, Globe, Target, Brain, Zap, Download, FileText, Send } from 'lucide-react';
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

interface ExecutiveReport {
  id: string;
  entity_name: string;
  total_threats: number;
  critical_threats: number;
  risk_score: number;
  generated_at: string;
}

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('command');
  const [targetEntity, setTargetEntity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [entities, setEntities] = useState<GenesisEntity[]>([]);
  const [threatReports, setThreatReports] = useState<ThreatReport[]>([]);
  const [executiveReports, setExecutiveReports] = useState<ExecutiveReport[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<GenesisEntity | null>(null);
  const [guardianMode, setGuardianMode] = useState<Record<string, boolean>>({});

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
        .limit(20);

      if (entitiesError) throw entitiesError;
      setEntities(entitiesData || []);

      // Load threat reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('genesis_threat_reports')
        .select('*')
        .order('report_generated_at', { ascending: false })
        .limit(20);

      if (reportsError) throw reportsError;
      setThreatReports(reportsData || []);

      // Load executive reports
      const { data: execReports, error: execError } = await supabase
        .from('aria_reports')
        .select('*')
        .eq('report_title', 'Genesis Executive Summary')
        .order('created_at', { ascending: false })
        .limit(10);

      if (execError) throw execError;
      const formattedReports = (execReports || []).map(report => ({
        id: report.id,
        entity_name: report.entity_name,
        total_threats: 0,
        critical_threats: 0,
        risk_score: 0,
        generated_at: report.created_at
      }));
      setExecutiveReports(formattedReports);

    } catch (error) {
      console.error('Error loading Genesis data:', error);
      toast.error('Failed to load Genesis data');
    }
  };

  const runLiveThreatScan = async () => {
    if (!targetEntity.trim()) {
      toast.error('Please enter a target entity');
      return;
    }

    setIsScanning(true);
    try {
      console.log('🔍 Genesis: Starting live threat scan for:', targetEntity);
      
      // Create or find entity
      let entityId: string;
      const { data: existingEntity } = await supabase
        .from('genesis_entities')
        .select('id')
        .eq('full_name', targetEntity)
        .single();

      if (existingEntity) {
        entityId = existingEntity.id;
      } else {
        const { data: newEntity, error: entityError } = await supabase
          .from('genesis_entities')
          .insert({
            full_name: targetEntity,
            discovery_source: 'live_scan',
            risk_profile: 'scanning'
          })
          .select()
          .single();

        if (entityError) throw entityError;
        entityId = newEntity.id;
      }

      // Perform live scans
      const [liveResults, monitoringResults] = await Promise.all([
        performLiveScan(targetEntity, ['Reddit', 'News', 'Forums'], { maxResults: 50 }),
        runMonitoringScan(targetEntity)
      ]);

      const allResults = [...liveResults, ...monitoringResults];
      console.log(`📊 Found ${allResults.length} results`);

      // Create threat reports for significant findings
      const threatsCreated = [];
      for (const result of allResults) {
        if (['moderate', 'high', 'critical'].includes(result.severity)) {
          const { data: threat, error } = await supabase
            .from('genesis_threat_reports')
            .insert({
              entity_id: entityId,
              threat_summary: `${result.platform} threat: ${result.content.substring(0, 200)}...`,
              threat_level: result.severity,
              sentiment_score: result.sentiment || 0,
              evidence_links: [result.url].filter(Boolean),
              is_live: true
            })
            .select()
            .single();

          if (!error) threatsCreated.push(threat);
        }
      }

      toast.success(`Live scan complete: ${allResults.length} items processed, ${threatsCreated.length} threats identified`);
      
      // Create notification
      await supabase.from('aria_notifications').insert({
        event_type: 'genesis_threat_scan',
        entity_name: targetEntity,
        summary: `Live scan completed: ${threatsCreated.length} threats detected`,
        priority: threatsCreated.some((t: any) => t.threat_level === 'critical') ? 'critical' : 'medium'
      });

      await loadGenesisData();
      setTargetEntity('');

    } catch (error) {
      console.error('❌ Live scan failed:', error);
      toast.error('Live threat scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const generateExecutiveReport = async (entity: GenesisEntity) => {
    try {
      // Get threats for entity
      const { data: threats } = await supabase
        .from('genesis_threat_reports')
        .select('*')
        .eq('entity_id', entity.id);

      const criticalThreats = (threats || []).filter(t => t.threat_level === 'critical').length;
      const totalThreats = threats?.length || 0;

      // Generate executive summary
      const summary = `Executive Assessment for ${entity.full_name}: ${totalThreats} total threats detected, ${criticalThreats} critical. Risk profile: ${entity.risk_profile}. Immediate action ${criticalThreats > 0 ? 'required' : 'recommended'}.`;

      const { data, error } = await supabase
        .from('aria_reports')
        .insert({
          report_title: 'Genesis Executive Summary',
          entity_name: entity.full_name,
          content: `Comprehensive threat assessment for ${entity.full_name}. Total threats: ${totalThreats}. Critical threats: ${criticalThreats}. Recommended response level: ${criticalThreats > 0 ? 'NUCLEAR' : totalThreats > 5 ? 'HARD' : 'SOFT'}.`,
          summary: summary,
          risk_rating: criticalThreats > 0 ? 'critical' : totalThreats > 5 ? 'high' : 'medium'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Executive report generated');
      await loadGenesisData();
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error('Failed to generate executive report');
    }
  };

  const deployResponse = async (entityId: string, responseType: 'soft' | 'hard' | 'nuclear') => {
    try {
      await supabase.from('genesis_response_log').insert({
        entity_id: entityId,
        response_type: responseType,
        action_summary: `${responseType.toUpperCase()} response deployed`,
        deployed_by: 'genesis_operator'
      });

      toast.success(`${responseType.toUpperCase()} response deployed`);
    } catch (error) {
      console.error('Response deployment failed:', error);
      toast.error('Failed to deploy response');
    }
  };

  const toggleGuardianMode = async (entity: GenesisEntity) => {
    try {
      const newState = !guardianMode[entity.id];
      
      if (newState) {
        // Enable guardian mode
        await supabase.from('genesis_guardian_log').insert({
          entity_id: entity.id,
          check_type: 'guardian_activation',
          findings: 'Guardian monitoring activated',
          escalation_level: 'info'
        });
      }

      setGuardianMode(prev => ({ ...prev, [entity.id]: newState }));
      toast.success(`Guardian mode ${newState ? 'enabled' : 'disabled'} for ${entity.full_name}`);
    } catch (error) {
      console.error('Guardian mode toggle failed:', error);
      toast.error('Failed to toggle guardian mode');
    }
  };

  return (
    <Card className="bg-corporate-darkTertiary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-corporate-accent">
          <Shield className="h-5 w-5" />
          A.R.I.A™ Genesis Sentinel Command Center
        </CardTitle>
        <p className="text-sm text-corporate-lightGray">
          Live-only threat detection and response system with zero mock data
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="command" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Target className="h-4 w-4 mr-2" />
              Command
            </TabsTrigger>
            <TabsTrigger value="entities" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Users className="h-4 w-4 mr-2" />
              Entities
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="guardian" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Guardian
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-4 mt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter target entity (person, company, brand)"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="flex-1 bg-corporate-darkSecondary border-corporate-border text-white"
              />
              <Button
                onClick={runLiveThreatScan}
                disabled={isScanning}
                className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
              >
                <Search className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Live Threat Scan'}
              </Button>
            </div>

            {isScanning && (
              <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">Live Intelligence Gathering</span>
                </div>
                <p className="text-sm text-blue-300 mt-1">
                  • Scanning live Reddit feeds<br/>
                  • Processing real-time news<br/>
                  • Analyzing forum discussions<br/>
                  • Generating threat assessments
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-corporate-accent" />
                    <span className="text-white font-medium">Live Entities</span>
                  </div>
                  <p className="text-2xl font-bold text-corporate-accent">{entities.length}</p>
                  <p className="text-xs text-corporate-subtext">Being monitored</p>
                </CardContent>
              </Card>
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-medium">Active Threats</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{threatReports.length}</p>
                  <p className="text-xs text-corporate-subtext">Require attention</p>
                </CardContent>
              </Card>
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">Reports</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{executiveReports.length}</p>
                  <p className="text-xs text-corporate-subtext">Executive summaries</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entities" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Protected Entities</h3>
              {entities.map((entity) => (
                <Card key={entity.id} className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{entity.full_name}</h4>
                        <p className="text-sm text-corporate-lightGray">
                          Industry: {entity.primary_industry} • Risk: {entity.risk_profile}
                        </p>
                        <p className="text-xs text-corporate-subtext">
                          Added: {new Date(entity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => generateExecutiveReport(entity)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedEntity(entity)}
                          className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="threats" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Live Threat Intelligence</h3>
              {threatReports.map((threat) => (
                <Card key={threat.id} className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${
                            threat.threat_level === 'critical' ? 'bg-red-600' :
                            threat.threat_level === 'high' ? 'bg-orange-600' :
                            threat.threat_level === 'moderate' ? 'bg-yellow-600' :
                            'bg-blue-600'
                          } text-white`}>
                            {threat.threat_level?.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                            Sentiment: {(threat.sentiment_score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-corporate-lightGray text-sm mb-2">
                          {threat.threat_summary}
                        </p>
                        <p className="text-xs text-corporate-subtext">
                          Detected: {new Date(threat.report_generated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => deployResponse(threat.entity_id, 'soft')}
                          className="bg-green-600 hover:bg-green-700 text-xs"
                        >
                          Soft Response
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deployResponse(threat.entity_id, 'hard')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                        >
                          Hard Response
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deployResponse(threat.entity_id, 'nuclear')}
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
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Executive Reports</h3>
              {executiveReports.map((report) => (
                <Card key={report.id} className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{report.entity_name}</h4>
                        <p className="text-sm text-corporate-lightGray">
                          Generated: {new Date(report.generated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guardian" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Guardian Mode (24/7 Monitoring)</h3>
              {entities.map((entity) => (
                <Card key={entity.id} className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{entity.full_name}</h4>
                        <p className="text-sm text-corporate-lightGray">
                          Status: {guardianMode[entity.id] ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </div>
                      <Button
                        onClick={() => toggleGuardianMode(entity)}
                        className={`${
                          guardianMode[entity.id] 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {guardianMode[entity.id] ? 'Disable' : 'Enable'} Guardian
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GenesisSentinelPanel;
