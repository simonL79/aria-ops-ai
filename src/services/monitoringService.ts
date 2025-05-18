
import { toast } from "sonner";
import { fetchContent } from "@/services/dataIngestionService";
import { ContentAlert } from "@/types/dashboard";

export type MonitoringFrequency = '5min' | '15min' | '30min' | '1hour' | '6hours' | '24hours';

// Default configuration
let monitoringConfig = {
  isActive: true,
  frequency: '30min' as MonitoringFrequency,
  keywords: ['company name', 'brand name'],
  sources: ['twitter', 'reddit', 'google_news'],
  lastRun: new Date().toISOString(),
  nextRun: null as Date | null
};

// Timer ID for cleanup
let monitoringIntervalId: number | null = null;

/**
 * Starts the monitoring scheduler
 */
export const startMonitoring = (config: Partial<typeof monitoringConfig> = {}): void => {
  // Stop any existing monitoring
  stopMonitoring();
  
  // Update config
  monitoringConfig = { ...monitoringConfig, ...config };
  
  // Calculate milliseconds for the frequency
  const frequencyMap: Record<MonitoringFrequency, number> = {
    '5min': 5 * 60 * 1000,
    '15min': 15 * 60 * 1000,
    '30min': 30 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
    '6hours': 6 * 60 * 60 * 1000,
    '24hours': 24 * 60 * 60 * 1000
  };
  
  const interval = frequencyMap[monitoringConfig.frequency];
  
  // Set up the next run time
  const nextRun = new Date();
  nextRun.setTime(nextRun.getTime() + interval);
  monitoringConfig.nextRun = nextRun;
  
  // Set up the interval for automatic scanning
  monitoringIntervalId = window.setInterval(async () => {
    await runMonitoringScan();
  }, interval);
  
  toast.success(`Monitoring activated with ${monitoringConfig.frequency} frequency`);
};

/**
 * Stops the monitoring scheduler
 */
export const stopMonitoring = (): void => {
  if (monitoringIntervalId !== null) {
    window.clearInterval(monitoringIntervalId);
    monitoringIntervalId = null;
    monitoringConfig.isActive = false;
    monitoringConfig.nextRun = null;
    toast.info("Monitoring has been stopped");
  }
};

/**
 * Updates the monitoring configuration
 */
export const updateMonitoringConfig = (config: Partial<typeof monitoringConfig>): void => {
  const wasActive = monitoringConfig.isActive;
  monitoringConfig = { ...monitoringConfig, ...config };
  
  if (wasActive && monitoringConfig.isActive) {
    // If it was active and should remain active, restart with new config
    startMonitoring(monitoringConfig);
  }
};

/**
 * Runs a manual monitoring scan
 */
export const runMonitoringScan = async (): Promise<ContentAlert[]> => {
  try {
    monitoringConfig.lastRun = new Date().toISOString();
    
    const alerts = await fetchContent({
      keywords: monitoringConfig.keywords,
      sources: monitoringConfig.sources
    });
    
    if (alerts.length > 0) {
      toast.success(`Monitoring scan completed`, {
        description: `Found ${alerts.length} new mentions.`
      });
    } else {
      toast.info("Monitoring scan completed", {
        description: "No new mentions found."
      });
    }
    
    // If we have active monitoring, update the next run time
    if (monitoringConfig.isActive && monitoringIntervalId !== null) {
      const frequencyMap: Record<MonitoringFrequency, number> = {
        '5min': 5 * 60 * 1000,
        '15min': 15 * 60 * 1000,
        '30min': 30 * 60 * 1000,
        '1hour': 60 * 60 * 1000,
        '6hours': 6 * 60 * 60 * 1000,
        '24hours': 24 * 60 * 60 * 1000
      };
      
      const interval = frequencyMap[monitoringConfig.frequency];
      const nextRun = new Date();
      nextRun.setTime(nextRun.getTime() + interval);
      monitoringConfig.nextRun = nextRun;
    }
    
    return alerts;
    
  } catch (error) {
    console.error("Error running monitoring scan:", error);
    toast.error("Monitoring scan failed");
    return [];
  }
};

/**
 * Gets the current monitoring status
 */
export const getMonitoringStatus = () => {
  return {
    isActive: monitoringConfig.isActive,
    frequency: monitoringConfig.frequency,
    lastRun: monitoringConfig.lastRun,
    nextRun: monitoringConfig.nextRun,
    sources: monitoringConfig.sources.length
  };
};
