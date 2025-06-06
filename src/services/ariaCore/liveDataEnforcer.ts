
import { supabase } from '@/integrations/supabase/client';

export interface LiveDataCompliance {
  isCompliant: boolean;
  simulationDetected: boolean;
  violationType?: string;
  details?: string;
}

export class LiveDataEnforcer {
  
  /**
   * Validate that system is operating with live data compliance
   */
  static async validateLiveDataCompliance(): Promise<LiveDataCompliance> {
    try {
      // Check system configuration for mock data allowance
      const { data: config } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'allow_mock_data')
        .single();

      if (config?.config_value === 'enabled') {
        return {
          isCompliant: false,
          simulationDetected: true,
          violationType: 'system_config',
          details: 'Mock data is enabled in system configuration'
        };
      }

      // Check for recent mock data insertions
      const { data: mockEntries } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(1);

      if (mockEntries && mockEntries.length > 0) {
        return {
          isCompliant: false,
          simulationDetected: true,
          violationType: 'mock_data_detected',
          details: 'Mock data entries found in recent scan results'
        };
      }

      return {
        isCompliant: true,
        simulationDetected: false
      };

    } catch (error) {
      console.error('Live data compliance check failed:', error);
      return {
        isCompliant: false,
        simulationDetected: true,
        violationType: 'compliance_check_failed',
        details: 'Unable to verify live data compliance'
      };
    }
  }

  /**
   * Validate that input data is live (not simulation)
   */
  static async validateDataInput(inputData: string, source: string): Promise<boolean> {
    const inputLower = inputData.toLowerCase();
    
    // Block obvious simulation indicators
    const simulationIndicators = [
      'mock', 'test', 'demo', 'sample', 'example',
      'lorem', 'ipsum', 'placeholder', 'dummy',
      'fake', 'artificial', 'synthetic', 'generated'
    ];

    for (const indicator of simulationIndicators) {
      if (inputLower.includes(indicator)) {
        console.warn(`🚫 Live Data Enforcer: Simulation indicator "${indicator}" detected in input`);
        return false;
      }
    }

    // Additional validation for entity names
    if (source === 'entity_scanner') {
      const suspiciousPatterns = [
        /test\d+/i,
        /user\d+/i,
        /entity\d+/i,
        /mock_/i,
        /demo_/i
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(inputData)) {
          console.warn(`🚫 Live Data Enforcer: Suspicious pattern detected in entity: ${inputData}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Block simulation attempts with immediate termination
   */
  static blockSimulation(functionName: string): never {
    console.error(`🚫 SIMULATION BLOCKED: ${functionName} attempted to execute with simulation data`);
    
    // Log the violation
    supabase.from('aria_ops_log').insert({
      operation_type: 'simulation_blocked',
      module_source: 'live_data_enforcer',
      success: false,
      operation_data: {
        blocked_function: functionName,
        block_reason: 'Simulation data detected',
        block_timestamp: new Date().toISOString()
      }
    }).then(() => {
      console.log('Simulation block logged to database');
    }).catch(error => {
      console.error('Failed to log simulation block:', error);
    });

    throw new Error(`SIMULATION BLOCKED: ${functionName} - A.R.I.A™ operates exclusively with live data`);
  }

  /**
   * Enforce live-only operation mode
   */
  static async enforceLiveOnlyMode(): Promise<void> {
    try {
      // Update system configuration to disable mock data
      await supabase
        .from('system_config')
        .upsert({
          config_key: 'allow_mock_data',
          config_value: 'disabled'
        });

      // Update system configuration for live mode
      await supabase
        .from('system_config')
        .upsert({
          config_key: 'system_mode',
          config_value: 'live'
        });

      console.log('✅ Live Data Enforcer: Live-only mode enforced');
    } catch (error) {
      console.error('Failed to enforce live-only mode:', error);
    }
  }

  /**
   * Get live data compliance report
   */
  static async getComplianceReport(): Promise<any> {
    try {
      const compliance = await this.validateLiveDataCompliance();
      
      // Get recent violations count
      const { data: violations } = await supabase
        .from('aria_ops_log')
        .select('id')
        .eq('operation_type', 'simulation_blocked')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get system configuration
      const { data: systemConfig } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['allow_mock_data', 'system_mode', 'live_enforcement']);

      return {
        compliance_status: compliance,
        violations_24h: violations?.length || 0,
        system_configuration: systemConfig || [],
        last_check: new Date().toISOString()
      };

    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      return {
        compliance_status: { isCompliant: false, simulationDetected: true },
        violations_24h: 0,
        system_configuration: [],
        last_check: new Date().toISOString(),
        error: error.message
      };
    }
  }
}
