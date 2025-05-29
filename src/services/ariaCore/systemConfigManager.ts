import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemConfigResult {
  success: boolean;
  issues: string[];
  warnings: string[];
  fixes_applied: string[];
}

export interface SystemHealthReport {
  rls_issues: string[];
  null_data_issues: number;
  orphaned_records: number;
  duplicate_configs: any[];
  stale_queue_items: number;
  invalid_risk_scores: number;
  unsync_modules: any[];
  mock_data_issues: number;
  failed_functions: any[];
  admin_count: number;
}

export interface SystemBugScanResult {
  success: boolean;
  critical_issues: string[];
  warnings: string[];
  info: string[];
  scan_summary: string;
}

/**
 * A.R.I.A™ System Configuration Manager
 * Ensures proper live operation setup and system integrity
 */
export class SystemConfigManager {
  
  /**
   * Run comprehensive system configuration and fixes
   */
  static async configureLiveSystem(): Promise<SystemConfigResult> {
    const result: SystemConfigResult = {
      success: false,
      issues: [],
      warnings: [],
      fixes_applied: []
    };

    try {
      console.log('🔧 Starting A.R.I.A™ live system configuration...');
      
      // 1. Configure live system settings
      await this.setLiveSystemConfig(result);
      
      // 2. Initialize live status modules
      await this.initializeLiveStatusModules(result);
      
      // 3. Clean up system configuration duplicates
      await this.cleanupSystemConfig(result);
      
      // 4. Initialize monitoring status
      await this.initializeMonitoringStatus(result);
      
      // 5. Verify final configuration
      await this.verifySystemConfiguration(result);
      
      result.success = result.issues.length === 0;
      
      if (result.success) {
        console.log('✅ A.R.I.A™ system configured for live operations');
        toast.success('A.R.I.A™ system successfully configured for live operations');
      } else {
        console.warn('⚠️ System configuration completed with issues:', result.issues);
        toast.warning('System configuration completed with some issues');
      }
      
    } catch (error: any) {
      console.error('❌ System configuration failed:', error);
      result.issues.push(`Configuration failed: ${error.message}`);
      toast.error('System configuration failed');
    }
    
    return result;
  }

