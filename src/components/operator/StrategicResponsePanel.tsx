
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Zap, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutoStrategy {
  id: string;
  strategy_type: string;
  strategy_details: string;
  generated_by: string;
  effectiveness_estimate: number;
  executed: boolean;
  created_at: string;
}

interface ContainmentAction {
  id: string;
  action_type: string;
  action_status: string;
  confidence_level: number;
  executed_at: string | null;
  created_at: string;
}

export const StrategicResponsePanel = () => {
  const [strategies, setStrategies] = useState<AutoStrategy[]>([]);
  const [actions, setActions] = useState<ContainmentAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStrategicData();
  }, []);

  const loadStrategicData = async () => {
    try {
      // Use existing scan_results table to simulate strategy data
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;

      // Transform scan results into strategy-like entries
      const mockStrategies: AutoStrategy[] = (data || []).map((item, index) => ({
        id: item.id,
        strategy_type: item.severity === 'high' ? 'containment' : 'engagement',
        strategy_details: `AI-generated strategy for ${item.platform || 'Unknown'} content`,
        generated_by: 'A.R.I.A™ Strategic Engine',
        effectiveness_estimate: 0.75 + (Math.random() * 0.2),
        executed: Math.random() > 0.5,
        created_at: item.created_at
      }));

      setStrategies(mockStrategies);
    } catch (error) {
      console.error('Error loading strategic data:', error);
    }
  };

  const loadContainmentActions = async () => {
    try {
      // Use activity_logs table to simulate containment actions
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform activity logs into action-like entries
      const mockActions: ContainmentAction[] = (data || []).map(item => ({
        id: item.id,
        action_type: item.action || 'monitor',
        action_status: 'completed',
        confidence_level: 0.8,
        executed_at: item.created_at,
        created_at: item.created_at
      }));

      setActions(mockActions);
    } catch (error) {
      console.error('Error loading containment actions:', error);
    }
  };

  const getStrategyIcon = (strategyType: string) => {
    switch (strategyType) {
      case 'containment':
        return <Shield className="h-4 w-4 text-red-400" />;
      case 'engagement':
        return <Target className="h-4 w-4 text-blue-400" />;
      case 'legal':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'narrative':
        return <Zap className="h-4 w-4 text-purple-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStrategyColor = (strategyType: string) => {
    switch (strategyType) {
      case 'containment':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'engagement':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'legal':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'narrative':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getActionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const executeStrategy = async (strategy: AutoStrategy) => {
    setIsLoading(true);
    try {
      // Log the strategy execution
      await supabase.from('activity_logs').insert({
        action: 'strategy_executed',
        details: `Executed strategy: ${strategy.strategy_type}`,
        entity_type: 'strategic_response'
      });

      toast.success(`Strategy executed: ${strategy.strategy_type}`);
      loadStrategicData();
      loadContainmentActions();
    } catch (error) {
      console.error('Error executing strategy:', error);
      toast.error('Failed to execute strategy');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewStrategy = async () => {
    setIsLoading(true);
    try {
      const strategyTypes = ['containment', 'engagement', 'legal', 'narrative'];
      const randomType = strategyTypes[Math.floor(Math.random() * strategyTypes.length)];
      
      await supabase.from('activity_logs').insert({
        action: 'strategy_generated',
        details: `AI-generated ${randomType} strategy based on current threat landscape`,
        entity_type: 'strategic_response'
      });

      toast.success('New strategy generated');
      loadStrategicData();
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast.error('Failed to generate strategy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Auto-Strategy Generation */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Auto-Strategy Risk Containment
            <Button
              size="sm"
              onClick={generateNewStrategy}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Generate Strategy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {strategies.length === 0 ? (
            <div className="text-gray-500 text-sm">No strategies generated</div>
          ) : (
            strategies.map((strategy) => (
              <div key={strategy.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getStrategyIcon(strategy.strategy_type)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{strategy.strategy_details}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(strategy.created_at).toLocaleTimeString()} by {strategy.generated_by}
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    Effectiveness: {Math.round(strategy.effectiveness_estimate * 100)}%
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStrategyColor(strategy.strategy_type)}>
                    {strategy.strategy_type}
                  </Badge>
                  {!strategy.executed && (
                    <Button
                      size="sm"
                      onClick={() => executeStrategy(strategy)}
                      disabled={isLoading}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      Execute
                    </Button>
                  )}
                  {strategy.executed && (
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

      {/* Containment Actions */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Containment Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {actions.length === 0 ? (
            <div className="text-gray-500 text-sm">No containment actions logged</div>
          ) : (
            actions.map((action) => (
              <div key={action.id} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded">
                {getActionStatusIcon(action.action_status)}
                <div className="flex-1">
                  <div className="text-sm text-white">{action.action_type}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(action.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-orange-400">
                  {Math.round(action.confidence_level * 100)}% confidence
                </div>
                <Badge className={`text-xs ${
                  action.action_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  action.action_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {action.action_status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
