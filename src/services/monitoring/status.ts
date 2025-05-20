
import { MonitoringStatus } from "./types";
import { getAvailableSources } from "@/services/dataIngestion";

// Mock monitoring status
let monitoringStatus: MonitoringStatus = {
  isActive: false,
  lastRun: new Date(),
  nextRun: new Date(),
  sources: getAvailableSources().filter(s => s.active).length
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
  // Simulate starting the monitoring process
  monitoringStatus = {
    isActive: true,
    lastRun: new Date(),
    nextRun: new Date(),
    sources: getAvailableSources().filter(s => s.active).length
  };
  
  // Set next run time
  monitoringStatus.nextRun.setHours(monitoringStatus.lastRun.getHours() + 1);
};

/**
 * Stops the monitoring process
 */
export const stopMonitoring = () => {
  // Simulate stopping the monitoring process
  monitoringStatus.isActive = false;
};

/**
 * Updates the monitoring status after a scan
 */
export const updateMonitoringStatus = () => {
  const lastRun = new Date();
  const nextRun = new Date();
  nextRun.setHours(lastRun.getHours() + 1);
  
  // Update monitoring status
  monitoringStatus = {
    isActive: true,
    lastRun,
    nextRun,
    sources: getAvailableSources().filter(s => s.active).length
  };
};
