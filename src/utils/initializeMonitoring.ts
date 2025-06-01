
import { supabase } from '@/integrations/supabase/client';
import { initializeMonitoringPlatforms } from '@/services/monitoring';

/**
 * Initialize all A.R.I.A™ monitoring systems and live data flows
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing A.R.I.A™ database systems...');
    
    // Initialize monitoring platforms
    await initializeMonitoringPlatforms();
    
    // Ensure live status table is populated
    await initializeLiveStatus();
    
    // Initialize system config for live data enforcement
    await initializeSystemConfig();
    
    console.log('✅ A.R.I.A™ database initialization complete');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

/**
 * Initialize live status monitoring for all A.R.I.A™ modules
 */
const initializeLiveStatus = async (): Promise<void> => {
  try {
    const liveModules = [
      'Live Threat Scanner',
      'Social Media Monitor',
      'News Feed Scanner',
      'Forum Analysis Engine',
      'Legal Discussion Monitor',
      'Reputation Risk Detector',
      'Strike Management System',
      'HyperCore Intelligence',
      'EIDETIC Memory Engine',
      'RSI Threat Simulation',
      'Anubis Diagnostics',
      'Graveyard Archive'
    ];

    for (const module of liveModules) {
      try {
        // First check if the module already exists
        const { data: existing } = await supabase
          .from('live_status')
          .select('name')
          .eq('name', module)
          .single();

        if (!existing) {
          // Only insert if it doesn't exist
          const { error } = await supabase
            .from('live_status')
            .insert({
              name: module,
              active_threats: 0,
              last_threat_seen: new Date().toISOString(),
              last_report: new Date().toISOString(),
              system_status: 'LIVE'
            });

          if (error) {
            console.warn(`Could not initialize module ${module}:`, error.message);
          }
        }
      } catch (moduleError) {
        console.warn(`Failed to check/insert module ${module}:`, moduleError);
      }
    }

    console.log('✅ Live status monitoring initialized for all modules');
  } catch (error) {
    console.error('❌ Live status initialization failed:', error);
  }
};

/**
 * Initialize system configuration for live data enforcement
 */
const initializeSystemConfig = async (): Promise<void> => {
  try {
    const configs = [
      { key: 'allow_mock_data', value: 'disabled' },
      { key: 'system_mode', value: 'live' },
      { key: 'scanner_mode', value: 'production' },
      { key: 'data_validation', value: 'strict' },
      { key: 'aria_core_active', value: 'true' },
      { key: 'live_enforcement', value: 'enabled' }
    ];

    for (const config of configs) {
      try {
        // Check if config exists first
        const { data: existing } = await supabase
          .from('system_config')
          .select('config_key')
          .eq('config_key', config.key)
          .single();

        if (!existing) {
          // Only insert if it doesn't exist
          const { error } = await supabase
            .from('system_config')
            .insert({
              config_key: config.key,
              config_value: config.value
            });

          if (error) {
            console.warn(`Could not create config ${config.key}:`, error.message);
          }
        }
      } catch (configError) {
        console.warn(`Failed to check/insert config ${config.key}:`, configError);
      }
    }

    console.log('✅ System configuration initialized for live operation');
  } catch (error) {
    console.error('❌ System config initialization failed:', error);
  }
};
