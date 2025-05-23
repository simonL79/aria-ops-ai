
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Initialize default monitoring sources in the database
 */
export const initializeMonitoringSources = async (): Promise<void> => {
  try {
    console.log('Initializing monitoring sources...');
    
    // Check if we have an authenticated user first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('No authenticated user, skipping monitoring sources initialization');
      return;
    }

    // Check if monitoring sources already exist
    const { data: existingSources, error: checkError } = await supabase
      .from('monitoring_sources')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing monitoring sources:', checkError);
      return;
    }

    // If sources already exist, don't create duplicates
    if (existingSources && existingSources.length > 0) {
      console.log('Monitoring sources already exist, skipping initialization');
      return;
    }

    // Create default monitoring sources
    const defaultSources = [
      { name: 'Twitter', type: 'social_media', is_active: true },
      { name: 'Facebook', type: 'social_media', is_active: true },
      { name: 'LinkedIn', type: 'social_media', is_active: true },
      { name: 'Reddit', type: 'forum', is_active: true },
      { name: 'News Sites', type: 'news', is_active: true },
      { name: 'Google Search', type: 'search', is_active: true }
    ];

    const { error: insertError } = await supabase
      .from('monitoring_sources')
      .insert(defaultSources);

    if (insertError) {
      console.error('Error creating default monitoring sources:', insertError);
      return;
    }

    console.log('Default monitoring sources created successfully');
  } catch (error) {
    console.error('Error in initializeMonitoringSources:', error);
  }
};

/**
 * Initialize monitored platforms in the database
 */
export const initializeMonitoredPlatforms = async (): Promise<void> => {
  try {
    console.log('Initializing monitored platforms...');
    
    // Check if we have an authenticated user first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('No authenticated user, skipping monitored platforms initialization');
      return;
    }

    // Check if platforms already exist
    const { data: existingPlatforms, error: checkError } = await supabase
      .from('monitored_platforms')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing monitored platforms:', checkError);
      return;
    }

    // If platforms already exist, don't create duplicates
    if (existingPlatforms && existingPlatforms.length > 0) {
      console.log('Monitored platforms already exist, skipping initialization');
      return;
    }

    // Create default monitored platforms
    const defaultPlatforms = [
      {
        name: 'Twitter',
        type: 'social_media',
        status: 'active',
        active: true,
        positive_ratio: 50,
        total: 0,
        mention_count: 0,
        sentiment: 0
      },
      {
        name: 'Facebook',
        type: 'social_media', 
        status: 'active',
        active: true,
        positive_ratio: 60,
        total: 0,
        mention_count: 0,
        sentiment: 0
      },
      {
        name: 'LinkedIn',
        type: 'social_media',
        status: 'active', 
        active: true,
        positive_ratio: 75,
        total: 0,
        mention_count: 0,
        sentiment: 0
      }
    ];

    const { error: insertError } = await supabase
      .from('monitored_platforms')
      .insert(defaultPlatforms);

    if (insertError) {
      console.error('Error initializing monitored platforms:', insertError);
      return;
    }

    console.log('Monitored platforms initialized successfully');
  } catch (error) {
    console.error('Error in initializeMonitoredPlatforms:', error);
  }
};

/**
 * Initialize the monitoring status
 */
export const initializeMonitoringStatus = async (): Promise<void> => {
  try {
    console.log('Initializing monitoring status...');

    // Check if monitoring status already exists
    const { data: existingStatus, error: checkError } = await supabase
      .from('monitoring_status')
      .select('id')
      .eq('id', '1')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking monitoring status:', checkError);
      return;
    }

    // If status already exists, don't create duplicate
    if (existingStatus) {
      console.log('Monitoring status already exists, skipping initialization');
      return;
    }

    // Create default monitoring status
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
      console.error('Error creating monitoring status:', insertError);
      return;
    }

    console.log('Monitoring status initialized successfully');
  } catch (error) {
    console.error('Error in initializeMonitoringStatus:', error);
  }
};

/**
 * Initialize all database components
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database initialization...');
    
    await initializeMonitoringStatus();
    await initializeMonitoringSources();
    await initializeMonitoredPlatforms();
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
};
