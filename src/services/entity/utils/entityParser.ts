
import { ScanEntity } from '../types/scanTypes';

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
