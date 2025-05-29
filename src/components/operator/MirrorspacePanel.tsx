
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Activity, Zap, Users, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MirrorIndex {
  id: string;
  entity_name: string;
  source: string;
  narrative_vector: any;
  sentiment_shift: string | null;
  influence_score: number | null;
  detected_at: string;
}

interface BehaviorTrace {
  id: string;
  entity_name: string;
  platform: string | null;
  interaction_type: string | null;
  content: string | null;
  influence_vector: any | null;
  created_at: string;
}

interface MirrorSnapshot {
  id: string;
  entity_name: string;
  snapshot_data: any;
  taken_at: string;
}

export const MirrorspacePanel = () => {
  const [mirrorIndex, setMirrorIndex] = useState<MirrorIndex[]>([]);
  const [behaviorTraces, setBehaviorTraces] = useState<BehaviorTrace[]>([]);
  const [snapshots, setSnapshots] = useState<MirrorSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMirrorspaceData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('mirrorspace-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'influence_mirror_index' },
        () => loadMirrorIndex()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'behavior_trace_logs' },
        () => loadBehaviorTraces()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mirrorspace_snapshots' },
        () => loadSnapshots()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadMirrorspaceData = async () => {
    await Promise.all([loadMirrorIndex(), loadBehaviorTraces(), loadSnapshots()]);
  };

  const loadMirrorIndex = async () => {
    try {
      const { data, error } = await supabase
        .from('influence_mirror_index')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setMirrorIndex(data || []);
    } catch (error) {
      console.error('Error loading mirror index:', error);
    }
  };

  const loadBehaviorTraces = async () => {
    try {
      const { data, error } = await supabase
        .from('behavior_trace_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBehaviorTraces(data || []);
    } catch (error) {
      console.error('Error loading behavior traces:', error);
    }
  };

  const loadSnapshots = async () => {
    try {
      const { data, error } = await supabase
        .from('mirrorspace_snapshots')
        .select('*')
        .order('taken_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSnapshots(data || []);
    } catch (error) {
      console.error('Error loading snapshots:', error);
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'neutral':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getInfluenceIcon = (score: number | null) => {
    if (!score) return <Activity className="h-4 w-4 text-gray-400" />;
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-red-400" />;
    if (score >= 40) return <Target className="h-4 w-4 text-yellow-400" />;
    return <Users className="h-4 w-4 text-green-400" />;
  };

  const captureSnapshot = async () => {
    if (mirrorIndex.length === 0) {
      toast.error('No mirror index data available to snapshot');
      return;
    }

    setIsLoading(true);
    try {
      const randomEntity = mirrorIndex[Math.floor(Math.random() * mirrorIndex.length)];
      const snapshotData = {
        sentiment: randomEntity.sentiment_shift || 'neutral',
        influence_score: randomEntity.influence_score,
        dominant_narrative: randomEntity.narrative_vector?.keywords?.[0] || 'unknown',
        behavioral_pattern: 'mirror_analysis',
        snapshot_type: 'behavioral_surveillance'
      };
      
      await supabase
        .from('mirrorspace_snapshots')
        .insert({
          entity_name: randomEntity.entity_name,
          snapshot_data: snapshotData
        });

      toast.success('Behavioral snapshot captured');
      loadSnapshots();
    } catch (error) {
      console.error('Error capturing snapshot:', error);
      toast.error('Failed to capture snapshot');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBehaviorTrace = async () => {
    setIsLoading(true);
    try {
      const platforms = ['Twitter', 'Reddit', 'LinkedIn', 'Facebook', 'TikTok'];
      const interactionTypes = ['mention', 'comment', 'share', 'post', 'reaction'];
      const entities = ['TechCorp', 'Global Brand', 'Startup Inc', 'Media Giant', 'Finance Co'];
      
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const randomInteraction = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const sentimentScore = Math.random() * 2 - 1; // -1 to 1
      
      await supabase
        .from('behavior_trace_logs')
        .insert({
          entity_name: randomEntity,
          platform: randomPlatform,
          interaction_type: randomInteraction,
          content: `Behavioral trace: ${randomInteraction} detected on ${randomPlatform}`,
          influence_vector: {
            sentiment: sentimentScore,
            reach: Math.floor(Math.random() * 5000) + 100,
            engagement_rate: Math.random() * 0.1
          }
        });

      toast.success('Behavior trace logged');
      loadBehaviorTraces();
    } catch (error) {
      console.error('Error simulating behavior trace:', error);
      toast.error('Failed to log behavior trace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Influence Mirror Index */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            MIRRORSPACE™ Influence Index
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {mirrorIndex.length === 0 ? (
            <div className="text-gray-500 text-sm">No mirror index data available</div>
          ) : (
            mirrorIndex.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getInfluenceIcon(item.influence_score)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{item.entity_name}]</span> via {item.source}
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    Influence Score: {item.influence_score?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getSentimentColor(item.sentiment_shift)}>
                  {item.sentiment_shift || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Behavior Trace Logs */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Behavioral Surveillance Traces
            <Button
              size="sm"
              onClick={simulateBehaviorTrace}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Log Trace
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {behaviorTraces.length === 0 ? (
            <div className="text-gray-500 text-sm">No behavior traces available</div>
          ) : (
            behaviorTraces.map((trace) => (
              <div key={trace.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Activity className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-cyan-300">[{trace.entity_name}]</span> {trace.interaction_type} on {trace.platform}
                  </div>
                  {trace.content && (
                    <div className="text-xs text-cyan-400 mb-1">{trace.content}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(trace.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  {trace.platform}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Surveillance Snapshots */}
      <Card className="bg-black border-indigo-500/30">
        <CardHeader>
          <CardTitle className="text-indigo-400 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Surveillance Snapshots
            <Button
              size="sm"
              onClick={captureSnapshot}
              disabled={isLoading}
              className="ml-auto text-xs bg-indigo-600 hover:bg-indigo-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Capture
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {snapshots.length === 0 ? (
            <div className="text-gray-500 text-sm">No snapshots available</div>
          ) : (
            snapshots.map((snapshot) => (
              <div key={snapshot.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Target className="h-4 w-4 text-indigo-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-indigo-300">[{snapshot.entity_name}]</span> Snapshot
                  </div>
                  <div className="text-xs text-indigo-400 mb-1">
                    Pattern: {snapshot.snapshot_data?.behavioral_pattern || 'unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(snapshot.taken_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getSentimentColor(snapshot.snapshot_data?.sentiment)}>
                  {snapshot.snapshot_data?.sentiment || 'neutral'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
