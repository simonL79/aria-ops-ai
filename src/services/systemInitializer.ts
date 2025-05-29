
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
      
      // 3. Initialize live status modules
      await this.initializeLiveStatusModules(result);
      
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
      
    } catch (error) {
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
        .from('system_config')
        .select('config_key')
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
        const { error } = await supabase
          .from('system_config')
          .upsert({
            config_key: config.key,
            config_value: config.value
          }, { onConflict: 'config_key' });
        
        if (error) {
          result.warnings.push(`Failed to set config: ${config.key}`);
        }
      }
      
      console.log('✅ System configuration initialized');
    } catch (error) {
      result.issues.push('Failed to initialize system configuration');
    }
  }
  
  /**
   * Initialize live status monitoring for all modules
   */
  private static async initializeLiveStatusModules(result: SystemInitializationResult): Promise<void> {
    try {
      const modules = [
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
      
      for (const module of modules) {
        const { error } = await supabase
          .from('live_status')
          .upsert({
            name: module,
            active_threats: 0,
            last_threat_seen: new Date().toISOString(),
            last_report: new Date().toISOString(),
            system_status: 'LIVE'
          }, { onConflict: 'name' });
        
        if (error) {
          result.warnings.push(`Failed to initialize module: ${module}`);
        } else {
          result.modulesInitialized++;
        }
      }
      
      console.log(`✅ Initialized ${result.modulesInitialized} live status modules`);
    } catch (error) {
      result.issues.push('Failed to initialize live status modules');
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
