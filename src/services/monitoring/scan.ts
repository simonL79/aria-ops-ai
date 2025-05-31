
import { supabase } from '@/integrations/supabase/client';
import type { ScanResult } from './types';
import { toast } from 'sonner';
import { parseDetectedEntities } from '@/utils/parseDetectedEntities';
import { processScanWithEntityExtraction } from '@/services/entityExtraction/scanProcessor';
import { performRealScan } from './realScan';

interface ScanOptions {
  scan_depth?: string;
  target_entity?: string | null;
}

/**
 * Run a monitoring scan - 100% LIVE DATA ONLY, NO SIMULATIONS
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

    // Use ONLY live intelligence gathering
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
      
      // Validate all results are live data
      const validatedResults = liveResults.filter((item: any) => {
        const content = (item.content || '').toLowerCase();
        const hasMockIndicators = ['mock', 'test', 'demo', 'sample', 'simulation'].some(keyword => 
          content.includes(keyword)
        );
        
        if (hasMockIndicators) {
          console.warn('🚫 BLOCKED: Mock data detected and filtered from results');
          return false;
        }
        return true;
      });

      console.log(`✅ Validated ${validatedResults.length}/${liveResults.length} results as live data`);
      
      return validatedResults.map((item: any): ScanResult => ({
        id: item.id || `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: item.content,
        platform: item.platform,
        url: item.url || '',
        date: item.created_at || new Date().toISOString(),
        sentiment: item.sentiment || 0,
        severity: (item.severity as 'low' | 'medium' | 'high') || 'low',
        status: (item.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
        threatType: 'live_intelligence',
        client_id: item.client_id,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        detectedEntities: item.detected_entities || [],
        sourceType: 'live_osint',
        potentialReach: item.potential_reach || 0,
        confidenceScore: item.confidence_score || 75,
        source_credibility_score: item.source_credibility_score,
        media_is_ai_generated: item.media_is_ai_generated || false,
        ai_detection_confidence: item.ai_detection_confidence,
        incident_playbook: item.incident_playbook
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

// Block any mock scan functions
export const runMockScan = () => {
  console.error('🚫 BLOCKED: Mock scanning permanently disabled in A.R.I.A™ live system');
  throw new Error('Mock scanning is permanently disabled. A.R.I.A™ uses 100% live intelligence.');
};
