
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmergencyThreat {
  id: string;
  threat_description: string;
  threat_type: string;
  origin_url: string;
  risk_level: 'high' | 'critical';
  confirmed_by_admin: boolean;
  detected_at: string;
  status: 'unconfirmed' | 'confirmed' | 'executed' | 'cancelled';
}

export interface StrikePlan {
  id: string;
  threat_id: string;
  action_type: 'dmca' | 'gdpr' | 'deindex' | 'deepfake_report' | 'platform_flag' | 'legal_escalation';
  action_detail: string;
  urgency_level: string;
  approved: boolean;
  created_at: string;
}

export interface AdminDecision {
  id: string;
  threat_id: string;
  admin_id: string;
  approved: boolean;
  reason: string;
  reviewed_at: string;
}

export interface ActionLog {
  id: string;
  threat_id: string;
  action_type: string;
  executed_at: string;
  result: string;
  engine_version: string;
}

class EmergencyStrikeService {
  async addEmergencyThreat(
    description: string,
    type: string,
    url: string,
    riskLevel: 'high' | 'critical'
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('ex_add_threat', {
        p_desc: description,
        p_type: type,
        p_url: url,
        p_risk: riskLevel
      });

      if (error) {
        console.error('Error adding emergency threat:', error);
        toast.error('Failed to add emergency threat');
        return null;
      }

      console.log('Emergency threat added:', data);
      toast.error(`🚨 EMERGENCY THREAT DETECTED: ${type.toUpperCase()}`);
      return data;
    } catch (error) {
      console.error('Error in addEmergencyThreat:', error);
      toast.error('Failed to add emergency threat');
      return null;
    }
  }

  async addStrikePlan(
    threatId: string,
    actionType: 'dmca' | 'gdpr' | 'deindex' | 'deepfake_report' | 'platform_flag' | 'legal_escalation',
    actionDetail: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('ex_add_strike_plan', {
        p_threat_id: threatId,
        p_action_type: actionType,
        p_action_detail: actionDetail
      });

      if (error) {
        console.error('Error adding strike plan:', error);
        toast.error('Failed to add strike plan');
        return null;
      }

      console.log('Strike plan added:', data);
      toast.success('Strike plan added to emergency queue');
      return data;
    } catch (error) {
      console.error('Error in addStrikePlan:', error);
      toast.error('Failed to add strike plan');
      return null;
    }
  }

  async confirmStrike(
    threatId: string,
    adminId: string,
    reason: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('ex_admin_confirm_strike', {
        p_threat_id: threatId,
        p_admin: adminId,
        p_reason: reason
      });

      if (error) {
        console.error('Error confirming strike:', error);
        toast.error('Failed to confirm strike execution');
        return false;
      }

      toast.success(data || 'Emergency strike executed successfully');
      return true;
    } catch (error) {
      console.error('Error in confirmStrike:', error);
      toast.error('Failed to confirm strike execution');
      return false;
    }
  }

  async cancelThreat(threatId: string, reason: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('ex_cancel_threat', {
        p_threat_id: threatId,
        p_reason: reason
      });

      if (error) {
        console.error('Error cancelling threat:', error);
        toast.error('Failed to cancel threat');
        return false;
      }

      toast.success(data || 'Threat cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error in cancelThreat:', error);
      toast.error('Failed to cancel threat');
      return false;
    }
  }

  async getEmergencyThreats(): Promise<EmergencyThreat[]> {
    try {
      const { data, error } = await supabase
        .from('ex_threat_queue')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) {
        console.error('Error fetching emergency threats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEmergencyThreats:', error);
      return [];
    }
  }

  async getStrikePlans(threatId?: string): Promise<StrikePlan[]> {
    try {
      let query = supabase
        .from('ex_strike_plan')
        .select('*')
        .order('created_at', { ascending: false });

      if (threatId) {
        query = query.eq('threat_id', threatId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching strike plans:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStrikePlans:', error);
      return [];
    }
  }

  async getAdminDecisions(): Promise<AdminDecision[]> {
    try {
      const { data, error } = await supabase
        .from('ex_admin_decisions')
        .select('*')
        .order('reviewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin decisions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAdminDecisions:', error);
      return [];
    }
  }

  async getActionLogs(): Promise<ActionLog[]> {
    try {
      const { data, error } = await supabase
        .from('ex_action_log')
        .select('*')
        .order('executed_at', { ascending: false });

      if (error) {
        console.error('Error fetching action logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActionLogs:', error);
      return [];
    }
  }

  // Emergency simulation for testing
  async simulateEmergencyThreat(): Promise<void> {
    const emergencyThreats = [
      {
        description: 'High-volume coordinated deepfake campaign targeting executive reputation',
        type: 'deepfake_attack',
        url: 'https://example.com/threat-source',
        riskLevel: 'critical' as const
      },
      {
        description: 'Legal threat escalation requiring immediate DMCA response',
        type: 'legal_escalation',
        url: 'https://example.com/legal-threat',
        riskLevel: 'high' as const
      },
      {
        description: 'Platform manipulation campaign requiring urgent intervention',
        type: 'platform_manipulation',
        url: 'https://example.com/platform-threat',
        riskLevel: 'critical' as const
      }
    ];

    for (const threat of emergencyThreats) {
      const threatId = await this.addEmergencyThreat(
        threat.description,
        threat.type,
        threat.url,
        threat.riskLevel
      );

      if (threatId) {
        // Add corresponding strike plans
        const strikePlans = [
          {
            actionType: 'dmca' as const,
            actionDetail: 'Issue immediate DMCA takedown notice to hosting provider'
          },
          {
            actionType: 'platform_flag' as const,
            actionDetail: 'Report content to platform moderation teams for urgent review'
          },
          {
            actionType: 'legal_escalation' as const,
            actionDetail: 'Engage legal counsel for emergency injunction proceedings'
          }
        ];

        for (const plan of strikePlans) {
          await this.addStrikePlan(threatId, plan.actionType, plan.actionDetail);
        }
      }
    }

    toast.error('🚨 EMERGENCY SIMULATION COMPLETE - Check A.R.I.A/EX™ Dashboard');
  }
}

export const emergencyStrikeService = new EmergencyStrikeService();
