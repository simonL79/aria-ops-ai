
import { supabase } from '@/integrations/supabase/client';
import type { ScanResult } from './types';
import { toast } from 'sonner';

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
    // If a target entity is provided, pass it to the scan function
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
    
    // Convert to the expected format
    const results: ScanResult[] = scanResults?.map(item => ({
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
      // Ensure detected entities is always a string array
      detectedEntities: processDetectedEntities(item.detected_entities),
      // Add additional source information
      sourceType: item.source_type,
      // Parse potential reach if available
      potentialReach: item.potential_reach,
      // Parse confidence score if available  
      confidenceScore: item.confidence_score
    })) || [];
    
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

/**
 * Process detected entities to always return a string array
 */
const processDetectedEntities = (entities: any): string[] => {
  if (!entities) return [];
  
  if (Array.isArray(entities)) {
    return entities.map(entity => String(entity));
  }
  
  if (typeof entities === 'string') {
    try {
      // Check if it's a JSON string
      const parsed = JSON.parse(entities);
      if (Array.isArray(parsed)) {
        return parsed.map(entity => String(entity));
      }
      return [String(parsed)];
    } catch {
      // Not a JSON string, treat as a single entity
      return [entities];
    }
  }
  
  // For any other type, convert to string and return as a single-item array
  return [String(entities)];
};
