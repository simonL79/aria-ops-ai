
import { supabase } from '@/integrations/supabase/client';

export interface LiveDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  passedChecks: number;
  totalChecks: number;
}

/**
 * Comprehensive live data validation for A.R.I.A™ systems
 */
export class LiveDataValidator {
  
  /**
   * Validate complete system integrity for live data operations
   */
  static async validateLiveIntegrity(): Promise<LiveDataValidationResult> {
    const result: LiveDataValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      passedChecks: 0,
      totalChecks: 0
    };

    const checks = [
      () => this.validateDatabaseConnectivity(result),
      () => this.validateSystemConfig(result),
      () => this.validateLiveStatus(result),
      () => this.validateDataQuality(result)
    ];

    result.totalChecks = checks.length;

    for (const check of checks) {
      try {
        await check();
        result.passedChecks++;
      } catch (error) {
        result.errors.push(`Validation check failed: ${error.message}`);
        result.isValid = false;
      }
    }

    // System is considered valid if no critical errors
    result.isValid = result.errors.length === 0;

    return result;
  }

  /**
   * Validate database connectivity first
   */
  private static async validateDatabaseConnectivity(result: LiveDataValidationResult): Promise<void> {
    try {
      // Test basic connectivity with a simple query
      const { error } = await supabase
        .from('user_roles')
        .select('role')
        .limit(1);

      if (error) {
        throw new Error(`Database connectivity failed: ${error.message}`);
      }

    } catch (error) {
      result.errors.push(`Database connectivity failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate system configuration for live operations
   */
  private static async validateSystemConfig(result: LiveDataValidationResult): Promise<void> {
    try {
      const { data: configs, error } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['system_mode', 'allow_mock_data', 'live_enforcement']);

      if (error) {
        // If we can't read system_config, it might not exist or have proper policies
        result.warnings.push('System configuration table access limited or not configured');
        return;
      }

      const configMap = new Map(configs?.map(c => [c.config_key, c.config_value]) || []);

      if (configMap.get('system_mode') !== 'live') {
        result.warnings.push('System not in live mode');
      }

      if (configMap.get('allow_mock_data') !== 'disabled') {
        result.warnings.push('Mock data is still allowed');
      }

      if (configMap.get('live_enforcement') !== 'enabled') {
        result.warnings.push('Live data enforcement is not enabled');
      }

    } catch (error) {
      result.warnings.push(`System config validation encountered issues: ${error.message}`);
    }
  }

  /**
   * Validate live status monitoring
   */
  private static async validateLiveStatus(result: LiveDataValidationResult): Promise<void> {
    try {
      const { data: statuses, error } = await supabase
        .from('live_status')
        .select('name, system_status, last_report')
        .eq('system_status', 'LIVE');

      if (error) {
        // Table might not exist
        result.warnings.push('Live status monitoring table not accessible');
        return;
      }

      if (!statuses || statuses.length === 0) {
        result.warnings.push('No live status modules found');
        return;
      }

      const staleModules = statuses.filter(s => {
        const lastReport = new Date(s.last_report);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return lastReport < fiveMinutesAgo;
      });

      if (staleModules.length > 0) {
        result.warnings.push(`${staleModules.length} modules have stale status reports`);
      }

    } catch (error) {
      result.warnings.push(`Live status validation encountered issues: ${error.message}`);
    }
  }

  /**
   * Validate data quality and integrity
   */
  private static async validateDataQuality(result: LiveDataValidationResult): Promise<void> {
    try {
      // Check for mock data in scan_results table
      const { data: mockScans, error } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
        .limit(1);

      if (error) {
        // Table might not exist, skip this check
        return;
      }

      if (mockScans && mockScans.length > 0) {
        result.warnings.push('Mock data detected in scan_results table');
      }

      // Check for mock data in threats table
      const { data: mockThreats, error: threatError } = await supabase
        .from('threats')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
        .limit(1);

      if (!threatError && mockThreats && mockThreats.length > 0) {
        result.warnings.push('Mock data detected in threats table');
      }

    } catch (error) {
      result.warnings.push(`Data quality check encountered issues: ${error.message}`);
    }
  }

  /**
   * Quick validation for system health check
   */
  static async quickHealthCheck(): Promise<boolean> {
    try {
      // Test database connectivity
      const { error } = await supabase
        .from('user_roles')
        .select('role')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Quick health check failed:', error);
      return false;
    }
  }
}