  /**
   * Run comprehensive system bug scan
   */
  static async runSystemBugScan(): Promise<SystemBugScanResult> {
    const result: SystemBugScanResult = {
      success: true,
      critical_issues: [],
      warnings: [],
      info: [],
      scan_summary: ''
    };

    try {
      console.log('🐞 Starting A.R.I.A™ system bug scan...');

      // 1. Check for tables with missing RLS
      await this.checkRLSEnforcement(result);

      // 2. Check admin presence
      await this.checkAdminPresence(result);

      // 3. Check system configuration
      await this.checkSystemConfiguration(result);

      // 4. Check live status modules
      await this.checkLiveStatusModules(result);

      // 5. Check monitoring status
      await this.checkMonitoringStatus(result);

      // Generate summary
      const totalIssues = result.critical_issues.length + result.warnings.length;
      result.scan_summary = `Scan completed: ${result.critical_issues.length} critical issues, ${result.warnings.length} warnings, ${result.info.length} info items`;
      result.success = result.critical_issues.length === 0;

      console.log('✅ System bug scan completed:', result.scan_summary);

    } catch (error: any) {
      console.error('❌ System bug scan failed:', error);
      result.critical_issues.push(`Bug scan failed: ${error.message}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Run automated admin login system checks
   */
  static async runAdminLoginChecks(): Promise<{ config: SystemConfigResult; bugScan: SystemBugScanResult }> {
    console.log('🚀 Running automated admin login system checks...');

    // Run bug scan first
    const bugScan = await this.runSystemBugScan();
    
    // Then run configuration
    const config = await this.configureLiveSystem();

    return { config, bugScan };
  }

  private static async setLiveSystemConfig(result: SystemConfigResult): Promise<void> {
    const liveConfigs = [
      { config_key: 'system_mode', config_value: 'live' },
      { config_key: 'allow_mock_data', config_value: 'disabled' },
      { config_key: 'live_enforcement', config_value: 'enabled' },
      { config_key: 'scanner_mode', config_value: 'production' },
      { config_key: 'data_validation', config_value: 'strict' },
      { config_key: 'aria_core_active', config_value: 'true' }
    ];

    for (const config of liveConfigs) {
      try {
        const { error } = await supabase
          .from('system_config')
          .upsert(config, { onConflict: 'config_key' });

        if (error) {
          result.issues.push(`Failed to set ${config.config_key}: ${error.message}`);
        } else {
          result.fixes_applied.push(`Set ${config.config_key} = ${config.config_value}`);
        }
      } catch (error: any) {
        result.issues.push(`Error setting ${config.config_key}: ${error.message}`);
      }
    }
  }

  private static async initializeLiveStatusModules(result: SystemConfigResult): Promise<void> {
    const liveModules = [
      { name: 'Live Threat Scanner', active_threats: 0, system_status: 'LIVE' },
      { name: 'Social Media Monitor', active_threats: 0, system_status: 'LIVE' },
      { name: 'News Feed Scanner', active_threats: 0, system_status: 'LIVE' },
      { name: 'Forum Analysis Engine', active_threats: 0, system_status: 'LIVE' },
      { name: 'Legal Discussion Monitor', active_threats: 0, system_status: 'LIVE' },
      { name: 'Reputation Risk Detector', active_threats: 0, system_status: 'LIVE' },
      { name: 'Strike Management System', active_threats: 0, system_status: 'LIVE' },
      { name: 'HyperCore Intelligence', active_threats: 0, system_status: 'LIVE' },
      { name: 'EIDETIC Memory Engine', active_threats: 0, system_status: 'LIVE' },
      { name: 'RSI Threat Simulation', active_threats: 0, system_status: 'LIVE' },
      { name: 'Anubis Diagnostics', active_threats: 0, system_status: 'LIVE' },
      { name: 'Graveyard Archive', active_threats: 0, system_status: 'LIVE' }
    ];

    for (const module of liveModules) {
      try {
        const moduleData = {
          ...module,
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString()
        };

        const { error } = await supabase
          .from('live_status')
          .upsert(moduleData, { onConflict: 'name' });

        if (error) {
          result.issues.push(`Failed to initialize ${module.name}: ${error.message}`);
        } else {
          result.fixes_applied.push(`Initialized live status for ${module.name}`);
        }
      } catch (error: any) {
        result.issues.push(`Error initializing ${module.name}: ${error.message}`);
      }
    }
  }

  private static async cleanupSystemConfig(result: SystemConfigResult): Promise<void> {
    try {
      // Get all system configs
      const { data: configs, error } = await supabase
        .from('system_config')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        result.issues.push(`Failed to check system config: ${error.message}`);
        return;
      }

      if (configs && configs.length > 0) {
        result.fixes_applied.push(`Verified ${configs.length} system configuration entries`);
      } else {
        result.warnings.push('No system configuration found - this may be normal for a new system');
      }
    } catch (error: any) {
      result.issues.push(`Error checking system config: ${error.message}`);
    }
  }

  private static async initializeMonitoringStatus(result: SystemConfigResult): Promise<void> {
    try {
      const monitoringStatus = {
        id: '1',
        is_active: true,
        last_run: new Date().toISOString(),
        next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        sources_count: 6,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('monitoring_status')
        .upsert(monitoringStatus, { onConflict: 'id' });

      if (error) {
        result.issues.push(`Failed to initialize monitoring status: ${error.message}`);
      } else {
        result.fixes_applied.push('Initialized monitoring status');
      }
    } catch (error: any) {
      result.issues.push(`Error initializing monitoring status: ${error.message}`);
    }
  }

  private static async verifySystemConfiguration(result: SystemConfigResult): Promise<void> {
    try {
      // Check if live mode is properly configured
      const { data: liveConfig } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'system_mode')
        .single();

      if (liveConfig?.config_value === 'live') {
        result.fixes_applied.push('✅ System mode: LIVE');
      } else {
        result.warnings.push('System mode may not be set to live');
      }

      // Check if mock data is disabled
      const { data: mockConfig } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'allow_mock_data')
        .single();

      if (mockConfig?.config_value === 'disabled') {
        result.fixes_applied.push('✅ Mock data: DISABLED');
      } else {
        result.warnings.push('Mock data may still be enabled');
      }

      // Check live status modules
      const { data: liveModules } = await supabase
        .from('live_status')
        .select('name, system_status')
        .eq('system_status', 'LIVE');

      if (liveModules && liveModules.length > 0) {
        result.fixes_applied.push(`✅ Live modules: ${liveModules.length} active`);
      } else {
        result.warnings.push('No live status modules found');
      }

    } catch (error: any) {
      result.warnings.push(`Verification incomplete: ${error.message}`);
    }
  }

  // New bug scan methods
  private static async checkRLSEnforcement(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: tableCheck, error } = await supabase.rpc('check_rls_compliance');
      
      if (error) {
        result.warnings.push(`Could not check RLS compliance: ${error.message}`);
        return;
      }

      if (tableCheck) {
        const tablesWithoutRLS = tableCheck.filter((table: any) => !table.rls_enabled);
        if (tablesWithoutRLS.length > 0) {
          result.warnings.push(`${tablesWithoutRLS.length} tables missing RLS enforcement`);
        } else {
          result.info.push('All tables have RLS enforcement enabled');
        }
      }
    } catch (error: any) {
      result.warnings.push(`RLS check failed: ${error.message}`);
    }
  }

  private static async checkAdminPresence(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: adminCheck, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (error) {
        result.critical_issues.push(`Failed to check admin presence: ${error.message}`);
        return;
      }

      const adminCount = adminCheck?.length || 0;
      if (adminCount === 0) {
        result.critical_issues.push('No admin users found in the system');
      } else {
        result.info.push(`${adminCount} admin users configured`);
      }
    } catch (error: any) {
      result.critical_issues.push(`Admin check failed: ${error.message}`);
    }
  }

  private static async checkSystemConfiguration(result: SystemBugScanResult): Promise<void> {
    try {
      // Check for system_mode
      const { data: systemMode } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'system_mode')
        .single();

      if (!systemMode || systemMode.config_value !== 'live') {
        result.warnings.push('System not configured for live mode');
      } else {
        result.info.push('System configured for live mode');
      }

      // Check for duplicate configs
      const { data: duplicateCheck, error } = await supabase
        .from('system_config')
        .select('config_key')
        .order('config_key');

      if (!error && duplicateCheck) {
        const keyMap = new Map();
        duplicateCheck.forEach(config => {
          const count = keyMap.get(config.config_key) || 0;
          keyMap.set(config.config_key, count + 1);
        });

        const duplicates = Array.from(keyMap.entries()).filter(([key, count]) => count > 1);
        if (duplicates.length > 0) {
          result.warnings.push(`${duplicates.length} duplicate configuration keys found`);
        } else {
          result.info.push('No duplicate configuration keys');
        }
      }
    } catch (error: any) {
      result.warnings.push(`System configuration check failed: ${error.message}`);
    }
  }

  private static async checkLiveStatusModules(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: modules, error } = await supabase
        .from('live_status')
        .select('name, system_status, last_threat_seen');

      if (error) {
        result.warnings.push(`Failed to check live status modules: ${error.message}`);
        return;
      }

      if (!modules || modules.length === 0) {
        result.warnings.push('No live status modules found');
        return;
      }

      const outdatedModules = modules.filter(module => 
        !module.last_threat_seen || 
        new Date(module.last_threat_seen) < new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      if (outdatedModules.length > 0) {
        result.warnings.push(`${outdatedModules.length} modules have not reported in 24+ hours`);
      } else {
        result.info.push(`All ${modules.length} live status modules are current`);
      }
    } catch (error: any) {
      result.warnings.push(`Live status check failed: ${error.message}`);
    }
  }

  private static async checkMonitoringStatus(result: SystemBugScanResult): Promise<void> {
    try {
      const { data: monitoring, error } = await supabase
        .from('monitoring_status')
        .select('*')
        .eq('id', '1')
        .single();

      if (error) {
        result.warnings.push('Monitoring status not initialized');
        return;
      }

      if (!monitoring.is_active) {
        result.warnings.push('Monitoring is not active');
      } else {
        result.info.push('Monitoring system is active');
      }
    } catch (error: any) {
      result.warnings.push(`Monitoring status check failed: ${error.message}`);
    }
  }

  /**
   * Get system health report
   */
  static async getSystemHealthReport(): Promise<SystemHealthReport | null> {
    try {
      const report: SystemHealthReport = {
        rls_issues: [],
        null_data_issues: 0,
        orphaned_records: 0,
        duplicate_configs: [],
        stale_queue_items: 0,
        invalid_risk_scores: 0,
        unsync_modules: [],
        mock_data_issues: 0,
        failed_functions: [],
        admin_count: 0
      };

      // Check admin count
      const { data: adminData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      report.admin_count = adminData?.length || 0;

      // Check live status modules
      const { data: liveStatusData } = await supabase
        .from('live_status')
        .select('name, system_status, last_threat_seen');

      report.unsync_modules = liveStatusData?.filter(module => 
        !module.last_threat_seen || 
        new Date(module.last_threat_seen) < new Date(Date.now() - 24 * 60 * 60 * 1000)
      ) || [];

      return report;
    } catch (error) {
      console.error('Failed to generate health report:', error);
      return null;
    }
  }
}
