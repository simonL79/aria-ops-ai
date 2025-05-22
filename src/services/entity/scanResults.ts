
/**
 * Re-export scan result types and functions
 * This maintains backward compatibility with existing imports
 */

// Re-export types
export { 
  ScanResult, 
  RawScanResult, 
  ScanEntity, 
  isScanResult 
} from './types/scanTypes';

// Re-export parser function
export { parseDetectedEntities } from './utils/entityParser';

// Re-export query functions
export { 
  getScanResultsByEntity, 
  getAllScanResults 
} from './queries/scanQueries';
