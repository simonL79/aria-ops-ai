
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkColumnExists } from '@/utils/databaseUtils';
import { parseDetectedEntities, ScanEntity } from '@/utils/parseDetectedEntities';

// Define a strict interface for raw scan results from database
export interface RawScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: string;
  status: string;
  threat_type?: string;
  detected_entities?: unknown; // Accept unknown for detected_entities at fetch time
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  created_at?: string;
  confidence_score?: number | null;
  is_identified?: boolean;
  [key: string]: unknown; // Allow for additional properties
}

// Define processed scan result type after parsing detected entities
export interface ScanResult extends Omit<RawScanResult, 'detected_entities'> {
  detected_entities?: ScanEntity[]; // Always parsed into ScanEntity[]
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
        // Process raw data into typed ScanResults
        return nameData.map((row: RawScanResult): ScanResult => ({
          ...row,
          detected_entities: parseDetectedEntities(row.detected_entities)
        }));
      }
    }
    
    // Try using the detected_entities array if it exists
    if (hasDetectedEntities) {
      const { data: arrayData, error: arrayError } = await supabase
        .from('scan_results')
        .select('*')
        .contains('detected_entities', [entityName]);
      
      if (!arrayError && arrayData) {
        // Process raw data into typed ScanResults
        results = arrayData.map((row: RawScanResult): ScanResult => ({
          ...row,
          detected_entities: parseDetectedEntities(row.detected_entities)
        }));
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};
