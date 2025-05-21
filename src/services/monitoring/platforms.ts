
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
      console.error("Error fetching monitored platforms:", error);
      return [];
    }
    
    return data.map(platform => ({
      id: platform.id,
      name: platform.name,
      isActive: platform.active,
      type: platform.type
    }));
  } catch (error) {
    console.error("Error in getMonitoredPlatforms:", error);
    return [];
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
      console.error("Error checking platform status:", error);
      return false;
    }
    
    return data?.active || false;
  } catch (error) {
    console.error("Error in isPlatformMonitored:", error);
    return false;
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
      console.error("Error updating platform status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updatePlatformStatus:", error);
    return false;
  }
};

