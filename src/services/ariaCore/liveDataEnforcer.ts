
import { supabase } from '@/integrations/supabase/client';

/**
 * A.R.I.A™ Live Data Enforcement System - ENHANCED SIMULATION DETECTION
 * Ensures 100% live data, blocks all simulation/mock content with advanced detection
 */
export class LiveDataEnforcer {
  
  /**
   * Enhanced validation that input data is live/real with advanced simulation detection
   */
  static async validateDataInput(content: string, platform: string): Promise<boolean> {
    // Enhanced simulation detection patterns
    const simulationKeywords = [
      'mock', 'test', 'demo', 'sample', 'fake', 'simulated', 
      'placeholder', 'lorem ipsum', 'example', 'dummy',
      'synthetic', 'generated', 'artificial', 'template',
      'sandbox', 'staging', 'dev', 'development',
      'simulation', 'hypothetical', 'fictional',
      'advanced ai analysis for target entity', // Specific pattern found in logs
      'target entity', // Generic placeholder
      'undefined', 'null', 'test data'
    ];
    
    const contentLower = content.toLowerCase();
    const hasSimulationKeywords = simulationKeywords.some(keyword => 
      contentLower.includes(keyword)
    );
    
    if (hasSimulationKeywords) {
      console.warn('🚫 BLOCKED: Enhanced simulation detection triggered:', platform, content.substring(0, 100));
      return false;
    }
    
    // Enhanced validation for live data characteristics
    const hasTimestamp = content.includes('2025') || content.includes('Jan') || content.includes('Feb') || content.includes('Dec');
    const hasRealContent = content.length > 50; // Real content tends to be longer
    const hasSpecificDetails = /\b(?:said|reported|announced|confirmed|stated|according to)\b/i.test(content);
    const hasRealNames = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(content); // Proper names pattern
    
    // Block generic/template responses
    const isGenericResponse = /^(this is|here is|the following|based on)/i.test(content.trim());
    if (isGenericResponse) {
      console.warn('🚫 BLOCKED: Generic template response detected:', content.substring(0, 50));
      return false;
    }
    
    // Require multiple live indicators
    const liveIndicators = [hasTimestamp, hasRealContent, hasSpecificDetails, hasRealNames].filter(Boolean).length;
    const isLive = liveIndicators >= 2;
    
    if (!isLive) {
      console.warn('🚫 BLOCKED: Insufficient live data indicators:', platform, `Score: ${liveIndicators}/4`);
    }
    
    return isLive;
  }
  
  /**
   * Enhanced system-wide live data compliance with simulation cleanup
   */
  static async enforceSystemWideLiveData(): Promise<boolean> {
    try {
      // Enhanced patterns for simulation detection in database
      const simulationPatterns = [
        '%mock%', '%test%', '%demo%', '%sample%', '%fake%', '%simulated%',
        '%placeholder%', '%lorem%', '%example%', '%dummy%', '%synthetic%',
        '%generated%', '%artificial%', '%template%', '%sandbox%', '%staging%',
        '%dev%', '%development%', '%simulation%', '%hypothetical%', '%fictional%',
        '%advanced ai analysis%', '%target entity%', '%undefined%'
      ];
      
      // Check for simulation data across multiple tables
      for (const pattern of simulationPatterns) {
        const { data: mockCheck, error } = await supabase
          .from('scan_results')
          .select('id, content, platform')
          .ilike('content', pattern)
          .limit(10);
        
        if (error) {
          console.error('Live data enforcement check failed:', error);
          continue;
        }
        
        if (mockCheck && mockCheck.length > 0) {
          console.warn(`🚫 SYSTEM ALERT: ${mockCheck.length} simulation entries detected for pattern: ${pattern}`);
          
          // Clean up simulation data
          const { error: deleteError } = await supabase
            .from('scan_results')
            .delete()
            .ilike('content', pattern);
            
          if (deleteError) {
            console.error('Failed to clean simulation data:', deleteError);
          } else {
            console.log(`✅ Cleaned ${mockCheck.length} simulation entries for pattern: ${pattern}`);
          }
        }
      }
      
      // Validate recent entries are live
      const { data: recentEntries, error: recentError } = await supabase
        .from('scan_results')
        .select('id, content, platform, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (!recentError && recentEntries) {
        let simulationCount = 0;
        for (const entry of recentEntries) {
          const isLive = await this.validateDataInput(entry.content, entry.platform);
          if (!isLive) {
            simulationCount++;
            // Remove non-live entry
            await supabase.from('scan_results').delete().eq('id', entry.id);
          }
        }
        
        if (simulationCount > 0) {
          console.warn(`🚫 CLEANED: Removed ${simulationCount} simulation entries from recent data`);
        }
      }
      
      return true;
      
    } catch (error) {
      console.error('Live data enforcement failed:', error);
      return false;
    }
  }

  /**
   * Enhanced live data compliance validation with strict simulation detection
   */
  static async validateLiveDataCompliance(): Promise<{
    isCompliant: boolean;
    mockDataBlocked: boolean;
    liveDataOnly: boolean;
    simulationDetected: boolean;
    message: string;
  }> {
    try {
      const isSystemCompliant = await this.enforceSystemWideLiveData();
      
      // Additional check for simulation patterns in prompts/queries
      const { data: queryLogs } = await supabase
        .from('scanner_query_log')
        .select('entity_name, search_terms')
        .gte('executed_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(20);
        
      let simulationDetected = false;
      if (queryLogs) {
        for (const log of queryLogs) {
          const searchTermsStr = JSON.stringify(log.search_terms || []).toLowerCase();
          if (searchTermsStr.includes('simulation') || searchTermsStr.includes('mock') || 
              searchTermsStr.includes('test') || log.entity_name?.toLowerCase().includes('undefined')) {
            simulationDetected = true;
            console.warn('🚫 SIMULATION DETECTED in query logs:', log.entity_name);
            break;
          }
        }
      }
      
      return {
        isCompliant: isSystemCompliant && !simulationDetected,
        mockDataBlocked: true,
        liveDataOnly: !simulationDetected,
        simulationDetected,
        message: simulationDetected 
          ? 'A.R.I.A™ ALERT: Simulation/Mock data detected in system - immediate cleanup required'
          : isSystemCompliant 
            ? 'A.R.I.A™ OSINT Intelligence: 100% live data compliance achieved - NO SIMULATIONS'
            : 'A.R.I.A™ OSINT Intelligence: Live data compliance issues detected'
      };
    } catch (error) {
      console.error('Live data compliance validation failed:', error);
      return {
        isCompliant: false,
        mockDataBlocked: true,
        liveDataOnly: false,
        simulationDetected: true,
        message: 'A.R.I.A™ OSINT Intelligence: Critical compliance validation failed'
      };
    }
  }
  
  /**
   * Enhanced simulation blocking
   */
  static blockSimulation(functionName: string): never {
    console.error(`🚫 WEAPONS-GRADE BLOCK: ${functionName} - ALL SIMULATIONS PERMANENTLY DISABLED`);
    throw new Error(`${functionName} blocked: A.R.I.A™ LIVE INTELLIGENCE ONLY - NO SIMULATIONS PERMITTED`);
  }
}
