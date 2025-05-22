
/**
 * Entity Recognition Types
 */

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'location' | 'unknown';
  confidence: number;
  mentions?: number;
}

export interface EntityStatistics {
  totalEntities: number;
  personEntities: number;
  orgEntities: number;
  handleEntities: number;
  mostMentioned: Entity | null;
}

// Type guard to check if object has required entity properties
export function isEntityArray(data: any): data is Entity[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' &&
    'name' in item &&
    'type' in item &&
    'confidence' in item
  );
}
