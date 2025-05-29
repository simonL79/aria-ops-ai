
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Settings, CheckCircle, XCircle, Activity, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatSignature {
  id: string;
  signature_name: string;
  pattern: string;
  threat_type: string | null;
  severity_level: string | null;
  created_at: string;
  updated_at: string;
}

interface DefenseTrigger {
  id: string;
  triggered_at: string;
  source: string;
  detected_pattern: string | null;
  signature_id: string | null;
  response_action: string | null;
  status: string | null;
}

interface AutoHardening {
  id: string;
  config_area: string;
  adjustment: string | null;
  rationale: string | null;
  executed_at: string;
  verified: boolean | null;
}

export const SentinelShieldPanel = () => {
  const [signatures, setSignatures] = useState<ThreatSignature[]>([]);
  const [triggers, setTriggers] = useState<DefenseTrigger[]>([]);
  const [hardening, setHardening] = useState<AutoHardening[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSentinelData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('sentinel-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sentinel_threat_signatures' },
        () => loadSignatures()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sentinel_defense_triggers' },
        () => loadTriggers()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sentinel_auto_hardening' },
        () => loadHardening()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadSentinelData = async () => {
    await Promise.all([loadSignatures(), loadTriggers(), loadHardening()]);
  };

  const loadSignatures = async () => {
    try {
      const { data, error } = await supabase
        .from('sentinel_threat_signatures')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error('Error loading threat signatures:', error);
    }
  };

  const loadTriggers = async () => {
    try {
      const { data, error } = await supabase
        .from('sentinel_defense_triggers')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTriggers(data || []);
    } catch (error) {
      console.error('Error loading defense triggers:', error);
    }
  };

  const loadHardening = async () => {
    try {
      const { data, error } = await supabase
        .from('sentinel_auto_hardening')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setHardening(data || []);
    } catch (error) {
      console.error('Error loading auto hardening:', error);
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Activity className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string | null) => {
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

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'executed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const simulateDefenseTrigger = async () => {
    setIsLoading(true);
    try {
      const triggerTypes = [
        { source: 'web_scanner', pattern: 'sql_injection_attempt', action: 'block_request' },
        { source: 'auth_module', pattern: 'brute_force_detected', action: 'temp_lockout' },
        { source: 'api_gateway', pattern: 'rate_limit_exceeded', action: 'throttle_requests' },
        { source: 'file_monitor', pattern: 'malicious_upload', action: 'quarantine_file' }
      ];

      const randomTrigger = triggerTypes[Math.floor(Math.random() * triggerTypes.length)];
      
      await supabase
        .from('sentinel_defense_triggers')
        .insert({
          source: randomTrigger.source,
          detected_pattern: randomTrigger.pattern,
          response_action: randomTrigger.action,
          status: 'executed'
        });

      toast.success('Defense trigger simulated');
      loadTriggers();
    } catch (error) {
      console.error('Error simulating defense trigger:', error);
      toast.error('Failed to simulate defense trigger');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAutoHardening = async () => {
    setIsLoading(true);
    try {
      const hardeningActions = [
        { area: 'firewall_rules', adjustment: 'Added IP blacklist rule for suspicious range', rationale: 'Multiple attack attempts from IP range detected' },
        { area: 'rate_limiting', adjustment: 'Reduced API rate limit from 1000/min to 500/min', rationale: 'Preventing potential DDoS attacks' },
        { area: 'access_control', adjustment: 'Enabled MFA requirement for admin accounts', rationale: 'Enhanced security after privilege escalation attempt' },
        { area: 'encryption', adjustment: 'Upgraded TLS to v1.3 for all endpoints', rationale: 'Maintaining cryptographic strength against modern attacks' }
      ];

      const randomAction = hardeningActions[Math.floor(Math.random() * hardeningActions.length)];
      
      await supabase
        .from('sentinel_auto_hardening')
        .insert({
          config_area: randomAction.area,
          adjustment: randomAction.adjustment,
          rationale: randomAction.rationale,
          verified: Math.random() > 0.3 // 70% success rate
        });

      toast.success('Auto-hardening action simulated');
      loadHardening();
    } catch (error) {
      console.error('Error simulating auto hardening:', error);
      toast.error('Failed to simulate auto hardening');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Threat Signatures */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            SENTINEL SHIELD™ Threat Signatures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {signatures.length === 0 ? (
            <div className="text-gray-500 text-sm">No threat signatures registered</div>
          ) : (
            signatures.map((signature) => (
              <div key={signature.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getSeverityIcon(signature.severity_level)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{signature.signature_name}</div>
                  <div className="text-xs text-red-300 mb-1">Pattern: {signature.pattern}</div>
                  {signature.threat_type && (
                    <div className="text-xs text-gray-400 mb-1">Type: {signature.threat_type}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Created: {new Date(signature.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getSeverityColor(signature.severity_level)}>
                  {signature.severity_level || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Defense Triggers */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Autonomous Defense Triggers
            <Button
              size="sm"
              onClick={simulateDefenseTrigger}
              disabled={isLoading}
              className="ml-auto text-xs bg-orange-600 hover:bg-orange-700"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Simulate Trigger
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {triggers.length === 0 ? (
            <div className="text-gray-500 text-sm">No defense triggers activated</div>
          ) : (
            triggers.map((trigger) => (
              <div key={trigger.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getStatusIcon(trigger.status)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{trigger.source}]</span> Defense Activated
                  </div>
                  {trigger.detected_pattern && (
                    <div className="text-xs text-orange-400 mb-1">Pattern: {trigger.detected_pattern}</div>
                  )}
                  {trigger.response_action && (
                    <div className="text-xs text-green-400 mb-1">Action: {trigger.response_action}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(trigger.triggered_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getStatusColor(trigger.status)}>
                  {trigger.status || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Auto-Hardening */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Autonomous System Hardening
            <Button
              size="sm"
              onClick={simulateAutoHardening}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="h-3 w-3 mr-1" />
              Simulate Hardening
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {hardening.length === 0 ? (
            <div className="text-gray-500 text-sm">No hardening actions executed</div>
          ) : (
            hardening.map((action) => (
              <div key={action.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {action.verified ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{action.config_area}]</span> System Update
                  </div>
                  {action.adjustment && (
                    <div className="text-xs text-blue-400 mb-1">{action.adjustment}</div>
                  )}
                  {action.rationale && (
                    <div className="text-xs text-gray-400 mb-1">Reason: {action.rationale}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(action.executed_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={action.verified ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}>
                  {action.verified ? 'verified' : 'failed'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
