
// This file is maintained for backwards compatibility
// Import and re-export all entity-related functions

import { extractEntitiesFromText } from './entity/extractionUtils';
import { processEntities } from './entity/processUtils';
import { batchProcessEntities } from './entity/batchProcessor';
import { 
  getAllEntities, 
  getScanResultsByEntity, 
  getEntityStatistics 
} from './entity/queryService';

export { 
  extractEntitiesFromText,
  processEntities,
  batchProcessEntities,
  getAllEntities,
  getScanResultsByEntity,
  getEntityStatistics,
};

// Explicitly re-export the Entity and EntityStatistics types
export type { Entity, EntityStatistics } from '@/types/entity';
