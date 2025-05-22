
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define a strict interface for raw scan results from database
export interface RawScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: string;
  status: string;
  threat_type?: string;
  detected_entities?: unknown; // Use unknown type to avoid recursive type issues
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  created_at?: string;
  confidence_score?: number | null;
  is_identified?: boolean;
}

// Define a simple entity structure
export interface ScanEntity {
  name: string;
  type?: string;
  confidence?: number;
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
 * Simple function to safely parse detected entities from various formats
 */
export function parseDetectedEntities(input: unknown): ScanEntity[] {
  if (!input) return [];
  
  // Handle array input
  if (Array.isArray(input)) {
    return input.map(item => {
      // Handle string items
      if (typeof item === 'string') {
        return { name: item };
      }
      
      // Handle object items
      if (item && typeof item === 'object') {
        if ('name' in item && typeof item.name === 'string') {
          return {
            name: item.name,
            type: typeof item.type === 'string' ? item.type : undefined,
            confidence: typeof item.confidence === 'number' ? item.confidence : undefined
          };
        }
      }
      
      // Default fallback
      return { name: String(item) };
    });
  }
  
  // Handle string input (e.g., JSON string)
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parseDetectedEntities(parsed);
      }
      return [{ name: input }];
    } catch {
      return [{ name: input }];
    }
  }
  
  // Default: empty array
  return [];
}

/**
 * Get scan results by entity name - simplified approach that doesn't rely on column_exists
 */
export const getScanResultsByEntity = async (entityName: string): Promise<ScanResult[]> => {
  try {
    let results: ScanResult[] = [];
    
    // Try with risk_entity_name field
    const { data: nameData, error: nameError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('risk_entity_name', entityName);
    
    if (!nameError && nameData && nameData.length > 0) {
      // Process raw data into typed ScanResults
      const rawResults = nameData;
      
      return rawResults.map((row: any): ScanResult => {
        return {
          ...row,
          detected_entities: parseDetectedEntities(row.detected_entities)
        };
      });
    }
    
    // Try with detected_entities field
    const { data: arrayData, error: arrayError } = await supabase
      .from('scan_results')
      .select('*')
      .contains('detected_entities', [entityName]);
    
    if (!arrayError && arrayData) {
      // Process raw data into typed ScanResults
      const rawResults = arrayData;
      
      results = rawResults.map((row: any): ScanResult => {
        return {
          ...row,
          detected_entities: parseDetectedEntities(row.detected_entities)
        };
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    toast.error("Failed to fetch scan results for entity");
    return [];
  }
};

/**
 * Get all scan results - simplified approach 
 */
export const getAllScanResults = async (): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.error("Failed to fetch scan results:", error);
      return [];
    }
    
    // Process raw data into typed ScanResults
    return data.map((row: any): ScanResult => {
      return {
        ...row,
        detected_entities: parseDetectedEntities(row.detected_entities)
      };
    });
  } catch (error) {
    console.error("Error fetching scan results:", error);
    return [];
  }
};
