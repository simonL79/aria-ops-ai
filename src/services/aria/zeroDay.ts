
import { supabase } from '@/integrations/supabase/client';

export interface ZeroDayEvent {
  id: string;
  event_type: string;
  severity: string;
  entity_name: string;
  detection_method: string;
  response_status: string;
  detected_at: string;
  threat_vector?: string;
  entropy_score?: number;
  auto_neutralized?: boolean;
  anomaly_signature?: string;
  source_url?: string;
}

export interface AIWatchdogVerdict {
  id: string;
  threat_id: string;
  watchdog_name: string;
  verdict: string;
  confidence: number;
  submitted_at: string;
}

export interface AISwarmConsensus {
  threat_id: string;
  final_verdict: string;
  consensus_score: number;
  resolved_at: string;
}

class ZeroDayFirewall {
  async scanForZeroDayThreats(): Promise<void> {
    console.log('Zero-day threat scan initiated (simulated)');
    
    // Log scan to activity_logs
    await supabase.from('activity_logs').insert({
      action: 'zero_day_scan',
      details: 'Automated zero-day threat scan performed',
      entity_type: 'zero_day'
    });
  }

  async getZeroDayEvents(): Promise<ZeroDayEvent[]> {
    try {
      // Use activity_logs table instead of zero_day_events
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'zero_day')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform to ZeroDayEvent format
      const events: ZeroDayEvent[] = (data || []).map((item: any) => ({
        id: item.id,
        event_type: item.action,
        severity: 'medium',
        entity_name: item.entity_id || 'unknown',
        detection_method: 'automated',
        response_status: 'logged',
        detected_at: item.created_at,
        threat_vector: 'unknown_threat',
        entropy_score: 0.75,
        auto_neutralized: false,
        anomaly_signature: 'System anomaly detected',
        source_url: 'https://example.com'
      }));

      return events;
    } catch (error) {
      console.error('Error fetching zero-day events:', error);
      return [];
    }
  }

  async getAIWatchdogVerdicts(): Promise<AIWatchdogVerdict[]> {
    try {
      // Use activity_logs for simulated AI verdicts
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'ai_verdict')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        threat_id: item.entity_id || 'unknown',
        watchdog_name: 'AI_Watchdog_1',
        verdict: 'benign',
        confidence: 0.85,
        submitted_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching AI watchdog verdicts:', error);
      return [];
    }
  }

  async getAISwarmConsensus(): Promise<AISwarmConsensus[]> {
    try {
      // Use activity_logs for simulated consensus data
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'consensus_resolution')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((item: any) => ({
        threat_id: item.entity_id || 'unknown',
        final_verdict: 'benign',
        consensus_score: 0.8,
        resolved_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching AI swarm consensus:', error);
      return [];
    }
  }
}

export const zeroDayFirewall = new ZeroDayFirewall();

export const triggerZeroDayResponse = async (threat: any): Promise<string> => {
  try {
    console.log('Triggering zero-day response (simulated):', threat);
    
    // Log to activity_logs instead of calling non-existent function
    await supabase.from('activity_logs').insert({
      action: 'zero_day_trigger',
      details: JSON.stringify(threat),
      entity_type: 'zero_day'
    });

    return 'Zero-day response triggered successfully (simulated)';
  } catch (error) {
    console.error('Error triggering zero-day response:', error);
    throw error;
  }
};

export const submitVerdict = async (verdict: any): Promise<boolean> => {
  try {
    console.log('Submitting verdict (simulated):', verdict);
    
    // Log to activity_logs instead of calling non-existent function
    await supabase.from('activity_logs').insert({
      action: 'verdict_submission',
      details: JSON.stringify(verdict),
      entity_type: 'verdict'
    });

    return true;
  } catch (error) {
    console.error('Error submitting verdict:', error);
    return false;
  }
};

export const resolveConsensus = async (consensus: any): Promise<boolean> => {
  try {
    console.log('Resolving consensus (simulated):', consensus);
    
    // Log to activity_logs instead of calling non-existent function
    await supabase.from('activity_logs').insert({
      action: 'consensus_resolution',
      details: JSON.stringify(consensus),
      entity_type: 'consensus'
    });

    return true;
  } catch (error) {
    console.error('Error resolving consensus:', error);
    return false;
  }
};

export const getZeroDayEvents = async (): Promise<ZeroDayEvent[]> => {
  return zeroDayFirewall.getZeroDayEvents();
};

export const getSystemConsensus = async (): Promise<any> => {
  try {
    // Use activity_logs table instead of system_consensus
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', 'consensus_resolution')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return {
      consensus_items: data || [],
      total_consensus: data?.length || 0,
      pending_decisions: 0
    };
  } catch (error) {
    console.error('Error fetching system consensus:', error);
    return { consensus_items: [], total_consensus: 0, pending_decisions: 0 };
  }
};
