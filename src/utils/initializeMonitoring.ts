
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
      await supabase
        .from('live_status')
        .upsert({
          name: module,
          active_threats: 0,
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString(),
          system_status: 'LIVE'
        }, { onConflict: 'name' });
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
    await supabase
      .from('system_config')
      .upsert([
        { config_key: 'allow_mock_data', config_value: 'disabled' },
        { config_key: 'system_mode', config_value: 'live' },
        { config_key: 'scanner_mode', config_value: 'production' },
        { config_key: 'data_validation', config_value: 'strict' },
        { config_key: 'aria_core_active', config_value: 'true' },
        { config_key: 'live_enforcement', config_value: 'enabled' }
      ], { onConflict: 'config_key' });

    console.log('✅ System configuration initialized for live operation');
  } catch (error) {
    console.error('❌ System config initialization failed:', error);
  }
};
