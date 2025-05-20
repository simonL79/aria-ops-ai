
import { MonitoringStatus } from "./types";
import { getMonitoredPlatforms } from "./platforms";

// Monitoring status
let monitoringStatus: MonitoringStatus = {
  isActive: true,
  lastRun: new Date(),
  nextRun: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  sources: getMonitoredPlatforms().filter(p => p.enabled).length
};

/**
 * Returns the current monitoring status
 */
export const getMonitoringStatus = (): MonitoringStatus => {
  return monitoringStatus;
};

/**
 * Starts the monitoring process
 */
export const startMonitoring = () => {
  // Start the monitoring process
  monitoringStatus = {
    isActive: true,
    lastRun: new Date(),
    nextRun: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    sources: getMonitoredPlatforms().filter(p => p.enabled).length
  };
  
  return {
    success: true,
    started: new Date().toISOString()
  };
};

/**
 * Stops the monitoring process
 */
export const stopMonitoring = () => {
  // Stop the monitoring process
  monitoringStatus.isActive = false;
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

/**
 * Updates the monitoring status after a scan
 */
export const updateMonitoringStatus = () => {
  const lastRun = new Date();
  const nextRun = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  
  // Update monitoring status
  monitoringStatus = {
    isActive: true,
    lastRun,
    nextRun,
    sources: getMonitoredPlatforms().filter(p => p.enabled).length
  };
};
