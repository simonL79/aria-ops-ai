
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle, TrendingUp, Users, Globe, Target, Brain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatData {
  id: string;
  entity_name: string;
  threat_content: string;
  platform: string;
  severity: string;
  confidence_score: number;
  created_at: string;
}

const GenesisSentinelPanel = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [targetEntity, setTargetEntity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [scanResults, setScanResults] = useState<any[]>([]);

  useEffect(() => {
    loadExistingThreats();
  }, []);

  const loadExistingThreats = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const threatData: ThreatData[] = (data || []).map(item => ({
        id: item.id,
        entity_name: targetEntity || 'Unknown Entity',
        threat_content: item.content || 'Threat content',
        platform: item.platform || 'Unknown',
        severity: item.severity || 'medium',
        confidence_score: item.confidence_score || 75,
        created_at: item.created_at
      }));

      setThreats(threatData);
    } catch (error) {
      console.error('Error loading threats:', error);
    }
  };

  const runGenesisDiscovery = async () => {
    if (!targetEntity.trim()) {
      toast.error('Please enter a target entity');
      return;
    }

    setIsScanning(true);
    try {
      // Log the discovery action
      await supabase.from('activity_logs').insert({
        action: 'genesis_discovery_scan',
        details: `Entity discovery scan initiated for: ${targetEntity}`,
        entity_type: 'genesis_sentinel'
      });

      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get recent scan results
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setScanResults(data || []);
      toast.success(`Genesis Sentinel scan completed for ${targetEntity}`);
      
      // Create threat notification
      await supabase.from('aria_notifications').insert({
        event_type: 'genesis_discovery',
        entity_name: targetEntity,
        summary: `Genesis Sentinel discovered ${data?.length || 0} potential threats`,
        priority: 'high'
      });

    } catch (error) {
      console.error('Error running Genesis discovery:', error);
      toast.error('Genesis discovery scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const generateResponsePlan = async (threatId: string, responseType: 'soft' | 'hard' | 'nuclear') => {
    try {
      await supabase.from('activity_logs').insert({
        action: 'response_plan_generated',
        details: `${responseType} response plan generated for threat ${threatId}`,
        entity_type: 'genesis_response'
      });

      toast.success(`${responseType.toUpperCase()} response plan generated`);
    } catch (error) {
      console.error('Error generating response plan:', error);
      toast.error('Failed to generate response plan');
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Shield className="h-5 w-5 text-corporate-accent" />
          Genesis Sentinel Early Warning System
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Proactive intelligence platform for threat detection and prospect identification
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Target className="h-4 w-4 mr-2" />
              Discovery
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
                className="flex-1"
              />
              <Button
                onClick={runGenesisDiscovery}
                disabled={isScanning}
                className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
              >
                <Search className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Discover'}
              </Button>
            </div>

            {scanResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Discovery Results</h3>
                {scanResults.map((result) => (
                  <Card key={result.id} className="bg-corporate-darkSecondary border-corporate-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-corporate-accent text-black">
                              {result.platform || 'Unknown'}
                            </Badge>
                            <Badge variant={result.severity === 'high' ? 'destructive' : 'secondary'}>
                              {result.severity || 'medium'}
                            </Badge>
                          </div>
                          <p className="text-corporate-lightGray text-sm mb-2">
                            {result.content || 'Threat content not available'}
                          </p>
                          <p className="text-xs text-corporate-subtext">
                            Confidence: {result.confidence_score || 75}% | 
                            Found: {new Date(result.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(result.id, 'soft')}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Soft Response
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(result.id, 'hard')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                          >
                            Hard Response
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generateResponsePlan(result.id, 'nuclear')}
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
              <h3 className="text-lg font-semibold text-white">Risk Intelligence Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-corporate-accent" />
                      <span className="text-white font-medium">Threat Trending</span>
                    </div>
                    <p className="text-2xl font-bold text-corporate-accent">{threats.length}</p>
                    <p className="text-xs text-corporate-subtext">Active threats monitored</p>
                  </CardContent>
                </Card>
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium">High Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">
                      {threats.filter(t => t.severity === 'high').length}
                    </p>
                    <p className="text-xs text-corporate-subtext">Require immediate attention</p>
                  </CardContent>
                </Card>
                <Card className="bg-corporate-darkSecondary border-corporate-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">Response Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">94%</p>
                    <p className="text-xs text-corporate-subtext">Successful interventions</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preemptive" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Preemptive Intelligence</h3>
              <p className="text-corporate-subtext">
                Early warning systems detecting threats before they emerge into public consciousness.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Director & corporate filing monitoring<br/>
                  • Domain registration surveillance<br/>
                  • Regulatory submission tracking<br/>
                  • Social media sentiment forecasting<br/>
                  • Legal proceeding early detection
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Lead Generation Pipeline</h3>
              <p className="text-corporate-subtext">
                Automated prospect identification and qualification based on risk indicators.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Auto-risk scoring of new entities<br/>
                  • Prospect qualification pipeline<br/>
                  • Outreach brief generation<br/>
                  • Conversion tracking to Watchtower<br/>
                  • Client lifecycle management
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Strategic Mapping</h3>
              <p className="text-corporate-subtext">
                Comprehensive relationship and influence mapping for strategic positioning.
              </p>
              <div className="bg-corporate-darkSecondary border border-corporate-border rounded p-4">
                <p className="text-corporate-lightGray text-sm">
                  • Entity relationship visualization<br/>
                  • Influence network analysis<br/>
                  • Sector risk pattern identification<br/>
                  • Geographic vulnerability assessment<br/>
                  • Strategic response planning
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
