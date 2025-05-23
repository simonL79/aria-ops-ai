
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ScanResult, MonitoringStatus } from './types';

/**
 * Get the current monitoring status
 */
export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
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
        sources: 0,
        sourcesCount: 0
      };
    }
    
    return {
      isActive: data.is_active,
      lastRun: data.last_run ? new Date(data.last_run) : null,
      nextRun: data.next_run ? new Date(data.next_run) : null,
      sources: data.sources_count,
      sourcesCount: data.sources_count
    };
    
  } catch (error) {
    console.error("Error in getMonitoringStatus:", error);
    return {
      isActive: false,
      lastRun: null,
      nextRun: null,
      sources: 0,
      sourcesCount: 0
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

    // Call the run_scan function via RPC
    const { data, error } = await supabase.rpc('run_scan', { scan_depth: 'standard' });
    
    if (error) {
      console.error("Error running monitoring scan:", error);
      toast.error("Failed to run monitoring scan");
      return [];
    }
    
    // Get the latest scan results
    const { data: scanResults, error: fetchError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (fetchError) {
      console.error("Error fetching scan results:", fetchError);
      return [];
    }
    
    // Convert to the expected format
    const results = scanResults?.map(item => ({
      id: item.id,
      content: item.content,
      platform: item.platform,
      url: item.url || '',
      date: item.created_at,
      sentiment: item.sentiment || 0,
      severity: item.severity as 'low' | 'medium' | 'high',
      status: item.status as 'new' | 'read' | 'actioned' | 'resolved',
      threatType: item.threat_type,
      client_id: item.client_id,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) || [];
    
    if (results.length > 0) {
      toast.success(`Scan completed: ${results.length} mentions found`);
    } else {
      toast.info("Scan completed: No new mentions found");
    }
    
    return results;
    
  } catch (error) {
    console.error("Error in runMonitoringScan:", error);
    toast.error("An error occurred while running the scan");
    return [];
  }
};
