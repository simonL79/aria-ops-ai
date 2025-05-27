
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MonitoringStatus, ScanResult } from './types';

export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching monitoring status:", error);
      return {
        isActive: false,
        lastRun: null,
        nextRun: null,
        scanInterval: 60
      };
    }
    
    return {
      isActive: data?.is_active || false,
      lastRun: data?.last_run ? new Date(data.last_run) : null,
      nextRun: data?.next_run ? new Date(data.next_run) : null,
      scanInterval: data?.scan_interval || 60
    };
  } catch (error) {
    console.error("Error in getMonitoringStatus:", error);
    return {
      isActive: false,
      lastRun: null,
      nextRun: null,
      scanInterval: 60
    };
  }
};

export const startMonitoring = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: true,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error starting monitoring:", error);
      return false;
    }
    
    toast.success("Monitoring started successfully");
    return true;
  } catch (error) {
    console.error("Error in startMonitoring:", error);
    return false;
  }
};

export const stopMonitoring = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('monitoring_status')
      .upsert({
        id: '1',
        is_active: false,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error stopping monitoring:", error);
      return false;
    }
    
    toast.success("Monitoring stopped");
    return true;
  } catch (error) {
    console.error("Error in stopMonitoring:", error);
    return false;
  }
};

export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  try {
    toast.info("Starting monitoring scan...");
    
    // Call the monitoring scan edge function
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: { scanType: 'manual' }
    });
    
    if (error) {
      console.error("Monitoring scan error:", error);
      toast.error("Monitoring scan failed");
      return [];
    }
    
    if (data?.success && data.results) {
      toast.success(`Monitoring scan completed: ${data.results.length} results found`);
      return data.results;
    }
    
    toast.info("Monitoring scan completed with no results");
    return [];
  } catch (error) {
    console.error("Error in runMonitoringScan:", error);
    toast.error("Monitoring scan failed");
    return [];
  }
};
