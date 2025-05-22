
import { processText, processScanResult } from './textProcessor';
import { getAllEntities } from './entityRetrieval';
import { batchProcessScanResults } from '@/services/batchEntityService';

// Export all entity recognition functionality from a single file
export {
  processText,
  processScanResult,
  getAllEntities,
  batchProcessScanResults
};
