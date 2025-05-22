
/**
 * Entity query service
 * 
 * This file re-exports functionality from more focused modules for backward compatibility.
 */

import { getAllEntities } from './entities';
import { getScanResultsByEntity } from './scanResults';
import { getEntityStatistics } from './statistics';

// Re-export functions for backward compatibility
export {
  getAllEntities,
  getScanResultsByEntity,
  getEntityStatistics
};
