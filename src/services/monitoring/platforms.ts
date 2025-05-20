
import { MonitorablePlatform } from './types';

// Mock data for monitored platforms
const monitoredPlatforms: MonitorablePlatform[] = [
  { id: 'twitter', name: 'Twitter', type: 'social', enabled: true, coverage: 95 },
  { id: 'facebook', name: 'Facebook', type: 'social', enabled: true, coverage: 90 },
  { id: 'reddit', name: 'Reddit', type: 'social', enabled: true, coverage: 85 },
  { id: 'news', name: 'News Sites', type: 'news', enabled: true, coverage: 75 },
  { id: 'blogs', name: 'Blogs', type: 'web', enabled: true, coverage: 65 },
];

/**
 * Get the list of platforms being monitored
 */
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  return monitoredPlatforms;
};

/**
 * Check if a specific platform is being monitored
 */
export const isPlatformMonitored = (platformId: string): boolean => {
  const platform = monitoredPlatforms.find(p => p.id === platformId);
  return platform ? platform.enabled : false;
};

/**
 * Update the monitoring status for a platform
 */
export const updatePlatformStatus = (platformId: string, enabled: boolean): void => {
  const platform = monitoredPlatforms.find(p => p.id === platformId);
  if (platform) {
    platform.enabled = enabled;
  }
};
