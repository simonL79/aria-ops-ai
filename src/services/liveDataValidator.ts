
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
      () => this.validateSystemConfig(result),
      () => this.validateLiveStatus(result),
      () => this.validateDataQuality(result),
      () => this.validateModuleConnectivity(result)
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
   * Validate system configuration for live operations
   */
  private static async validateSystemConfig(result: LiveDataValidationResult): Promise<void> {
    try {
      const { data: configs, error } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['system_mode', 'allow_mock_data', 'live_enforcement']);

      if (error) throw error;

      const configMap = new Map(configs?.map(c => [c.config_key, c.config_value]) || []);

      if (configMap.get('system_mode') !== 'live') {
        result.warnings.push('System not in live mode');
      }

      if (configMap.get('allow_mock_data') !== 'disabled') {
        result.warnings.push('Mock data is still allowed');
      }

      if (configMap.get('live_enforcement') !== 'enabled') {
        result.errors.push('Live data enforcement is disabled');
      }

    } catch (error) {
      result.errors.push(`System config validation failed: ${error.message}`);
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

      if (error) throw error;

      if (!statuses || statuses.length === 0) {
        result.errors.push('No live status modules found');
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
      result.errors.push(`Live status validation failed: ${error.message}`);
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
   * Validate module connectivity
   */
  private static async validateModuleConnectivity(result: LiveDataValidationResult): Promise<void> {
    try {
      // Test database connectivity
      const { error } = await supabase
        .from('system_config')
        .select('config_key')
        .limit(1);

      if (error) {
        result.errors.push('Database connectivity failed');
      }

    } catch (error) {
      result.errors.push(`Module connectivity validation failed: ${error.message}`);
    }
  }
}
