
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

// Explicitly import and re-export the Entity and EntityStatistics types
// Use 'export type' for types when isolatedModules is enabled
import type { Entity, EntityStatistics } from '@/types/entity';
export type { Entity, EntityStatistics };
