
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ScanResult, MonitoringStatus } from './monitoring/types';

export type { ScanResult, MonitoringStatus };

// Re-export main functions from the refactored service
export { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring, 
  runMonitoringScan 
} from './monitoring/monitoringService';

/**
 * Get all available monitoring sources
 */
export const getAvailableSources = async (): Promise<any[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('monitoring_sources')
      .select('*');
    
    if (error) {
      console.error("Error fetching monitoring sources:", error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error("Error in getAvailableSources:", error);
    return [];
  }
};

/**
 * Get recent scan results
 */
export const getScanResults = async (limit: number = 10): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching scan results:", error);
      return [];
    }
    
    if (!data) return [];

    // Map database columns to ScanResult interface  
    return data.map((item: any) => ({
      id: item.id,
      content: item.content,
      platform: item.platform,
      url: item.url || '',
      date: item.created_at,
      sentiment: Number(item.sentiment) || 0,
      severity: item.severity as 'low' | 'medium' | 'high',
      status: item.status as 'new' | 'read' | 'actioned' | 'resolved',
      threatType: item.threat_type,
      client_id: null,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
  } catch (error) {
    console.error("Error in getScanResults:", error);
    return [];
  }
};

/**
 * Update the status of a scan result
 */
export const updateScanResultStatus = async (id: string, status: 'read' | 'actioned' | 'resolved'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating scan result status:", error);
      toast.error("Failed to update status");
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error("Error in updateScanResultStatus:", error);
    return false;
  }
};

/**
 * Get mentions as alerts for the real-time alerts system
 */
export const getMentionsAsAlerts = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching mentions as alerts:", error);
      return [];
    }
    
    if (!data) return [];

    // Map the database results to the expected format
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: item.created_at,
      severity: item.severity,
      status: item.status,
      url: item.url || '',
      threatType: item.threat_type
    }));
    
  } catch (error) {
    console.error("Error in getMentionsAsAlerts:", error);
    return [];
  }
};

/**
 * Insert default monitoring platforms if none exist
 */
export const initializeMonitoringPlatforms = async (): Promise<void> => {
  try {
    // Check if we have any platforms
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('count')
      .single();
    
    if (error) {
      console.error("Error checking monitored platforms:", error);
      return;
    }
    
    const count = data?.count || 0;
    
    // Only add default platforms if none exist
    if (count === 0) {
      const defaultPlatforms = [
        { platform_name: 'Twitter', platform_type: 'social', is_active: true },
        { platform_name: 'Facebook', platform_type: 'social', is_active: true },
        { platform_name: 'Reddit', platform_type: 'forum', is_active: true },
        { platform_name: 'Yelp', platform_type: 'review', is_active: true },
        { platform_name: 'Google Reviews', platform_type: 'review', is_active: true }
      ];
      
      const { error: insertError } = await supabase
        .from('monitored_platforms')
        .insert(defaultPlatforms);
      
      if (insertError) {
        console.error("Error initializing monitoring platforms:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in initializeMonitoringPlatforms:", error);
  }
};
