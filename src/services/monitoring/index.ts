
// Re-export all monitoring services from a single entry point

// Status management
export { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring,
  runMonitoringScan
} from './status';

// Mention management
export { 
  saveMention, 
  getAllMentions, 
  clearMentions,
  getMentionsByPlatform
} from './mentions';

// Platform monitoring
export { 
  getMonitoredPlatforms,
  isPlatformMonitored,
  updatePlatformStatus
} from './platforms';

// Alert conversion
export { 
  getMentionsAsAlerts 
} from './alerts';

// Types
export type { 
  MonitoringStatus, 
  MonitorablePlatform, 
  Mention,
  ScanResult
} from './types';
