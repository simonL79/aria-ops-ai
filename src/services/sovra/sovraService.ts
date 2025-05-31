
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
      // Use activity_logs to simulate threat queue since the database functions don't exist yet
      const { data, error } = await supabase.from('activity_logs').insert({
        action: 'sovra_threat_event',
        details: JSON.stringify({
          threat_type: threat.type,
          identity: threat.identity,
          platform: threat.platform,
          payload: threat.payload,
          score: threat.score,
          status: 'pending'
        }),
        entity_type: 'threat_queue',
        entity_id: crypto.randomUUID()
      }).select().single();

      if (error) {
        console.error('Error adding threat event:', error);
        toast.error('Failed to add threat event');
        return null;
      }

      console.log('Threat event added successfully:', data.id);
      toast.success('Threat event added to queue');
      return data.id;
    } catch (error) {
      console.error('Error in addThreatEvent:', error);
      toast.error('Failed to add threat event');
      return null;
    }
  }

  async addAIAction(action: AIAction): Promise<string | null> {
    try {
      // Use activity_logs to simulate action matrix
      const { data, error } = await supabase.from('activity_logs').insert({
        action: 'sovra_ai_action',
        details: JSON.stringify({
          threat_id: action.threatId,
          action_type: action.actionType,
          action_detail: action.actionDetail,
          confidence: action.confidence,
          status: 'pending'
        }),
        entity_type: 'action_matrix',
        entity_id: action.threatId
      }).select().single();

      if (error) {
        console.error('Error adding AI action:', error);
        toast.error('Failed to add AI action');
        return null;
      }

      console.log('AI action added successfully:', data.id);
      return data.id;
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
      // Use activity_logs to simulate admin signals
      const { data, error } = await supabase.from('activity_logs').insert({
        action: 'sovra_admin_decision',
        details: JSON.stringify({
          threat_id: threatId,
          approved: approved,
          comment: comment,
          reviewed_at: new Date().toISOString()
        }),
        entity_type: 'admin_signals',
        entity_id: threatId
      }).select().single();

      if (error) {
        console.error('Error processing threat decision:', error);
        toast.error('Failed to process decision');
        return false;
      }

      const message = approved ? 'Threat approved successfully' : 'Threat rejected successfully';
      toast.success(message);
      return true;
    } catch (error) {
      console.error('Error in approveOrRejectThreat:', error);
      toast.error('Failed to process decision');
      return false;
    }
  }

  async getThreatQueue() {
    try {
      // Get simulated threat queue from activity_logs
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'threat_queue')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching threat queue:', error);
        return [];
      }

      // Transform activity logs to threat queue format
      return (data || []).map(item => {
        const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
        return {
          id: item.id,
          threat_type: details.threat_type || 'unknown',
          identity: details.identity || 'unknown',
          platform: details.platform || 'unknown',
          payload: details.payload || '',
          score: details.score || 0,
          status: details.status || 'pending',
          detected_at: item.created_at
        };
      });
    } catch (error) {
      console.error('Error in getThreatQueue:', error);
      return [];
    }
  }

  async getActionMatrix() {
    try {
      // Get simulated action matrix from activity_logs
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'action_matrix')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching action matrix:', error);
        return [];
      }

      // Transform activity logs to action matrix format
      return (data || []).map(item => {
        const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
        return {
          id: item.id,
          threat_id: details.threat_id || item.entity_id,
          action_type: details.action_type || 'unknown',
          action_detail: details.action_detail || '',
          confidence: details.confidence || 0,
          status: details.status || 'pending',
          created_at: item.created_at
        };
      });
    } catch (error) {
      console.error('Error in getActionMatrix:', error);
      return [];
    }
  }

  async getAdminSignals() {
    try {
      // Get simulated admin signals from activity_logs
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'admin_signals')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin signals:', error);
        return [];
      }

      // Transform activity logs to admin signals format
      return (data || []).map(item => {
        const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
        return {
          id: item.id,
          threat_id: details.threat_id || item.entity_id,
          approved: details.approved || false,
          comment: details.comment || '',
          reviewed_at: details.reviewed_at || item.created_at,
          reviewed_by: item.user_id
        };
      });
    } catch (error) {
      console.error('Error in getAdminSignals:', error);
      return [];
    }
  }

  async getExecutionLog() {
    try {
      // Get simulated execution log from activity_logs
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'sovra_execution')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching execution log:', error);
        return [];
      }

      // Transform activity logs to execution log format
      return (data || []).map(item => {
        const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
        return {
          id: item.id,
          threat_id: details.threat_id || item.entity_id,
          action_type: details.action_type || 'unknown',
          result: details.result || 'executed',
          executed_at: item.created_at,
          executed_by: item.user_id
        };
      });
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
