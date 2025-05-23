
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  sentiment: number;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threat_type?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
  source_type?: string;
  confidence_score?: number;
  potential_reach?: number;
  detected_entities?: any;
  source_credibility_score?: number;
  media_is_ai_generated?: boolean;
  ai_detection_confidence?: number;
  incident_playbook?: string;
}

/**
 * Get scan results with pagination
 */
export const getScanResults = async (limit: number = 20, page: number = 0): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      console.error("Error fetching scan results:", error);
      toast.error("Failed to fetch scan results");
      return [];
    }
    
    // Convert and validate the severity field to ensure it matches the expected type
    return data?.map(item => ({
      ...item,
      // Ensure severity is one of the allowed values, defaulting to 'medium' if invalid
      severity: (item.severity === 'low' || item.severity === 'medium' || item.severity === 'high') 
        ? item.severity as 'low' | 'medium' | 'high'
        : 'medium',
      // Ensure status is one of the allowed values, defaulting to 'new' if invalid
      status: (item.status === 'new' || item.status === 'read' || item.status === 'actioned' || item.status === 'resolved')
        ? item.status as 'new' | 'read' | 'actioned' | 'resolved'
        : 'new'
    })) || [];
  } catch (error) {
    console.error("Error in getScanResults:", error);
    toast.error("An error occurred while fetching scan results");
    return [];
  }
};

/**
 * Get a single scan result by ID
 */
export const getScanResultById = async (id: string): Promise<ScanResult | null> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching scan result:", error);
      return null;
    }
    
    if (!data) return null;
    
    // Convert and validate the severity and status fields
    return {
      ...data,
      severity: (data.severity === 'low' || data.severity === 'medium' || data.severity === 'high') 
        ? data.severity as 'low' | 'medium' | 'high'
        : 'medium',
      status: (data.status === 'new' || data.status === 'read' || data.status === 'actioned' || data.status === 'resolved')
        ? data.status as 'new' | 'read' | 'actioned' | 'resolved'
        : 'new'
    };
  } catch (error) {
    console.error("Error in getScanResultById:", error);
    return null;
  }
};

/**
 * Update scan result status
 */
export const updateScanResultStatus = async (id: string, status: 'read' | 'actioned' | 'resolved'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
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
 * Run a new scan and return the results
 */
export const runScan = async (depth: string = 'standard'): Promise<ScanResult[]> => {
  try {
    // Call the stored function to run a scan
    const { data, error } = await supabase
      .rpc('run_scan', { scan_depth: depth });
    
    if (error) {
      console.error("Error running scan:", error);
      toast.error("Failed to run scan");
      return [];
    }
    
    // Get the latest scan results after running the scan
    return await getScanResults(10, 0);
  } catch (error) {
    console.error("Error in runScan:", error);
    toast.error("An error occurred during the scan");
    return [];
  }
};

/**
 * Get content alerts with pagination
 */
export const getContentAlerts = async (limit: number = 20, page: number = 0): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('content_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      console.error("Error fetching content alerts:", error);
      toast.error("Failed to fetch content alerts");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getContentAlerts:", error);
    toast.error("An error occurred while fetching alerts");
    return [];
  }
};

/**
 * Get all monitored platforms
 */
export const getMonitoredPlatforms = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching monitored platforms:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getMonitoredPlatforms:", error);
    return [];
  }
};

/**
 * Create/update a monitored platform
 */
export const upsertMonitoredPlatform = async (platform: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('monitored_platforms')
      .upsert({
        ...platform,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error upserting monitored platform:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in upsertMonitoredPlatform:", error);
    return false;
  }
};

/**
 * Get content actions with pagination
 */
export const getContentActions = async (limit: number = 20, page: number = 0): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('content_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      console.error("Error fetching content actions:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getContentActions:", error);
    return [];
  }
};

/**
 * Create a new content action
 */
export const createContentAction = async (action: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_actions')
      .insert({
        ...action,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error creating content action:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in createContentAction:", error);
    return false;
  }
};
