
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkColumnExists } from '@/utils/databaseUtils';

// Define a more specific interface for entities to avoid recursive type issues
export interface DetectedEntity {
  name: string;
  type?: string;
  confidence?: number;
}

// Define a proper interface to avoid recursive type issues
export interface ScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: string;
  status: string;
  threat_type?: string;
  detected_entities?: string[] | null;
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  created_at?: string;
  confidence_score?: number | null;
  is_identified?: boolean;
  // Use a safer type for the index signature
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
        // Use type guard to ensure we have valid ScanResults
        return (nameData as any[]).filter(isScanResult);
      }
    }
    
    // Try using the detected_entities array if it exists
    if (hasDetectedEntities) {
      const { data: arrayData, error: arrayError } = await supabase
        .from('scan_results')
        .select('*')
        .contains('detected_entities', [entityName]);
      
      if (!arrayError && arrayData) {
        // Use type guard to ensure we have valid ScanResults
        results = (arrayData as any[]).filter(isScanResult);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};
