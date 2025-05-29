import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, XCircle, Lightbulb, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SelfHealingPanel } from './SelfHealingPanel';
import { StrategicResponsePanel } from './StrategicResponsePanel';
import { AletheiaTruthPanel } from './AletheiaTruthPanel';
import { ErisPanel } from './ErisPanel';
import { SentiencePanel } from './SentiencePanel';
import { PanopticaPanel } from './PanopticaPanel';
import { NexusPanel } from './NexusPanel';
import { SentinelShieldPanel } from './SentinelShieldPanel';
import { PropheticVisionPanel } from './PropheticVisionPanel';
import { CitadelPanel } from './CitadelPanel';
import { MirrorspacePanel } from './MirrorspacePanel';
import { ShieldhavenPanel } from './ShieldhavenPanel';
import { HalcyonPanel } from './HalcyonPanel';
import { IronvaultPanel } from './IronvaultPanel';
import { CerebraPanel } from './CerebraPanel';
import { StrikecorePanel } from './StrikecorePanel';
import { ShadowvaultPanel } from './ShadowvaultPanel';
import { VoxtracePanel } from './VoxtracePanel';
import { PolarisPanel } from './PolarisPanel';

interface CommandFeedback {
  id: string;
  command_id: string;
  execution_status: string;
  summary: string;
  error_message?: string;
  evaluated_at: string;
  created_by: string;
}

interface RemediationSuggestion {
  id: string;
  command_id: string;
  suggestion: string;
  rationale: string;
  proposed_by: string;
  created_at: string;
}

interface FeedbackPanelProps {
  commandHistory: any[];
}

export const FeedbackPanel = ({ commandHistory }: FeedbackPanelProps) => {
  const [feedback, setFeedback] = useState<CommandFeedback[]>([]);
  const [suggestions, setSuggestions] = useState<RemediationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFeedbackData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('feedback-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'command_response_feedback' },
        () => loadFeedbackData()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'command_remediation_suggestions' },
        () => loadRemediationSuggestions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadFeedbackData = async () => {
    try {
      const { data, error } = await supabase
        .from('command_response_feedback')
        .select('*')
        .order('evaluated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const loadRemediationSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('command_remediation_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'fail':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const applySuggestion = async (suggestion: RemediationSuggestion) => {
    // This would trigger the suggested command or action
    toast.info(`Applied suggestion: ${suggestion.suggestion}`);
  };

  return (
    <div className="space-y-4">
      {/* POLARIS™ Counter-Narrative Generator & Deployment Hub Panel */}
      <PolarisPanel />

      {/* VOXTRACE™ Audio Threat Detection & Forensic Logging Panel */}
      <VoxtracePanel />

      {/* SHADOWVAULT™ Dark Web Threat Monitoring & Risk Indexing Panel */}
      <ShadowvaultPanel />

      {/* STRIKECORE™ Reputation Strike & Recovery Analytics Panel */}
      <StrikecorePanel />

      {/* CEREBRA™ AI Bias & Influence Detection Engine Panel */}
      <CerebraPanel />

      {/* IRONVAULT™ Document Leak & Surveillance System Panel */}
      <IronvaultPanel />

      {/* HALCYON™ Media Manipulation & Propaganda Detection Panel */}
      <HalcyonPanel />

      {/* SHIELDHAVEN™ Legal & Regulatory AI Defense Panel */}
      <ShieldhavenPanel />

      {/* MIRRORSPACE™ Behavioral Surveillance & Influence Index Panel */}
      <MirrorspacePanel />

      {/* CITADEL™ Infrastructure Reinforcement & Policy Vaulting Panel */}
      <CitadelPanel />

      {/* PROPHETIC VISION™ Predictive Threat Intelligence Panel */}
      <PropheticVisionPanel />

      {/* SENTINEL SHIELD™ Autonomous Perimeter Defense Panel */}
      <SentinelShieldPanel />

      {/* NEXUS CORE™ Inter-Agent Collaboration Panel */}
      <NexusPanel />

      {/* PANOPTICA™ Sensor Fusion Panel */}
      <PanopticaPanel />

      {/* Self-Healing Panel */}
      <SelfHealingPanel />

      {/* Strategic Response Panel */}
      <StrategicResponsePanel />

      {/* Aletheia Truth Panel */}
      <AletheiaTruthPanel />

      {/* Eris Adversarial Defense Panel */}
      <ErisPanel />

      {/* Sentience Loop Panel */}
      <SentiencePanel />

      {/* Command Execution Feedback */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Command Execution Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {feedback.length === 0 ? (
            <div className="text-gray-500 text-sm">No feedback data available</div>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                {getStatusIcon(item.execution_status)}
                <div className="flex-1">
                  <div className="text-sm text-white">{item.summary}</div>
                  {item.error_message && (
                    <div className="text-xs text-red-400 mt-1">{item.error_message}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(item.evaluated_at).toLocaleTimeString()} by {item.created_by}
                  </div>
                </div>
                <Badge className={getStatusColor(item.execution_status)}>
                  {item.execution_status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Remediation Suggestions */}
      {suggestions.length > 0 && (
        <Card className="bg-black border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Remediation Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-40 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <div className="text-sm text-yellow-200 mb-2">{suggestion.suggestion}</div>
                <div className="text-xs text-yellow-400/70 mb-2">{suggestion.rationale}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">by {suggestion.proposed_by}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                    className="text-xs bg-yellow-600 hover:bg-yellow-700"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
