
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize monitoring status if it doesn't exist
 */
export const initializeMonitoringStatus = async () => {
  try {
    // Check if monitoring status exists
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('id')
      .eq('id', '1')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking monitoring status:', error);
      return;
    }
    
    // If monitoring status doesn't exist, create it
    if (!data) {
      const now = new Date();
      const { error: insertError } = await supabase
        .from('monitoring_status')
        .insert({
          id: '1',
          is_active: false,
          sources_count: 0,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });
      
      if (insertError) {
        console.error('Error creating monitoring status:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in initializeMonitoringStatus:', error);
  }
};

/**
 * Initialize monitoring sources if none exist
 */
export const initializeMonitoringSources = async () => {
  try {
    // Check if monitoring sources exist
    const { count, error } = await supabase
      .from('monitoring_sources')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking monitoring sources:', error);
      return;
    }
    
    // If no monitoring sources exist, create default ones
    if (count === 0) {
      const defaultSources = [
        { name: 'Twitter', type: 'social_media' },
        { name: 'Facebook', type: 'social_media' },
        { name: 'LinkedIn', type: 'social_media' },
        { name: 'Google News', type: 'news' },
        { name: 'Reddit', type: 'forum' }
      ];
      
      const { error: insertError } = await supabase
        .from('monitoring_sources')
        .insert(defaultSources);
      
      if (insertError) {
        console.error('Error creating default monitoring sources:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in initializeMonitoringSources:', error);
  }
};

/**
 * Initialize monitored platforms if none exist
 */
export const initializeMonitoredPlatforms = async () => {
  try {
    // Check if monitored platforms exist
    const { count, error } = await supabase
      .from('monitored_platforms')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking monitored platforms:', error);
      return;
    }
    
    // If no monitored platforms exist, create default ones
    if (count === 0) {
      const defaultPlatforms = [
        { name: 'Twitter', type: 'social', status: 'active' },
        { name: 'Facebook', type: 'social', status: 'active' },
        { name: 'Reddit', type: 'forum', status: 'active' },
        { name: 'Google Reviews', type: 'review', status: 'active' },
        { name: 'Yelp', type: 'review', status: 'active' }
      ];
      
      const { error: insertError } = await supabase
        .from('monitored_platforms')
        .insert(defaultPlatforms);
      
      if (insertError) {
        console.error('Error initializing monitored platforms:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in initializeMonitoredPlatforms:', error);
  }
};

/**
 * Initialize the database with required data
 */
export const initializeDatabase = async () => {
  try {
    // Initialize monitoring status
    await initializeMonitoringStatus();
    
    // Initialize monitoring sources
    await initializeMonitoringSources();
    
    // Initialize monitored platforms
    await initializeMonitoredPlatforms();
    
  } catch (error) {
    console.error('Error in initializeDatabase:', error);
  }
};

/**
 * Initialize the monitoring system
 */
export const initializeMonitoringSystem = async () => {
  try {
    // Initialize the database
    await initializeDatabase();
    
    // Log success
    console.log('Monitoring system initialized successfully');
    
  } catch (error) {
    console.error('Error in initializeMonitoringSystem:', error);
  }
};
