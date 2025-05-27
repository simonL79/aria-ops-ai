
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Brain,
  Target,
  Zap,
  Shield,
  Plus,
  BarChart3
} from "lucide-react";
import {
  getInternalBehaviorSignals,
  createInternalBehaviorSignal,
  getToneDriftProfiles,
  createToneDriftProfile,
  getPraxisRiskArchetypes,
  createPraxisRiskArchetype,
  getPraxisCrisisSimulations,
  getPraxisForecastDashboard,
  getPraxisSignalTrends,
  refreshPraxisViews,
  updateRiskArchetypeStatus,
  type InternalBehaviorSignal,
  type ToneDriftProfile,
  type PraxisRiskArchetype,
  type PraxisCrisisSimulation,
  type PraxisForecastDashboard,
  type PraxisSignalTrend
} from '@/services/aria/praxisService';
import { toast } from 'sonner';

const PraxisPanel = () => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [showAddArchetype, setShowAddArchetype] = useState(false);

  // Data states
  const [signals, setSignals] = useState<InternalBehaviorSignal[]>([]);
  const [driftProfiles, setDriftProfiles] = useState<ToneDriftProfile[]>([]);
  const [archetypes, setArchetypes] = useState<PraxisRiskArchetype[]>([]);
  const [simulations, setSimulations] = useState<PraxisCrisisSimulation[]>([]);
  const [forecast, setForecast] = useState<PraxisForecastDashboard[]>([]);
  const [trends, setTrends] = useState<PraxisSignalTrend[]>([]);

  // Form states
  const [newSignal, setNewSignal] = useState({
    entity_name: '',
    signal_type: '',
    signal_value: '',
    severity: 0.5,
    source: '',
    notes: ''
  });

  const [newArchetype, setNewArchetype] = useState({
    entity_name: '',
    forecast_type: '',
    confidence_score: 0.5,
    supporting_signals: [] as string[],
    drift_score: 0.5,
    likely_visibility: 'external',
    risk_level: 'medium',
    mitigation_suggested: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        signalsData,
        driftData,
        archetypesData,
        simulationsData,
        forecastData,
        trendsData
      ] = await Promise.all([
        getInternalBehaviorSignals(),
        getToneDriftProfiles(),
        getPraxisRiskArchetypes(),
        getPraxisCrisisSimulations(),
        getPraxisForecastDashboard(),
        getPraxisSignalTrends()
      ]);

      setSignals(signalsData);
      setDriftProfiles(driftData);
      setArchetypes(archetypesData);
      setSimulations(simulationsData);
      setForecast(forecastData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading PRAXIS data:', error);
      toast.error('Failed to load PRAXIS data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshViews = async () => {
    await refreshPraxisViews();
    await loadAllData();
  };

  const handleCreateSignal = async () => {
    if (!newSignal.entity_name || !newSignal.signal_type) {
      toast.error('Entity name and signal type are required');
      return;
    }

    const success = await createInternalBehaviorSignal(newSignal);
    if (success) {
      setNewSignal({
        entity_name: '',
        signal_type: '',
        signal_value: '',
        severity: 0.5,
        source: '',
        notes: ''
      });
      setShowAddSignal(false);
      await loadAllData();
    }
  };

  const handleCreateArchetype = async () => {
    if (!newArchetype.entity_name || !newArchetype.forecast_type) {
      toast.error('Entity name and forecast type are required');
      return;
    }

    const success = await createPraxisRiskArchetype(newArchetype);
    if (success) {
      setNewArchetype({
        entity_name: '',
        forecast_type: '',
        confidence_score: 0.5,
        supporting_signals: [],
        drift_score: 0.5,
        likely_visibility: 'external',
        risk_level: 'medium',
        mitigation_suggested: ''
      });
      setShowAddArchetype(false);
      await loadAllData();
    }
  };

  const handleUpdateArchetypeStatus = async (id: string, status: string) => {
    await updateRiskArchetypeStatus(id, status);
    await loadAllData();
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'viral': return 'bg-red-500 text-white';
      case 'external': return 'bg-orange-500 text-white';
      case 'internal_only': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading PRAXIS™ System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            PRAXIS™ Reputation Foresight
          </h3>
          <p className="text-sm text-muted-foreground">
            Pre-crisis risk engine and narrative fallout prediction
          </p>
        </div>
        <Button onClick={handleRefreshViews} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analytics
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Forecasts</p>
                <p className="text-2xl font-bold">{forecast.filter(f => f.status === 'active').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Risks</p>
                <p className="text-2xl font-bold text-red-600">
                  {forecast.filter(f => f.risk_level === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Behavior Signals</p>
                <p className="text-2xl font-bold">{signals.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Crisis Simulations</p>
                <p className="text-2xl font-bold">{simulations.length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="forecast">Risk Forecast</TabsTrigger>
          <TabsTrigger value="signals">Behavior Signals</TabsTrigger>
          <TabsTrigger value="archetypes">Risk Archetypes</TabsTrigger>
          <TabsTrigger value="trends">Signal Trends</TabsTrigger>
          <TabsTrigger value="simulations">Crisis Sims</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>Active Risk Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.map((item) => (
                  <div key={`${item.entity_name}-${item.forecast_type}`} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.entity_name}</h4>
                        <p className="text-sm text-gray-600">{item.forecast_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(item.risk_level)}>
                          {item.risk_level.toUpperCase()}
                        </Badge>
                        <Badge className={getVisibilityColor(item.likely_visibility)}>
                          {item.likely_visibility}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>Confidence: {(item.confidence_score * 100).toFixed(0)}%</div>
                      <div>Active Signals: {item.active_signals}</div>
                      <div>Simulations: {item.crisis_simulated}</div>
                      <div>Status: {item.status}</div>
                    </div>
                    
                    <Progress value={item.confidence_score * 100} className="mb-2" />
                    
                    <div className="text-xs text-gray-500">
                      Last Updated: {new Date(item.last_updated).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {forecast.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No active risk forecasts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Internal Behavior Signals</CardTitle>
                <Button onClick={() => setShowAddSignal(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Signal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddSignal && (
                <div className="border rounded p-4 mb-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add New Signal</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="entity">Entity Name</Label>
                      <Input
                        id="entity"
                        value={newSignal.entity_name}
                        onChange={(e) => setNewSignal(prev => ({ ...prev, entity_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signal-type">Signal Type</Label>
                      <Select onValueChange={(value) => setNewSignal(prev => ({ ...prev, signal_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select signal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glassdoor_delta">Glassdoor Rating Change</SelectItem>
                          <SelectItem value="exec_departure">Executive Departure</SelectItem>
                          <SelectItem value="tone_shift">Communication Tone Shift</SelectItem>
                          <SelectItem value="email_volume_spike">Email Volume Spike</SelectItem>
                          <SelectItem value="hr_complaints">HR Complaints</SelectItem>
                          <SelectItem value="media_coverage">Media Coverage Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="signal-value">Signal Value</Label>
                      <Input
                        id="signal-value"
                        value={newSignal.signal_value}
                        onChange={(e) => setNewSignal(prev => ({ ...prev, signal_value: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={newSignal.source}
                        onChange={(e) => setNewSignal(prev => ({ ...prev, source: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="severity">Severity: {newSignal.severity.toFixed(2)}</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={newSignal.severity}
                        onChange={(e) => setNewSignal(prev => ({ ...prev, severity: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newSignal.notes}
                        onChange={(e) => setNewSignal(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateSignal}>Create Signal</Button>
                    <Button variant="outline" onClick={() => setShowAddSignal(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {signals.map((signal) => (
                  <div key={signal.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{signal.entity_name}</h4>
                        <p className="text-sm text-gray-600">{signal.signal_type}</p>
                      </div>
                      <Badge variant={signal.severity && signal.severity >= 0.8 ? 'destructive' : 'outline'}>
                        {signal.severity ? (signal.severity * 100).toFixed(0) : '0'}% Severity
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-2">{signal.signal_value}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>Source: {signal.source}</div>
                      <div>Captured: {new Date(signal.captured_at).toLocaleString()}</div>
                    </div>
                    
                    {signal.notes && (
                      <div className="mt-2 text-xs text-gray-600">
                        Notes: {signal.notes}
                      </div>
                    )}
                  </div>
                ))}
                
                {signals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No behavior signals detected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archetypes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Risk Archetypes</CardTitle>
                <Button onClick={() => setShowAddArchetype(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Archetype
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddArchetype && (
                <div className="border rounded p-4 mb-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Create Risk Archetype</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="archetype-entity">Entity Name</Label>
                      <Input
                        id="archetype-entity"
                        value={newArchetype.entity_name}
                        onChange={(e) => setNewArchetype(prev => ({ ...prev, entity_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="forecast-type">Forecast Type</Label>
                      <Select onValueChange={(value) => setNewArchetype(prev => ({ ...prev, forecast_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select forecast type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive_scandal">Executive Scandal</SelectItem>
                          <SelectItem value="toxic_culture">Toxic Culture</SelectItem>
                          <SelectItem value="layoff_wave">Layoff Wave</SelectItem>
                          <SelectItem value="ethics_violation">Ethics Violation</SelectItem>
                          <SelectItem value="data_breach">Data Breach</SelectItem>
                          <SelectItem value="financial_irregularity">Financial Irregularity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="visibility">Likely Visibility</Label>
                      <Select 
                        value={newArchetype.likely_visibility}
                        onValueChange={(value) => setNewArchetype(prev => ({ ...prev, likely_visibility: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal_only">Internal Only</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="viral">Viral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="risk-level">Risk Level</Label>
                      <Select 
                        value={newArchetype.risk_level}
                        onValueChange={(value) => setNewArchetype(prev => ({ ...prev, risk_level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="confidence">Confidence: {newArchetype.confidence_score.toFixed(2)}</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={newArchetype.confidence_score}
                        onChange={(e) => setNewArchetype(prev => ({ ...prev, confidence_score: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="mitigation">Mitigation Suggestions</Label>
                      <Textarea
                        id="mitigation"
                        value={newArchetype.mitigation_suggested}
                        onChange={(e) => setNewArchetype(prev => ({ ...prev, mitigation_suggested: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateArchetype}>Create Archetype</Button>
                    <Button variant="outline" onClick={() => setShowAddArchetype(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {archetypes.map((archetype) => (
                  <div key={archetype.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{archetype.entity_name}</h4>
                        <p className="text-sm text-gray-600">{archetype.forecast_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(archetype.risk_level || 'medium')}>
                          {archetype.risk_level?.toUpperCase()}
                        </Badge>
                        <Badge variant={archetype.status === 'active' ? 'default' : 'secondary'}>
                          {archetype.status?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>Confidence: {archetype.confidence_score ? (archetype.confidence_score * 100).toFixed(0) : '0'}%</div>
                      <div>Visibility: {archetype.likely_visibility}</div>
                      <div>Window: {archetype.predicted_window}</div>
                      <div>Signals: {archetype.supporting_signals?.length || 0}</div>
                    </div>
                    
                    {archetype.mitigation_suggested && (
                      <div className="text-sm text-blue-600 mb-2">
                        Mitigation: {archetype.mitigation_suggested}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {archetype.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateArchetypeStatus(archetype.id, 'resolved')}>
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateArchetypeStatus(archetype.id, 'escalated')}>
                            Escalate
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Triggered: {new Date(archetype.triggered_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {archetypes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No risk archetypes created yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Signal Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend) => (
                  <div key={`${trend.entity_name}-${trend.signal_type}`} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{trend.entity_name}</h4>
                        <p className="text-sm text-gray-600">{trend.signal_type}</p>
                      </div>
                      <Badge variant="outline">
                        {trend.signal_count} signals
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Avg Severity: {(trend.avg_severity * 100).toFixed(0)}%</div>
                      <div>Peak Severity: {(trend.peak_severity * 100).toFixed(0)}%</div>
                      <div>Duration: {Math.round(trend.trend_duration_days)} days</div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(trend.first_detected).toLocaleDateString()} - {new Date(trend.latest_signal).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {trends.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No signal trends available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulations">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Simulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulations.map((sim) => (
                  <div key={sim.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{sim.entity_name}</h4>
                        <p className="text-sm text-gray-600">{sim.simulated_narrative}</p>
                      </div>
                      <Badge variant={sim.simulation_status === 'pending' ? 'secondary' : 'default'}>
                        {sim.simulation_status?.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {sim.outcome_projection && (
                      <div className="text-sm text-blue-600 mb-2">
                        Outcome: {sim.outcome_projection}
                      </div>
                    )}
                    
                    {sim.effectiveness_score && (
                      <div className="text-sm">
                        Effectiveness: {(sim.effectiveness_score * 100).toFixed(0)}%
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Created: {new Date(sim.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                
                {simulations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No crisis simulations yet
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

export default PraxisPanel;
