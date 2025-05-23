
export { 
  getMonitoringStatus, 
  startMonitoring, 
  stopMonitoring, 
  runMonitoringScan 
} from './monitoringService';
export type { ScanResult, MonitoringStatus } from './types';

// Re-export other functions for backwards compatibility
export {
  getAvailableSources,
  getScanResults,
  updateScanResultStatus,
  getMentionsAsAlerts,
  initializeMonitoringPlatforms
} from '../monitoring';
