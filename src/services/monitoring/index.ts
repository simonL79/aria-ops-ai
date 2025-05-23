
import { ScanResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { ContentAlert } from '@/types/dashboard';

/**
 * Get monitoring status from database
 */
export const getMonitoringStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .eq('id', '1')
      .single();
    
    if (error) {
      console.error('Error fetching monitoring status:', error);
      return {
        isActive: false,
        lastRun: null,
        nextRun: null
      };
    }
    
    return {
      isActive: data.is_active,
      lastRun: data.last_run,
      nextRun: data.next_run,
      sources: data.sources_count
    };
  } catch (error) {
    console.error('Error in getMonitoringStatus:', error);
    return {
      isActive: false,
      lastRun: null,
      nextRun: null
    };
  }
};

/**
 * Start monitoring service
 */
export const startMonitoring = async () => {
  try {
    const { error } = await supabase
      .from('monitoring_status')
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', '1');
    
    if (error) {
      console.error('Error starting monitoring:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in startMonitoring:', error);
    return false;
  }
};

/**
 * Stop monitoring service
 */
export const stopMonitoring = async () => {
  try {
    const { error } = await supabase
      .from('monitoring_status')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', '1');
    
    if (error) {
      console.error('Error stopping monitoring:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in stopMonitoring:', error);
    return false;
  }
};

/**
 * Get mentions as formatted ContentAlerts
 */
export const getMentionsAsAlerts = async (): Promise<ContentAlert[]> => {
  try {
    console.log('Fetching mentions as alerts...');
    
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) {
      console.error('Error fetching scan results:', error);
      return [];
    }
    
    console.log(`Fetched ${scanResults?.length || 0} scan results to convert to alerts`);
    
    // Convert to ContentAlert format
    return (scanResults || []).map((item): ContentAlert => {
      let detectedEntities: string[] = [];
      
      // Handle detected_entities in various formats
      if (item.detected_entities) {
        if (Array.isArray(item.detected_entities)) {
          detectedEntities = item.detected_entities.map(entity => {
            if (typeof entity === 'string') return entity;
            if (typeof entity === 'object' && entity.name) return entity.name;
            return String(entity);
          });
        } else if (typeof item.detected_entities === 'object') {
          detectedEntities = Object.values(item.detected_entities)
            .filter(Boolean)
            .map(entity => String(entity));
        }
      }
      
      // Map sentiment number to string value
      const sentimentValue = mapSentimentToString(item.sentiment);
      
      return {
        id: item.id,
        platform: item.platform,
        content: item.content,
        date: new Date(item.created_at).toLocaleString(),
        severity: (item.severity as 'high' | 'medium' | 'low') || 'low',
        status: (item.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
        url: item.url || '',
        threatType: item.threat_type,
        sourceType: item.source_type || 'scan',
        confidenceScore: item.confidence_score || 75,
        sentiment: sentimentValue,
        detectedEntities: detectedEntities,
        potentialReach: item.potential_reach || 0
      };
    });
  } catch (error) {
    console.error('Error in getMentionsAsAlerts:', error);
    return [];
  }
};

/**
 * Helper function to map numeric sentiment to string values
 */
const mapSentimentToString = (sentiment?: number): 'threatening' | 'negative' | 'neutral' | 'positive' => {
  if (sentiment === undefined || sentiment === null) return 'neutral';
  
  if (sentiment < -70) return 'threatening';
  if (sentiment < -20) return 'negative';
  if (sentiment > 50) return 'positive';
  return 'neutral';
};

// Re-export scan functions for convenience
export { runMonitoringScan } from './scan';
