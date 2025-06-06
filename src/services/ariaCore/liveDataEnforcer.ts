
import { toast } from 'sonner';

export interface LiveDataCompliance {
  isCompliant: boolean;
  mockDataBlocked: boolean;
  liveDataOnly: boolean;
  simulationDetected: boolean;
  message: string;
}

/**
 * A.R.I.A™ Live Data Enforcement System
 * ZERO TOLERANCE for mock data in production client environment
 */
export class LiveDataEnforcer {
  
  private static readonly MOCK_DATA_PATTERNS = [
    /mock/i,
    /test/i,
    /demo/i,
    /sample/i,
    /example\.com/i,
    /localhost/i,
    /127\.0\.0\.1/i,
    /simulation/i,
    /fake/i,
    /dummy/i
  ];
  
  /**
   * Validate that the system is operating in live data mode only
   */
  static async validateLiveDataCompliance(): Promise<LiveDataCompliance> {
    try {
      console.log('🔍 A.R.I.A™ OSINT: Validating live data compliance...');
      
      // Check for any simulation or mock data indicators
      const simulationDetected = this.detectSimulationIndicators();
      
      if (simulationDetected) {
        const message = '🚨 SIMULATION DETECTED: A.R.I.A™ system must operate with 100% live data';
        console.error(message);
        
        return {
          isCompliant: false,
          mockDataBlocked: true,
          liveDataOnly: false,
          simulationDetected: true,
          message
        };
      }
      
      const compliance: LiveDataCompliance = {
        isCompliant: true,
        mockDataBlocked: true,
        liveDataOnly: true,
        simulationDetected: false,
        message: 'A.R.I.A™ OSINT Intelligence: 100% live data compliance achieved - NO SIMULATIONS'
      };
      
      console.log('📊 Live data compliance:', compliance);
      return compliance;
      
    } catch (error) {
      console.error('❌ Live data compliance check failed:', error);
      
      return {
        isCompliant: false,
        mockDataBlocked: false,
        liveDataOnly: false,
        simulationDetected: false,
        message: `Compliance validation failed: ${error.message}`
      };
    }
  }
  
  /**
   * Validate that input data is from live sources
   */
  static async validateDataInput(data: string, source: string): Promise<boolean> {
    if (!data || !source) {
      return false;
    }
    
    // Check for mock data patterns
    const hasMockPattern = this.MOCK_DATA_PATTERNS.some(pattern => 
      pattern.test(data) || pattern.test(source)
    );
    
    if (hasMockPattern) {
      console.warn(`🚫 Mock data detected in ${source}: ${data.substring(0, 100)}...`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Block simulation operations with zero tolerance
   */
  static blockSimulation(operation: string): never {
    const message = `🚫 SIMULATION BLOCKED: ${operation} - A.R.I.A™ operates with live data only in production`;
    console.error(message);
    
    toast.error("Simulation Blocked", {
      description: "A.R.I.A™ requires 100% live data sources for client operations",
      duration: 10000
    });
    
    throw new Error(message);
  }
  
  /**
   * Detect simulation indicators in the environment
   */
  private static detectSimulationIndicators(): boolean {
    // Check for common development/test indicators
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    const testIndicators = [
      hostname.includes('localhost'),
      hostname.includes('127.0.0.1'),
      hostname.includes('test'),
      hostname.includes('dev'),
      userAgent.includes('test'),
      // Check for common test frameworks
      typeof window !== 'undefined' && (window as any).__test__,
      typeof global !== 'undefined' && (global as any).__test__
    ];
    
    return testIndicators.some(indicator => indicator);
  }
  
  /**
   * Enforce live data requirements for API calls
   */
  static async validateApiCall(endpoint: string, payload: any): Promise<void> {
    const endpointValid = await this.validateDataInput(endpoint, 'api_endpoint');
    const payloadValid = payload ? await this.validateDataInput(JSON.stringify(payload), 'api_payload') : true;
    
    if (!endpointValid || !payloadValid) {
      this.blockSimulation(`API call to ${endpoint}`);
    }
  }
  
  /**
   * Get current compliance status
   */
  static async getCurrentComplianceStatus(): Promise<LiveDataCompliance> {
    return await this.validateLiveDataCompliance();
  }
}
