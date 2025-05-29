
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SelfHealingLog {
  id: string;
  related_command: string | null;
  issue_detected: string;
  correction_applied: string;
  applied_by: string;
  resolved: boolean;
  severity: string;
  created_at: string;
}

interface AutoCorrectionRecommendation {
  id: string;
  module: string;
  finding: string;
  suggested_fix: string;
  confidence_score: number;
  status: string;
  created_at: string;
}

export const SelfHealingPanel = () => {
  const [healingLogs, setHealingLogs] = useState<SelfHealingLog[]>([]);
  const [recommendations, setRecommendations] = useState<AutoCorrectionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSelfHealingData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('self-healing-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ai_self_healing_log' },
        () => loadSelfHealingData()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ai_autocorrection_recommendations' },
        () => loadRecommendations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadSelfHealingData = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_self_healing_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setHealingLogs(data || []);
    } catch (error) {
      console.error('Error loading self-healing logs:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_autocorrection_recommendations')
        .select('*')
        .eq('status', 'pending')
        .order('confidence_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
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

  const applyAutoCorrection = async (recommendation: AutoCorrectionRecommendation) => {
    setIsLoading(true);
    try {
      // Update recommendation status
      await supabase
        .from('ai_autocorrection_recommendations')
        .update({ status: 'applied' })
        .eq('id', recommendation.id);

      // Log the self-healing action
      await supabase
        .from('ai_self_healing_log')
        .insert({
          issue_detected: recommendation.finding,
          correction_applied: recommendation.suggested_fix,
          applied_by: 'Operator',
          resolved: true,
          severity: 'medium'
        });

      toast.success(`Auto-correction applied: ${recommendation.module}`);
      loadRecommendations();
      loadSelfHealingData();
    } catch (error) {
      console.error('Error applying auto-correction:', error);
      toast.error('Failed to apply auto-correction');
    } finally {
      setIsLoading(false);
    }
  };

  const skipRecommendation = async (recommendation: AutoCorrectionRecommendation) => {
    try {
      await supabase
        .from('ai_autocorrection_recommendations')
        .update({ status: 'skipped' })
        .eq('id', recommendation.id);

      toast.info('Recommendation skipped');
      loadRecommendations();
    } catch (error) {
      console.error('Error skipping recommendation:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Self-Healing Actions Log */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Self-Healing Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {healingLogs.length === 0 ? (
            <div className="text-gray-500 text-sm">No healing actions recorded</div>
          ) : (
            healingLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getSeverityIcon(log.severity)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{log.issue_detected}</div>
                  <div className="text-xs text-blue-300">{log.correction_applied}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(log.created_at).toLocaleTimeString()} by {log.applied_by}
                  </div>
                </div>
                <Badge className={getSeverityColor(log.severity)}>
                  {log.severity}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Auto-Correction Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-black border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Auto-Correction Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-40 overflow-y-auto">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                    {rec.module}
                  </Badge>
                  <span className="text-xs text-purple-400">
                    {Math.round(rec.confidence_score * 100)}% confidence
                  </span>
                </div>
                <div className="text-sm text-purple-200 mb-1">{rec.finding}</div>
                <div className="text-xs text-purple-300/70 mb-3">{rec.suggested_fix}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => applyAutoCorrection(rec)}
                    disabled={isLoading}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Apply Fix
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => skipRecommendation(rec)}
                    className="text-xs border-gray-600 text-gray-400 hover:bg-gray-800"
                  >
                    Skip
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
