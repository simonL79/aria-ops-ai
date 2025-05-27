
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
    // Get entities from the new risk profiles system
    const { data, error } = await supabase
      .from('entity_risk_profiles')
      .select('*')
      .order('risk_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching prospect entities:', error);
      return [];
    }

    // Map entity_risk_profiles to ProspectEntity format
    const entities: ProspectEntity[] = (data || []).map(item => ({
      id: item.id,
      detected_name: item.entity_name,
      source: 'Risk Profile System',
      context_excerpt: `Risk Score: ${item.risk_score} | Signals: ${item.total_signals}`,
      mention_count: item.total_signals,
      escalation_score: item.risk_score,
      created_at: item.updated_at,
      updated_at: item.updated_at
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
      .from('rsi_activation_queue')
      .select('*')
      .order('queued_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching RSI activation queue:', error);
      return [];
    }

    return data || [];
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

    return data || [];
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

    return data || [];
  } catch (error) {
    console.error('Error in getProspectAlerts:', error);
    return [];
  }
};

export const getEntityRiskDashboard = async (): Promise<EntityRiskDashboard[]> => {
  try {
    const { data, error } = await supabase
      .from('entity_risk_dashboard')
      .select('*')
      .order('risk_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching entity risk dashboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEntityRiskDashboard:', error);
    return [];
  }
};

export const updateEntityRiskScores = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('update_entity_risk_scores');
    
    if (error) {
      console.error('Error updating entity risk scores:', error);
      return false;
    }
    
    toast.success('Entity risk scores updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateEntityRiskScores:', error);
    return false;
  }
};

export const triggerRiskEscalations = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('trigger_risk_escalations');
    
    if (error) {
      console.error('Error triggering risk escalations:', error);
      return false;
    }
    
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
    const [entities, rsiQueue, eideticQueue, alerts, riskDashboard, reports, notifications] = await Promise.all([
      getProspectEntities(),
      getRSIActivationQueue(),
      getEideticFootprintQueue(),
      getProspectAlerts(),
      getEntityRiskDashboard(),
      // Add new report and notification counts
      supabase.from('aria_reports').select('id', { count: 'exact', head: true }),
      supabase.from('aria_notifications').select('id', { count: 'exact', head: true }).eq('seen', false)
    ]);

    const highScoreProspects = riskDashboard.filter(e => e.risk_score >= 0.8).length;
    const totalMentions = riskDashboard.reduce((sum, e) => sum + e.total_signals, 0);
    
    return {
      totalProspects: entities.length,
      highScoreProspects,
      totalMentions,
      rsiActivations: rsiQueue.length,
      eideticFootprints: eideticQueue.length,
      pendingAlerts: alerts.length,
      autoReports: reports.count || 0,
      unseenNotifications: notifications.count || 0
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
