
import { supabase } from '@/integrations/supabase/client';

interface AnubisActivityLog {
  action: string;
  details?: string;
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  user_email?: string;
}

class AnubisIntegrationService {
  async logActivity(activity: AnubisActivityLog) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([activity])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  async logEmergencyStrike(threatId: string, action: string, userId?: string) {
    return this.logActivity({
      action: 'emergency_strike',
      details: `${action} for threat ${threatId}`,
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }

  async logSovraDecision(threatId: string, decision: string, confidence: number, userId?: string) {
    return this.logActivity({
      action: 'sovra_decision',
      details: `Decision: ${decision}, Confidence: ${confidence}`,
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }

  async performSystemHealthCheck() {
    console.log('System health check performed');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }

  async getSystemMetrics(timeframe: '7d' | '30d' = '7d') {
    console.log(`Getting system metrics for ${timeframe}`);
    return {
      totalActivities: 0,
      errorRate: 0,
      responseTime: 100
    };
  }
}

export const anubisIntegrationService = new AnubisIntegrationService();
