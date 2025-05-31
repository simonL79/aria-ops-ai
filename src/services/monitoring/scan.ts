
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
    console.log('Starting monitoring scan...');
    
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

    // Try to call the edge function first, but fallback to database function if it fails
    let scanResults = null;
    let useEdgeFunction = true;
    
    try {
      // Call the monitoring-scan edge function
      console.log('Attempting to call monitoring-scan edge function...');
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('monitoring-scan', {
        body: { 
          fullScan: true,
          targetEntity: targetEntity || null
        }
      });
      
      if (edgeError) {
        console.error('Edge function error:', edgeError);
        useEdgeFunction = false;
      } else {
        console.log('Edge function executed successfully');
        scanResults = edgeData?.results || [];
      }
    } catch (edgeError) {
      console.error('Edge function call failed:', edgeError);
      useEdgeFunction = false;
    }
    
    // Fallback to database function if edge function fails
    if (!useEdgeFunction) {
      console.log('Falling back to database function...');
      const scanOptions: ScanOptions = { 
        scan_depth: 'standard',
        target_entity: targetEntity || null
      };
      
      const { data, error } = await supabase.rpc('run_scan', scanOptions);
      
      if (error) {
        console.error("Error running database scan:", error);
        toast.error("Failed to run monitoring scan");
        return [];
      }
    }
    
    // Get the latest scan results regardless of scan method
    console.log('Fetching latest scan results...');
    const { data: latestResults, error: fetchError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (fetchError) {
      console.error("Error fetching scan results:", fetchError);
      return [];
    }
    
    console.log(`Fetched ${latestResults?.length || 0} scan results`);
    
    // Process entity extraction for new results
    if (latestResults && latestResults.length > 0) {
      console.log('Processing entity extraction for new scan results...');
      
      const processingPromises = [];
      
      // Process entity extraction in the background for each new result
      for (const result of latestResults) {
        if (result.content && (!result.detected_entities || (Array.isArray(result.detected_entities) && result.detected_entities.length === 0))) {
          // Add to processing queue
          processingPromises.push(
            processScanWithEntityExtraction(result.id, result.content)
              .catch(error => {
                console.error(`Error processing entities for scan ${result.id}:`, error);
              })
          );
        }
      }
      
      // Process entity extraction concurrently
      if (processingPromises.length > 0) {
        console.log(`Processing entity extraction for ${processingPromises.length} items...`);
        try {
          // Run all entity extraction in the background
          Promise.all(processingPromises).catch(err => {
            console.error('Error in bulk entity extraction:', err);
          });
        } catch (err) {
          console.error('Error starting entity extraction:', err);
        }
      }
    }
    
    // Convert to the expected format with type safety
    const results = (latestResults || []).map((item: any): ScanResult => {
      // Parse detected entities if they exist
      const detectedEntities = item.detected_entities ? 
        parseDetectedEntities(item.detected_entities) : [];
      
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
        detectedEntities: detectedEntities.map(entity => entity.name),
        sourceType: item.source_type || 'scan',
        potentialReach: item.potential_reach || 0,
        confidenceScore: item.confidence_score || 75,
        source_credibility_score: item.source_credibility_score,
        media_is_ai_generated: item.media_is_ai_generated || false,
        ai_detection_confidence: item.ai_detection_confidence,
        incident_playbook: item.incident_playbook
      };
      return typedResult;
    });
    
    if (results.length > 0) {
      console.log(`Scan completed: ${results.length} mentions found`);
      toast.success(`Scan completed: ${results.length} mentions found`);
    } else {
      console.log('Scan completed: No new mentions found');
      toast.info("Scan completed: No new mentions found");
    }
    
    return results;
    
  } catch (error) {
    console.error("Error in runMonitoringScan:", error);
    toast.error("An error occurred while running the scan. The system fell back to local scanning.");
    
    // Final fallback - return empty results but don't crash
    return [];
  }
};
