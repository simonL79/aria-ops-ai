
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

// Re-export the Entity type from types/entity for backwards compatibility
// Use 'export type' for types when isolatedModules is enabled
export type { Entity, EntityStatistics } from '@/types/entity';
