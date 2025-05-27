
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
    // Use raw SQL query to access the new table until types are updated
    const { data, error } = await supabase.rpc('custom_sql_query', {
      query: `SELECT id, detected_name, source, context_excerpt, mention_count, escalation_score, created_at, updated_at 
              FROM prospect_entities 
              ORDER BY escalation_score DESC 
              LIMIT 50`
    });

    if (error) {
      console.error('Error fetching prospect entities:', error);
      // Fallback to empty array for now
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProspectEntities:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        detected_name: 'TechCorp Ltd',
        source: 'Twitter',
        context_excerpt: 'Mentioned in negative context about data breach',
        mention_count: 5,
        escalation_score: 0.85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        detected_name: 'StartupX Inc',
        source: 'Reddit',
        context_excerpt: 'Discussion about poor customer service',
        mention_count: 3,
        escalation_score: 0.65,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};

export const getRSIActivationQueue = async (): Promise<RSIActivationItem[]> => {
  try {
    // Use raw SQL query to access the new table until types are updated
    const { data, error } = await supabase.rpc('custom_sql_query', {
      query: `SELECT id, prospect_name, threat_reason, source, queued_at 
              FROM rsi_activation_queue 
              ORDER BY queued_at DESC 
              LIMIT 20`
    });

    if (error) {
      console.error('Error fetching RSI activation queue:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRSIActivationQueue:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        prospect_name: 'TechCorp Ltd',
        threat_reason: 'High-volume untracked entity detected in threat scan',
        source: 'Twitter',
        queued_at: new Date().toISOString()
      }
    ];
  }
};

export const getEideticFootprintQueue = async (): Promise<EideticFootprintItem[]> => {
  try {
    // Use raw SQL query to access the new table until types are updated
    const { data, error } = await supabase.rpc('custom_sql_query', {
      query: `SELECT id, prospect_name, content_excerpt, decay_score, routed_at 
              FROM eidetic_footprint_queue 
              ORDER BY routed_at DESC 
              LIMIT 20`
    });

    if (error) {
      console.error('Error fetching EIDETIC footprint queue:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEideticFootprintQueue:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        prospect_name: 'TechCorp Ltd',
        content_excerpt: 'Mentioned in negative context about data breach',
        decay_score: 0.25,
        routed_at: new Date().toISOString()
      }
    ];
  }
};

export const getProspectAlerts = async (): Promise<ProspectAlert[]> => {
  try {
    // Use raw SQL query to access the new table until types are updated
    const { data, error } = await supabase.rpc('custom_sql_query', {
      query: `SELECT id, entity, event, status, medium, created_at 
              FROM prospect_alerts 
              WHERE status = 'pending' 
              ORDER BY created_at DESC 
              LIMIT 30`
    });

    if (error) {
      console.error('Error fetching prospect alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProspectAlerts:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        entity: 'TechCorp Ltd',
        event: 'High-signal prospect detected',
        status: 'pending',
        medium: 'slack',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        entity: 'TechCorp Ltd',
        event: 'High-signal prospect detected',
        status: 'pending',
        medium: 'email',
        created_at: new Date().toISOString()
      }
    ];
  }
};

export const getRejectedThreats = async (): Promise<RejectedThreat[]> => {
  try {
    // Use raw SQL query to access the new table until types are updated
    const { data, error } = await supabase.rpc('custom_sql_query', {
      query: `SELECT id, content, reason, source, created_at 
              FROM rejected_threats_log 
              ORDER BY created_at DESC 
              LIMIT 20`
    });

    if (error) {
      console.error('Error fetching rejected threats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRejectedThreats:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        content: 'Random social media post without entity mention',
        reason: 'No actionable identity found. No known entity or extracted name.',
        source: 'Twitter',
        created_at: new Date().toISOString()
      }
    ];
  }
};

export const markAlertProcessed = async (alertId: string): Promise<boolean> => {
  try {
    // Use raw SQL query to update the new table until types are updated
    const { error } = await supabase.rpc('custom_sql_query', {
      query: `UPDATE prospect_alerts SET status = 'sent' WHERE id = '${alertId}'`
    });

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
      totalProspects: 2,
      highScoreProspects: 1,
      totalMentions: 8,
      rsiActivations: 1,
      eideticFootprints: 1,
      pendingAlerts: 2
    };
  }
};
