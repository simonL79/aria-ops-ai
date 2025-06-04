
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, MessageSquare, Scale, Users, Clock, CheckCircle } from 'lucide-react';
import { ResponseStrategy } from '@/services/strategyBrain/responseGenerator';
import { toast } from 'sonner';

interface StrategyBrainResponsesProps {
  strategies: ResponseStrategy[];
  isGenerating: boolean;
  onExecuteStrategy: (strategyId: string) => void;
}

const StrategyBrainResponses: React.FC<StrategyBrainResponsesProps> = ({
  strategies,
  isGenerating,
  onExecuteStrategy
}) => {
  const getStrategyIcon = (type: ResponseStrategy['type']) => {
    switch (type) {
      case 'defensive': return <Shield className="h-4 w-4" />;
      case 'proactive': return <Target className="h-4 w-4" />;
      case 'counter_narrative': return <MessageSquare className="h-4 w-4" />;
      case 'legal': return <Scale className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: ResponseStrategy['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleExecuteStrategy = (strategy: ResponseStrategy) => {
    toast.info(`🎯 Executing: ${strategy.title}`, {
      description: `Deploying ${strategy.actions.length} actions`
    });
    onExecuteStrategy(strategy.id);
  };

  if (isGenerating) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-corporate-accent"></div>
            <p className="text-corporate-lightGray">Generating response strategies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Response Strategies ({strategies.length})</h3>
      
      {strategies.length === 0 ? (
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-6 text-center">
            <p className="text-corporate-lightGray">No strategies generated</p>
            <p className="text-sm text-corporate-lightGray mt-2">Run pattern analysis first</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {getStrategyIcon(strategy.type)}
                    {strategy.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(strategy.priority)}>
                      {strategy.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-corporate-lightGray">
                      {strategy.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-corporate-lightGray text-sm">{strategy.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-corporate-lightGray">Timeframe:</p>
                    <p className="text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {strategy.timeframe}
                    </p>
                  </div>
                  <div>
                    <p className="text-corporate-lightGray">Resources Required:</p>
                    <p className="text-white">{strategy.resources.join(', ')}</p>
                  </div>
                </div>

                {/* Actions List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Action Plan:</p>
                  {strategy.actions.map((action, index) => (
                    <div key={index} className="bg-corporate-dark p-3 rounded border border-corporate-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-white">{action.action}</p>
                          {action.platform && (
                            <p className="text-xs text-corporate-lightGray">Platform: {action.platform}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-corporate-accent">{action.timeline}</p>
                          <p className="text-xs text-corporate-lightGray">{action.responsible}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-corporate-lightGray" />
                        <span className="text-xs text-corporate-lightGray">KPI: {action.kpi}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleExecuteStrategy(strategy)}
                  className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  Execute Strategy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrategyBrainResponses;
