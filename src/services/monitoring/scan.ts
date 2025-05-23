
import { supabase } from '@/integrations/supabase/client';
import type { ScanResult } from './types';
import { toast } from 'sonner';
import { parseDetectedEntities } from '@/utils/parseDetectedEntities';
import { processScanWithEntityExtraction } from '@/services/entityExtraction/scanProcessor';

interface ScanOptions {
  scan_depth?: string;
  target_entity?: string | null;
}

/**
 * Run a monitoring scan and return results
 */
export const runMonitoringScan = async (targetEntity?: string): Promise<ScanResult[]> => {
  try {
    // First, update the monitoring status
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

    // Call the run_scan function via RPC
    const scanOptions: ScanOptions = { 
      scan_depth: 'standard',
      target_entity: targetEntity || null
    };
    
    const { data, error } = await supabase.rpc('run_scan', scanOptions);
    
    if (error) {
      console.error("Error running monitoring scan:", error);
      toast.error("Failed to run monitoring scan");
      return [];
    }
    
    // Get the latest scan results
    const { data: scanResults, error: fetchError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (fetchError) {
      console.error("Error fetching scan results:", fetchError);
      return [];
    }
    
    // Process entity extraction for new results
    if (scanResults && scanResults.length > 0) {
      console.log('Processing entity extraction for new scan results...');
      
      // Process entity extraction in the background for each new result
      for (const result of scanResults) {
        if (result.content && (!result.is_identified || result.detected_entities?.length === 0)) {
          // Process entity extraction asynchronously
          processScanWithEntityExtraction(result.id, result.content).catch(error => {
            console.error(`Error processing entities for scan ${result.id}:`, error);
          });
        }
      }
    }
    
    // Convert to the expected format with type safety
    const results = (scanResults || []).map((item: any): ScanResult => {
      const typedResult: ScanResult = {
        id: item.id,
        content: item.content,
        platform: item.platform,
        url: item.url || '',
        date: item.created_at,
        sentiment: item.sentiment || 0,
        severity: (item.severity as 'low' | 'medium' | 'high') || 'low',
        status: (item.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
        threatType: item.threat_type,
        client_id: item.client_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        detectedEntities: parseDetectedEntities(item.detected_entities).map(entity => entity.name),
        sourceType: item.source_type,
        potentialReach: item.potential_reach,
        confidenceScore: item.confidence_score
      };
      return typedResult;
    });
    
    if (results.length > 0) {
      toast.success(`Scan completed: ${results.length} mentions found`);
    } else {
      toast.info("Scan completed: No new mentions found");
    }
    
    return results;
    
  } catch (error) {
    console.error("Error in runMonitoringScan:", error);
    toast.error("An error occurred while running the scan");
    return [];
  }
};
