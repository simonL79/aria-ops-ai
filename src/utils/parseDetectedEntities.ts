
import { ScanEntity } from '@/services/entityExtraction/openaiEntityExtraction';

/**
 * Parse detected entities from various formats
 */
export const parseDetectedEntities = (entities: any): ScanEntity[] => {
  if (!entities) return [];
  
  try {
    // Handle case where entities is already an array of objects
    if (Array.isArray(entities) && entities.length > 0 && typeof entities[0] === 'object') {
      return entities.map(entity => ({
        name: entity.name || String(entity),
        type: entity.type || 'PERSON'
      }));
    }
    
    // Handle case where entities is an array of strings
    if (Array.isArray(entities) && entities.length > 0 && typeof entities[0] === 'string') {
      return entities.map(entity => ({
        name: entity,
        type: 'PERSON'
      }));
    }
    
    // Handle case where entities is a JSON string
    if (typeof entities === 'string') {
      try {
        const parsed = JSON.parse(entities);
        if (Array.isArray(parsed)) {
          return parsed.map(entity => {
            if (typeof entity === 'string') {
              return { name: entity, type: 'PERSON' };
            }
            return {
              name: entity.name || String(entity),
              type: entity.type || 'PERSON'
            };
          });
        }
      } catch (e) {
        // If not valid JSON, treat as single entity
        return [{ name: entities, type: 'PERSON' }];
      }
    }
    
    // Handle case where entities is an object
    if (typeof entities === 'object' && !Array.isArray(entities)) {
      return Object.values(entities).map(entity => {
        if (typeof entity === 'string') {
          return { name: entity, type: 'PERSON' };
        }
        if (typeof entity === 'object' && entity !== null) {
          return {
            name: (entity as any).name || String(entity),
            type: (entity as any).type || 'PERSON'
          };
        }
        return { name: String(entity), type: 'PERSON' };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing detected entities:', error);
    return [];
  }
};
