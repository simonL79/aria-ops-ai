
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

    // Call the run_scan function via RPC
    const scanOptions: ScanOptions = { 
      scan_depth: 'standard',
      target_entity: targetEntity || null
    };
    
    console.log('Calling database run_scan function with options:', scanOptions);
    const { data, error } = await supabase.rpc('run_scan', scanOptions);
    
    if (error) {
      console.error("Error running monitoring scan:", error);
      toast.error("Failed to run monitoring scan");
      return [];
    }
    
    // Get the latest scan results
    console.log('Fetching latest scan results...');
    const { data: scanResults, error: fetchError } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (fetchError) {
      console.error("Error fetching scan results:", fetchError);
      return [];
    }
    
    console.log(`Fetched ${scanResults?.length || 0} scan results`);
    
    // Process entity extraction for new results
    if (scanResults && scanResults.length > 0) {
      console.log('Processing entity extraction for new scan results...');
      
      const processingPromises = [];
      
      // Process entity extraction in the background for each new result
      for (const result of scanResults) {
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
    const results = (scanResults || []).map((item: any): ScanResult => {
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
        confidenceScore: item.confidence_score || 75
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
    toast.error("An error occurred while running the scan");
    return [];
  }
};
