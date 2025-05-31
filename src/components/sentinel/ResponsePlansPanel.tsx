
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Play, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { SentinelService } from '@/services/sentinel/sentinelService';
import { useAuth } from '@/hooks/useAuth';
import type { SentinelClient, SentinelThreatDiscovery, SentinelResponsePlan } from '@/types/sentinel';

interface ResponsePlansPanelProps {
  client: SentinelClient;
}

export const ResponsePlansPanel = ({ client }: ResponsePlansPanelProps) => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<SentinelThreatDiscovery[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<SentinelThreatDiscovery | null>(null);
  const [responsePlans, setResponsePlans] = useState<SentinelResponsePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [executingPlan, setExecutingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadThreats();
  }, [client.id]);

  useEffect(() => {
    if (selectedThreat) {
      loadResponsePlans(selectedThreat.id);
    }
  }, [selectedThreat]);

  const loadThreats = async () => {
    setIsLoading(true);
    try {
      const threatsData = await SentinelService.getClientThreats(client.id);
      setThreats(threatsData.filter(t => t.status === 'active'));
      if (threatsData.length > 0 && !selectedThreat) {
        setSelectedThreat(threatsData[0]);
      }
    } catch (error) {
      console.error('Error loading threats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadResponsePlans = async (threatId: string) => {
    try {
      const plansData = await SentinelService.getResponsePlans(threatId);
      setResponsePlans(plansData);
    } catch (error) {
      console.error('Error loading response plans:', error);
    }
  };

  const executeResponsePlan = async (planId: string) => {
    if (!user?.id) {
      toast.error('User authentication required');
      return;
    }

    setExecutingPlan(planId);
    try {
      await SentinelService.executeResponsePlan(planId, user.id);
      toast.success('Response plan executed successfully');
      // Refresh plans to show updated status
      if (selectedThreat) {
        await loadResponsePlans(selectedThreat.id);
      }
    } catch (error) {
      console.error('Error executing response plan:', error);
      toast.error('Failed to execute response plan');
    } finally {
      setExecutingPlan(null);
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'soft': return 'bg-green-500 text-white';
      case 'hard': return 'bg-orange-500 text-white';
      case 'nuclear': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case 'soft': return '🛡️';
      case 'hard': return '⚔️';
      case 'nuclear': return '☢️';
      default: return '🎯';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading response plans...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Threats List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Threats ({threats.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedThreat?.id === threat.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getSeverityColor(threat.severity_level)}>
                    {threat.severity_level}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{threat.entity_name}</p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {threat.threat_content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Plans */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Response Plans
            {selectedThreat && (
              <span className="text-sm font-normal text-gray-600">
                for {selectedThreat.entity_name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedThreat && responsePlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {responsePlans.map((plan) => (
                <Card key={plan.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getPlanTypeColor(plan.plan_type)}>
                        {getPlanTypeIcon(plan.plan_type)} {plan.plan_type.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round(plan.estimated_effectiveness * 100)}% effectiveness
                        </div>
                        <div className="text-xs text-gray-600">{plan.time_to_execute}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Strategy</h4>
                      <p className="text-sm text-gray-600">{plan.strategy_summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Actions ({plan.specific_actions.length})</h4>
                      <ul className="space-y-1">
                        {plan.specific_actions.slice(0, 3).map((action, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            <span>{action.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.resource_requirements && (
                      <div>
                        <h4 className="font-medium mb-1">Resources</h4>
                        <p className="text-xs text-gray-600">{plan.resource_requirements}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t">
                      {plan.approved_by ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Executed</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => executeResponsePlan(plan.id)}
                          disabled={executingPlan === plan.id}
                          className="w-full flex items-center gap-2"
                          variant={plan.plan_type === 'nuclear' ? 'destructive' : 'default'}
                        >
                          {executingPlan === plan.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Executing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Execute {plan.plan_type}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedThreat ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">No response plans available for this threat</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Select a threat to view response plans</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
