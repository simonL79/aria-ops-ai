
import { supabase } from '@/integrations/supabase/client';
import { LiveDataValidator } from '@/services/liveDataValidator';

export interface LiveDataCompliance {
  compliant: boolean;
  issues: string[];
  warnings: string[];
  systemMode: string;
  enforcementActive: boolean;
}

/**
 * Live Data Enforcer - Ensures production-grade data integrity
 */
export class LiveDataEnforcer {
  
  /**
   * Enforce system-wide live data compliance
   */
  static async enforceSystemWideLiveData(): Promise<boolean> {
    try {
      console.log('🔒 Enforcing live data compliance...');
      
      // Initialize system configuration for live mode
      await this.initializeLiveSystemConfig();
      
      // Validate current system state
      const validation = await LiveDataValidator.validateLiveIntegrity();
      
      if (!validation.isValid) {
        console.warn('⚠️ Live data enforcement found issues:', validation.errors);
        return false;
      }
      
      console.log('✅ Live data enforcement successful');
      return true;
      
    } catch (error) {
      console.error('❌ Live data enforcement failed:', error);
      return false;
    }
  }
  
  /**
   * Initialize live system configuration
   */
  private static async initializeLiveSystemConfig(): Promise<void> {
    try {
      const liveConfigs = [
        { key: 'allow_mock_data', value: 'disabled' },
        { key: 'system_mode', value: 'live' },
        { key: 'scanner_mode', value: 'production' },
        { key: 'data_validation', value: 'strict' },
        { key: 'aria_core_active', value: 'true' },
        { key: 'live_enforcement', value: 'enabled' }
      ];
      
      for (const config of liveConfigs) {
        try {
          const { error } = await supabase
            .from('system_config')
            .upsert({
              config_key: config.key,
              config_value: config.value
            }, { onConflict: 'config_key' });
          
          if (error) {
            console.warn(`Could not set config ${config.key}:`, error.message);
          }
        } catch (configError) {
          console.warn(`Failed to set config ${config.key}:`, configError);
        }
      }
      
    } catch (error) {
      console.error('Failed to initialize live system config:', error);
    }
  }
  
  /**
   * Validate live data compliance
   */
  static async validateLiveDataCompliance(): Promise<LiveDataCompliance> {
    const result: LiveDataCompliance = {
      compliant: false,
      issues: [],
      warnings: [],
      systemMode: 'unknown',
      enforcementActive: false
    };
    
    try {
      // Check system configuration
      const { data: configs, error } = await supabase
        .from('system_config')
        .select('config_key, config_value');
      
      if (error) {
        result.issues.push('Cannot access system configuration');
        return result;
      }
      
      const configMap = new Map(configs?.map(c => [c.config_key, c.config_value]) || []);
      
      result.systemMode = configMap.get('system_mode') || 'unknown';
      result.enforcementActive = configMap.get('live_enforcement') === 'enabled';
      
      // Validate configuration
      if (result.systemMode !== 'live') {
        result.warnings.push('System not in live mode');
      }
      
      if (!result.enforcementActive) {
        result.issues.push('Live enforcement is disabled');
      }
      
      if (configMap.get('allow_mock_data') === 'enabled') {
        result.warnings.push('Mock data is allowed');
      }
      
      result.compliant = result.issues.length === 0;
      
    } catch (error) {
      result.issues.push(`Validation failed: ${error.message}`);
    }
    
    return result;
  }
  
  /**
   * Check if mock data is allowed
   */
  static async isMockDataAllowed(): Promise<boolean> {
    try {
      const { data: config, error } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'allow_mock_data')
        .single();
      
      if (error) {
        // Default to not allowing mock data if we can't check
        return false;
      }
      
      return config?.config_value === 'enabled';
      
    } catch (error) {
      console.error('Error checking mock data policy:', error);
      return false;
    }
  }
  
  /**
   * Block operation if mock data is detected and not allowed
   */
  static async validateDataInput(content: string, source: string): Promise<boolean> {
    try {
      const mockAllowed = await this.isMockDataAllowed();
      
      if (mockAllowed) {
        return true;
      }
      
      // Check for mock data indicators
      const lowerContent = content.toLowerCase();
      const mockIndicators = ['test', 'mock', 'demo', 'sample', 'example'];
      
      const hasMockData = mockIndicators.some(indicator => 
        lowerContent.includes(indicator)
      );
      
      if (hasMockData) {
        console.warn(`🚫 Mock data rejected from ${source}: Live enforcement active`);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Error validating data input:', error);
      // Be conservative - reject if we can't validate
      return false;
    }
  }
}
