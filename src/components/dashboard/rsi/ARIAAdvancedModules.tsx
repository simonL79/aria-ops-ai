
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  Scale, 
  Brain, 
  AlertTriangle, 
  Video, 
  Target,
  Eye,
  Shield,
  Zap
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReputationForecast {
  id: string;
  entity_name: string;
  source_type: string;
  trajectory: string;
  projected_impact: string;
  forecast_window: string;
  velocity: number;
  sentiment_avg: number;
  created_at: string;
}

interface LegalIndicator {
  id: string;
  entity_name: string;
  platform: string;
  context_excerpt: string;
  detected_keywords: string[];
  risk_level: string;
  discovered_at: string;
}

interface LLMMemoryAudit {
  id: string;
  entity_name: string;
  model_name: string;
  model_version: string;
  query: string;
  response_excerpt: string;
  reference_detected: boolean;
  bias_score: number;
  audit_timestamp: string;
}

interface OfflineSpillEvent {
  id: string;
  event_description: string;
  offline_date: string;
  first_online_mention: string;
  source_platform: string;
  entity_involved: string;
  spill_severity: string;
  created_at: string;
}

interface SyntheticThreat {
  id: string;
  entity_name: string;
  media_type: string;
  detection_tool: string;
  confidence_score: number;
  matched_phrase: string;
  sample_url: string;
  is_confirmed: boolean;
  detected_at: string;
}

interface NarrativeCluster {
  id: string;
  entity_name: string;
  narrative_snippet: string;
  intent_label: string;
  source_platform: string;
  attack_surface_score: number;
  created_at: string;
}

