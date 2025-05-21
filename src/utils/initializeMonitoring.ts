
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize monitoring status if it doesn't exist
 */
export const initializeMonitoringStatus = async (): Promise<void> => {
  try {
    // Check if monitoring_status exists
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('id')
      .eq('id', '1')
      .maybeSingle();
    
    if (error) {
      console.error("Error checking monitoring status:", error);
      return;
    }
    
    // If no data, create initial monitoring status
    if (!data) {
      const { error: insertError } = await supabase
        .from('monitoring_status')
        .insert({
          id: '1',
          is_active: false,
          sources_count: 0,
          last_run: null,
          next_run: null
        });
      
      if (insertError) {
        console.error("Error initializing monitoring status:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in initializeMonitoringStatus:", error);
  }
};

/**
 * Initialize database with required data
 */
export const initializeDatabase = async (): Promise<void> => {
  await initializeMonitoringStatus();
  await initializeMonitoredPlatforms();
};

/**
 * Initialize monitored platforms if not exists
 */
export const initializeMonitoredPlatforms = async (): Promise<void> => {
  try {
    // Check if there are any platforms
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Error checking monitored platforms:", error);
      return;
    }
    
    // If no platforms, insert defaults
    if (!data || data.length === 0) {
      const defaultPlatforms = [
        { name: 'Twitter', type: 'social', active: true, positive_ratio: 35, total: 120, sentiment: -15 },
        { name: 'Facebook', type: 'social', active: true, positive_ratio: 87, total: 230, sentiment: 25 },
        { name: 'Reddit', type: 'forum', active: true, positive_ratio: 62, total: 85, sentiment: 5 },
        { name: 'LinkedIn', type: 'business', active: true, positive_ratio: 75, total: 58, sentiment: 15 },
        { name: 'News Sites', type: 'news', active: true, positive_ratio: 45, total: 42, sentiment: -8 },
        { name: 'Yelp', type: 'review', active: true, positive_ratio: 78, total: 45, sentiment: 18 },
        { name: 'Google Reviews', type: 'review', active: true, positive_ratio: 82, total: 90, sentiment: 22 }
      ];
      
      const { error: insertError } = await supabase
        .from('monitored_platforms')
        .insert(defaultPlatforms);
      
      if (insertError) {
        console.error("Error initializing monitored platforms:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in initializeMonitoredPlatforms:", error);
  }
};

/**
 * Initialize the entire monitoring system
 * This ensures that both the status and the platforms are properly initialized
 */
export const initializeMonitoringSystem = async (): Promise<void> => {
  try {
    await initializeDatabase();
    console.log("Monitoring system initialized successfully");
  } catch (error) {
    console.error("Error initializing monitoring system:", error);
  }
};
