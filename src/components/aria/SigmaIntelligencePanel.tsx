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
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const SigmaIntelligencePanel = ({ entityName }: SigmaIntelligencePanelProps) => {
  const [threatProfiles, setThreatProfiles] = useState<ThreatProfile[]>([]);
  const [fixPaths, setFixPaths] = useState<FixPath[]>([]);
  const [actionTriggers, setActionTriggers] = useState<ActionTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSigmaData();
  }, [entityName]);

  const loadSigmaData = async () => {
    setIsLoading(true);
    try {
      // Load threat profiles
      let profilesQuery = supabase.from('threat_profiles').select('*').order('created_at', { ascending: false });
      if (entityName) {
        profilesQuery = profilesQuery.eq('entity_name', entityName);
      }
      const { data: profiles } = await profilesQuery.limit(10);

      // Load fix paths
      let fixPathsQuery = supabase.from('fix_paths').select('*').order('created_at', { ascending: false });
      if (entityName) {
        fixPathsQuery = fixPathsQuery.eq('entity_name', entityName);
      }
      const { data: paths } = await fixPathsQuery.limit(10);

      // Load action triggers
      let triggersQuery = supabase.from('action_triggers').select('*').order('triggered_at', { ascending: false });
      if (entityName) {
        triggersQuery = triggersQuery.eq('entity_name', entityName);
      }
      const { data: triggers } = await triggersQuery.limit(20);

      setThreatProfiles(profiles || []);
      
      // Fix the type conversion for fix paths
      const typedFixPaths = (paths || []).map(path => ({
        ...path,
        steps: Array.isArray(path.steps) ? path.steps : []
      }));
      setFixPaths(typedFixPaths);
      
      setActionTriggers(triggers || []);
    } catch (error) {
      console.error('Error loading SIGMA data:', error);
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

  if (isLoading) {
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </CardContent>
      </Card>

      {/* Threat Profiles */}
      <Card className="bg-[#1A1B1E] border-red-600/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Live Threat Profiles ({threatProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {threatProfiles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No threat profiles generated yet
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* AI Fix Paths */}
      <Card className="bg-[#1A1B1E] border-blue-600/30">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            AI-Generated Fix Paths ({fixPaths.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fixPaths.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No AI fix paths generated yet
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Action Triggers */}
      <Card className="bg-[#1A1B1E] border-green-600/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Action Triggers ({actionTriggers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actionTriggers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No action triggers created yet
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button
          onClick={loadSigmaData}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Eye className="mr-2 h-4 w-4" />
          Refresh SIGMA Intelligence
        </Button>
      </div>
    </div>
  );
};

export default SigmaIntelligencePanel;