const ARIAAdvancedModules = () => {
  const [activeTab, setActiveTab] = useState('forecasting');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states for each module
  const [forecasts, setForecasts] = useState<ReputationForecast[]>([]);
  const [legalIndicators, setLegalIndicators] = useState<LegalIndicator[]>([]);
  const [llmAudits, setLLMAudits] = useState<LLMMemoryAudit[]>([]);
  const [spillEvents, setSpillEvents] = useState<OfflineSpillEvent[]>([]);
  const [syntheticThreats, setSyntheticThreats] = useState<SyntheticThreat[]>([]);
  const [narrativeClusters, setNarrativeClusters] = useState<NarrativeCluster[]>([]);

  useEffect(() => {
    loadAllModuleData();
  }, []);

  const loadAllModuleData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadReputationForecasts(),
        loadLegalIndicators(),
        loadLLMAudits(),
        loadSpillEvents(),
        loadSyntheticThreats(),
        loadNarrativeClusters()
      ]);
    } catch (error) {
      console.error('Error loading A.R.I.A™ module data:', error);
      toast.error('Failed to load advanced intelligence modules');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReputationForecasts = async () => {
    const { data, error } = await supabase
      .from('reputation_forecasts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading reputation forecasts:', error);
    } else {
      setForecasts(data || []);
    }
  };

  const loadLegalIndicators = async () => {
    const { data, error } = await supabase
      .from('legal_indicators')
      .select('*')
      .order('discovered_at', { ascending: false });
    
    if (error) {
      console.error('Error loading legal indicators:', error);
    } else {
      setLegalIndicators(data || []);
    }
  };

  const loadLLMAudits = async () => {
    const { data, error } = await supabase
      .from('llm_memory_audit')
      .select('*')
      .order('audit_timestamp', { ascending: false });
    
    if (error) {
      console.error('Error loading LLM audits:', error);
    } else {
      setLLMAudits(data || []);
    }
  };

  const loadSpillEvents = async () => {
    const { data, error } = await supabase
      .from('offline_spill_events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading spill events:', error);
    } else {
      setSpillEvents(data || []);
    }
  };

  const loadSyntheticThreats = async () => {
    const { data, error } = await supabase
      .from('synthetic_threats')
      .select('*')
      .order('detected_at', { ascending: false });
    
    if (error) {
      console.error('Error loading synthetic threats:', error);
    } else {
      setSyntheticThreats(data || []);
    }
  };

  const loadNarrativeClusters = async () => {
    const { data, error } = await supabase
      .from('narrative_clusters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading narrative clusters:', error);
    } else {
      setNarrativeClusters(data || []);
    }
  };

  const getTrajectoryColor = (trajectory: string) => {
    switch (trajectory) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      case 'volatile': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBiasScoreColor = (score: number) => {
    if (score < -0.3) return 'text-red-600';
    if (score > 0.3) return 'text-green-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading A.R.I.A™ Advanced Modules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Advanced Intelligence Modules
          </h3>
          <p className="text-sm text-muted-foreground">6 Enhanced Detection & Analysis Systems</p>
        </div>
        <Button onClick={loadAllModuleData} variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="forecasting" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-1">
            <Scale className="h-3 w-3" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="llm" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            LLM Audit
          </TabsTrigger>
          <TabsTrigger value="spill" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Spill Events
          </TabsTrigger>
          <TabsTrigger value="synthetic" className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            Synthetic
          </TabsTrigger>
          <TabsTrigger value="narrative" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Narratives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Reputation Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecasts.length > 0 ? (
                  forecasts.map((forecast) => (
                    <div key={forecast.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{forecast.entity_name}</h4>
                        <Badge variant="outline">{forecast.source_type}</Badge>
                      </div>
                      <div className={`text-sm font-medium ${getTrajectoryColor(forecast.trajectory)}`}>
                        Trajectory: {forecast.trajectory.toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{forecast.projected_impact}</p>
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span>Velocity: {forecast.velocity}</span>
                        <span>Sentiment: {forecast.sentiment_avg}%</span>
                        <span>Window: {forecast.forecast_window}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reputation forecasts available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Legal Signal Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalIndicators.length > 0 ? (
                  legalIndicators.map((indicator) => (
                    <div key={indicator.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{indicator.entity_name}</h4>
                        <Badge className={getRiskLevelColor(indicator.risk_level)}>
                          {indicator.risk_level}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Platform: {indicator.platform}
                      </div>
                      <p className="text-sm mb-3">{indicator.context_excerpt}</p>
                      <div className="flex flex-wrap gap-1">
                        {indicator.detected_keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No legal indicators detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm">
          <Card>
            <CardHeader>
              <CardTitle>LLM Memory Audit & Bias Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {llmAudits.length > 0 ? (
                  llmAudits.map((audit) => (
                    <div key={audit.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{audit.entity_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={audit.reference_detected ? "destructive" : "secondary"}>
                            {audit.reference_detected ? 'Referenced' : 'Not Found'}
                          </Badge>
                          <span className={`text-sm font-medium ${getBiasScoreColor(audit.bias_score)}`}>
                            Bias: {audit.bias_score.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Model: {audit.model_name} {audit.model_version}
                      </div>
                      <div className="text-sm mb-2">
                        <strong>Query:</strong> {audit.query}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Response:</strong> {audit.response_excerpt}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No LLM audits available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spill">
          <Card>
            <CardHeader>
              <CardTitle>Offline-to-Online Spill Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spillEvents.length > 0 ? (
                  spillEvents.map((event) => (
                    <div key={event.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{event.entity_involved}</h4>
                        <Badge className={getRiskLevelColor(event.spill_severity)}>
                          {event.spill_severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{event.event_description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Offline: {new Date(event.offline_date).toLocaleDateString()}</span>
                        <span>Online: {new Date(event.first_online_mention).toLocaleDateString()}</span>
                        <span>Platform: {event.source_platform}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No spill events detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthetic">
          <Card>
            <CardHeader>
              <CardTitle>Deepfake & Synthetic Media Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syntheticThreats.length > 0 ? (
                  syntheticThreats.map((threat) => (
                    <div key={threat.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{threat.entity_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={threat.is_confirmed ? "destructive" : "secondary"}>
                            {threat.is_confirmed ? 'Confirmed' : 'Detected'}
                          </Badge>
                          <span className="text-sm font-medium">
                            {(threat.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Type: {threat.media_type} | Tool: {threat.detection_tool}
                      </div>
                      <p className="text-sm mb-3">{threat.matched_phrase}</p>
                      <Progress value={threat.confidence_score * 100} className="mb-2" />
                      {threat.sample_url && (
                        <a 
                          href={threat.sample_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Sample
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No synthetic threats detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narrative">
          <Card>
            <CardHeader>
              <CardTitle>Intent-Aware Narrative Clustering</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {narrativeClusters.length > 0 ? (
                  narrativeClusters.map((cluster) => (
                    <div key={cluster.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{cluster.entity_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={cluster.intent_label === 'attack' ? "destructive" : "outline"}>
                            {cluster.intent_label}
                          </Badge>
                          <span className="text-sm font-medium text-red-600">
                            {(cluster.attack_surface_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Platform: {cluster.source_platform}
                      </div>
                      <p className="text-sm italic">"{cluster.narrative_snippet}"</p>
                      <Progress 
                        value={cluster.attack_surface_score * 100} 
                        className="mt-3"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No narrative clusters detected
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

export default ARIAAdvancedModules;
