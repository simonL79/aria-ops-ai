
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Sword, AlertTriangle, Target, Zap, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AttackSimulation {
  id: string;
  attack_vector: string;
  target_entity: string | null;
  origin_source: string | null;
  scenario_description: string | null;
  threat_score: number | null;
  created_by: string | null;
  created_at: string;
}

interface ResponseStrategy {
  id: string;
  simulation_id: string;
  strategy_type: string | null;
  gpt_recommendation: string | null;
  effectiveness_score: number | null;
  executed: boolean | null;
  created_at: string;
}

export const ErisPanel = () => {
  const [simulations, setSimulations] = useState<AttackSimulation[]>([]);
  const [strategies, setStrategies] = useState<ResponseStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadErisData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('eris-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'eris_attack_simulations' },
        () => loadErisData()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'eris_response_strategies' },
        () => loadResponseStrategies()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadErisData = async () => {
    try {
      const { data, error } = await supabase
        .from('eris_attack_simulations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setSimulations(data || []);
    } catch (error) {
      console.error('Error loading attack simulations:', error);
    }
  };

  const loadResponseStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from('eris_response_strategies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setStrategies(data || []);
    } catch (error) {
      console.error('Error loading response strategies:', error);
    }
  };

  const getThreatIcon = (attackVector: string) => {
    switch (attackVector) {
      case 'sentiment_inversion':
        return <Target className="h-4 w-4 text-red-400" />;
      case 'disinfo_campaign':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'phishing':
        return <Shield className="h-4 w-4 text-yellow-400" />;
      default:
        return <Sword className="h-4 w-4 text-purple-400" />;
    }
  };

  const getThreatColor = (threatScore: number | null) => {
    if (!threatScore) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (threatScore >= 80) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (threatScore >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (threatScore >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getStrategyIcon = (strategyType: string | null) => {
    switch (strategyType) {
      case 'counter_narrative':
        return <Target className="h-4 w-4 text-blue-400" />;
      case 'deplatform_request':
        return <Shield className="h-4 w-4 text-red-400" />;
      case 'internal_alert':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Zap className="h-4 w-4 text-purple-400" />;
    }
  };

  const executeStrategy = async (strategy: ResponseStrategy) => {
    setIsLoading(true);
    try {
      await supabase
        .from('eris_response_strategies')
        .update({ executed: true })
        .eq('id', strategy.id);

      toast.success(`Strategy executed: ${strategy.strategy_type}`);
      loadResponseStrategies();
    } catch (error) {
      console.error('Error executing strategy:', error);
      toast.error('Failed to execute strategy');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerNewSimulation = async () => {
    setIsLoading(true);
    try {
      const attackVectors = ['sentiment_inversion', 'disinfo_campaign', 'phishing', 'social_engineering'];
      const randomVector = attackVectors[Math.floor(Math.random() * attackVectors.length)];
      
      await supabase
        .from('eris_attack_simulations')
        .insert({
          attack_vector: randomVector,
          origin_source: 'https://simulation.eris.ai',
          scenario_description: `Simulated ${randomVector} attack scenario for defensive training`,
          threat_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
          created_by: 'Eris™ Simulation Engine'
        });

      toast.success('New attack simulation generated');
      loadErisData();
    } catch (error) {
      console.error('Error generating simulation:', error);
      toast.error('Failed to generate simulation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Attack Simulations */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Eris™ Attack Simulations
            <Button
              size="sm"
              onClick={triggerNewSimulation}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Play className="h-3 w-3 mr-1" />
              New Simulation
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {simulations.length === 0 ? (
            <div className="text-gray-500 text-sm">No attack simulations recorded</div>
          ) : (
            simulations.map((simulation) => (
              <div key={simulation.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getThreatIcon(simulation.attack_vector)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1 capitalize">
                    {simulation.attack_vector.replace('_', ' ')}
                  </div>
                  {simulation.scenario_description && (
                    <div className="text-xs text-red-300 mb-1">
                      {simulation.scenario_description}
                    </div>
                  )}
                  {simulation.origin_source && (
                    <div className="text-xs text-gray-400 mb-1">
                      Source: {simulation.origin_source}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(simulation.created_at).toLocaleTimeString()} by {simulation.created_by}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getThreatColor(simulation.threat_score)}>
                    {simulation.threat_score || 0}% threat
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Response Strategies */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Defense Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {strategies.length === 0 ? (
            <div className="text-gray-500 text-sm">No defense strategies available</div>
          ) : (
            strategies.map((strategy) => (
              <div key={strategy.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getStrategyIcon(strategy.strategy_type)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1 capitalize">
                    {strategy.strategy_type?.replace('_', ' ') || 'Unknown Strategy'}
                  </div>
                  {strategy.gpt_recommendation && (
                    <div className="text-xs text-blue-300 mb-1">
                      {strategy.gpt_recommendation}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(strategy.created_at).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    Effectiveness: {Math.round((strategy.effectiveness_score || 0))}%
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!strategy.executed ? (
                    <Button
                      size="sm"
                      onClick={() => executeStrategy(strategy)}
                      disabled={isLoading}
                      className="text-xs bg-blue-600 hover:bg-blue-700"
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
