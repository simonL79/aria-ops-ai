
import { MonitorablePlatform } from './types';

// Available platforms to monitor
const platforms: MonitorablePlatform[] = [
  { id: 'twitter', name: 'Twitter', type: 'social', enabled: true, coverage: 95 },
  { id: 'facebook', name: 'Facebook', type: 'social', enabled: true, coverage: 90 },
  { id: 'reddit', name: 'Reddit', type: 'social', enabled: true, coverage: 85 },
  { id: 'instagram', name: 'Instagram', type: 'social', enabled: true, coverage: 80 },
  { id: 'youtube', name: 'YouTube', type: 'video', enabled: true, coverage: 75 },
  { id: 'news', name: 'News Sites', type: 'news', enabled: true, coverage: 70 },
  { id: 'blogs', name: 'Blogs', type: 'blog', enabled: true, coverage: 65 },
  { id: 'review_sites', name: 'Review Sites', type: 'review', enabled: true, coverage: 60 },
  { id: 'telegram', name: 'Telegram', type: 'messaging', enabled: true, coverage: 55 },
  { id: 'darkweb', name: 'Dark Web', type: 'darkweb', enabled: true, coverage: 50 }
];

/**
 * Get all monitored platforms
 */
export const getMonitoredPlatforms = (): MonitorablePlatform[] => {
  return platforms;
};

/**
 * Check if a platform is being monitored
 */
export const isPlatformMonitored = (platformId: string): boolean => {
  const platform = platforms.find(p => p.id === platformId);
  return platform?.enabled || false;
};

/**
 * Update platform monitoring status
 */
export const updatePlatformStatus = (platformId: string, enabled: boolean): void => {
  const platform = platforms.find(p => p.id === platformId);
  if (platform) {
    platform.enabled = enabled;
  }
};
