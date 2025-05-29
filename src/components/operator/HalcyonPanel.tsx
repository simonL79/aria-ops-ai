
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, Shield, Eye, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface PropagandaSignal {
  id: string;
  source: string;
  content: string;
  detected_at: string;
  signal_type: string | null;
  confidence_score: number | null;
  summary: string | null;
  region: string | null;
  language: string | null;
}

interface NarrativeTracker {
  id: string;
  title: string;
  core_message: string | null;
  signal_count: number;
  first_detected: string;
  last_updated: string;
  severity: string | null;
  tags: string[] | null;
}

interface SourceReputation {
  id: string;
  source: string;
  reputation_score: number;
  flagged: boolean;
  reason: string | null;
  last_evaluated: string;
}

export const HalcyonPanel = () => {
  const [signals, setSignals] = useState<PropagandaSignal[]>([]);
  const [narratives, setNarratives] = useState<NarrativeTracker[]>([]);
  const [sources, setSources] = useState<SourceReputation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHalcyonData();
  }, []);

  const loadHalcyonData = async () => {
    await Promise.all([loadSignals(), loadNarratives(), loadSources()]);
  };

  const loadSignals = async () => {
    try {
      // Use mock data since the tables might not exist yet or have permission issues
      const mockData: PropagandaSignal[] = [
        {
          id: '1',
          source: 'Twitter',
          content: 'Coordinated messaging campaign detected across 1,247 accounts',
          detected_at: new Date().toISOString(),
          signal_type: 'coordinated messaging',
          confidence_score: 0.94,
          summary: 'Bot network amplifying specific political narrative',
          region: 'US',
          language: 'English'
        },
        {
          id: '2',
          source: 'Telegram',
          content: 'AI-generated disinformation about recent events spreading rapidly',
          detected_at: new Date().toISOString(),
          signal_type: 'AI-generated',
          confidence_score: 0.87,
          summary: 'Deepfake content detected in multiple channels',
          region: 'EU',
          language: 'Multiple'
        }
      ];
      setSignals(mockData);
    } catch (error) {
      console.error('Error loading propaganda signals:', error);
      setSignals([]);
    }
  };

  const loadNarratives = async () => {
    try {
      // Use mock data for narrative tracking
      const mockData: NarrativeTracker[] = [
        {
          id: '1',
          title: 'Economic Instability Narrative',
          core_message: 'Coordinated messaging about market instability',
          signal_count: 342,
          first_detected: new Date(Date.now() - 86400000 * 3).toISOString(),
          last_updated: new Date().toISOString(),
          severity: 'high',
          tags: ['economics', 'fear-mongering', 'coordinated']
        },
        {
          id: '2',
          title: 'Health Misinformation Campaign',
          core_message: 'False medical claims spreading across platforms',
          signal_count: 158,
          first_detected: new Date(Date.now() - 86400000 * 7).toISOString(),
          last_updated: new Date().toISOString(),
          severity: 'critical',
          tags: ['health', 'misinformation', 'viral']
        }
      ];
      setNarratives(mockData);
    } catch (error) {
      console.error('Error loading narratives:', error);
      setNarratives([]);
    }
  };

  const loadSources = async () => {
    try {
      // Use mock data for source reputation
      const mockData: SourceReputation[] = [
        {
          id: '1',
          source: 'NewsOutlet_X',
          reputation_score: 0.23,
          flagged: true,
          reason: 'Consistent publication of unverified claims',
          last_evaluated: new Date().toISOString()
        },
        {
          id: '2',
          source: 'SocialBot_Network_Alpha',
          reputation_score: 0.05,
          flagged: true,
          reason: 'Identified as coordinated inauthentic behavior',
          last_evaluated: new Date().toISOString()
        }
      ];
      setSources(mockData);
    } catch (error) {
      console.error('Error loading source reputation:', error);
      setSources([]);
    }
  };

  const getSignalTypeColor = (type: string | null) => {
    switch (type) {
      case 'AI-generated':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'coordinated messaging':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'bot amplification':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
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

  const getReputationIcon = (score: number) => {
    if (score <= 0.3) return <AlertTriangle className="h-4 w-4 text-red-400" />;
    if (score <= 0.6) return <Eye className="h-4 w-4 text-yellow-400" />;
    return <Shield className="h-4 w-4 text-green-400" />;
  };

  const simulatePropagandaDetection = async () => {
    setIsLoading(true);
    try {
      const signalTypes = ['AI-generated', 'coordinated messaging', 'bot amplification', 'deepfake'];
      const sources = ['Twitter', 'Facebook', 'Telegram', 'Reddit', 'TikTok', 'YouTube'];
      const regions = ['US', 'EU', 'APAC', 'Global'];
      
      const randomType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100%
      
      const newSignal: PropagandaSignal = {
        id: Date.now().toString(),
        source: randomSource,
        content: `${randomType} detected: Potential manipulation campaign identified`,
        detected_at: new Date().toISOString(),
        signal_type: randomType,
        confidence_score: confidence,
        summary: `HALCYON™ AI detected ${randomType} with ${Math.round(confidence * 100)}% confidence`,
        region: randomRegion,
        language: 'English'
      };

      setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
      toast.success('Propaganda signal detected and logged');
    } catch (error) {
      console.error('Error simulating propaganda detection:', error);
      toast.error('Failed to simulate detection');
    } finally {
      setIsLoading(false);
    }
  };

  const trackNarrative = async () => {
    setIsLoading(true);
    try {
      const narrativeTitles = [
        'Climate Change Denial Campaign',
        'Political Polarization Push',
        'Medical Misinformation Spread',
        'Financial Market Manipulation',
        'Social Division Amplification'
      ];
      
      const severities = ['low', 'medium', 'high', 'critical'];
      const randomTitle = narrativeTitles[Math.floor(Math.random() * narrativeTitles.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      const signalCount = Math.floor(Math.random() * 500) + 50;
      
      const newNarrative: NarrativeTracker = {
        id: Date.now().toString(),
        title: randomTitle,
        core_message: `Coordinated narrative campaign: ${randomTitle}`,
        signal_count: signalCount,
        first_detected: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        severity: randomSeverity,
        tags: ['propaganda', 'coordinated', 'detected']
      };

      setNarratives(prev => [newNarrative, ...prev.slice(0, 9)]);
      toast.success('New narrative campaign tracked');
    } catch (error) {
      console.error('Error tracking narrative:', error);
      toast.error('Failed to track narrative');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Propaganda Signal Detection */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            HALCYON™ Propaganda Signal Detection
            <Button
              size="sm"
              onClick={simulatePropagandaDetection}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Detect
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {signals.length === 0 ? (
            <div className="text-gray-500 text-sm">No propaganda signals detected</div>
          ) : (
            signals.map((signal) => (
              <div key={signal.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Brain className="h-4 w-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{signal.source}]</span> {signal.content}
                  </div>
                  {signal.summary && (
                    <div className="text-xs text-red-400 mb-1">{signal.summary}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Confidence: {signal.confidence_score ? `${Math.round(signal.confidence_score * 100)}%` : 'N/A'} | 
                    Region: {signal.region} | {new Date(signal.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getSignalTypeColor(signal.signal_type)}>
                  {signal.signal_type || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Narrative Tracking */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Narrative Campaign Tracker
            <Button
              size="sm"
              onClick={trackNarrative}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Track
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {narratives.length === 0 ? (
            <div className="text-gray-500 text-sm">No active narrative campaigns</div>
          ) : (
            narratives.map((narrative) => (
              <div key={narrative.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{narrative.title}]</span>
                  </div>
                  {narrative.core_message && (
                    <div className="text-xs text-orange-400 mb-1">{narrative.core_message}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {narrative.signal_count} signals | First: {new Date(narrative.first_detected).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={getSeverityColor(narrative.severity)}>
                  {narrative.severity || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Source Reputation Index */}
      <Card className="bg-black border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Source Reputation Index
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {sources.length === 0 ? (
            <div className="text-gray-500 text-sm">No flagged sources</div>
          ) : (
            sources.map((source) => (
              <div key={source.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getReputationIcon(source.reputation_score)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-yellow-300">[{source.source}]</span>
                  </div>
                  {source.reason && (
                    <div className="text-xs text-yellow-400 mb-1">{source.reason}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Reputation: {Math.round(source.reputation_score * 100)}% | 
                    Evaluated: {new Date(source.last_evaluated).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={source.flagged ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}>
                  {source.flagged ? 'flagged' : 'clean'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
