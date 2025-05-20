
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MonitoringStatus {
  isActive: boolean;
  lastRun: string | null;
  nextRun: string | null;
  sources: number;
}

export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  date: string;
  sentiment: number;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threatType?: string;
  client_id?: string;
}

/**
 * Get the current monitoring status
 */
export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  try {
    // Using 'as any' to bypass type checking for tables not in the Supabase schema yet
    const { data, error } = await (supabase
      .from('monitoring_status') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching monitoring status:", error);
      return {
        isActive: false,
        lastRun: null,
        nextRun: null,
        sources: 0
      };
    }
    
    return {
      isActive: data.is_active,
      lastRun: data.last_run,
      nextRun: data.next_run,
      sources: data.sources_count
    };
    
  } catch (error) {
    console.error("Error in getMonitoringStatus:", error);
    return {
      isActive: false,
      lastRun: null,
      nextRun: null,
      sources: 0
    };
  }
};

/**
 * Start the monitoring process
 */
export const startMonitoring = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .upsert({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error starting monitoring:", error);
      toast.error("Failed to start monitoring");
      return false;
    }
    
    toast.success("Monitoring started successfully");
    return true;
    
  } catch (error) {
    console.error("Error in startMonitoring:", error);
    toast.error("An error occurred while starting monitoring");
    return false;
  }
};

/**
 * Stop the monitoring process
 */
export const stopMonitoring = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .upsert({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error stopping monitoring:", error);
      toast.error("Failed to stop monitoring");
      return false;
    }
    
    toast.success("Monitoring paused successfully");
    return true;
    
  } catch (error) {
    console.error("Error in stopMonitoring:", error);
    toast.error("An error occurred while stopping monitoring");
    return false;
  }
};

/**
 * Run a manual monitoring scan
 */
export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  try {
    // First, update the monitoring status
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .upsert({
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (statusError) {
      console.error("Error updating monitoring status:", statusError);
    }

    // Invoke the monitoring scan edge function
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: { fullScan: true }
    });
    
    if (error) {
      console.error("Error running monitoring scan:", error);
      toast.error("Failed to run monitoring scan");
      return [];
    }
    
    if (data && data.results) {
      // Store the scan results in the database
      const { error: insertError } = await supabase
        .from('scan_results')
        .insert(data.results.map((result: any) => ({
          content: result.content,
          platform: result.platform,
          url: result.url || '',
          sentiment: result.sentiment || 0,
          severity: result.severity || 'medium',
          status: 'new',
          threat_type: result.threatType || null,
          client_id: result.clientId || null
        })));
      
      if (insertError) {
        console.error("Error storing scan results:", insertError);
      }
      
      toast.success(`Scan completed: ${data.results.length} mentions found`);
      return data.results;
    }
    
    toast.info("Scan completed: No new mentions found");
    return [];
    
  } catch (error) {
    console.error("Error in runMonitoringScan:", error);
    toast.error("An error occurred while running the scan");
    return [];
  }
};

/**
 * Get all available monitoring sources
 */
export const getAvailableSources = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
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
    
    return data.map(item => ({
      id: item.id,
      content: item.content,
      platform: item.platform,
      url: item.url,
      date: item.created_at,
      sentiment: item.sentiment,
      severity: item.severity,
      status: item.status,
      threatType: item.threat_type,
      client_id: item.client_id
    })) || [];
    
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
    
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: item.created_at,
      severity: item.severity,
      status: item.status,
      url: item.url,
      threatType: item.threat_type
    })) || [];
    
  } catch (error) {
    console.error("Error in getMentionsAsAlerts:", error);
    return [];
  }
};
