
import { supabase } from '@/integrations/supabase/client';

export interface LiveDataCompliance {
  isCompliant: boolean;
  liveDataOnly: boolean;
  mockDataBlocked: boolean;
  lastValidated: string;
  violations: string[];
}

/**
 * A.R.I.A™ Live Data Enforcement System
 */
export class LiveDataEnforcer {
  
  /**
   * Validate that the system is enforcing live data only
   */
  static async validateLiveDataCompliance(): Promise<LiveDataCompliance> {
    try {
      console.log('🔍 Validating live data compliance...');
      
      const violations: string[] = [];
      
      // Check system configuration
      const { data: config, error } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['allow_mock_data', 'live_enforcement', 'system_mode']);
      
      if (error) {
        violations.push('Could not verify system configuration');
      }
      
      const configMap = new Map(config?.map(c => [c.config_key, c.config_value]) || []);
      
      // Validate configuration
      if (configMap.get('allow_mock_data') === 'enabled') {
        violations.push('Mock data is enabled - should be disabled in production');
      }
      
      if (configMap.get('live_enforcement') !== 'enabled') {
        violations.push('Live data enforcement is not active');
      }
      
      if (configMap.get('system_mode') !== 'live') {
        violations.push('System not in live mode');
      }
      
      // Check for recent mock data contamination
      const { data: mockData, error: mockError } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);
      
      if (mockData && mockData.length > 0) {
        violations.push('Mock data detected in recent scan results');
      }
      
      const isCompliant = violations.length === 0;
      const liveDataOnly = configMap.get('allow_mock_data') !== 'enabled';
      const mockDataBlocked = !mockData || mockData.length === 0;
      
      return {
        isCompliant,
        liveDataOnly,
        mockDataBlocked,
        lastValidated: new Date().toISOString(),
        violations
      };
      
    } catch (error) {
      console.error('❌ Live data compliance validation failed:', error);
      return {
        isCompliant: false,
        liveDataOnly: false,
        mockDataBlocked: false,
        lastValidated: new Date().toISOString(),
        violations: ['Validation system error: ' + error.message]
      };
    }
  }
  
  /**
   * Validate input data to ensure it's not mock/test data
   */
  static async validateDataInput(content: string, source: string): Promise<void> {
    const mockIndicators = ['mock', 'test', 'demo', 'sample', 'example'];
    const lowerContent = content.toLowerCase();
    
    if (mockIndicators.some(indicator => lowerContent.includes(indicator))) {
      throw new Error(`Mock data rejected: ${source} contains test indicators`);
    }
    
    // Log validation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'data_validation',
      module_source: 'LiveDataEnforcer',
      operation_data: {
        source,
        contentLength: content.length,
        validated: true
      },
      success: true
    });
  }
  
  /**
   * Enable live data enforcement
   */
  static async enableLiveEnforcement(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_config')
        .upsert([
          { config_key: 'live_enforcement', config_value: 'enabled' },
          { config_key: 'allow_mock_data', config_value: 'disabled' },
          { config_key: 'system_mode', config_value: 'live' }
        ], { onConflict: 'config_key' });
      
      if (error) {
        console.error('Failed to enable live enforcement:', error);
        return false;
      }
      
      console.log('✅ Live data enforcement enabled');
      return true;
      
    } catch (error) {
      console.error('Error enabling live enforcement:', error);
      return false;
    }
  }
  
  /**
   * Get live system status
   */
  static async getLiveSystemStatus(): Promise<{
    active: boolean;
    modules: any[];
    lastUpdate: string;
  }> {
    try {
      const { data: liveStatus, error } = await supabase
        .from('live_status')
        .select('*')
        .order('last_report', { ascending: false });
      
      if (error) {
        console.error('Failed to get live status:', error);
        return { active: false, modules: [], lastUpdate: new Date().toISOString() };
      }
      
      const activeModules = liveStatus?.filter(m => m.system_status === 'LIVE') || [];
      
      return {
        active: activeModules.length > 0,
        modules: liveStatus || [],
        lastUpdate: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error getting live system status:', error);
      return { active: false, modules: [], lastUpdate: new Date().toISOString() };
    }
  }
}
