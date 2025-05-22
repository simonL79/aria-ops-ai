
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkColumnExists } from '@/utils/databaseUtils';
import { parseDetectedEntities, ScanEntity } from '@/utils/parseDetectedEntities';

// Define a more specific interface for scan results to avoid recursive type issues
export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: string;
  status: string;
  threat_type?: string;
  // Use ScanEntity[] for detected_entities to avoid type recursion issues
  detected_entities?: ScanEntity[] | string[] | null;
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  created_at?: string;
  confidence_score?: number | null;
  is_identified?: boolean;
  // Use unknown for any additional properties
  [key: string]: unknown;
}

/**
 * Type guard to check if an object is a ScanResult
 */
export function isScanResult(obj: any): obj is ScanResult {
  return obj && 
         typeof obj === 'object' && 
         'id' in obj && 
         'content' in obj &&
         'platform' in obj;
}

/**
 * Get scan results by entity name
 */
export const getScanResultsByEntity = async (entityName: string): Promise<ScanResult[]> => {
  try {
    // Check if required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasRiskEntityName = await checkColumnExists('scan_results', 'risk_entity_name');
    
    if (!hasDetectedEntities && !hasRiskEntityName) {
      toast.error("Required database columns for entity recognition are missing");
      return [];
    }
    
    // Try different approaches based on available columns
    let results: ScanResult[] = [];
    
    // First try with the risk_entity_name field if it exists
    if (hasRiskEntityName) {
      const { data: nameData, error: nameError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('risk_entity_name', entityName);
      
      if (!nameError && nameData && nameData.length > 0) {
        // Process data without deep nesting in types
        const filteredData = nameData.filter(isScanResult);
        return filteredData.map(result => {
          // Create a new object to avoid modifying the original
          const processed: ScanResult = { ...result };
          // Parse detected entities using our utility
          processed.detected_entities = parseDetectedEntities(result.detected_entities);
          return processed;
        });
      }
    }
    
    // Try using the detected_entities array if it exists
    if (hasDetectedEntities) {
      const { data: arrayData, error: arrayError } = await supabase
        .from('scan_results')
        .select('*')
        .contains('detected_entities', [entityName]);
      
      if (!arrayError && arrayData) {
        // Process data without deep nesting in types
        const filteredData = arrayData.filter(isScanResult);
        results = filteredData.map(result => {
          // Create a new object to avoid modifying the original
          const processed: ScanResult = { ...result };
          // Parse detected entities using our utility
          processed.detected_entities = parseDetectedEntities(result.detected_entities);
          return processed;
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};
