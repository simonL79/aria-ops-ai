
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Shield,
  Target,
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap
} from "lucide-react";
import {
  getModelBiasProfiles,
  getCerebraOverridePackets,
  getAIInfluenceMap,
  getCerebraBiasDashboard,
  getCerebraInfluenceSummary,
  refreshCerebraViews,
  type ModelBiasProfile,
  type CerebraOverridePacket,
  type AIInfluenceMap,
  type CerebraBiasDashboard,
  type CerebraInfluenceSummary
} from '@/services/aria/cerebraService';
import { toast } from 'sonner';

const CerebraPanel = () => {
  const [biasProfiles, setBiasProfiles] = useState<ModelBiasProfile[]>([]);
  const [overridePackets, setOverridePackets] = useState<CerebraOverridePacket[]>([]);
  const [influenceMap, setInfluenceMap] = useState<AIInfluenceMap[]>([]);
  const [biasDashboard, setBiasDashboard] = useState<CerebraBiasDashboard[]>([]);
  const [influenceSummary, setInfluenceSummary] = useState<CerebraInfluenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCerebraData();
  }, []);

  const loadCerebraData = async () => {
    setIsLoading(true);
    try {
      const [profiles, packets, influence, dashboard, summary] = await Promise.all([
        getModelBiasProfiles(),
        getCerebraOverridePackets(),
        getAIInfluenceMap(),
        getCerebraBiasDashboard(),
        getCerebraInfluenceSummary()
      ]);

      setBiasProfiles(profiles);
      setOverridePackets(packets);
      setInfluenceMap(influence);
      setBiasDashboard(dashboard);
      setInfluenceSummary(summary);
    } catch (error) {
      console.error('Error loading CEREBRA data:', error);
      toast.error('Failed to load CEREBRA data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshViews = async () => {
    await refreshCerebraViews();
    await loadCerebraData();
  };

  const getBiasLevelColor = (biasLevel: number) => {
    if (biasLevel <= -0.5) return 'bg-red-500 text-white';
    if (biasLevel >= 0.5) return 'bg-green-500 text-white';
    return 'bg-yellow-500 text-white';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.8) return 'text-green-600';
    if (accuracy >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading CEREBRA™ System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            CEREBRA™ AI Memory Control
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor AI model bias, deploy memory overrides, and track narrative influence
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
                <p className="text-sm text-muted-foreground">Bias Profiles</p>
                <p className="text-2xl font-bold">{biasProfiles.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Override Packets</p>
                <p className="text-2xl font-bold">{overridePackets.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Influence Echoes</p>
                <p className="text-2xl font-bold">{influenceMap.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Bias</p>
                <p className="text-2xl font-bold text-red-600">
                  {biasProfiles.filter(p => p.bias_level && p.bias_level <= -0.5).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bias" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="bias">Bias Monitoring</TabsTrigger>
          <TabsTrigger value="overrides">Override Packets</TabsTrigger>
          <TabsTrigger value="influence">Influence Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bias">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Bias Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {biasProfiles.map((profile) => (
                  <div key={profile.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{profile.entity_name}</h4>
                        <p className="text-sm text-gray-600">Model: {profile.model}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBiasLevelColor(profile.bias_level || 0)}>
                          Bias: {profile.bias_level?.toFixed(2)}
                        </Badge>
                        <Badge variant={profile.tone === 'incorrect' ? 'destructive' : 'outline'}>
                          {profile.tone?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Accuracy:</span>
                        <span className={`font-medium ml-2 ${getAccuracyColor(profile.factual_accuracy_score || 0)}`}>
                          {((profile.factual_accuracy_score || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Verified:</span>
                        <span className="font-medium ml-2">
                          {new Date(profile.last_verified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {profile.notes && (
                      <div className="mt-2 text-xs text-gray-500">
                        {profile.notes}
                      </div>
                    )}
                  </div>
                ))}
                
                {biasProfiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No bias profiles detected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides">
          <Card>
            <CardHeader>
              <CardTitle>Memory Override Packets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overridePackets.map((packet) => (
                  <div key={packet.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{packet.entity_name}</h4>
                        <p className="text-sm text-gray-600">Target: {packet.target_model}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={packet.status === 'deployed' ? 'default' : 'secondary'}>
                          {packet.status?.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {packet.context_type?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <span className="text-gray-600">Override Prompt:</span>
                      <p className="mt-1 text-gray-800">{packet.override_prompt}</p>
                    </div>
                    
                    {packet.effectiveness_score && (
                      <div className="text-sm">
                        <span className="text-gray-600">Effectiveness:</span>
                        <span className="font-medium ml-2 text-green-600">
                          {(packet.effectiveness_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                
                {overridePackets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No override packets created yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influence">
          <Card>
            <CardHeader>
              <CardTitle>AI Influence Echo Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influenceMap.map((echo) => (
                  <div key={echo.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{echo.entity_name}</h4>
                        <p className="text-sm text-gray-600">Platform: {echo.source_platform}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={echo.echo_type === 'hallucination' ? 'destructive' : 'outline'}>
                          {echo.echo_type?.toUpperCase()}
                        </Badge>
                        {echo.verified && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            VERIFIED
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <span className="text-gray-600">Content:</span>
                      <p className="mt-1 text-gray-800">{echo.matched_content}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>Visibility: {((echo.visibility_score || 0) * 100).toFixed(0)}%</div>
                      <div>Source: {echo.ai_model_origin}</div>
                    </div>
                  </div>
                ))}
                
                {influenceMap.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No influence echoes detected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bias Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {biasDashboard.map((item) => (
                    <div key={`${item.entity_name}-${item.model}`} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{item.entity_name}</h4>
                        <Badge variant="outline">{item.model}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Avg Accuracy: {(item.avg_accuracy * 100).toFixed(0)}%</div>
                        <div>Avg Bias: {item.avg_bias.toFixed(2)}</div>
                        <div>Critical: {item.critical_mentions}</div>
                        <div>Inaccuracies: {item.inaccuracies}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Influence Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influenceSummary.map((item) => (
                    <div key={item.entity_name} className="border rounded p-3">
                      <h4 className="font-medium mb-2">{item.entity_name}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total Echoes: {item.total_echoes}</div>
                        <div>Peak Visibility: {(item.peak_visibility * 100).toFixed(0)}%</div>
                        <div>Hallucinations: {item.hallucinated_mentions}</div>
                        <div>Channels: {item.spread_channels}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CerebraPanel;
