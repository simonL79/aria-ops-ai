import { toast } from "sonner";
import { MonitoringStatus } from "./types";

/**
 * Get current monitoring status
 */
export const getMonitoringStatus = (): MonitoringStatus => {
  const now = new Date();
  const nextRun = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
  const activeSince = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  return {
    isActive: true,
    lastRun: now.toISOString(),
    nextRun: nextRun.toISOString(), 
    sources: Math.floor(15 + Math.random() * 5), // 15-20 sources
    activeSince: activeSince
  };
};

/**
 * Start monitoring service
 * In a real implementation, this would connect to actual monitoring services
 */
export const startMonitoring = () => {
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
  console.log("Stopping real-time monitoring services...");
  
  // Toast notification for user feedback
  setTimeout(() => {
    toast.info("Monitoring paused", {
      description: "All monitoring systems have been paused."
    });
  }, 1000);
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

/**
 * Run a manual monitoring scan
 */
export const runMonitoringScan = async (): Promise<{ success: boolean; newMentions: number }> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
  
  // Simulate finding new mentions
  const newMentionsCount = Math.floor(Math.random() * 5); // 0-4 new mentions
  
  // Toast notification for user feedback
  toast.success("Analysis complete", {
    description: `Found ${newMentionsCount} new mentions and updated reputation metrics.`
  });
  
  return {
    success: true,
    newMentions: newMentionsCount
  };
};
