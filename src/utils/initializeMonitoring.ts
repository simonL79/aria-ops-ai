
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
          sources_count: 5,
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
 * Initialize monitoring sources if they don't exist
 */
export const initializeMonitoringSources = async (): Promise<void> => {
  try {
    // Check if monitoring_sources has data
    const { data, error } = await supabase
      .from('monitoring_sources')
      .select('count')
      .single();
    
    if (error) {
      console.error("Error checking monitoring sources:", error);
      return;
    }
    
    const count = data?.count || 0;
    
    // If no data, create initial monitoring sources
    if (count === 0) {
      const defaultSources = [
        { name: 'Twitter', type: 'social' },
        { name: 'Facebook', type: 'social' },
        { name: 'Reddit', type: 'forum' },
        { name: 'LinkedIn', type: 'business' },
        { name: 'News Sites', type: 'news' },
        { name: 'Yelp', type: 'review' },
        { name: 'Google Reviews', type: 'review' }
      ];
      
      const { error: insertError } = await supabase
        .from('monitoring_sources')
        .insert(defaultSources);
      
      if (insertError) {
        console.error("Error initializing monitoring sources:", insertError);
      }
    }
  } catch (error) {
    console.error("Error in initializeMonitoringSources:", error);
  }
};

/**
 * Initialize monitored platforms if they don't exist
 */
export const initializeMonitoredPlatforms = async (): Promise<void> => {
  try {
    // Check if monitored_platforms has data
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('count')
      .single();
    
    if (error) {
      console.error("Error checking monitored platforms:", error);
      return;
    }
    
    const count = data?.count || 0;
    
    // If no data, create initial monitored platforms
    if (count === 0) {
      const defaultPlatforms = [
        { name: 'Twitter', type: 'social', positive_ratio: 35, total: 120, sentiment: -15 },
        { name: 'Facebook', type: 'social', positive_ratio: 87, total: 230, sentiment: 25 },
        { name: 'Reddit', type: 'forum', positive_ratio: 62, total: 85, sentiment: 5 },
        { name: 'Yelp', type: 'review', positive_ratio: 78, total: 45, sentiment: 18 }
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
 * Initialize the monitoring system
 */
export const initializeMonitoringSystem = async (): Promise<void> => {
  await initializeMonitoringStatus();
  await initializeMonitoringSources();
  await initializeMonitoredPlatforms();
};
