
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, AlertTriangle, Eye, Bell, TrendingUp } from "lucide-react";
import { 
  getProspectEntities, 
  getRSIActivationQueue, 
  getEideticFootprintQueue, 
  getProspectAlerts,
  getRejectedThreats,
  getARIAStats,
  markAlertProcessed,
  type ProspectEntity,
  type RSIActivationItem,
  type EideticFootprintItem,
  type ProspectAlert
} from '@/services/aria/ariaThreatPulse';
import { toast } from 'sonner';

const ARIAThreatPulsePanel = () => {
  const [prospects, setProspects] = useState<ProspectEntity[]>([]);
  const [rsiQueue, setRSIQueue] = useState<RSIActivationItem[]>([]);
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
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prospectsData, rsiData, eideticData, alertsData, statsData] = await Promise.all([
        getProspectEntities(),
        getRSIActivationQueue(),
        getEideticFootprintQueue(),
        getProspectAlerts(),
        getARIAStats()
      ]);

      setProspects(prospectsData);
      setRSIQueue(rsiData);
      setEideticQueue(eideticData);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading ARIA data:', error);
      toast.error('Failed to load ARIA Threat Pulse data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessAlert = async (alertId: string) => {
    const success = await markAlertProcessed(alertId);
    if (success) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert marked as processed');
    } else {
      toast.error('Failed to process alert');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 bg-red-50';
    if (score >= 0.6) return 'text-orange-600 bg-orange-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading A.R.I.A™ Threat Pulse...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            A.R.I.A™ Threat Pulse Engine
          </h3>
          <p className="text-sm text-muted-foreground">
            Intelligence routing, prospect scoring, and automated escalation
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Prospects</p>
                <p className="text-lg font-semibold">{stats.totalProspects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">High Score</p>
                <p className="text-lg font-semibold">{stats.highScoreProspects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">RSI Queue</p>
                <p className="text-lg font-semibold">{stats.rsiActivations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">EIDETIC</p>
                <p className="text-lg font-semibold">{stats.eideticFootprints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Alerts</p>
                <p className="text-lg font-semibold">{stats.pendingAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs text-muted-foreground">Mentions</p>
                <p className="text-lg font-semibold">{stats.totalMentions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prospects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prospects">Prospect Entities</TabsTrigger>
          <TabsTrigger value="rsi">RSI Queue</TabsTrigger>
          <TabsTrigger value="eidetic">EIDETIC Queue</TabsTrigger>
          <TabsTrigger value="alerts">Pending Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prospect Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prospects.map((prospect) => (
                  <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{prospect.detected_name}</h4>
                      <p className="text-sm text-muted-foreground">{prospect.context_excerpt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {prospect.mention_count} mentions • {prospect.source}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(prospect.escalation_score)}>
                        {(prospect.escalation_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {prospects.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No prospect entities found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rsi">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">RSI Activation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rsiQueue.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{item.prospect_name}</h4>
                    <p className="text-sm text-muted-foreground">{item.threat_reason}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Source: {item.source}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.queued_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {rsiQueue.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No RSI activations queued</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eidetic">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">EIDETIC Footprint Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eideticQueue.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{item.prospect_name}</h4>
                    <p className="text-sm text-muted-foreground">{item.content_excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">
                        Decay Score: {(item.decay_score * 100).toFixed(0)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.routed_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {eideticQueue.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No EIDETIC footprints queued</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.entity}</h4>
                      <p className="text-sm text-muted-foreground">{alert.event}</p>
                      <Badge variant="outline" className="mt-1">
                        {alert.medium}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleProcessAlert(alert.id)}
                    >
                      Mark Sent
                    </Button>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No pending alerts</p>
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
