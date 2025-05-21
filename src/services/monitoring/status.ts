
import { toast } from "sonner";
import { MonitoringStatus, ScanResult } from "./types";

/**
 * Get current monitoring status
 */
export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  try {
    // Get the monitoring status from Supabase
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .eq('id', '1')
      .single();
    
    if (error) {
      console.error("Error fetching monitoring status:", error);
      throw error;
    }
    
    if (!data) {
      // Create a default status if not present
      const now = new Date();
      const nextRun = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
      const activeSince = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      return {
        isActive: false,
        lastRun: null,
        nextRun: null,
        sourcesCount: 0,
        activeSince: activeSince
      };
    }
    
    // Map database fields to our type
    return {
      isActive: data.is_active,
      lastRun: data.last_run ? new Date(data.last_run) : null,
      nextRun: data.next_run ? new Date(data.next_run) : null,
      sourcesCount: data.sources_count || 0,
      activeSince: data.created_at ? new Date(data.created_at) : undefined
    };
  } catch (error) {
    console.error("Error in getMonitoringStatus:", error);
    // Fallback to a default status on error
    const now = new Date();
    const nextRun = new Date(now.getTime() + 5 * 60 * 1000);
    const activeSince = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      isActive: false,
      lastRun: null,
      nextRun: null,
      sourcesCount: 0,
      activeSince: activeSince
    };
  }
};

/**
 * Start monitoring service
 */
export const startMonitoring = async () => {
  console.log("Starting real-time monitoring services...");
  
  try {
    // Update database to set monitoring as active
    const { supabase } = await import('@/integrations/supabase/client');
    const now = new Date();
    const nextRun = new Date(now.getTime() + 5 * 60 * 1000);
    
    const { error } = await supabase
      .from('monitoring_status')
      .update({
        is_active: true,
        updated_at: now.toISOString(),
        next_run: nextRun.toISOString()
      })
      .eq('id', '1');
    
    if (error) {
      console.error("Error updating monitoring status:", error);
      throw error;
    }
    
    // Toast notification for user feedback
    toast.success("Real-time monitoring active", {
      description: "All monitoring systems are now active and collecting data."
    });
    
    return {
      success: true,
      started: now.toISOString()
    };
  } catch (error) {
    console.error("Error in startMonitoring:", error);
    toast.error("Failed to start monitoring");
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Stop monitoring service
 */
export const stopMonitoring = async () => {
  console.log("Stopping real-time monitoring services...");
  
  try {
    // Update database to set monitoring as inactive
    const { supabase } = await import('@/integrations/supabase/client');
    const now = new Date();
    
    const { error } = await supabase
      .from('monitoring_status')
      .update({
        is_active: false,
        updated_at: now.toISOString(),
        next_run: null
      })
      .eq('id', '1');
    
    if (error) {
      console.error("Error updating monitoring status:", error);
      throw error;
    }
    
    // Toast notification for user feedback
    toast.info("Monitoring paused", {
      description: "All monitoring systems have been paused."
    });
    
    return {
      success: true,
      stopped: now.toISOString()
    };
  } catch (error) {
    console.error("Error in stopMonitoring:", error);
    toast.error("Failed to stop monitoring");
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Run a manual monitoring scan
 */
export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  // Import the scan function to prevent circular dependencies
  const { runMonitoringScan: runScan } = await import('./scan');
  
  // Call the actual scan function
  return runScan();
};

