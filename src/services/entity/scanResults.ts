
/**
 * Re-export scan result types and functions
 * This maintains backward compatibility with existing imports
 */

// Re-export types
export type { 
  ScanResult, 
  RawScanResult, 
  ScanEntity, 
} from './types/scanTypes';

export { isScanResult } from './types/scanTypes';

// Re-export parser function
export { parseDetectedEntities } from './utils/entityParser';

// Re-export query functions
export { 
  getScanResultsByEntity, 
  getAllScanResults 
} from './queries/scanQueries';
