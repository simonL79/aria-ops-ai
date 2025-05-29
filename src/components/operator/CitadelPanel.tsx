
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Zap, CheckCircle, XCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIPolicyVault {
  id: string;
  policy_name: string;
  scope: string;
  definition: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface HardeningRule {
  id: string;
  rule_name: string;
  condition: string | null;
  action: string | null;
  applied: boolean | null;
  system_trigger: string | null;
  evaluated_at: string;
}

interface HardeningEvent {
  id: string;
  rule_id: string | null;
  action_taken: string | null;
  success: boolean | null;
  outcome_summary: string | null;
  executed_at: string;
}

export const CitadelPanel = () => {
  const [policies, setPolicies] = useState<AIPolicyVault[]>([]);
  const [rules, setRules] = useState<HardeningRule[]>([]);
  const [events, setEvents] = useState<HardeningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCitadelData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('citadel-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ai_policy_vault' },
        () => loadPolicies()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'infrastructure_hardening_rules' },
        () => loadRules()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hardening_event_log' },
        () => loadEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadCitadelData = async () => {
    await Promise.all([loadPolicies(), loadRules(), loadEvents()]);
  };

  const loadPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_policy_vault')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('infrastructure_hardening_rules')
        .select('*')
        .order('evaluated_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('hardening_event_log')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'infrastructure':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'threat_response':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'monitoring':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'alerting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'infrastructure':
        return <Shield className="h-4 w-4 text-red-400" />;
      case 'threat_response':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'monitoring':
        return <Eye className="h-4 w-4 text-blue-400" />;
      default:
        return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuccessIcon = (success: boolean | null) => {
    if (success === null) return <Clock className="h-4 w-4 text-gray-400" />;
    return success ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />;
  };

  const getSuccessColor = (success: boolean | null) => {
    if (success === null) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    return success ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const deployNewPolicy = async () => {
    setIsLoading(true);
    try {
      const policyTypes = ['threat_response', 'monitoring', 'alerting', 'infrastructure'];
      const randomType = policyTypes[Math.floor(Math.random() * policyTypes.length)];
      
      await supabase
        .from('ai_policy_vault')
        .insert({
          policy_name: `Auto-Generated ${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Policy`,
          scope: randomType,
          definition: {
            trigger: `${randomType}_anomaly_detected`,
            action: 'automated_containment',
            severity: 'high',
            notify: ['admin', 'security_team']
          },
          created_by: 'CITADEL™ AI'
        });

      toast.success('New AI policy deployed to vault');
      loadPolicies();
    } catch (error) {
      console.error('Error deploying policy:', error);
      toast.error('Failed to deploy policy');
    } finally {
      setIsLoading(false);
    }
  };

  const executeHardeningRule = async () => {
    if (rules.length === 0) {
      toast.error('No hardening rules available to execute');
      return;
    }

    setIsLoading(true);
    try {
      const randomRule = rules[Math.floor(Math.random() * rules.length)];
      
      await supabase
        .from('hardening_event_log')
        .insert({
          rule_id: randomRule.id,
          action_taken: randomRule.action || 'security_hardening_applied',
          success: Math.random() > 0.2, // 80% success rate
          outcome_summary: `Executed rule: ${randomRule.rule_name}. Infrastructure security enhanced.`
        });

      toast.success('Hardening rule executed');
      loadEvents();
    } catch (error) {
      console.error('Error executing rule:', error);
      toast.error('Failed to execute hardening rule');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Policy Vault */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Lock className="h-4 w-4" />
            CITADEL™ AI Policy Vault
            <Button
              size="sm"
              onClick={deployNewPolicy}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Deploy Policy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {policies.length === 0 ? (
            <div className="text-gray-500 text-sm">No vaulted policies available</div>
          ) : (
            policies.map((policy) => (
              <div key={policy.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getScopeIcon(policy.scope)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{policy.policy_name}</div>
                  <div className="text-xs text-purple-400 mb-1">
                    Created by: {policy.created_by}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(policy.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getScopeColor(policy.scope)}>
                  {policy.scope}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Infrastructure Hardening Rules */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Infrastructure Hardening Rules
            <Button
              size="sm"
              onClick={executeHardeningRule}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Shield className="h-3 w-3 mr-1" />
              Execute Rule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {rules.length === 0 ? (
            <div className="text-gray-500 text-sm">No hardening rules available</div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{rule.rule_name}</div>
                  {rule.condition && (
                    <div className="text-xs text-red-400 mb-1">Condition: {rule.condition}</div>
                  )}
                  {rule.action && (
                    <div className="text-xs text-orange-400 mb-1">Action: {rule.action}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Trigger: {rule.system_trigger || 'manual'}
                  </div>
                </div>
                <Badge className={rule.applied ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                  {rule.applied ? 'applied' : 'pending'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Hardening Execution Log */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Hardening Execution Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-gray-500 text-sm">No execution events available</div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getSuccessIcon(event.success)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    {event.action_taken || 'Security action executed'}
                  </div>
                  {event.outcome_summary && (
                    <div className="text-xs text-green-400 mb-1">{event.outcome_summary}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(event.executed_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getSuccessColor(event.success)}>
                  {event.success === null ? 'pending' : event.success ? 'success' : 'failed'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
