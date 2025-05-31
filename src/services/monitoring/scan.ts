
import { supabase } from '@/integrations/supabase/client';
import type { ScanResult } from '@/types/scan';
import { toast } from 'sonner';
import { parseDetectedEntities } from '@/utils/parseDetectedEntities';
import { processScanWithEntityExtraction } from '@/services/entityExtraction/scanProcessor';
import { performRealScan } from './realScan';

/**
 * Run a monitoring scan - 100% LIVE DATA ONLY, NO SIMULATIONS
 * Uses consolidated real scanning logic
 */
export const runMonitoringScan = async (targetEntity?: string): Promise<ScanResult[]> => {
  try {
    console.log('🔍 A.R.I.A™ OSINT: Starting live monitoring scan - NO SIMULATIONS ALLOWED');
    
    // Update monitoring status
    const { error: statusError } = await supabase
      .from('monitoring_status')
      .update({
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', '1');
    
    if (statusError) {
      console.error("Error updating monitoring status:", statusError);
    }

    // Use ONLY live intelligence gathering from consolidated scanner
    try {
      console.log('🔍 A.R.I.A™ OSINT: Executing live intelligence scan');
      
      const liveResults = await performRealScan({
        fullScan: true,
        targetEntity: targetEntity || null,
        source: 'monitoring_scan'
      });
      
      console.log(`✅ Live scan completed: ${liveResults.length} verified live intelligence items`);
      
      if (liveResults.length > 0) {
        toast.success(`Live scan completed: ${liveResults.length} live intelligence items found - NO MOCK DATA`);
      } else {
        toast.info("Live scan completed: No new live intelligence detected");
      }
      
      // Convert to ScanResult format
      return liveResults.map((item): ScanResult => ({
        id: item.id,
        content: item.content,
        platform: item.platform,
        url: item.url,
        date: new Date().toISOString(),
        sentiment: item.sentiment,
        severity: item.severity,
        status: item.status,
        threatType: item.threat_type,
        client_id: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        detectedEntities: item.detected_entities,
        sourceType: item.source_type,
        potentialReach: item.potential_reach,
        confidenceScore: item.confidence_score,
        source_credibility_score: item.source_credibility_score,
        media_is_ai_generated: item.media_is_ai_generated,
        ai_detection_confidence: item.ai_detection_confidence
      }));
      
    } catch (error) {
      console.error("❌ Live scan failed:", error);
      toast.error("Live intelligence scan failed - no simulation fallback available");
      throw new Error('Live scanning failed - simulation permanently disabled');
    }
    
  } catch (error) {
    console.error("❌ Error in runMonitoringScan:", error);
    toast.error("Live intelligence scan failed");
    return [];
  }
};

/**
 * PERMANENTLY BLOCK ALL MOCK OPERATIONS
 */
export const runMockScan = (): never => {
  console.error('🚫 BLOCKED: Mock scanning permanently disabled in A.R.I.A™ live system');
  throw new Error('Mock scanning is permanently disabled. A.R.I.A™ uses 100% live intelligence.');
};
