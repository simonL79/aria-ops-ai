
import { MonitorablePlatform } from "./types";

// List of platforms that can be monitored
const platforms: MonitorablePlatform[] = [
  { id: 'twitter', name: 'Twitter', isActive: true },
  { id: 'facebook', name: 'Facebook', isActive: true },
  { id: 'reddit', name: 'Reddit', isActive: true },
  { id: 'news', name: 'News Sites', isActive: true },
  { id: 'blogs', name: 'Blogs', isActive: true },
  { id: 'instagram', name: 'Instagram', isActive: true },
  { id: 'tiktok', name: 'TikTok', isActive: true },
  { id: 'youtube', name: 'YouTube', isActive: true },
  { id: 'dark_web', name: 'Dark Web', isActive: false },
];

/**
 * Get all platforms available for monitoring
 */
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  return [...platforms];
};

/**
 * Check if a specific platform is being monitored
 */
export const isPlatformMonitored = (platformId: string): boolean => {
  const platform = platforms.find(p => p.id === platformId);
  return platform ? platform.isActive : false;
};

/**
 * Update the monitoring status for a platform
 */
export const updatePlatformStatus = (platformId: string, isActive: boolean): boolean => {
  const platform = platforms.find(p => p.id === platformId);
  
  if (platform) {
    platform.isActive = isActive;
    return true;
  }
  
  return false;
};
