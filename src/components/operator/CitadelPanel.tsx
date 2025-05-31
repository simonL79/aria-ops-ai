
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, Lock, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PolicyEntry {
  id: string;
  policy_name: string;
  threat_category: string;
  action_type: string;
  enabled: boolean;
  severity_threshold: number;
  created_at: string;
}

const CitadelPanel = () => {
  const [policies, setPolicies] = useState<PolicyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'monitoring' | 'alert'>('secure');

  useEffect(() => {
    loadPolicyEntries();
    checkSystemStatus();
  }, []);

  const loadPolicyEntries = async () => {
    try {
      // Use existing scan_results table to simulate policy data
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform scan results into policy-like entries
      const mockPolicies: PolicyEntry[] = (data || []).map((item, index) => ({
        id: item.id,
        policy_name: `Auto-Policy-${index + 1}`,
        threat_category: item.threat_type || 'general',
        action_type: item.severity === 'high' ? 'immediate_response' : 'monitor',
        enabled: true,
        severity_threshold: item.severity === 'high' ? 0.8 : 0.5,
        created_at: item.created_at
      }));

      setPolicies(mockPolicies);
    } catch (error) {
      console.error('Error loading policy entries:', error);
      toast.error('Failed to load policy vault');
    }
  };

  const checkSystemStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('severity')
        .eq('status', 'new')
        .limit(5);

      if (error) throw error;

      const highSeverityCount = data?.filter(item => item.severity === 'high').length || 0;
      
      if (highSeverityCount > 2) {
        setSystemStatus('alert');
      } else if (highSeverityCount > 0) {
        setSystemStatus('monitoring');
      } else {
        setSystemStatus('secure');
      }
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const handleCreatePolicy = async () => {
    setIsLoading(true);
    try {
      // Simulate policy creation by logging to activity_logs
      await supabase.from('activity_logs').insert({
        action: 'policy_created',
        details: 'New AI policy created via Citadel Panel',
        entity_type: 'ai_policy'
      });

      toast.success('New policy created');
      loadPolicyEntries();
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error('Failed to create policy');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'secure': return 'text-green-400';
      case 'monitoring': return 'text-yellow-400';
      case 'alert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            A.R.I.A™ Citadel Defense Grid
          </CardTitle>
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${getStatusColor()}`} />
            <span className={`text-sm ${getStatusColor()}`}>
              Status: {systemStatus.toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Active Policies</span>
              </div>
              <div className="text-2xl font-bold text-white">{policies.length}</div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Threat Categories</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {new Set(policies.map(p => p.threat_category)).size}
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">High Priority</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {policies.filter(p => p.severity_threshold > 0.7).length}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Policy Vault</h3>
            <Button
              onClick={handleCreatePolicy}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Policy
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {policies.map((policy) => (
              <div key={policy.id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{policy.policy_name}</div>
                  <div className="text-sm text-gray-400">
                    Category: {policy.threat_category} | Action: {policy.action_type}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={policy.enabled ? "default" : "secondary"}>
                    {policy.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {(policy.severity_threshold * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitadelPanel;
