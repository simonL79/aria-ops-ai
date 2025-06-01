
import { MonitorablePlatform } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all monitored platforms from database
 */
export const getMonitoredPlatforms = async (): Promise<MonitorablePlatform[]> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .order('name');
    
    if (error) {
      console.warn("Could not fetch monitored platforms (may require auth):", error.message);
      // Return default platforms if database access fails
      return [
        { id: 'twitter', name: 'Twitter', isActive: true, type: 'social' },
        { id: 'reddit', name: 'Reddit', isActive: true, type: 'forum' },
        { id: 'google-news', name: 'Google News', isActive: true, type: 'news' },
        { id: 'facebook', name: 'Facebook', isActive: true, type: 'social' },
        { id: 'linkedin', name: 'LinkedIn', isActive: true, type: 'professional' },
        { id: 'yelp', name: 'Yelp', isActive: true, type: 'review' }
      ];
    }
    
    return data.map(platform => ({
      id: platform.id,
      name: platform.name,
      isActive: platform.active,
      type: platform.type
    }));
  } catch (error) {
    console.warn("Error in getMonitoredPlatforms:", error);
    // Return default platforms as fallback
    return [
      { id: 'twitter', name: 'Twitter', isActive: true, type: 'social' },
      { id: 'reddit', name: 'Reddit', isActive: true, type: 'forum' },
      { id: 'google-news', name: 'Google News', isActive: true, type: 'news' },
      { id: 'facebook', name: 'Facebook', isActive: true, type: 'social' },
      { id: 'linkedin', name: 'LinkedIn', isActive: true, type: 'professional' },
      { id: 'yelp', name: 'Yelp', isActive: true, type: 'review' }
    ];
  }
};

/**
 * Check if a platform is being monitored
 */
export const isPlatformMonitored = async (platformName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('active')
      .eq('name', platformName)
      .maybeSingle();
    
    if (error) {
      console.warn("Could not check platform status:", error.message);
      return true; // Default to monitored if we can't check
    }
    
    return data?.active || false;
  } catch (error) {
    console.warn("Error in isPlatformMonitored:", error);
    return true; // Default to monitored if there's an error
  }
};

/**
 * Update platform monitoring status
 */
export const updatePlatformStatus = async (platformId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('monitored_platforms')
      .update({
        active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', platformId);
    
    if (error) {
      console.warn("Could not update platform status:", error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn("Error in updatePlatformStatus:", error);
    return false;
  }
};
