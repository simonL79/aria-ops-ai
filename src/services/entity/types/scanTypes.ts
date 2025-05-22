
/**
 * Type definitions for scan results and entities
 */

// Define a strict interface for raw scan results from database
export interface RawScanResult {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: string;
  status: string;
  threat_type?: string;
  detected_entities?: unknown;
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
