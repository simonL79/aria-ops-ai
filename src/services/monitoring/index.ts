
// Re-export all monitoring services from a single entry point

// Status management
export { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring 
} from './status';

// Mention management
export { 
  saveMention, 
  getAllMentions, 
  clearMentions 
} from './mentions';

// Platform monitoring
export { 
  getMonitoredPlatforms,
  isPlatformMonitored
} from './platforms';

// Alert conversion
export { 
  getMentionsAsAlerts 
} from './alerts';

// Scan functionality
export { 
  runMonitoringScan 
} from './scan';

// Types
export type { 
  MonitoringStatus, 
  MonitorablePlatform, 
  Mention 
} from './types';
