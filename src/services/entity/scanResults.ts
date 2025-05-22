
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
  // Make detected_entities flexible to handle various formats from the database
  detected_entities?: string[] | DetectedEntity[] | null;
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
 * Process detected entities to ensure consistent format
 */
function processDetectedEntities(entities: unknown): string[] | null {
  if (!entities) return null;
  
  // If already string array, return as is
  if (Array.isArray(entities) && entities.every(e => typeof e === 'string')) {
    return entities;
  }
  
  // If JSON string, try to parse it
  if (typeof entities === 'string') {
    try {
      const parsed = JSON.parse(entities);
      if (Array.isArray(parsed)) {
        return parsed.map(e => typeof e === 'string' ? e : e.name || String(e));
      }
    } catch {
      // If parsing fails, treat as a single entity
      return [entities];
    }
  }
  
  // For objects or other formats, extract names or convert to strings
  if (Array.isArray(entities)) {
    return entities.map(e => {
      if (typeof e === 'object' && e !== null && 'name' in e) {
        return String(e.name);
      }
      return String(e);
    });
  }
  
  return null;
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
          const processed = { ...result };
          processed.detected_entities = processDetectedEntities(result.detected_entities);
          return processed as ScanResult;
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
          const processed = { ...result };
          processed.detected_entities = processDetectedEntities(result.detected_entities);
          return processed as ScanResult;
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};
