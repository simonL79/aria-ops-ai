
import { supabase } from '@/integrations/supabase/client';
import type { ScanResult } from './types';
import { toast } from 'sonner';

/**
 * Run a monitoring scan and return results
 */
export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  try {
    // First, update the monitoring status
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .update({
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', '1');
    
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
