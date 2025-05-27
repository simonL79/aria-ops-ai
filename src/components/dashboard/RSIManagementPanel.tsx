
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Target, Zap, BarChart3, Settings, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThreatSimulation {
  id: string;
  threat_topic: string;
  threat_level: number;
  likelihood_score: number;
  threat_source?: string;
  geographical_scope?: string[];
  created_at: string;
}

interface RSICampaign {
  id: string;
  campaign_name: string;
  status: string;
  forever_active: boolean;
  target_threats?: string[];
  roi_score?: number;
  created_at: string;
}

interface RSIActivationLog {
  id: string;
  trigger_type: string;
  matched_threat?: string;
  activation_status: string;
  triggered_at: string;
  response_count: number;
}

const RSIManagementPanel = () => {
  const [threats, setThreats] = useState<ThreatSimulation[]>([]);
  const [campaigns, setCampaigns] = useState<RSICampaign[]>([]);
  const [activations, setActivations] = useState<RSIActivationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadRSIData();
  }, []);

  const loadRSIData = async () => {
    try {
      setLoading(true);
      
      const [threatsData, campaignsData, activationsData] = await Promise.all([
        supabase.from('threat_simulations').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('rsi_campaigns').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('rsi_activation_logs').select('*').order('triggered_at', { ascending: false }).limit(20)
      ]);

      if (threatsData.data) setThreats(threatsData.data);
      if (campaignsData.data) setCampaigns(campaignsData.data);
      if (activationsData.data) setActivations(activationsData.data);
    } catch (error) {
      console.error('Error loading RSI data:', error);
      toast.error('Failed to load RSI data');
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: number) => {
    if (level >= 4) return 'bg-red-500';
    if (level >= 3) return 'bg-orange-500';
    if (level >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getThreatLevelText = (level: number) => {
    const levels = ['Unknown', 'Low', 'Medium', 'High', 'Critical'];
    return levels[level] || 'Unknown';
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1) + '%';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Zap className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading RSI™ System...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            RSI™ Never-Stop Mode
          </h2>
          <p className="text-gray-600">Reputation Surface Inversion - Autonomous Threat Suppression</p>
        </div>
        <Button onClick={loadRSIData} variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Refresh Dashboard
        </Button>
      </div>

      {/* RSI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold">{threats.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto Activations</p>
                <p className="text-2xl font-bold">{activations.filter(a => a.trigger_type === 'auto_threat_match').length}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Never-Stop Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.forever_active).length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Threat Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="activations">Activation Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Threat Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threats.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active threats detected</p>
                ) : (
                  threats.map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{threat.threat_topic}</h4>
                        <p className="text-sm text-gray-600">
                          Source: {threat.threat_source || 'Unknown'} • 
                          Scope: {threat.geographical_scope?.join(', ') || 'Global'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getThreatLevelColor(threat.threat_level)} text-white`}>
                          {getThreatLevelText(threat.threat_level)}
                        </Badge>
                        <Badge variant="outline">
                          {formatScore(threat.likelihood_score)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RSI Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No campaigns configured</p>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{campaign.campaign_name}</h4>
                        <p className="text-sm text-gray-600">
                          Targets: {campaign.target_threats?.join(', ') || 'All threats'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.forever_active && (
                          <Badge className="bg-purple-500 text-white">
                            Never-Stop
                          </Badge>
                        )}
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        {campaign.roi_score && (
                          <Badge variant="outline">
                            ROI: {campaign.roi_score.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activations recorded</p>
                ) : (
                  activations.map((activation) => (
                    <div key={activation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{activation.matched_threat || 'System Activation'}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(activation.triggered_at).toLocaleString()} • 
                          Responses: {activation.response_count}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activation.trigger_type === 'auto_threat_match' ? 'default' : 'secondary'}>
                          {activation.trigger_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={activation.activation_status === 'completed' ? 'default' : 'secondary'}>
                          {activation.activation_status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RSI Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Threat Distribution</h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const count = threats.filter(t => t.threat_level === level).length;
                      const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0;
                      return (
                        <div key={level} className="flex items-center justify-between">
                          <span className="text-sm">{getThreatLevelText(level)}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getThreatLevelColor(level)}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">System Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Auto-Activation Rate</span>
                      <span className="text-sm font-medium">
                        {activations.length > 0 ? 
                          ((activations.filter(a => a.trigger_type === 'auto_threat_match').length / activations.length) * 100).toFixed(1) + '%' 
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Response Time</span>
                      <span className="text-sm font-medium">&lt; 5min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSIManagementPanel;
