
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Shield, Clock, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface StrikeEvent {
  id: string;
  entity_id: string;
  event_type: string;
  severity: string;
  triggered_at: string;
  description: string;
  source_url: string;
  is_resolved: boolean;
  resolution_strategy?: string;
  resolved_at?: string;
}

interface RecoveryTimeline {
  id: string;
  strike_event_id: string;
  stage: string;
  status: string;
  notes?: string;
  updated_at: string;
}

interface RecoveryStrategy {
  id: string;
  strategy_name: string;
  category?: string;
  description?: string;
  effectiveness_score?: number;
  last_used?: string;
}

export const StrikecorePanel = () => {
  const [strikeEvents, setStrikeEvents] = useState<StrikeEvent[]>([]);
  const [recoveryTimeline, setRecoveryTimeline] = useState<RecoveryTimeline[]>([]);
  const [recoveryStrategies, setRecoveryStrategies] = useState<RecoveryStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStrikecoreData();
  }, []);

  const loadStrikecoreData = async () => {
    await Promise.all([loadStrikeEvents(), loadRecoveryTimeline(), loadRecoveryStrategies()]);
  };

  const loadStrikeEvents = async () => {
    try {
      // Use mock data since tables are newly created
      const mockData: StrikeEvent[] = [
        {
          id: '1',
          entity_id: 'entity-1',
          event_type: 'defamation',
          severity: 'high',
          triggered_at: new Date().toISOString(),
          description: 'False allegations circulating on social media platforms',
          source_url: 'https://twitter.com/example',
          is_resolved: false,
          resolution_strategy: 'Legal counter-action initiated'
        },
        {
          id: '2',
          entity_id: 'entity-2',
          event_type: 'leak',
          severity: 'critical',
          triggered_at: new Date(Date.now() - 86400000).toISOString(),
          description: 'Confidential documents leaked to news outlets',
          source_url: 'https://news.example.com/leak',
          is_resolved: true,
          resolution_strategy: 'Crisis management protocol activated',
          resolved_at: new Date().toISOString()
        }
      ];
      setStrikeEvents(mockData);
    } catch (error) {
      console.error('Error loading strike events:', error);
      setStrikeEvents([]);
    }
  };

  const loadRecoveryTimeline = async () => {
    try {
      const mockData: RecoveryTimeline[] = [
        {
          id: '1',
          strike_event_id: '1',
          stage: 'detection',
          status: 'complete',
          notes: 'Threat detected via STRIKECORE™ monitoring',
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          strike_event_id: '1',
          stage: 'containment',
          status: 'active',
          notes: 'Legal team engaged, cease & desist prepared',
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          strike_event_id: '2',
          stage: 'post-analysis',
          status: 'complete',
          notes: 'Full impact assessment completed',
          updated_at: new Date().toISOString()
        }
      ];
      setRecoveryTimeline(mockData);
    } catch (error) {
      console.error('Error loading recovery timeline:', error);
      setRecoveryTimeline([]);
    }
  };

  const loadRecoveryStrategies = async () => {
    try {
      const mockData: RecoveryStrategy[] = [
        {
          id: '1',
          strategy_name: 'Legal Counter-Strike',
          category: 'Legal',
          description: 'Immediate legal action to counter false claims',
          effectiveness_score: 0.85,
          last_used: new Date().toISOString()
        },
        {
          id: '2',
          strategy_name: 'Narrative Rehabilitation',
          category: 'PR',
          description: 'Strategic communication to rebuild reputation',
          effectiveness_score: 0.78,
          last_used: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: '3',
          strategy_name: 'Crisis Containment Protocol',
          category: 'Emergency',
          description: 'Rapid response to contain reputation damage',
          effectiveness_score: 0.92,
          last_used: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setRecoveryStrategies(mockData);
    } catch (error) {
      console.error('Error loading recovery strategies:', error);
      setRecoveryStrategies([]);
    }
  };

  const getSeverityColor = (severity: string) => {
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

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'defamation':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'leak':
        return <Shield className="h-4 w-4 text-orange-400" />;
      case 'cancellation':
        return <Target className="h-4 w-4 text-purple-400" />;
      case 'smear':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'legal_case':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'detection':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'containment':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'recovery':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'post-analysis':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const simulateStrikeEvent = async () => {
    setIsLoading(true);
    try {
      const eventTypes = ['defamation', 'leak', 'cancellation', 'smear', 'legal_case'];
      const severities = ['low', 'medium', 'high', 'critical'];
      const descriptions = [
        'Malicious content detected on social media',
        'Negative press coverage spreading online',
        'False allegations in public forums',
        'Data breach reported in media',
        'Coordinated attack campaign identified'
      ];

      const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

      const newStrikeEvent: StrikeEvent = {
        id: Date.now().toString(),
        entity_id: 'auto-detected',
        event_type: randomEventType,
        severity: randomSeverity,
        triggered_at: new Date().toISOString(),
        description: randomDescription,
        source_url: `https://detected-source-${Date.now()}.example.com`,
        is_resolved: false,
        resolution_strategy: 'STRIKECORE™ auto-response initiated'
      };

      setStrikeEvents(prev => [newStrikeEvent, ...prev.slice(0, 9)]);
      toast.success('Strike event detected and logged');
    } catch (error) {
      console.error('Error simulating strike event:', error);
      toast.error('Failed to simulate strike event');
    } finally {
      setIsLoading(false);
    }
  };

  const deployRecoveryStrategy = async () => {
    setIsLoading(true);
    try {
      const strategies = [
        'Emergency Response Protocol',
        'Reputation Rehabilitation Campaign',
        'Legal Counter-Action',
        'Crisis Communication Strategy',
        'Stakeholder Engagement Plan'
      ];

      const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
      const effectiveness = Math.random() * 0.3 + 0.7; // 70-100%

      const newStrategy: RecoveryStrategy = {
        id: Date.now().toString(),
        strategy_name: randomStrategy,
        category: 'Auto-Deploy',
        description: `STRIKECORE™ auto-deployed strategy: ${randomStrategy}`,
        effectiveness_score: effectiveness,
        last_used: new Date().toISOString()
      };

      setRecoveryStrategies(prev => [newStrategy, ...prev.slice(0, 9)]);
      toast.success('Recovery strategy deployed successfully');
    } catch (error) {
      console.error('Error deploying recovery strategy:', error);
      toast.error('Failed to deploy recovery strategy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Strike Events Monitor */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" />
            STRIKECORE™ Reputation Strike Events
            <Button
              size="sm"
              onClick={simulateStrikeEvent}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Detect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {strikeEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No strike events detected</div>
          ) : (
            strikeEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getEventTypeIcon(event.event_type)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{event.event_type.toUpperCase()}]</span> {event.description}
                  </div>
                  {event.resolution_strategy && (
                    <div className="text-xs text-red-400 mb-1">{event.resolution_strategy}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(event.triggered_at).toLocaleTimeString()} | 
                    {event.source_url && ` Source: ${event.source_url.substring(0, 30)}...`}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <Badge className={event.is_resolved ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}>
                    {event.is_resolved ? 'resolved' : 'active'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recovery Timeline */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recovery Timeline Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {recoveryTimeline.length === 0 ? (
            <div className="text-gray-500 text-sm">No recovery timeline data</div>
          ) : (
            recoveryTimeline.map((timeline) => (
              <div key={timeline.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Clock className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{timeline.stage.toUpperCase()}]</span>
                  </div>
                  {timeline.notes && (
                    <div className="text-xs text-blue-400 mb-1">{timeline.notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(timeline.updated_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStageColor(timeline.stage)}>
                    {timeline.stage}
                  </Badge>
                  <Badge className={getStatusColor(timeline.status)}>
                    {timeline.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recovery Strategies */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Recovery Strategy Playbook
            <Button
              size="sm"
              onClick={deployRecoveryStrategy}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <Target className="h-3 w-3 mr-1" />
              Deploy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {recoveryStrategies.length === 0 ? (
            <div className="text-gray-500 text-sm">No recovery strategies available</div>
          ) : (
            recoveryStrategies.map((strategy) => (
              <div key={strategy.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-green-300">[{strategy.strategy_name}]</span>
                  </div>
                  {strategy.description && (
                    <div className="text-xs text-green-400 mb-1">{strategy.description}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Category: {strategy.category} | 
                    Effectiveness: {strategy.effectiveness_score ? `${Math.round(strategy.effectiveness_score * 100)}%` : 'N/A'} |
                    {strategy.last_used && ` Last used: ${new Date(strategy.last_used).toLocaleDateString()}`}
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  {strategy.effectiveness_score ? `${Math.round(strategy.effectiveness_score * 100)}%` : 'N/A'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
