
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
    const { data, error } = await supabase
      .from('prospect_entities')
      .select('*')
      .order('escalation_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching prospect entities:', error);
      return [];
    }

    return data || [];
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

export const getRejectedThreats = async (): Promise<RejectedThreat[]> => {
  try {
    const { data, error } = await supabase
      .from('rejected_threats_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching rejected threats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRejectedThreats:', error);
    return [];
  }
};

export const markAlertProcessed = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('prospect_alerts')
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
