
import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import type { ScanOptions, LiveScanResult } from '@/types/scan';

/**
 * CONSOLIDATED LIVE OSINT SCANNING - SINGLE SOURCE OF TRUTH
 * NO MOCK DATA - 100% LIVE INTELLIGENCE ONLY
 */

/**
 * Perform real OSINT scan with strict live data enforcement
 * This is the ONLY scanning function - all others are permanently blocked
 */
export const performRealScan = async (options: ScanOptions = {}): Promise<LiveScanResult[]> => {
  try {
    // Enforce live data compliance
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    if (!isCompliant) {
      console.warn('🚫 BLOCKED: System not compliant for live data operations');
      throw new Error('Live data enforcement failed. Mock data operations blocked.');
    }

    console.log('🔍 A.R.I.A™ OSINT: Starting real intelligence scan...');
    console.log('🔍 Options:', options);

    // Call live scanning edge functions in sequence
    const scanFunctions = [
      'reddit-scan',
      'uk-news-scanner', 
      'enhanced-intelligence',
      'discovery-scanner',
      'monitoring-scan'
    ];

    const results: LiveScanResult[] = [];
    
    for (const func of scanFunctions) {
      try {
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_osint',
            fullScan: options.fullScan || true,
            targetEntity: options.targetEntity || null,
            source: options.source || 'manual',
            blockMockData: true,
            enforceLiveOnly: true
          }
        });

        if (!error && data?.results) {
          // Validate results are live data only
          for (const result of data.results) {
            const isValidLiveData = await LiveDataEnforcer.validateDataInput(
              result.content || '', 
              result.platform || 'unknown'
            );
            
            if (isValidLiveData) {
              results.push({
                id: result.id || `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                platform: result.platform,
                content: result.content,
                url: result.url || '',
                severity: (result.severity as 'low' | 'medium' | 'high') || 'low',
                status: (result.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
                threat_type: result.threat_type || 'live_intelligence',
                sentiment: result.sentiment || 0,
                confidence_score: result.confidence_score || 75,
                potential_reach: result.potential_reach || 0,
                detected_entities: result.detected_entities || [],
                source_type: 'live_osint',
                entity_name: result.entity_name || 'unknown',
                source_credibility_score: result.source_credibility_score || 75,
                media_is_ai_generated: result.media_is_ai_generated || false,
                ai_detection_confidence: result.ai_detection_confidence || 0
              });
            } else {
              console.warn('🚫 BLOCKED: Mock data detected and filtered:', result.platform);
            }
          }
        }
      } catch (error) {
        console.warn(`Scan function ${func} failed:`, error);
      }
    }

    console.log(`✅ Validated ${results.length} results as live data`);
    return results;

  } catch (error) {
    console.error('❌ Real scan failed:', error);
    throw error;
  }
};

/**
 * Get live threat score for entity
 */
export const getLiveThreatScore = async (entityId: string): Promise<number> => {
  try {
    const results = await performRealScan({ targetEntity: entityId, fullScan: false });
    
    if (results.length === 0) return 0;
    
    // Calculate threat score based on severity and confidence
    const threatScore = results.reduce((score, result) => {
      let severityWeight = 1;
      if (result.severity === 'medium') severityWeight = 2;
      if (result.severity === 'high') severityWeight = 3;
      
      return score + (severityWeight * (result.confidence_score / 100));
    }, 0);
    
    return Math.min(threatScore / results.length, 100);
  } catch (error) {
    console.error('Error calculating live threat score:', error);
    return 0;
  }
};

/**
 * Perform real-time monitoring scan
 */
export const performRealTimeMonitoring = async (): Promise<LiveScanResult[]> => {
  console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring - live data only');
  return await performRealScan({ fullScan: true, source: 'real_time_monitoring' });
};

/**
 * PERMANENTLY BLOCK ALL MOCK OPERATIONS
 */
export const performMockScan = (): never => {
  console.error('🚫 BLOCKED: Mock scan operations are permanently disabled. Use performRealScan() for live intelligence.');
  throw new Error('Mock data operations blocked by A.R.I.A™ live enforcement system');
};

export const generateMockData = (): never => {
  console.error('🚫 BLOCKED: Mock data generation permanently disabled');
  throw new Error('Mock data generation is permanently disabled. A.R.I.A™ uses 100% live intelligence.');
};
