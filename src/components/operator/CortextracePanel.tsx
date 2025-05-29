
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, MemoryStick, TrendingUp, Eye, Search, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryTrace {
  id: string;
  entity_name: string;
  memory_snapshot: any;
  memory_score: number;
  trajectory_label?: string;
  recorded_at: string;
  is_ai_generated: boolean;
}

interface InsightLink {
  id: string;
  trace_id: string;
  insight_summary?: string;
  relevance_score: number;
  created_at: string;
}

interface CortexProjection {
  id: string;
  entity_name: string;
  projection_summary?: string;
  risk_trajectory?: string;
  probability: number;
  projected_by?: string;
  projected_at: string;
}

export const CortextracePanel = () => {
  const [memoryTraces, setMemoryTraces] = useState<MemoryTrace[]>([]);
  const [insightLinks, setInsightLinks] = useState<InsightLink[]>([]);
  const [cortexProjections, setCortexProjections] = useState<CortexProjection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCortextraceData();
  }, []);

  const loadCortextraceData = async () => {
    await Promise.all([loadMemoryTraces(), loadInsightLinks(), loadCortexProjections()]);
  };

  const loadMemoryTraces = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: MemoryTrace[] = [
        {
          id: '1',
          entity_name: 'Global Tech Corp',
          memory_snapshot: { reputation: 'positive', sentiment: 0.8, key_events: ['product_launch', 'positive_review'] },
          memory_score: 0.85,
          trajectory_label: 'positive_momentum',
          recorded_at: new Date().toISOString(),
          is_ai_generated: true
        },
        {
          id: '2',
          entity_name: 'Financial Services Ltd',
          memory_snapshot: { reputation: 'neutral', sentiment: 0.3, key_events: ['data_concern', 'regulatory_notice'] },
          memory_score: 0.45,
          trajectory_label: 'declining_trust',
          recorded_at: new Date(Date.now() - 3600000).toISOString(),
          is_ai_generated: true
        },
        {
          id: '3',
          entity_name: 'Innovation Startup',
          memory_snapshot: { reputation: 'emerging', sentiment: 0.6, key_events: ['funding_round', 'media_coverage'] },
          memory_score: 0.72,
          trajectory_label: 'growth_phase',
          recorded_at: new Date(Date.now() - 7200000).toISOString(),
          is_ai_generated: false
        }
      ];
      setMemoryTraces(mockData);
    } catch (error) {
      console.error('Error loading memory traces:', error);
      setMemoryTraces([]);
    }
  };

  const loadInsightLinks = async () => {
    try {
      const mockData: InsightLink[] = [
        {
          id: '1',
          trace_id: '1',
          insight_summary: 'Strong positive correlation between product launches and sentiment',
          relevance_score: 0.92,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          trace_id: '2',
          insight_summary: 'Regulatory concerns show consistent impact on memory trajectory',
          relevance_score: 0.88,
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          trace_id: '3',
          insight_summary: 'Growth-phase entities exhibit volatile but upward memory patterns',
          relevance_score: 0.76,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setInsightLinks(mockData);
    } catch (error) {
      console.error('Error loading insight links:', error);
      setInsightLinks([]);
    }
  };

  const loadCortexProjections = async () => {
    try {
      const mockData: CortexProjection[] = [
        {
          id: '1',
          entity_name: 'Global Tech Corp',
          projection_summary: 'Continued positive trajectory with expanding market presence',
          risk_trajectory: 'low_risk_sustained_growth',
          probability: 0.84,
          projected_by: 'CORTEXTRACE™ AI',
          projected_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Financial Services Ltd',
          projection_summary: 'Potential reputation recovery through transparency initiatives',
          risk_trajectory: 'moderate_risk_recovery_path',
          probability: 0.67,
          projected_by: 'CORTEXTRACE™ AI',
          projected_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          entity_name: 'Innovation Startup',
          projection_summary: 'High volatility period with breakthrough potential',
          risk_trajectory: 'high_variance_opportunity',
          probability: 0.73,
          projected_by: 'Strategic Analysis Engine',
          projected_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setCortexProjections(mockData);
    } catch (error) {
      console.error('Error loading cortex projections:', error);
      setCortexProjections([]);
    }
  };

  const getMemoryScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (score >= 0.6) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (score >= 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getTrajectoryColor = (trajectory?: string) => {
    switch (trajectory) {
      case 'positive_momentum':
      case 'growth_phase':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'declining_trust':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'recovery_path':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (probability >= 0.6) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (probability >= 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const recordMemoryTrace = async () => {
    setIsLoading(true);
    try {
      const entities = ['Tech Innovation Corp', 'Global Finance Group', 'Emerging Brand Ltd', 'Healthcare Solutions'];
      const trajectories = ['positive_momentum', 'stabilizing', 'declining_trust', 'growth_phase'];
      
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomTrajectory = trajectories[Math.floor(Math.random() * trajectories.length)];
      const randomScore = Math.random() * 0.4 + 0.4; // Between 0.4 and 0.8
      
      const newTrace: MemoryTrace = {
        id: Date.now().toString(),
        entity_name: randomEntity,
        memory_snapshot: {
          reputation: randomTrajectory.includes('positive') ? 'positive' : 'neutral',
          sentiment: randomScore,
          key_events: ['analyzed_event', 'memory_update']
        },
        memory_score: parseFloat(randomScore.toFixed(2)),
        trajectory_label: randomTrajectory,
        recorded_at: new Date().toISOString(),
        is_ai_generated: true
      };

      setMemoryTraces(prev => [newTrace, ...prev.slice(0, 9)]);
      toast.success('Memory trace recorded by CORTEXTRACE™');
    } catch (error) {
      console.error('Error recording memory trace:', error);
      toast.error('Failed to record memory trace');
    } finally {
      setIsLoading(false);
    }
  };

  const generateProjection = async () => {
    setIsLoading(true);
    try {
      const entities = ['Enterprise Solutions', 'Digital Platform Inc', 'Market Leader Corp'];
      const trajectories = ['low_risk_sustained_growth', 'moderate_risk_recovery_path', 'high_variance_opportunity'];
      const summaries = [
        'Strategic positioning indicates continued market expansion',
        'Recovery metrics suggest positive trajectory realignment',
        'High-potential scenario with calculated risk factors'
      ];
      
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomTrajectory = trajectories[Math.floor(Math.random() * trajectories.length)];
      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
      const randomProbability = Math.random() * 0.4 + 0.5; // Between 0.5 and 0.9
      
      const newProjection: CortexProjection = {
        id: Date.now().toString(),
        entity_name: randomEntity,
        projection_summary: randomSummary,
        risk_trajectory: randomTrajectory,
        probability: parseFloat(randomProbability.toFixed(2)),
        projected_by: 'CORTEXTRACE™ AI',
        projected_at: new Date().toISOString()
      };

      setCortexProjections(prev => [newProjection, ...prev.slice(0, 9)]);
      toast.success('Strategic projection generated');
    } catch (error) {
      console.error('Error generating projection:', error);
      toast.error('Failed to generate projection');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTrajectory = async () => {
    setIsLoading(true);
    try {
      const totalTraces = memoryTraces.length;
      const aiGenerated = memoryTraces.filter(trace => trace.is_ai_generated).length;
      const avgMemoryScore = memoryTraces.reduce((sum, trace) => sum + trace.memory_score, 0) / totalTraces;
      const totalProjections = cortexProjections.length;
      
      toast.success(
        `CORTEXTRACE™ Analysis: ${totalTraces} memory traces, ${aiGenerated} AI-generated, avg score: ${avgMemoryScore.toFixed(2)}, ${totalProjections} projections`
      );
    } catch (error) {
      console.error('Error analyzing trajectory:', error);
      toast.error('Failed to analyze trajectory data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Memory Trace Monitoring */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            CORTEXTRACE™ Memory Evolution
            <Button
              size="sm"
              onClick={recordMemoryTrace}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <MemoryStick className="h-3 w-3 mr-1" />
              Record
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {memoryTraces.length === 0 ? (
            <div className="text-gray-500 text-sm">No memory traces recorded</div>
          ) : (
            memoryTraces.map((trace) => (
              <div key={trace.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Brain className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{trace.entity_name}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    Trajectory: {trace.trajectory_label || 'unclassified'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Recorded: {new Date(trace.recorded_at).toLocaleTimeString()} | 
                    {trace.is_ai_generated ? ' AI Generated' : ' Manual'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getMemoryScoreColor(trace.memory_score)}>
                    {(trace.memory_score * 100).toFixed(0)}%
                  </Badge>
                  <Badge className={getTrajectoryColor(trace.trajectory_label)}>
                    {trace.trajectory_label?.replace('_', ' ') || 'pending'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Strategic Insight Links */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Search className="h-4 w-4" />
            Strategic Insight Correlation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {insightLinks.length === 0 ? (
            <div className="text-gray-500 text-sm">No insights correlated</div>
          ) : (
            insightLinks.map((insight) => (
              <div key={insight.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Eye className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-xs text-cyan-400 mb-1">
                    {insight.insight_summary?.substring(0, 60)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    Trace ID: {insight.trace_id} | {new Date(insight.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getMemoryScoreColor(insight.relevance_score)}>
                  {(insight.relevance_score * 100).toFixed(0)}%
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Strategic Projections */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Future Trajectory Projections
            <Button
              size="sm"
              onClick={generateProjection}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {cortexProjections.length === 0 ? (
            <div className="text-gray-500 text-sm">No projections generated</div>
          ) : (
            cortexProjections.map((projection) => (
              <div key={projection.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{projection.entity_name}]</span>
                  </div>
                  <div className="text-xs text-orange-400 mb-1">
                    {projection.projection_summary?.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    By: {projection.projected_by} | {new Date(projection.projected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getProbabilityColor(projection.probability)}>
                    {(projection.probability * 100).toFixed(0)}%
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-xs">
                    {projection.risk_trajectory?.replace(/_/g, ' ') || 'unknown'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Trajectory Analysis Engine
            <Button
              size="sm"
              onClick={analyzeTrajectory}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{memoryTraces.length}</div>
              <div className="text-xs text-gray-500">Memory Traces</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{insightLinks.length}</div>
              <div className="text-xs text-gray-500">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{cortexProjections.length}</div>
              <div className="text-xs text-gray-500">Projections</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
