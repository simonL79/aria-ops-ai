
import { supabase } from '@/integrations/supabase/client';

export interface SystemConfigResult {
  success: boolean;
  fixes_applied: string[];
  issues: string[];
  warnings: string[];
}

export class SystemConfigManager {
  
  /**
   * Configure the system for live operations
   */
  static async configureLiveSystem(): Promise<SystemConfigResult> {
    const result: SystemConfigResult = {
      success: false,
      fixes_applied: [],
      issues: [],
      warnings: []
    };

    try {
      console.log('🔧 Configuring A.R.I.A™ for live operations...');

      // Check and create system config entries
      await this.ensureSystemConfig(result);
      
      // Initialize monitoring platforms
      await this.initializeMonitoringPlatforms(result);
      
      // Validate system state
      await this.validateSystemState(result);

      result.success = result.issues.length === 0;
      
      console.log(`✅ System configuration ${result.success ? 'completed successfully' : 'completed with issues'}`);
      return result;

    } catch (error) {
      console.error('❌ System configuration failed:', error);
      result.issues.push(`Configuration failed: ${error.message}`);
      return result;
    }
  }

  private static async ensureSystemConfig(result: SystemConfigResult): Promise<void> {
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
        // Check if config exists
        const { data: existing } = await supabase
          .from('system_config')
          .select('config_value')
          .eq('config_key', config.key)
          .single();

        if (existing) {
          if (existing.config_value !== config.value) {
            // Update existing config
            const { error } = await supabase
              .from('system_config')
              .update({ config_value: config.value })
              .eq('config_key', config.key);

            if (error) {
              result.issues.push(`Failed to update config ${config.key}: ${error.message}`);
            } else {
              result.fixes_applied.push(`Updated ${config.key} to ${config.value}`);
            }
          }
        } else {
          // Create new config
          const { error } = await supabase
            .from('system_config')
            .insert({
              config_key: config.key,
              config_value: config.value
            });

          if (error) {
            result.warnings.push(`Could not create config ${config.key}: ${error.message}`);
          } else {
            result.fixes_applied.push(`Created ${config.key} = ${config.value}`);
          }
        }
      } catch (error) {
        result.warnings.push(`Config check failed for ${config.key}: ${error.message}`);
      }
    }
  }

  private static async initializeMonitoringPlatforms(result: SystemConfigResult): Promise<void> {
    try {
      const { count } = await supabase
        .from('monitored_platforms')
        .select('*', { count: 'exact', head: true });

      if (!count || count === 0) {
        const platforms = [
          { name: 'Reddit', type: 'social', status: 'active' },
          { name: 'Twitter', type: 'social', status: 'active' },
          { name: 'YouTube', type: 'social', status: 'active' },
          { name: 'Google News', type: 'news', status: 'active' },
          { name: 'Yelp', type: 'review', status: 'active' }
        ];

        for (const platform of platforms) {
          const { error } = await supabase
            .from('monitored_platforms')
            .insert(platform);

          if (error) {
            result.warnings.push(`Could not add platform ${platform.name}: ${error.message}`);
          } else {
            result.fixes_applied.push(`Initialized monitoring for ${platform.name}`);
          }
        }
      }
    } catch (error) {
      result.warnings.push(`Platform initialization failed: ${error.message}`);
    }
  }

  private static async validateSystemState(result: SystemConfigResult): Promise<void> {
    try {
      // Check recent scan activity
      const { data: recentScans } = await supabase
        .from('scan_results')
        .select('created_at')
        .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (!recentScans || recentScans.length === 0) {
        result.warnings.push('No recent scan activity detected in last 24 hours');
      } else {
        result.fixes_applied.push('Recent scan activity verified');
      }

      // Check Anubis log activity
      const { data: recentLogs } = await supabase
        .from('anubis_creeper_log')
        .select('created_at')
        .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(1);

      if (!recentLogs || recentLogs.length === 0) {
        result.warnings.push('No recent Anubis activity detected in last hour');
      } else {
        result.fixes_applied.push('Anubis monitoring activity verified');
      }

    } catch (error) {
      result.warnings.push(`System validation failed: ${error.message}`);
    }
  }
}
