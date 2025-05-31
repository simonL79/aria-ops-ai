
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type {
  SentinelClient,
  SentinelThreatDiscovery,
  SentinelResponsePlan,
  SentinelMissionLog,
  SentinelGuardianRegistry,
  ThreatDiscoveryResult,
  ResponsePlanGeneration
} from '@/types/sentinel';

export class SentinelService {
  
  /**
   * Discover threats for a client and their entities
   */
  static async discoverThreats(clientName: string, entityNames: string[]): Promise<ThreatDiscoveryResult> {
    try {
      console.log(`[SENTINEL] Starting comprehensive threat discovery for: ${clientName}`);
      
      const { data, error } = await supabase.rpc('sentinel_discover_threats', {
        p_client_name: clientName,
        p_entity_names: entityNames
      });

      if (error) {
        console.error('[SENTINEL] Threat discovery error:', error);
        throw error;
      }

      console.log(`[SENTINEL] Discovery completed:`, data[0]);
      return data[0];
    } catch (error) {
      console.error('[SENTINEL] Error in discoverThreats:', error);
      throw error;
    }
  }

  /**
   * Get all discovered threats for a client
   */
  static async getClientThreats(clientId: string): Promise<SentinelThreatDiscovery[]> {
    try {
      const { data, error } = await supabase
        .from('sentinel_threat_discovery')
        .select('*')
        .eq('client_id', clientId)
        .order('discovered_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SENTINEL] Error fetching client threats:', error);
      throw error;
    }
  }

  /**
   * Get response plans for a specific threat
   */
  static async getResponsePlans(threatId: string): Promise<SentinelResponsePlan[]> {
    try {
      const { data, error } = await supabase
        .from('sentinel_response_plans')
        .select('*')
        .eq('threat_id', threatId)
        .order('plan_type');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SENTINEL] Error fetching response plans:', error);
      throw error;
    }
  }

  /**
   * Execute a response plan
   */
  static async executeResponsePlan(planId: string, approvedBy: string): Promise<SentinelMissionLog> {
    try {
      // First, approve the plan
      const { error: approveError } = await supabase
        .from('sentinel_response_plans')
        .update({
          approved_by: approvedBy,
          approved_at: new Date().toISOString()
        })
        .eq('id', planId);

      if (approveError) throw approveError;

      // Get the plan details
      const { data: plan, error: planError } = await supabase
        .from('sentinel_response_plans')
        .select(`
          *,
          sentinel_threat_discovery!inner(client_id, entity_name, threat_content)
        `)
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      // Create mission log entry
      const { data: missionLog, error: logError } = await supabase
        .from('sentinel_mission_log')
        .insert({
          plan_id: planId,
          client_id: plan.sentinel_threat_discovery.client_id,
          action_type: `${plan.plan_type}_response`,
          action_details: {
            plan_type: plan.plan_type,
            actions: plan.specific_actions,
            entity_name: plan.sentinel_threat_discovery.entity_name,
            threat_content: plan.sentinel_threat_discovery.threat_content.substring(0, 200)
          },
          execution_status: 'executing',
          started_at: new Date().toISOString(),
          executed_by: approvedBy
        })
        .select()
        .single();

      if (logError) throw logError;

      // Simulate execution process (in real implementation, this would trigger actual response systems)
      setTimeout(async () => {
        await this.completeExecution(missionLog.id, plan.plan_type);
      }, 2000);

      console.log(`[SENTINEL] ${plan.plan_type.toUpperCase()} response plan executed for threat`);
      toast.success(`${plan.plan_type.toUpperCase()} response plan activated`);
      
      return missionLog;
    } catch (error) {
      console.error('[SENTINEL] Error executing response plan:', error);
      throw error;
    }
  }

  /**
   * Complete execution simulation
   */
  private static async completeExecution(missionLogId: string, planType: string): Promise<void> {
    try {
      const effectiveness = planType === 'nuclear' ? 0.95 : planType === 'hard' ? 0.80 : 0.65;
      const resultMessages = {
        soft: 'Monitoring activated, positive content amplified, initial engagement completed',
        hard: 'Counter-narrative deployed, platform reports filed, influencer outreach initiated',
        nuclear: 'Legal proceedings initiated, media campaign launched, executive escalation completed'
      };

      await supabase
        .from('sentinel_mission_log')
        .update({
          execution_status: 'completed',
          completed_at: new Date().toISOString(),
          result_summary: resultMessages[planType] || 'Response executed successfully',
          effectiveness_score: effectiveness
        })
        .eq('id', missionLogId);

      toast.success(`${planType.toUpperCase()} response completed successfully`);
    } catch (error) {
      console.error('[SENTINEL] Error completing execution:', error);
    }
  }

  /**
   * Get all Sentinel clients
   */
  static async getClients(): Promise<SentinelClient[]> {
    try {
      const { data, error } = await supabase
        .from('sentinel_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SENTINEL] Error fetching clients:', error);
      throw error;
    }
  }

  /**
   * Get mission logs for a client
   */
  static async getMissionLogs(clientId: string): Promise<SentinelMissionLog[]> {
    try {
      const { data, error } = await supabase
        .from('sentinel_mission_log')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SENTINEL] Error fetching mission logs:', error);
      throw error;
    }
  }

  /**
   * Enable guardian monitoring for a client
   */
  static async enableGuardianMode(clientId: string, entityNames: string[]): Promise<void> {
    try {
      // Update client to enable guardian mode
      const { error: clientError } = await supabase
        .from('sentinel_clients')
        .update({ guardian_mode_enabled: true })
        .eq('id', clientId);

      if (clientError) throw clientError;

      // Activate guardian registry entries
      const { error: guardianError } = await supabase
        .from('sentinel_guardian_registry')
        .update({ 
          status: 'active',
          auto_response_enabled: true,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId);

      if (guardianError) throw guardianError;

      toast.success('Guardian monitoring activated');
    } catch (error) {
      console.error('[SENTINEL] Error enabling guardian mode:', error);
      throw error;
    }
  }

  /**
   * Get guardian status for a client
   */
  static async getGuardianStatus(clientId: string): Promise<SentinelGuardianRegistry[]> {
    try {
      const { data, error } = await supabase
        .from('sentinel_guardian_registry')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[SENTINEL] Error fetching guardian status:', error);
      throw error;
    }
  }
}
