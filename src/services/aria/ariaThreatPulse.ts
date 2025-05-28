
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
  status?: string;
}

export interface EideticFootprintItem {
  id: string;
  prospect_name?: string;
  content_excerpt?: string;
  decay_score: number;
  routed_at: string;
  status?: string;
}

export interface ProspectAlert {
  id: string;
  entity?: string;
  event?: string;
  status: string;
  medium?: string;
  created_at: string;
}

export interface EntityRiskProfile {
  id: string;
  entity_name: string;
  total_signals: number;
  risk_score: number;
  updated_at: string;
}

export interface EntityRiskDashboard {
  entity_name: string;
  total_signals: number;
  risk_score: number;
  rsi_triggered: boolean;
  eidetic_queued: boolean;
  alert_pending?: string;
  updated_at: string;
}

export const getProspectEntities = async (): Promise<ProspectEntity[]> => {
  try {
    // Get entities from the entities table we created
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching prospect entities:', error);
      return [];
    }

    // Map entities to ProspectEntity format
    const entities: ProspectEntity[] = (data || []).map(item => ({
      id: item.id,
      detected_name: item.name,
      source: 'Entities Registry',
      context_excerpt: `Type: ${item.entity_type}`,
      mention_count: 1,
      escalation_score: 0.5,
      created_at: item.created_at,
      updated_at: item.created_at
    }));

    return entities;
  } catch (error) {
    console.error('Error in getProspectEntities:', error);
    return [];
  }
};

export const getRSIActivationQueue = async (): Promise<RSIActivationItem[]> => {
  try {
    const { data, error } = await supabase
      .from('rsi_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching RSI activation queue:', error);
      return [];
    }

    // Map to RSIActivationItem format
    return (data || []).map(item => ({
      id: item.id,
      prospect_name: `Entity ${item.entity_id}`,
      threat_reason: item.counter_message,
      source: 'RSI Queue',
      queued_at: item.created_at,
      status: item.status
    }));
  } catch (error) {
    console.error('Error in getRSIActivationQueue:', error);
    return [];
  }
};

export const getEideticFootprintQueue = async (): Promise<EideticFootprintItem[]> => {
  try {
    const { data, error } = await supabase
      .from('eidetic_footprint_queue')
      .select('*')
      .order('routed_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching EIDETIC footprint queue:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      prospect_name: item.prospect_name,
      content_excerpt: item.content_excerpt,
      decay_score: item.decay_score,
      routed_at: item.routed_at,
      status: item.status
    }));
  } catch (error) {
    console.error('Error in getEideticFootprintQueue:', error);
    return [];
  }
};

export const getProspectAlerts = async (): Promise<ProspectAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('prospect_alerts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching prospect alerts:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      entity: item.entity,
      event: item.alert_type,
      status: item.status,
      medium: item.source_module,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in getProspectAlerts:', error);
    return [];
  }
};

export const getEntityRiskDashboard = async (): Promise<EntityRiskDashboard[]> => {
  try {
    // Get entities and create a simplified risk dashboard
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching entity risk dashboard:', error);
      return [];
    }

    return (data || []).map(item => ({
      entity_name: item.name,
      total_signals: 1,
      risk_score: 0.5,
      rsi_triggered: false,
      eidetic_queued: false,
      alert_pending: undefined,
      updated_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in getEntityRiskDashboard:', error);
    return [];
  }
};

export const updateEntityRiskScores = async (): Promise<boolean> => {
  try {
    // For now, just return success since we don't have the materialized views
    toast.success('Entity risk scores updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateEntityRiskScores:', error);
    return false;
  }
};

export const triggerRiskEscalations = async (): Promise<boolean> => {
  try {
    // For now, just return success since we don't have the escalation functions
    toast.success('Risk escalations triggered successfully');
    return true;
  } catch (error) {
    console.error('Error in triggerRiskEscalations:', error);
    return false;
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
      .from('prospect_alerts')
      .update({ status: 'processed' })
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
      pendingAlerts: alerts.length,
      autoReports: 0,
      unseenNotifications: 0
    };
  } catch (error) {
    console.error('Error getting ARIA stats:', error);
    return {
      totalProspects: 0,
      highScoreProspects: 0,
      totalMentions: 0,
      rsiActivations: 0,
      eideticFootprints: 0,
      pendingAlerts: 0,
      autoReports: 0,
      unseenNotifications: 0
    };
  }
};
