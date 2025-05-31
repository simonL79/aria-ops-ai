
import { supabase } from '@/integrations/supabase/client';

export interface ZeroDayEvent {
  id: string;
  event_type: string;
  severity: string;
  entity_name: string;
  detection_method: string;
  response_status: string;
  detected_at: string;
}

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
      severity: 'medium', // Default since not stored
      entity_name: item.entity_id || 'unknown',
      detection_method: 'automated',
      response_status: 'logged',
      detected_at: item.created_at
    }));

    return events;
  } catch (error) {
    console.error('Error fetching zero-day events:', error);
    return [];
  }
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
