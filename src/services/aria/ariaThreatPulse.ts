
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProspectEntity {
  id: string;
  detected_name: string;
  source?: string;
  context_excerpt?: string;
  mention_count: number;
  escalation_score: number;
  created_at: string;
  updated_at: string;
}

export interface RejectedThreat {
  id: string;
  content: string;
  reason?: string;
  source?: string;
  created_at: string;
}

export interface RSIActivationItem {
  id: string;
  prospect_name?: string;
  threat_reason?: string;
  source?: string;
  queued_at: string;
}

export interface EideticFootprintItem {
  id: string;
  prospect_name?: string;
  content_excerpt?: string;
  decay_score: number;
  routed_at: string;
}

export interface ProspectAlert {
  id: string;
  entity?: string;
  event?: string;
  status: string;
  medium?: string;
  created_at: string;
}

export const getProspectEntities = async (): Promise<ProspectEntity[]> => {
  try {
    // Use scan_results table to simulate prospect entities
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('threat_type', 'reputation_risk')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching prospect entities:', error);
      return [];
    }

    // Map scan_results to ProspectEntity format
    const entities: ProspectEntity[] = (data || []).map(item => ({
      id: item.id,
      detected_name: item.risk_entity_name || 'Unknown Entity',
      source: item.platform || 'Unknown Source',
      context_excerpt: (item.content || '').substring(0, 150) + '...',
      mention_count: 1,
      escalation_score: Math.abs(item.sentiment || 0),
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at
    }));

    return entities;
  } catch (error) {
    console.error('Error in getProspectEntities:', error);
    return [];
  }
};

export const getRSIActivationQueue = async (): Promise<RSIActivationItem[]> => {
  try {
    // Use activity_logs table to simulate RSI activation queue
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', 'rsi_simulation_triggered')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching RSI activation queue:', error);
      return [];
    }

    // Map activity_logs to RSIActivationItem format
    const items: RSIActivationItem[] = (data || []).map(log => ({
      id: log.id,
      prospect_name: log.entity_id || 'Unknown Prospect',
      threat_reason: log.details || 'RSI Simulation',
      source: 'Manual Trigger',
      queued_at: log.created_at
    }));

    return items;
  } catch (error) {
    console.error('Error in getRSIActivationQueue:', error);
    return [];
  }
};

export const getEideticFootprintQueue = async (): Promise<EideticFootprintItem[]> => {
  try {
    // Use memory_footprints table to simulate eidetic queue
    const { data, error } = await supabase
      .from('memory_footprints')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching EIDETIC footprint queue:', error);
      return [];
    }

    // Map memory_footprints to EideticFootprintItem format
    const items: EideticFootprintItem[] = (data || []).map(footprint => ({
      id: footprint.id,
      prospect_name: footprint.memory_type || 'Unknown Prospect',
      content_excerpt: (footprint.memory_context || '').substring(0, 100) + '...',
      decay_score: footprint.decay_score || 0,
      routed_at: footprint.updated_at
    }));

    return items;
  } catch (error) {
    console.error('Error in getEideticFootprintQueue:', error);
    return [];
  }
};

export const getProspectAlerts = async (): Promise<ProspectAlert[]> => {
  try {
    // Use content_alerts table for prospect alerts
    const { data, error } = await supabase
      .from('content_alerts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching prospect alerts:', error);
      return [];
    }

    // Map content_alerts to ProspectAlert format
    const alerts: ProspectAlert[] = (data || []).map(alert => ({
      id: alert.id,
      entity: alert.detected_entities ? JSON.stringify(alert.detected_entities) : 'Unknown Entity',
      event: alert.threat_type || 'Threat Detected',
      status: alert.status || 'pending',
      medium: alert.platform || 'Unknown Medium',
      created_at: alert.created_at
    }));

    return alerts;
  } catch (error) {
    console.error('Error in getProspectAlerts:', error);
    return [];
  }
};

export const getRejectedThreats = async (): Promise<RejectedThreat[]> => {
  try {
    // Use scan_results with resolved status for rejected threats
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('status', 'resolved')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching rejected threats:', error);
      return [];
    }

    // Map scan_results to RejectedThreat format
    const threats: RejectedThreat[] = (data || []).map(result => ({
      id: result.id,
      content: result.content || 'Threat content',
      reason: 'Resolved by system',
      source: result.platform || 'Unknown Source',
      created_at: result.created_at
    }));

    return threats;
  } catch (error) {
    console.error('Error in getRejectedThreats:', error);
    return [];
  }
};

export const markAlertProcessed = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_alerts')
      .update({ status: 'sent' })
      .eq('id', alertId);

    if (error) {
      console.error('Error marking alert as processed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markAlertProcessed:', error);
    return false;
  }
};

export const getARIAStats = async () => {
  try {
    const [entities, rsiQueue, eideticQueue, alerts] = await Promise.all([
      getProspectEntities(),
      getRSIActivationQueue(),
      getEideticFootprintQueue(),
      getProspectAlerts()
    ]);

    const highScoreProspects = entities.filter(e => e.escalation_score >= 0.8).length;
    const totalMentions = entities.reduce((sum, e) => sum + e.mention_count, 0);
    
    return {
      totalProspects: entities.length,
      highScoreProspects,
      totalMentions,
      rsiActivations: rsiQueue.length,
      eideticFootprints: eideticQueue.length,
      pendingAlerts: alerts.length
    };
  } catch (error) {
    console.error('Error getting ARIA stats:', error);
    return {
      totalProspects: 0,
      highScoreProspects: 0,
      totalMentions: 0,
      rsiActivations: 0,
      eideticFootprints: 0,
      pendingAlerts: 0
    };
  }
};
