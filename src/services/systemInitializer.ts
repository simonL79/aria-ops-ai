
import { supabase } from '@/integrations/supabase/client';

export interface SystemInitializationResult {
  initialized: boolean;
  issues: string[];
  warnings: string[];
  modulesInitialized: number;
}

/**
 * System Initializer - Sets up A.R.I.A™ for live operations
 */
export class SystemInitializer {
  
  /**
   * Initialize the complete A.R.I.A™ system for live operations
   */
  static async initializeSystem(): Promise<SystemInitializationResult> {
    const result: SystemInitializationResult = {
      initialized: false,
      issues: [],
      warnings: [],
      modulesInitialized: 0
    };

    try {
      console.log('🚀 Initializing A.R.I.A™ System for live operations...');
      
      // 1. Verify database connectivity
      await this.verifyDatabaseConnectivity(result);
      
      // 2. Initialize system configuration
      await this.initializeSystemConfig(result);
      
      // 3. Verify live status modules
      await this.verifyLiveStatusModules(result);
      
      // 4. Set up monitoring infrastructure
      await this.setupMonitoringInfrastructure(result);
      
      // 5. Validate system integrity
      await this.validateSystemIntegrity(result);
      
      // System is initialized if no critical issues
      result.initialized = result.issues.length === 0;
      
      if (result.initialized) {
        console.log('✅ A.R.I.A™ System initialization completed successfully');
      } else {
        console.warn('⚠️ A.R.I.A™ System initialization completed with issues');
      }
      
      return result;
      
    } catch (error: any) {
      console.error('❌ System initialization failed:', error);
      result.issues.push(`System initialization failed: ${error.message}`);
      return result;
    }
  }
  
  /**
   * Verify database connectivity
   */
  private static async verifyDatabaseConnectivity(result: SystemInitializationResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('live_status')
        .select('name')
        .limit(1);
      
      if (error) {
        result.issues.push('Database connectivity test failed');
        throw error;
      }
      
      console.log('✅ Database connectivity verified');
    } catch (error) {
      result.issues.push('Failed to verify database connectivity');
      throw error;
    }
  }
  
  /**
   * Initialize system configuration for live operations
   */
  private static async initializeSystemConfig(result: SystemInitializationResult): Promise<void> {
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
          const { error } = await supabase
            .from('system_config')
            .upsert({
              config_key: config.key,
              config_value: config.value
            }, { onConflict: 'config_key' });
          
          if (error) {
            result.warnings.push(`Failed to set config: ${config.key}`);
          }
        } catch (configError) {
          result.warnings.push(`Error setting config ${config.key}: ${configError}`);
        }
      }
      
      console.log('✅ System configuration initialized');
    } catch (error) {
      result.issues.push('Failed to initialize system configuration');
    }
  }
  
  /**
   * Verify live status monitoring modules exist
   */
  private static async verifyLiveStatusModules(result: SystemInitializationResult): Promise<void> {
    try {
      const expectedModules = [
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
      
      const { data: modules, error } = await supabase
        .from('live_status')
        .select('name, system_status')
        .eq('system_status', 'LIVE');
      
      if (error) {
        result.issues.push('Failed to verify live status modules');
        return;
      }
      
      const moduleNames = modules?.map(m => m.name) || [];
      result.modulesInitialized = moduleNames.length;
      
      // Check for missing modules
      const missingModules = expectedModules.filter(module => !moduleNames.includes(module));
      if (missingModules.length > 0) {
        result.warnings.push(`Missing modules: ${missingModules.join(', ')}`);
      }
      
      // Update last_report timestamp for active modules
      await supabase
        .from('live_status')
        .update({ last_report: new Date().toISOString() })
        .eq('system_status', 'LIVE');
      
      console.log(`✅ Verified ${result.modulesInitialized} live status modules`);
    } catch (error) {
      result.issues.push('Failed to verify live status modules');
    }
  }
  
  /**
   * Set up monitoring infrastructure
   */
  private static async setupMonitoringInfrastructure(result: SystemInitializationResult): Promise<void> {
    try {
      // Initialize monitoring status table if it exists
      const { error } = await supabase
        .from('monitoring_status')
        .upsert({
          id: '1',
          is_active: true,
          sources_count: 12,
          last_run: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error && error.code !== 'PGRST116') {
        result.warnings.push('Could not initialize monitoring status');
      }
      
      console.log('✅ Monitoring infrastructure set up');
    } catch (error) {
      result.warnings.push('Failed to set up monitoring infrastructure');
    }
  }
  
  /**
   * Validate system integrity after initialization
   */
  private static async validateSystemIntegrity(result: SystemInitializationResult): Promise<void> {
    try {
      // Check if all required tables exist and have data
      const { data: configs, error: configError } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['live_enforcement', 'system_mode']);
      
      if (configError) {
        result.issues.push('Failed to validate system configuration');
        return;
      }
      
      const configMap = new Map(configs?.map(c => [c.config_key, c.config_value]) || []);
      
      if (configMap.get('live_enforcement') !== 'enabled') {
        result.issues.push('Live enforcement is not enabled');
      }
      
      if (configMap.get('system_mode') !== 'live') {
        result.warnings.push('System is not in live mode');
      }
      
      // Check live status modules
      const { data: modules, error: moduleError } = await supabase
        .from('live_status')
        .select('name')
        .eq('system_status', 'LIVE');
      
      if (moduleError) {
        result.issues.push('Failed to validate live status modules');
      } else if (!modules || modules.length === 0) {
        result.issues.push('No live status modules found');
      }
      
      console.log('✅ System integrity validation completed');
    } catch (error) {
      result.issues.push('System integrity validation failed');
    }
  }
}
