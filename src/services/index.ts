
// Re-export all services from a single entry point
import { 
  getMonitoringStatus,
  startMonitoring,
  runMonitoringScan
} from './monitoring/status';

import {
  saveMention,
  getAllMentions,
  clearMentions,
  getMentionsByPlatform
} from './monitoring/mentions';

import {
  getMonitoredPlatforms,
  isPlatformMonitored,
  updatePlatformStatus
} from './monitoring/platforms';

import {
  getMentionsAsAlerts
} from './monitoring/alerts';

// Export the stopMonitoring function
const stopMonitoring = () => {
  console.log("Stopping real-time monitoring services...");
  
  return {
    success: true,
    stopped: new Date().toISOString()
  };
};

// Re-export the runMonitoringScan function from scan.ts
import { runMonitoringScan as runScan } from './monitoring/scan';

// Export all services
export {
  // Monitoring status services
  getMonitoringStatus,
  startMonitoring,
  stopMonitoring,
  runScan as runMonitoringScan,
  
  // Mentions services
  saveMention,
  getAllMentions,
  clearMentions,
  getMentionsByPlatform,
  getMentionsAsAlerts,
  
  // Platform services
  getMonitoredPlatforms,
  isPlatformMonitored,
  updatePlatformStatus
};
