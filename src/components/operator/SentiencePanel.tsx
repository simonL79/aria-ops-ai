
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, Settings, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MemoryLog {
  id: string;
  context: string;
  reflection: string;
  insight_level: number;
  timestamp: string;
  created_by: string | null;
}

interface RecalibrationDecision {
  id: string;
  memory_log_id: string;
  recalibration_type: string | null;
  triggered_by: string | null;
  notes: string | null;
  executed: boolean | null;
  created_at: string;
}

export const SentiencePanel = () => {
  const [memoryLogs, setMemoryLogs] = useState<MemoryLog[]>([]);
  const [recalibrations, setRecalibrations] = useState<RecalibrationDecision[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSentienceData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('sentience-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sentience_memory_log' },
        () => loadMemoryLogs()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sentience_recalibration_decisions' },
        () => loadRecalibrations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadSentienceData = async () => {
    await Promise.all([loadMemoryLogs(), loadRecalibrations()]);
  };

  const loadMemoryLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('sentience_memory_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(15);

      if (error) throw error;
      setMemoryLogs(data || []);
    } catch (error) {
      console.error('Error loading memory logs:', error);
    }
  };

  const loadRecalibrations = async () => {
    try {
      const { data, error } = await supabase
        .from('sentience_recalibration_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRecalibrations(data || []);
    } catch (error) {
      console.error('Error loading recalibrations:', error);
    }
  };

  const getInsightIcon = (level: number) => {
    if (level >= 90) return <Brain className="h-4 w-4 text-purple-400" />;
    if (level >= 70) return <Lightbulb className="h-4 w-4 text-yellow-400" />;
    return <Settings className="h-4 w-4 text-blue-400" />;
  };

  const getInsightColor = (level: number) => {
    if (level >= 90) return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    if (level >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (level >= 50) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const getRecalibrationType = (type: string | null) => {
    switch (type) {
      case 'bias_correction':
        return <RefreshCw className="h-4 w-4 text-green-400" />;
      case 'priority_shift':
        return <Zap className="h-4 w-4 text-orange-400" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const executeRecalibration = async (recalibration: RecalibrationDecision) => {
    setIsLoading(true);
    try {
      await supabase
        .from('sentience_recalibration_decisions')
        .update({ executed: true })
        .eq('id', recalibration.id);

      toast.success(`Recalibration executed: ${recalibration.recalibration_type}`);
      loadRecalibrations();
    } catch (error) {
      console.error('Error executing recalibration:', error);
      toast.error('Failed to execute recalibration');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewReflection = async () => {
    setIsLoading(true);
    try {
      const contexts = [
        'Analysis of cross-platform sentiment convergence patterns',
        'Post-incident response effectiveness evaluation',
        'Predictive accuracy assessment for threat escalation',
        'Memory retention optimization for similar threat vectors'
      ];
      
      const reflections = [
        'Pattern recognition improved through iterative learning cycles. Recommend enhanced pre-positioning.',
        'Response timing critical for narrative control. Implement faster trigger mechanisms.',
        'Correlation between entity mentions and threat materialization requires deeper analysis.',
        'Memory consolidation effective for threat prediction accuracy improvements.'
      ];

      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      const randomReflection = reflections[Math.floor(Math.random() * reflections.length)];
      
      await supabase
        .from('sentience_memory_log')
        .insert({
          context: randomContext,
          reflection: randomReflection,
          insight_level: Math.floor(Math.random() * 30) + 70, // 70-100 range
          created_by: 'A.R.I.A™ Sentience Engine'
        });

      toast.success('New reflection generated');
      loadMemoryLogs();
    } catch (error) {
      console.error('Error generating reflection:', error);
      toast.error('Failed to generate reflection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Memory Reflections */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sentience Loop™ Memory Reflections
            <Button
              size="sm"
              onClick={generateNewReflection}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Generate Reflection
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {memoryLogs.length === 0 ? (
            <div className="text-gray-500 text-sm">No memory reflections recorded</div>
          ) : (
            memoryLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getInsightIcon(log.insight_level)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{log.context}</div>
                  <div className="text-xs text-purple-300 mb-1">{log.reflection}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()} by {log.created_by}
                  </div>
                </div>
                <Badge className={getInsightColor(log.insight_level)}>
                  {log.insight_level}% insight
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recalibration Decisions */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            AI Recalibration Decisions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {recalibrations.length === 0 ? (
            <div className="text-gray-500 text-sm">No recalibration decisions available</div>
          ) : (
            recalibrations.map((recal) => (
              <div key={recal.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getRecalibrationType(recal.recalibration_type)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1 capitalize">
                    {recal.recalibration_type?.replace('_', ' ') || 'Unknown Type'}
                  </div>
                  {recal.notes && (
                    <div className="text-xs text-cyan-300 mb-1">{recal.notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Triggered by: {recal.triggered_by || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(recal.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!recal.executed ? (
                    <Button
                      size="sm"
                      onClick={() => executeRecalibration(recal)}
                      disabled={isLoading}
                      className="text-xs bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Execute
                    </Button>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      Executed
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
