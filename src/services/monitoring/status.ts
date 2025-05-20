
import { toast } from "sonner";
import { MonitoringStatus } from "./types";

// In-memory status store
let monitoringActive = true;
let activeSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago

/**
 * Start monitoring service
 */
export const startMonitoring = () => {
  monitoringActive = true;
  activeSince = new Date().toISOString();
  
  console.log("Starting real-time monitoring services...");
  
  // Toast notification for user feedback
  setTimeout(() => {
    toast.success("Real-time monitoring active", {
      description: "All monitoring systems are now active and collecting data."
    });
  }, 1000);
  
  return {
    success: true,
    started: new Date().toISOString()
  };
};

/**
 * Stop monitoring service
 */
export const stopMonitoring = () => {
  monitoringActive = false;
  
  console.log("Stopping real-time monitoring services...");
  
  // Toast notification for user feedback
  setTimeout(() => {
    toast.info("Real-time monitoring paused", {
      description: "All monitoring systems have been paused."
    });
  }, 1000);
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

/**
 * Get current monitoring status
 */
export const getMonitoringStatus = (): MonitoringStatus => {
  return {
    isActive: monitoringActive,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    sources: Math.floor(15 + Math.random() * 5), // 15-20 sources
    activeSince: activeSince
  };
};
