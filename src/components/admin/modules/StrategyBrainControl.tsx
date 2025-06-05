import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, PlayCircle, PauseCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Strategy {
  id: string;
  entity_name: string;
  strategy_type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  actions: any[];
  resources: string[];
  timeframe?: string;
  executed_at?: string;
  execution_result?: any;
  updated_at: string;
}

const StrategyBrainControl = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from('strategy_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedStrategies: Strategy[] = (data || []).map(item => ({
        id: item.id,
        entity_name: item.entity_name,
        strategy_type: item.strategy_type,
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status,
        created_at: item.created_at,
        actions: Array.isArray(item.actions) ? item.actions : [],
        resources: Array.isArray(item.resources) ? item.resources : [],
        timeframe: item.timeframe,
        executed_at: item.executed_at,
        execution_result: item.execution_result,
        updated_at: item.updated_at
      }));

      setStrategies(transformedStrategies);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const generateNewStrategy = async () => {
    setIsGenerating(true);
    try {
      // Trigger strategy generation based on recent threats
      const { data: recentThreats } = await supabase
        .from('scan_results')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentThreats && recentThreats.length > 0) {
        // Generate strategy for the most recent threat
        const threat = recentThreats[0];
        
        const newStrategy = {
          entity_name: threat.detected_entities?.[0] || 'Unknown Entity',
          strategy_id: `strategy-${Date.now()}`,
          strategy_type: 'defensive',
          title: 'Automated Threat Response',
          description: `Defensive strategy for ${threat.severity} severity threat on ${threat.platform}`,
          priority: threat.severity === 'critical' ? 'critical' : 'high',
          timeframe: '24 hours',
          actions: [
            {
              action: 'Monitor threat evolution',
              timeline: '1 hour',
              responsible: 'AI System',
              kpi: 'Threat status tracking'
            },
            {
              action: 'Deploy counter-narrative content',
              timeline: '4 hours',
              responsible: 'Content Team',
              kpi: 'Positive sentiment increase'
            }
          ],
          resources: ['AI System', 'Content Team'],
          status: 'pending'
        };

        const { error } = await supabase
          .from('strategy_responses')
          .insert([newStrategy]);

        if (error) throw error;

        toast.success('New strategy generated successfully');
        loadStrategies();
      } else {
        toast.info('No new threats detected - strategy generation skipped');
      }
    } catch (error) {
      toast.error('Strategy generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const executeStrategy = async (strategyId: string) => {
    try {
      const { error } = await supabase
        .from('strategy_responses')
        .update({ 
          status: 'executing',
          executed_at: new Date().toISOString()
        })
        .eq('id', strategyId);

      if (error) throw error;

      toast.success('Strategy execution initiated');
      loadStrategies();
    } catch (error) {
      toast.error('Strategy execution failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'executing': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const strategyCounts = {
    total: strategies.length,
    pending: strategies.filter(s => s.status === 'pending').length,
    executing: strategies.filter(s => s.status === 'executing').length,
    completed: strategies.filter(s => s.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Strategy Brain Control
          </h2>
          <p className="text-muted-foreground">AI-powered response strategy generation and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={generateNewStrategy} disabled={isGenerating}>
            <Zap className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Strategy'}
          </Button>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyCounts.total}</div>
            <p className="text-xs text-muted-foreground">Generated by AI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <PauseCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{strategyCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executing</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{strategyCounts.executing}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{strategyCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully executed</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategies List */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Response Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          {strategies.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No strategies generated yet</p>
              <p className="text-sm text-muted-foreground">AI will generate strategies based on detected threats</p>
            </div>
          ) : (
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{strategy.title}</h3>
                          <Badge className={getStatusColor(strategy.status)}>
                            {strategy.status.toUpperCase()}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(strategy.priority)}`}>
                            {strategy.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Entity: {strategy.entity_name} • Type: {strategy.strategy_type} • 
                          Created: {new Date(strategy.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {strategy.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => executeStrategy(strategy.id)}
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {strategy.actions && strategy.actions.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium mb-2">Planned Actions:</div>
                      <div className="space-y-1">
                        {strategy.actions.slice(0, 3).map((action: any, index: number) => (
                          <div key={index} className="text-muted-foreground">
                            • {action.action} ({action.timeline})
                          </div>
                        ))}
                        {strategy.actions.length > 3 && (
                          <div className="text-muted-foreground">
                            ... and {strategy.actions.length - 3} more actions
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBrainControl;
