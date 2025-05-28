// This file is now deprecated - all functionality moved to liveScanner.ts
// Keeping for backwards compatibility but redirecting to live scanner

import { performLiveScan, performRealTimeMonitoring, getMonitoringStatus } from './liveScanner';

export const performRealScan = performLiveScan;
export const performMockScan = performLiveScan; // Redirect to live scan
export { getMonitoringStatus, performRealTimeMonitoring };

// Remove all mock data
export const mockScanResults = [];

export const registerAlertListener = (callback: any) => {
  console.log('Real-time alert listener registered for live data');
  return () => console.log('Alert listener unregistered');
};

export const unregisterAlertListener = (listenerId: string) => {
  console.log('Alert listener unregistered:', listenerId);
};
