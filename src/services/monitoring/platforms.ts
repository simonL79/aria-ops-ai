
import { MonitorablePlatform } from "./types";

// Default monitored platforms
const monitoredPlatforms: MonitorablePlatform[] = [
  { id: 'twitter', name: 'Twitter', isActive: true },
  { id: 'facebook', name: 'Facebook', isActive: true },
  { id: 'instagram', name: 'Instagram', isActive: false },
  { id: 'linkedin', name: 'LinkedIn', isActive: true },
  { id: 'news', name: 'News Sites', isActive: true },
  { id: 'reddit', name: 'Reddit', isActive: true },
  { id: 'youtube', name: 'YouTube', isActive: false },
  { id: 'tiktok', name: 'TikTok', isActive: false }
];

/**
 * Get all monitored platforms
 */
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  return [...monitoredPlatforms];
};

/**
 * Check if a platform is being monitored
 */
export const isPlatformMonitored = (platformId: string): boolean => {
  const platform = monitoredPlatforms.find(p => p.id === platformId);
  return platform ? platform.isActive : false;
};

/**
 * Update platform monitoring status
 */
export const updatePlatformStatus = (platformId: string, isActive: boolean): void => {
  const platformIndex = monitoredPlatforms.findIndex(p => p.id === platformId);
  if (platformIndex >= 0) {
    monitoredPlatforms[platformIndex].isActive = isActive;
  }
};
