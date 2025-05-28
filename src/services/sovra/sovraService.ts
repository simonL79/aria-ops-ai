
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThreatEvent {
  type: string;
  identity: string;
  platform: string;
  payload: string;
  score: number;
}

export interface AIAction {
  threatId: string;
  actionType: string;
  actionDetail: string;
  confidence: number;
}

class SovraService {
  async addThreatEvent(threat: ThreatEvent): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('api_add_threat_event', {
        p_type: threat.type,
        p_identity: threat.identity,
        p_platform: threat.platform,
        p_payload: threat.payload,
        p_score: threat.score
      });

      if (error) {
        console.error('Error adding threat event:', error);
        toast.error('Failed to add threat event');
        return null;
      }

      console.log('Threat event added successfully:', data);
      toast.success('Threat event added to queue');
      return data;
    } catch (error) {
      console.error('Error in addThreatEvent:', error);
      toast.error('Failed to add threat event');
      return null;
    }
  }

  async addAIAction(action: AIAction): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('api_add_ai_action', {
        p_threat_id: action.threatId,
        p_action_type: action.actionType,
        p_action_detail: action.actionDetail,
        p_confidence: action.confidence
      });

      if (error) {
        console.error('Error adding AI action:', error);
        toast.error('Failed to add AI action');
        return null;
      }

      console.log('AI action added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in addAIAction:', error);
      toast.error('Failed to add AI action');
      return null;
    }
  }

  async approveOrRejectThreat(
    threatId: string,
    approved: boolean,
    comment: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('api_admin_approve_threat', {
        p_threat_id: threatId,
        p_approved: approved,
        p_comment: comment
      });

      if (error) {
        console.error('Error processing threat decision:', error);
        toast.error('Failed to process decision');
        return false;
      }

      toast.success(data || `Threat ${approved ? 'approved' : 'rejected'} successfully`);
      return true;
    } catch (error) {
      console.error('Error in approveOrRejectThreat:', error);
      toast.error('Failed to process decision');
      return false;
    }
  }

  async getThreatQueue() {
    try {
      const { data, error } = await supabase
        .from('threat_queue')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) {
        console.error('Error fetching threat queue:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getThreatQueue:', error);
      return [];
    }
  }

  async getActionMatrix() {
    try {
      const { data, error } = await supabase
        .from('action_matrix')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching action matrix:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActionMatrix:', error);
      return [];
    }
  }

  async getAdminSignals() {
    try {
      const { data, error } = await supabase
        .from('admin_signals')
        .select('*')
        .order('reviewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin signals:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAdminSignals:', error);
      return [];
    }
  }

  async getExecutionLog() {
    try {
      const { data, error } = await supabase
        .from('sovra_action_log')
        .select('*')
        .order('executed_at', { ascending: false });

      if (error) {
        console.error('Error fetching execution log:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getExecutionLog:', error);
      return [];
    }
  }

  // Simulate threat detection for testing purposes
  async simulateThreatDetection(): Promise<void> {
    const threats = [
      {
        type: 'reputation_attack',
        identity: 'Corporate Executive',
        platform: 'Twitter',
        payload: 'Coordinated negative campaign detected with 500+ amplifier accounts',
        score: 0.85
      },
      {
        type: 'disinformation',
        identity: 'Brand Name',
        platform: 'Reddit',
        payload: 'False product safety claims spreading across multiple subreddits',
        score: 0.72
      },
      {
        type: 'legal_threat',
        identity: 'Company Legal Team',
        platform: 'LinkedIn',
        payload: 'Potential regulatory action discussion gaining traction',
        score: 0.91
      }
    ];

    for (const threat of threats) {
      const threatId = await this.addThreatEvent(threat);
      
      if (threatId) {
        // Add AI-recommended actions for each threat
        const actions = [
          {
            threatId,
            actionType: 'counter_narrative',
            actionDetail: 'Deploy strategic counter-narrative on same platform',
            confidence: 0.78
          },
          {
            threatId,
            actionType: 'suppress',
            actionDetail: 'Request platform moderation review',
            confidence: 0.65
          },
          {
            threatId,
            actionType: 'monitor',
            actionDetail: 'Increase monitoring frequency and alert thresholds',
            confidence: 0.92
          }
        ];

        for (const action of actions) {
          await this.addAIAction(action);
        }
      }
    }

    toast.success('Threat simulation completed - check the SOVRA dashboard');
  }
}

export const sovraService = new SovraService();
