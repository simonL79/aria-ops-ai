
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Shield,
  Activity,
  Target
} from "lucide-react";
import { 
  getProspectEntities, 
  getRSIActivationQueue,
  getEideticFootprintQueue,
  getProspectAlerts,
  getARIAStats,
  markAlertProcessed,
  type ProspectEntity,
  type RSIActivationItem,
  type EideticFootprintItem,
  type ProspectAlert
} from '@/services/aria/ariaThreatPulse';
import ARIARiskDashboard from './ARIARiskDashboard';
import { toast } from 'sonner';

const ARIAThreatPulsePanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [prospects, setProspects] = useState<ProspectEntity[]>([]);
  const [rsiQueue, setRsiQueue] = useState<RSIActivationItem[]>([]);
  const [eideticQueue, setEideticQueue] = useState<EideticFootprintItem[]>([]);
  const [alerts, setAlerts] = useState<ProspectAlert[]>([]);
  const [stats, setStats] = useState({
    totalProspects: 0,
    highScoreProspects: 0,
    totalMentions: 0,
    rsiActivations: 0,
    eideticFootprints: 0,
    pendingAlerts: 0
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        prospectsData,
        rsiData,
        eideticData,
        alertsData,
        statsData
      ] = await Promise.all([
        getProspectEntities(),
        getRSIActivationQueue(),
        getEideticFootprintQueue(),
        getProspectAlerts(),
        getARIAStats()
      ]);

      setProspects(prospectsData);
      setRsiQueue(rsiData);
      setEideticQueue(eideticData);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading A.R.I.A™ data:', error);
      toast.error('Failed to load A.R.I.A™ threat pulse data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessAlert = async (alertId: string) => {
    const success = await markAlertProcessed(alertId);
    if (success) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert processed successfully');
    }
  };

  const getEscalationColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading A.R.I.A™ Threat Pulse...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Threat Pulse Center
          </h3>
          <p className="text-sm text-muted-foreground">
            Advanced Reputation Intelligence & Activation System
          </p>
        </div>
        <Button onClick={loadAllData} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Prospects</p>
              <p className="text-lg font-bold">{stats.totalProspects}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">High Risk</p>
              <p className="text-lg font-bold text-red-600">{stats.highScoreProspects}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Signals</p>
              <p className="text-lg font-bold">{stats.totalMentions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">RSI™ Active</p>
              <p className="text-lg font-bold text-orange-600">{stats.rsiActivations}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">EIDETIC™</p>
              <p className="text-lg font-bold text-purple-600">{stats.eideticFootprints}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Alerts</p>
              <p className="text-lg font-bold text-blue-600">{stats.pendingAlerts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Risk Dashboard
          </TabsTrigger>
          <TabsTrigger value="rsi" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            RSI™ Queue
          </TabsTrigger>
          <TabsTrigger value="eidetic" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            EIDETIC™
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prospect Entities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prospects.slice(0, 10).map((prospect) => (
                    <div key={prospect.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{prospect.detected_name}</p>
                        <p className="text-sm text-gray-600">{prospect.context_excerpt}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getEscalationColor(prospect.escalation_score)}`}>
                          {(prospect.escalation_score * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {prospect.mention_count} signals
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <ARIARiskDashboard />
        </TabsContent>

        <TabsContent value="rsi">
          <Card>
            <CardHeader>
              <CardTitle>RSI™ Activation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rsiQueue.length > 0 ? (
                  rsiQueue.map((item) => (
                    <div key={item.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.prospect_name}</h4>
                        <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                          {item.status || 'pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.threat_reason}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Source: {item.source}</span>
                        <span>Queued: {new Date(item.queued_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No RSI™ activations in queue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eidetic">
          <Card>
            <CardHeader>
              <CardTitle>EIDETIC™ Footprint Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eideticQueue.length > 0 ? (
                  eideticQueue.map((item) => (
                    <div key={item.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.prospect_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                            {item.status || 'pending'}
                          </Badge>
                          <span className="text-sm">
                            Decay: {(item.decay_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.content_excerpt}</p>
                      <Progress value={item.decay_score * 100} className="mb-2" />
                      <div className="text-xs text-gray-500">
                        Routed: {new Date(item.routed_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No EIDETIC™ footprints in queue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Prospect Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{alert.entity}</h4>
                          <p className="text-sm text-gray-600">{alert.event}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{alert.medium}</Badge>
                          <Button 
                            size="sm" 
                            onClick={() => handleProcessAlert(alert.id)}
                          >
                            Process
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(alert.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No pending alerts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARIAThreatPulsePanel;
