
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity } from '@/types/entity';
import { hasScanProperty } from '@/utils/databaseUtils';

// Define type for scan result rows from Supabase
type ScanRow = {
  detected_entities?: any; // Changed from any[] to any to handle Json type
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  [key: string]: any;
};

// Type guard for ScanRow
function isScanRow(obj: any): obj is ScanRow {
  return obj && typeof obj === 'object';
}

/**
 * Process entity data from scan results
 */
function processEntityData(data: ScanRow[] | null): Map<string, Entity> {
  const entityMap = new Map<string, Entity>();
  
  if (!data || data.length === 0) {
    return entityMap;
  }
  
  data.forEach((result) => {
    // Skip if not a valid object
    if (!isScanRow(result)) return;
    
    // Process detected_entities array if it exists and is an array
    if (hasScanProperty(result, 'detected_entities')) {
      const detectedEntities = result.detected_entities;
      
      // Handle different formats of detected_entities
      let entitiesArray: any[] = [];
      
      if (Array.isArray(detectedEntities)) {
        entitiesArray = detectedEntities;
      } else if (detectedEntities && typeof detectedEntities === 'object' && !Array.isArray(detectedEntities)) {
        // If it's an object, try to extract entities from it
        entitiesArray = Object.values(detectedEntities).filter(item => 
          typeof item === 'string' || (typeof item === 'object' && item?.name)
        );
      }
      
      entitiesArray.forEach((entity: any) => {
        let entityName: string;
        let entityType: Entity['type'] = 'unknown';
        
        // Handle different entity formats
        if (typeof entity === 'string') {
          entityName = entity;
        } else if (typeof entity === 'object' && entity?.name) {
          entityName = entity.name;
          if (entity.type) {
            const type = entity.type.toLowerCase();
            if (['person', 'organization', 'handle', 'location'].includes(type)) {
              entityType = type as Entity['type'];
            } else if (type === 'org') {
              entityType = 'organization';
            }
          }
        } else {
          return; // Skip invalid entity format
        }
        
        if (entityMap.has(entityName)) {
          const existingEntity = entityMap.get(entityName)!;
          entityMap.set(entityName, { ...existingEntity, mentions: (existingEntity.mentions || 0) + 1 });
        } else {
          // Determine entity type based on available data if not already set
          if (entityType === 'unknown') {
            if (hasScanProperty(result, 'risk_entity_name') &&
                hasScanProperty(result, 'risk_entity_type') &&
                result.risk_entity_name === entityName &&
                typeof result.risk_entity_name === 'string' &&
                typeof result.risk_entity_type === 'string') {
                
              const riskType = result.risk_entity_type as string;
              if (['person', 'organization', 'handle', 'location'].includes(riskType)) {
                entityType = riskType as Entity['type'];
              }
            } else if (entityName.startsWith('@')) {
              entityType = 'handle';
            }
          }
          
          entityMap.set(entityName, {
            name: entityName,
            type: entityType,
            confidence: 0.7,
            mentions: 1
          });
        }
      });
    }
    
    // Process risk_entity_name if it exists
    if (hasScanProperty(result, 'risk_entity_name')) {
      const riskEntityName = result.risk_entity_name as string | null;
      
      if (typeof riskEntityName === 'string' && riskEntityName && !entityMap.has(riskEntityName)) {
        let type: Entity['type'] = 'unknown';
        
        if (hasScanProperty(result, 'risk_entity_type')) {
          const riskEntityType = result.risk_entity_type as string | null;
          
          if (typeof riskEntityType === 'string' && 
              ['person', 'organization', 'handle', 'location'].includes(riskEntityType)) {
            type = riskEntityType as Entity['type'];
          }
        }
        
        entityMap.set(riskEntityName, {
          name: riskEntityName,
          type,
          confidence: 0.85,
          mentions: 1
        });
      }
    }
  });
  
  return entityMap;
}

/**
 * Get all unique entities from scan results
 */
export const getAllEntities = async (): Promise<Entity[]> => {
  try {
    // Query scan results with entity data
    const { data, error } = await supabase
      .from('scan_results')
      .select('detected_entities, risk_entity_name, risk_entity_type');
    
    if (error) {
      console.error('Error fetching entities:', error);
      return [];
    }
    
    const entityMap = processEntityData(data);
    
    // Convert Map to Array and sort by mentions count
    return Array.from(entityMap.values()).sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
  } catch (error) {
    console.error('Error getting all entities:', error);
    return [];
  }
};
