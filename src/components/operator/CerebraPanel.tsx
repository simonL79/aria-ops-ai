
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, Shield, Zap, Eye, Target } from 'lucide-react';
import { toast } from 'sonner';

interface CerebraBiasEvent {
  id: string;
  model_name: string;
  detected_at: string;
  bias_type: string | null;
  severity: string | null;
  description: string | null;
  input_snippet: string | null;
  output_snippet: string | null;
  flagged_by: string | null;
  resolved: boolean | null;
  resolution_notes: string | null;
}

interface CerebraInfluenceMap {
  id: string;
  source_model: string;
  affected_platform: string | null;
  narrative: string | null;
  influence_strength: number | null;
  tracked_at: string;
}

interface CerebraOverrideEffectiveness {
  id: string;
  override_type: string | null;
  applied_at: string;
  before_bias_score: number | null;
  after_bias_score: number | null;
  model_name: string | null;
}

export const CerebraPanel = () => {
  const [biasEvents, setBiasEvents] = useState<CerebraBiasEvent[]>([]);
  const [influenceMap, setInfluenceMap] = useState<CerebraInfluenceMap[]>([]);
  const [overrideEffectiveness, setOverrideEffectiveness] = useState<CerebraOverrideEffectiveness[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCerebraData();
  }, []);

  const loadCerebraData = async () => {
    await Promise.all([loadBiasEvents(), loadInfluenceMap(), loadOverrideEffectiveness()]);
  };

  const loadBiasEvents = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: CerebraBiasEvent[] = [
        {
          id: '1',
          model_name: 'GPT-4',
          detected_at: new Date().toISOString(),
          bias_type: 'political',
          severity: 'high',
          description: 'Political bias detected in response generation',
          input_snippet: 'What do you think about recent election policies?',
          output_snippet: 'Response shows clear political leaning towards specific party',
          flagged_by: 'CEREBRA™ Bias Scanner',
          resolved: false,
          resolution_notes: null
        },
        {
          id: '2',
          model_name: 'Claude-3',
          detected_at: new Date().toISOString(),
          bias_type: 'gender',
          severity: 'medium',
          description: 'Gender stereotyping in career recommendations',
          input_snippet: 'What careers are suitable for women?',
          output_snippet: 'Response reinforces traditional gender roles',
          flagged_by: 'CEREBRA™ Bias Scanner',
          resolved: true,
          resolution_notes: 'Override packet deployed successfully'
        }
      ];
      setBiasEvents(mockData);
    } catch (error) {
      console.error('Error loading bias events:', error);
      setBiasEvents([]);
    }
  };

  const loadInfluenceMap = async () => {
    try {
      // Use mock data for influence tracking
      const mockData: CerebraInfluenceMap[] = [
        {
          id: '1',
          source_model: 'GPT-4',
          affected_platform: 'Twitter',
          narrative: 'Climate change skepticism amplified through AI-generated content',
          influence_strength: 0.78,
          tracked_at: new Date().toISOString()
        },
        {
          id: '2',
          source_model: 'Gemini',
          affected_platform: 'LinkedIn',
          narrative: 'Corporate bias in job market analysis',
          influence_strength: 0.65,
          tracked_at: new Date().toISOString()
        }
      ];
      setInfluenceMap(mockData);
    } catch (error) {
      console.error('Error loading influence map:', error);
      setInfluenceMap([]);
    }
  };

  const loadOverrideEffectiveness = async () => {
    try {
      // Use mock data for override effectiveness
      const mockData: CerebraOverrideEffectiveness[] = [
        {
          id: '1',
          override_type: 'bias_correction',
          applied_at: new Date().toISOString(),
          before_bias_score: 0.85,
          after_bias_score: 0.23,
          model_name: 'GPT-4'
        },
        {
          id: '2',
          override_type: 'narrative_neutralization',
          applied_at: new Date().toISOString(),
          before_bias_score: 0.72,
          after_bias_score: 0.31,
          model_name: 'Claude-3'
        }
      ];
      setOverrideEffectiveness(mockData);
    } catch (error) {
      console.error('Error loading override effectiveness:', error);
      setOverrideEffectiveness([]);
    }
  };

  const getBiasTypeColor = (type: string | null) => {
    switch (type) {
      case 'political':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'gender':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'race':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'regional':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <Shield className="h-4 w-4 text-green-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getInfluenceStrengthColor = (strength: number | null) => {
    if (!strength) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (strength >= 0.8) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (strength >= 0.6) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (strength >= 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const simulateBiasDetection = async () => {
    setIsLoading(true);
    try {
      const models = ['GPT-4', 'Claude-3', 'Gemini', 'PaLM-2', 'LLaMA-2'];
      const biasTypes = ['political', 'gender', 'race', 'regional', 'other'];
      const severities = ['low', 'medium', 'high', 'critical'];
      
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const randomBiasType = biasTypes[Math.floor(Math.random() * biasTypes.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      const newBiasEvent: CerebraBiasEvent = {
        id: Date.now().toString(),
        model_name: randomModel,
        detected_at: new Date().toISOString(),
        bias_type: randomBiasType,
        severity: randomSeverity,
        description: `${randomBiasType} bias detected in ${randomModel} response generation`,
        input_snippet: 'User query analyzed for bias patterns',
        output_snippet: `Response shows ${randomSeverity} level ${randomBiasType} bias`,
        flagged_by: 'CEREBRA™ Bias Scanner',
        resolved: false,
        resolution_notes: null
      };

      setBiasEvents(prev => [newBiasEvent, ...prev.slice(0, 9)]);
      toast.success('Bias detection scan completed');
    } catch (error) {
      console.error('Error simulating bias detection:', error);
      toast.error('Failed to simulate bias detection');
    } finally {
      setIsLoading(false);
    }
  };

  const trackInfluence = async () => {
    setIsLoading(true);
    try {
      const models = ['GPT-4', 'Claude-3', 'Gemini', 'PaLM-2'];
      const platforms = ['Twitter', 'LinkedIn', 'Reddit', 'Facebook', 'Medium'];
      const narratives = [
        'Climate change misinformation spread',
        'Political polarization amplification',
        'Corporate bias in hiring practices',
        'Healthcare misinformation propagation',
        'Economic inequality narrative skewing'
      ];
      
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const randomNarrative = narratives[Math.floor(Math.random() * narratives.length)];
      const influenceStrength = Math.random();
      
      const newInfluence: CerebraInfluenceMap = {
        id: Date.now().toString(),
        source_model: randomModel,
        affected_platform: randomPlatform,
        narrative: randomNarrative,
        influence_strength: influenceStrength,
        tracked_at: new Date().toISOString()
      };

      setInfluenceMap(prev => [newInfluence, ...prev.slice(0, 9)]);
      toast.success('Influence tracking updated');
    } catch (error) {
      console.error('Error tracking influence:', error);
      toast.error('Failed to track influence');
    } finally {
      setIsLoading(false);
    }
  };

  const deployOverride = async () => {
    setIsLoading(true);
    try {
      const overrideTypes = ['bias_correction', 'narrative_neutralization', 'content_filtering', 'response_rebalancing'];
      const models = ['GPT-4', 'Claude-3', 'Gemini', 'PaLM-2'];
      
      const randomType = overrideTypes[Math.floor(Math.random() * overrideTypes.length)];
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const beforeScore = Math.random() * 0.5 + 0.5; // 0.5-1.0
      const afterScore = Math.random() * 0.5; // 0-0.5 (improvement)
      
      const newOverride: CerebraOverrideEffectiveness = {
        id: Date.now().toString(),
        override_type: randomType,
        applied_at: new Date().toISOString(),
        before_bias_score: beforeScore,
        after_bias_score: afterScore,
        model_name: randomModel
      };

      setOverrideEffectiveness(prev => [newOverride, ...prev.slice(0, 9)]);
      toast.success('Override packet deployed successfully');
    } catch (error) {
      console.error('Error deploying override:', error);
      toast.error('Failed to deploy override');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Bias Event Registry */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            CEREBRA™ AI Bias Event Registry
            <Button
              size="sm"
              onClick={simulateBiasDetection}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {biasEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No bias events detected</div>
          ) : (
            biasEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getSeverityIcon(event.severity)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{event.model_name}]</span> {event.description}
                  </div>
                  {event.output_snippet && (
                    <div className="text-xs text-red-400 mb-1">{event.output_snippet}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {event.flagged_by} | {new Date(event.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getBiasTypeColor(event.bias_type)}>
                    {event.bias_type || 'unknown'}
                  </Badge>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity || 'unknown'}
                  </Badge>
                  <Badge className={event.resolved ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}>
                    {event.resolved ? 'resolved' : 'active'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Influence Map */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            AI Influence Mapping & Tracking
            <Button
              size="sm"
              onClick={trackInfluence}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Track
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {influenceMap.length === 0 ? (
            <div className="text-gray-500 text-sm">No influence patterns detected</div>
          ) : (
            influenceMap.map((influence) => (
              <div key={influence.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Target className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{influence.source_model}]</span> → {influence.affected_platform}
                  </div>
                  {influence.narrative && (
                    <div className="text-xs text-purple-400 mb-1">{influence.narrative}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Strength: {influence.influence_strength ? Math.round(influence.influence_strength * 100) : 'N/A'}% | 
                    {new Date(influence.tracked_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getInfluenceStrengthColor(influence.influence_strength)}>
                  {influence.influence_strength ? `${Math.round(influence.influence_strength * 100)}%` : 'N/A'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Override Effectiveness */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Override Effectiveness Monitor
            <Button
              size="sm"
              onClick={deployOverride}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <Shield className="h-3 w-3 mr-1" />
              Deploy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {overrideEffectiveness.length === 0 ? (
            <div className="text-gray-500 text-sm">No override deployments recorded</div>
          ) : (
            overrideEffectiveness.map((override) => (
              <div key={override.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-green-300">[{override.model_name}]</span> {override.override_type}
                  </div>
                  <div className="text-xs text-green-400 mb-1">
                    Bias Score: {override.before_bias_score ? Math.round(override.before_bias_score * 100) : 'N/A'}% → {override.after_bias_score ? Math.round(override.after_bias_score * 100) : 'N/A'}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Applied: {new Date(override.applied_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  {override.before_bias_score && override.after_bias_score ? 
                    `${Math.round(((override.before_bias_score - override.after_bias_score) / override.before_bias_score) * 100)}% improved` : 
                    'deployed'
                  }
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
