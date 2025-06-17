
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

export interface CIAScanOptions {
  targetEntity: string;
  fullScan?: boolean;
  source: string;
  precisionMode?: 'high' | 'medium' | 'low';
  enableFalsePositiveFilter?: boolean;
  liveDataOnly?: boolean;
  blockSimulations?: boolean;
}

export interface CIAScanResult {
  id: string;
  content?: string;
  platform: string;
  url?: string;
  match_score: number;
  match_decision: 'accepted' | 'quarantined' | 'rejected';
  match_type?: string;
  false_positive_detected: boolean;
  created_at: string;
  confidence_score: number;
  severity: 'low' | 'medium' | 'high';
  status: string;
  threat_type: string;
  sentiment: number;
  detected_entities: string[];
  source_type: string;
  potential_reach: number;
  source_credibility_score: number;
  media_is_ai_generated: boolean;
  ai_detection_confidence: number;
}

export class CIALevelScanner {
  /**
   * Execute CIA-level precision scan with mandatory live data enforcement
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    console.log('🎯 CIA Scanner: Starting precision scan with live enforcement');
    
    // MANDATORY: Block if simulation detected
    if (options.blockSimulations !== false) {
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant || compliance.simulationDetected) {
        console.error('🚫 CIA Scanner BLOCKED: Simulation detected');
        LiveDataEnforcer.blockSimulation('CIALevelScanner.executePrecisionScan');
      }
    }

    // Validate target entity is not simulation data
    if (options.liveDataOnly !== false) {
      const isLiveData = await LiveDataEnforcer.validateDataInput(options.targetEntity, options.source);
      if (!isLiveData) {
        console.error('🚫 CIA Scanner BLOCKED: Target entity appears to be simulation data');
        throw new Error('CIA Scanner blocked: Target entity rejected as simulation data');
      }
    }

    try {
      // Import the real scanning function
      const { performRealScan } = await import('@/services/monitoring/realScan');
      
      const liveResults = await performRealScan({
        fullScan: options.fullScan || false,
        targetEntity: options.targetEntity,
        source: options.source
      });

      // Convert to CIA scan result format
      const ciaResults: CIAScanResult[] = liveResults.map(result => ({
        id: result.id,
        content: result.content,
        platform: result.platform,
        url: result.url,
        match_score: result.confidence_score || result.confidence || 0,
        match_decision: (result.confidence_score || result.confidence || 0) > 0.7 ? 'accepted' : 
                       (result.confidence_score || result.confidence || 0) > 0.4 ? 'quarantined' : 'rejected',
        match_type: result.threat_type,
        false_positive_detected: (result.confidence_score || result.confidence || 0) < 0.3,
        created_at: new Date().toISOString(),
        confidence_score: result.confidence_score || result.confidence || 0,
        severity: result.severity,
        status: result.status || 'new',
        threat_type: result.threat_type || 'unknown',
        sentiment: result.sentiment || 0,
        detected_entities: result.detected_entities || [],
        source_type: result.source_type || 'live_osint',
        potential_reach: result.potential_reach || 1000,
        source_credibility_score: result.source_credibility_score || 0.5,
        media_is_ai_generated: result.media_is_ai_generated || false,
        ai_detection_confidence: result.ai_detection_confidence || 0
      }));

      console.log(`✅ CIA Scanner: ${ciaResults.length} live results processed`);
      return ciaResults;

    } catch (error) {
      console.error('❌ CIA Scanner failed:', error);
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        throw error; // Re-throw simulation blocks
      }
      throw new Error('CIA Scanner: Live intelligence gathering failed');
    }
  }

  /**
   * PERMANENTLY BLOCK mock scanning
   */
  static executeMockScan(): never {
    LiveDataEnforcer.blockSimulation('CIALevelScanner.executeMockScan');
  }
}
