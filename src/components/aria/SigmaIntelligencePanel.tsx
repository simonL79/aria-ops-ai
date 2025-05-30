import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Target, 
  Wrench, 
  Eye, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  Zap,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SigmaIntelligencePanelProps {
  entityName?: string;
}

interface ThreatProfile {
  id: string;
  entity_name: string;
  threat_level: string;
  risk_score: number;
  signature_match: string;
  match_confidence: number;
  primary_platforms: string[];
  total_mentions: number;
  negative_sentiment_score: number;
  related_entities: string[];
  fix_plan: string;
  created_at: string;
}

interface FixPath {
  id: string;
  entity_name: string;
  threat_level: string;
  steps: any[];
  created_at: string;
}

interface ActionTrigger {
  id: string;
  entity_name: string;
  module_name: string;
  action_type: string;
  status: string;
  triggered_at: string;
}

const SigmaIntelligencePanel = ({ entityName = "general_threats" }: SigmaIntelligencePanelProps) => {
  const [threatProfiles, setThreatProfiles] = useState<ThreatProfile[]>([]);
  const [fixPaths, setFixPaths] = useState<FixPath[]>([]);
  const [actionTriggers, setActionTriggers] = useState<ActionTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingLiveData, setIsGeneratingLiveData] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    loadSigmaData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSigmaData, 30000);
    return () => clearInterval(interval);
  }, [entityName]);

  const triggerLiveSigmaScan = async () => {
    setIsGeneratingLiveData(true);
    setScanProgress(0);
    
    try {
      console.log('🔍 Triggering live SIGMA scan for:', entityName);
      
      // Progress update
      setScanProgress(20);
      toast.info('A.R.I.A™ SIGMA: Initiating live intelligence scan...', {
        description: 'Scanning Reddit, News feeds, and Forums for live threats'
      });

      // Call SIGMA live scanner with better error handling
      const { data: sigmaData, error: sigmaError } = await supabase.functions.invoke('sigmalive', {
        body: { 
          entity: entityName,
          keywords: ['scandal', 'controversy', 'investigation', 'lawsuit', 'fraud', 'crisis'],
          depth: 3,
          generateProfile: true
        }
      });

      setScanProgress(60);

      if (sigmaError) {
        console.error('SIGMA scan error:', sigmaError);
        toast.error('SIGMA scan encountered issues', { 
          description: `Some sources failed: ${sigmaError.message}. Continuing with available data.` 
        });
      } else {
        console.log('✅ SIGMA scan completed:', sigmaData);
        toast.success('SIGMA scan completed', {
          description: `${sigmaData?.scan_results || 0} live threats analyzed`
        });
      }

      setScanProgress(80);

      // Generate AI fix paths if threats were found
      if (sigmaData?.threat_profile || (sigmaData?.results && sigmaData.results.length > 0)) {
        console.log('🔧 Generating AI fix paths...');
        
        const threatData = sigmaData.threat_profile || {
          entity_name: entityName,
          threat_level: 'moderate',
          risk_score: 0.5
        };

        const { data: fixData, error: fixError } = await supabase.functions.invoke('fixpath-ai', {
          body: {
            entity: threatData.entity_name,
            threatLevel: threatData.threat_level,
            riskScore: threatData.risk_score,
            threatContext: `Live SIGMA intelligence detected: ${threatData.signature_match || 'Multiple sources'}`,
            generateActions: true
          }
        });

        if (fixError) {
          console.error('Fix path generation error:', fixError);
          toast.warning('Fix path generation had issues', { description: fixError.message });
        } else {
          console.log('✅ AI fix paths generated:', fixData);
          toast.success('AI Fix Paths generated', {
            description: `${fixData?.steps?.length || 0} tactical steps created`
          });
        }
      }

      setScanProgress(100);
      
      // Force refresh data after scan
      setTimeout(() => {
        loadSigmaData();
        setScanProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Live scan error:', error);
      toast.error('Live scan failed', { description: 'Network error - check console for details' });
      setScanProgress(0);
    } finally {
      setIsGeneratingLiveData(false);
    }
  };

  const loadSigmaData = async () => {
    setIsLoading(true);
    try {
      // Load threat profiles with better filtering
      const { data: profiles } = await supabase
        .from('threat_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load fix paths
      const { data: paths } = await supabase
        .from('fix_paths')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load action triggers
      const { data: triggers } = await supabase
        .from('action_triggers')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(20);

      // Load recent scan results as backup data
      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'sigma_live')
        .order('created_at', { ascending: false })
        .limit(5);

      setThreatProfiles(profiles || []);
      
      const typedFixPaths = (paths || []).map(path => ({
        ...path,
        steps: Array.isArray(path.steps) ? path.steps : []
      }));
      setFixPaths(typedFixPaths);
      
      setActionTriggers(triggers || []);

      // Log current data state
      console.log(`📊 SIGMA Data Loaded: ${profiles?.length || 0} threats, ${paths?.length || 0} fix paths, ${triggers?.length || 0} actions, ${scanResults?.length || 0} scan results`);
      
    } catch (error) {
      console.error('Error loading SIGMA data:', error);
      toast.error('Failed to load SIGMA data', { description: 'Check console for details' });
    } finally {
      setIsLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'executing': return 'bg-blue-500 text-white';
      case 'queued': return 'bg-yellow-500 text-black';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading && !isGeneratingLiveData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Activity className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading SIGMA Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SIGMA Overview */}
      <Card className="bg-[#1A1B1E] border-purple-600/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            A.R.I.A™ SIGMA Intelligence Overview
            <Badge variant="outline" className="ml-2">
              Target: {entityName}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0A0B0D] p-4 rounded">
              <div className="text-2xl font-bold text-purple-400">{threatProfiles.length}</div>
              <div className="text-sm text-gray-300">Threat Profiles</div>
            </div>
            <div className="bg-[#0A0B0D] p-4 rounded">
              <div className="text-2xl font-bold text-blue-400">{fixPaths.length}</div>
              <div className="text-sm text-gray-300">AI Fix Paths</div>
            </div>
            <div className="bg-[#0A0B0D] p-4 rounded">
              <div className="text-2xl font-bold text-green-400">{actionTriggers.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-gray-300">Actions Completed</div>
            </div>
            <div className="bg-[#0A0B0D] p-4 rounded">
              <div className="text-2xl font-bold text-yellow-400">{actionTriggers.filter(t => t.status === 'queued').length}</div>
              <div className="text-sm text-gray-300">Actions Pending</div>
            </div>
          </div>
          
          {/* Progress bar for live scanning */}
          {isGeneratingLiveData && scanProgress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-400">Live Intelligence Scan Progress</span>
                <span className="text-sm text-gray-400">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
          
          {/* Live Data Generation Controls */}
          <div className="flex gap-4">
            <Button
              onClick={triggerLiveSigmaScan}
              disabled={isGeneratingLiveData}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGeneratingLiveData ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Live Intelligence...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Live SIGMA Intelligence
                </>
              )}
            </Button>
            
            <Button
              onClick={loadSigmaData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isGeneratingLiveData}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show message if no data */}
      {threatProfiles.length === 0 && fixPaths.length === 0 && actionTriggers.length === 0 && !isGeneratingLiveData && (
        <Card className="bg-[#1A1B1E] border-yellow-600/30">
          <CardContent className="py-8">
            <div className="text-center">
              <Brain className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Live Intelligence Data Yet</h3>
              <p className="text-gray-400 mb-4">
                Click "Generate Live SIGMA Intelligence" to start collecting real-time threat data from Reddit, news feeds, and forums for: <strong>{entityName}</strong>
              </p>
              <Button
                onClick={triggerLiveSigmaScan}
                disabled={isGeneratingLiveData}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGeneratingLiveData ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning Live Sources...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Live SIGMA Scan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threat Profiles */}
      {threatProfiles.length > 0 && (
        <Card className="bg-[#1A1B1E] border-red-600/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Live Threat Profiles ({threatProfiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatProfiles.map((profile) => (
                <div key={profile.id} className="bg-[#0A0B0D] p-4 rounded border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{profile.entity_name}</h3>
                      <p className="text-sm text-gray-400">Signature: {profile.signature_match}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getThreatLevelColor(profile.threat_level)}>
                        {profile.threat_level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        Risk: {Math.round(profile.risk_score * 100)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-400">Total Mentions</div>
                      <div className="text-white font-medium">{profile.total_mentions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Negative Sentiment</div>
                      <div className="text-white font-medium">{Math.round(profile.negative_sentiment_score * 100)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Platforms</div>
                      <div className="text-white font-medium">{profile.primary_platforms?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-white font-medium">{Math.round(profile.match_confidence * 100)}%</div>
                    </div>
                  </div>

                  {profile.related_entities && profile.related_entities.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-gray-400 mb-1">Related Entities:</div>
                      <div className="flex flex-wrap gap-1">
                        {profile.related_entities.slice(0, 5).map((entity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.fix_plan && (
                    <div className="bg-blue-500/10 p-3 rounded">
                      <div className="text-sm text-blue-400 mb-1">AI Fix Plan:</div>
                      <div className="text-sm text-gray-300">{profile.fix_plan}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Fix Paths */}
      {fixPaths.length > 0 && (
        <Card className="bg-[#1A1B1E] border-blue-600/30">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              AI-Generated Fix Paths ({fixPaths.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fixPaths.map((fixPath) => (
                <div key={fixPath.id} className="bg-[#0A0B0D] p-4 rounded border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{fixPath.entity_name}</h3>
                      <p className="text-sm text-gray-400">Generated: {new Date(fixPath.created_at).toLocaleString()}</p>
                    </div>
                    <Badge className={getThreatLevelColor(fixPath.threat_level)}>
                      {fixPath.threat_level?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>

                  {fixPath.steps && fixPath.steps.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-blue-400 mb-2">Fix Path Steps ({fixPath.steps.length}):</div>
                      {fixPath.steps.slice(0, 3).map((step: any, index: number) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Step {step.step}
                            </Badge>
                            <Badge className={step.priority === 'critical' ? 'bg-red-500' : step.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}>
                              {step.priority?.toUpperCase() || 'MEDIUM'}
                            </Badge>
                          </div>
                          <div className="text-white font-medium">{step.action}</div>
                          <div className="text-sm text-gray-300">{step.description}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>Module: {step.module}</span>
                            <span>Time: {step.estimated_time || 'Unknown'}</span>
                            <span>Success: {Math.round((step.success_probability || 0.7) * 100)}%</span>
                          </div>
                        </div>
                      ))}
                      {fixPath.steps.length > 3 && (
                        <div className="text-sm text-gray-400 text-center">
                          +{fixPath.steps.length - 3} more steps...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Triggers */}
      {actionTriggers.length > 0 && (
        <Card className="bg-[#1A1B1E] border-green-600/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Action Triggers ({actionTriggers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionTriggers.slice(0, 10).map((trigger) => (
                <div key={trigger.id} className="bg-[#0A0B0D] p-3 rounded border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-white">{trigger.action_type}</div>
                      <div className="text-sm text-gray-400">
                        {trigger.entity_name} • {trigger.module_name} • {new Date(trigger.triggered_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(trigger.status)}>
                      {trigger.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SigmaIntelligencePanel;
