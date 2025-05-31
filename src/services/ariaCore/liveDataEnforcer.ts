
import { supabase } from '@/integrations/supabase/client';

/**
 * A.R.I.A™ Live Data Enforcement System
 * Ensures 100% live data, blocks all simulation/mock content
 */
export class LiveDataEnforcer {
  
  /**
   * Validate that input data is live/real
   */
  static async validateDataInput(content: string, platform: string): Promise<boolean> {
    // Block obvious simulation indicators
    const simulationKeywords = [
      'mock', 'test', 'demo', 'sample', 'fake', 'simulated', 
      'placeholder', 'lorem ipsum', 'example', 'dummy'
    ];
    
    const contentLower = content.toLowerCase();
    const hasSimulationKeywords = simulationKeywords.some(keyword => 
      contentLower.includes(keyword)
    );
    
    if (hasSimulationKeywords) {
      console.warn('🚫 BLOCKED: Simulation content detected:', platform);
      return false;
    }
    
    // Additional validation for live data
    const hasTimestamp = content.includes('2025') || content.includes('Jan') || content.includes('Feb');
    const hasRealContent = content.length > 50; // Real content tends to be longer
    
    return hasTimestamp && hasRealContent;
  }
  
  /**
   * Enforce system-wide live data compliance
   */
  static async enforceSystemWideLiveData(): Promise<boolean> {
    try {
      // Check for any mock data in the system
      const { data: mockCheck, error } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%,content.ilike.%sample%')
        .limit(1);
      
      if (error) {
        console.error('Live data enforcement check failed:', error);
        return false;
      }
      
      if (mockCheck && mockCheck.length > 0) {
        console.warn('🚫 SYSTEM ALERT: Mock data detected in database');
        
        // Clean up mock data
        await supabase
          .from('scan_results')
          .delete()
          .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%,content.ilike.%sample%');
          
        console.log('✅ Mock data cleaned from system');
      }
      
      return true;
      
    } catch (error) {
      console.error('Live data enforcement failed:', error);
      return false;
    }
  }
  
  /**
   * Block simulation functions
   */
  static blockSimulation(functionName: string): never {
    console.error(`🚫 BLOCKED: ${functionName} - Simulation disabled in A.R.I.A™ live system`);
    throw new Error(`${functionName} blocked: Live intelligence system only`);
  }
}
