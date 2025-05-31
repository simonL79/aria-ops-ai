import { supabase } from '@/integrations/supabase/client';

export interface SystemConfigResult {
  success: boolean;
  fixes_applied: string[];
  issues: string[];
  warnings: string[];
}

export interface SystemBugScanResult {
  success: boolean;
  critical_issues: string[];
  warnings: string[];
  info: string[];
  scan_completed_at: string;
}

export class SystemConfigManager {
  
  /**
   * Run comprehensive system bug scan with audit logging
   */
  static async runSystemBugScan(): Promise<SystemBugScanResult> {
    const result: SystemBugScanResult = {
      success: true,
      critical_issues: [],
      warnings: [],
      info: [],
      scan_completed_at: new Date().toISOString()
    };

    try {
      console.log('🔍 Running system bug scan with audit logging...');

      // Check for RLS policy issues
      await this.checkRLSCompliance(result);
      
      // Check for table integrity
      await this.checkTableIntegrity(result);
      
      // Check for function availability
      await this.checkFunctionAvailability(result);
      
      // Check for security configurations
      await this.checkSecurityConfigurations(result);

      // Log the scan results to audit
      await this.logBugScanToAudit(result);

      result.success = result.critical_issues.length === 0;
      
      console.log(`✅ Bug scan completed. Critical: ${result.critical_issues.length}, Warnings: ${result.warnings.length}`);
      return result;

    } catch (error) {
      console.error('❌ Bug scan failed:', error);
      result.critical_issues.push(`Scan failed: ${error.message}`);
      result.success = false;
      return result;
    }
  }

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

  private static async checkRLSCompliance(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: rlsCheck } = await supabase.rpc('check_rls_compliance');
      
      if (rlsCheck) {
        const tablesWithoutRLS = rlsCheck.filter((table: any) => !table.rls_enabled);
        
        if (tablesWithoutRLS.length > 0) {
          result.warnings.push(`${tablesWithoutRLS.length} tables found without RLS enabled`);
        } else {
          result.info.push('All tables have RLS properly configured');
        }
      }
    } catch (error) {
      result.warnings.push(`RLS compliance check failed: ${error.message}`);
    }
  }

  private static async checkTableIntegrity(result: SystemBugScanResult): Promise<void> {
    // Use type assertions for table names to avoid TypeScript strict typing issues
    const criticalTables = [
      'activity_logs',
      'system_config',
      'user_roles',
      'scan_results',
      'threats'
    ] as const;

    for (const tableName of criticalTables) {
      try {
        // Use type assertion to handle strict typing
        const { error } = await supabase
          .from(tableName as any)
          .select('*')
          .limit(1);

        if (error) {
          result.critical_issues.push(`Critical table '${tableName}' is not accessible: ${error.message}`);
        } else {
          result.info.push(`Table '${tableName}' is accessible`);
        }
      } catch (error) {
        result.critical_issues.push(`Failed to check table '${tableName}': ${error.message}`);
      }
    }
  }

  private static async checkFunctionAvailability(result: SystemBugScanResult): Promise<void> {
    const criticalFunctions = [
      'is_current_user_admin',
      'validate_aria_on_admin_login',
      'log_anubis_check'
    ] as const;

    for (const funcName of criticalFunctions) {
      try {
        // Use type assertion for function names
        const { error } = await supabase.rpc(funcName as any);
        
        if (error && !error.message.includes('permission denied')) {
          result.warnings.push(`Function '${funcName}' may have issues: ${error.message}`);
        } else {
          result.info.push(`Function '${funcName}' is available`);
        }
      } catch (error) {
        result.warnings.push(`Failed to check function '${funcName}': ${error.message}`);
      }
    }
  }

  private static async checkSecurityConfigurations(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: configs } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['system_mode', 'live_enforcement', 'allow_mock_data']);

      if (configs) {
        const configMap = new Map(configs.map(c => [c.config_key, c.config_value]));
        
        if (configMap.get('system_mode') !== 'live') {
          result.warnings.push('System not in live mode');
        }
        
        if (configMap.get('live_enforcement') !== 'enabled') {
          result.warnings.push('Live enforcement is disabled');
        }
        
        if (configMap.get('allow_mock_data') === 'enabled') {
          result.warnings.push('Mock data is allowed in production');
        }
        
        result.info.push('Security configuration check completed');
      }
    } catch (error) {
      result.warnings.push(`Security configuration check failed: ${error.message}`);
    }
  }

  private static async logBugScanToAudit(result: SystemBugScanResult): Promise<void> {
    try {
      // Log critical issues
      for (const issue of result.critical_issues) {
        await supabase.rpc('log_anubis_check', {
          check_name: 'system_bug_scan',
          result: issue,
          passed: false,
          severity: 'critical',
          run_context: 'admin_login'
        });
      }

      // Log warnings
      for (const warning of result.warnings) {
        await supabase.rpc('log_anubis_check', {
          check_name: 'system_bug_scan',
          result: warning,
          passed: false,
          severity: 'medium',
          run_context: 'admin_login'
        });
      }

      // Log overall scan completion
      await supabase.rpc('log_anubis_check', {
        check_name: 'system_bug_scan_completed',
        result: `Bug scan completed. Critical: ${result.critical_issues.length}, Warnings: ${result.warnings.length}, Info: ${result.info.length}`,
        passed: result.success,
        severity: result.success ? 'low' : 'high',
        run_context: 'admin_login'
      });

    } catch (error) {
      console.error('Failed to log bug scan to audit:', error);
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

      // Check activity logs for Anubis activity instead of anubis_creeper_log
      const { data: recentLogs } = await supabase
        .from('activity_logs')
        .select('created_at')
        .eq('entity_type', 'anubis')
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
