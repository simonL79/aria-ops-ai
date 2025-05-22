
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity } from '@/types/entity';
import { checkColumnExists, hasScanProperty } from '@/utils/databaseUtils';

/**
 * Get all entities from database
 */
export async function getAllEntities(): Promise<Entity[]> {
  try {
    // Check if the required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasRiskEntityName = await checkColumnExists('scan_results', 'risk_entity_name');
    const hasRiskEntityType = await checkColumnExists('scan_results', 'risk_entity_type');
    
    if (!hasDetectedEntities && !hasRiskEntityName) {
      console.warn("Required entity columns don't exist in the database");
      toast.error("Entity recognition features require database setup");
      return [];
    }
    
    // Build the select statement based on what columns exist
    let selectStatement = '*';
    if (hasDetectedEntities && hasRiskEntityName && hasRiskEntityType) {
      selectStatement = 'detected_entities, risk_entity_name, risk_entity_type';
    } else if (hasDetectedEntities) {
      selectStatement = 'detected_entities';
    } else if (hasRiskEntityName) {
      selectStatement = 'risk_entity_name, risk_entity_type';
    }
    
    // Query with the appropriate select statement
    const { data, error } = await supabase
      .from('scan_results')
      .select(selectStatement);

    if (error) {
      console.error("Error fetching entities:", error);
      return [];
    }

    // Handle null/undefined data safely
    if (!data || data.length === 0) {
      return [];
    }

    // Combine all entities and count occurrences
    const entityCounts = new Map<string, number>();
    const entityTypes = new Map<string, string>();

    // Function to safely process detected_entities
    const processDetectedEntities = (result: any): void => {
      if (!result || !hasScanProperty(result, 'detected_entities')) return;
      
      const detectedEntities = result.detected_entities;
      if (!Array.isArray(detectedEntities)) return;
      
      detectedEntities.forEach((entity: string) => {
        entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
        
        // Try to guess entity type based on patterns
        if (!entityTypes.has(entity)) {
          if (entity.startsWith('@')) {
            entityTypes.set(entity, 'handle');
          } else if (/Inc|Ltd|LLC|Corp|Company/.test(entity)) {
            entityTypes.set(entity, 'organization');
          } else if (/\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(entity)) {
            entityTypes.set(entity, 'person');
          } else {
            entityTypes.set(entity, 'unknown');
          }
        }
      });
    };

    // Function to safely process risk_entity_name and risk_entity_type
    const processRiskEntity = (result: any): void => {
      if (!result || !hasScanProperty(result, 'risk_entity_name')) return;
      
      const riskEntityName = result.risk_entity_name;
      if (!riskEntityName || typeof riskEntityName !== 'string') return;
      
      entityCounts.set(riskEntityName, (entityCounts.get(riskEntityName) || 0) + 1);
      
      // Use risk_entity_type if available, otherwise default to unknown
      let entityType = 'unknown';
      
      if (hasScanProperty(result, 'risk_entity_type')) {
        const riskEntityType = result.risk_entity_type;
        
        if (typeof riskEntityType === 'string' && riskEntityType) {
          const validTypes = ['person', 'organization', 'handle', 'location'];
          entityType = validTypes.includes(riskEntityType) ? riskEntityType : 'unknown';
        }
      }
      
      entityTypes.set(riskEntityName, entityType);
    };

    // Process each scan result
    data.forEach(result => {
      // Process detected_entities if it exists
      if (hasDetectedEntities) {
        processDetectedEntities(result);
      }
      
      // Process risk_entity_name if it exists
      if (hasRiskEntityName) {
        processRiskEntity(result);
      }
    });

    const formattedEntities: Entity[] = Array.from(entityCounts.entries())
      .map(([name, mentions]) => {
        let type: Entity['type'] = 'unknown';
        const typeName = entityTypes.get(name);
        
        if (typeName === 'person' || 
            typeName === 'organization' || 
            typeName === 'handle' || 
            typeName === 'location') {
          type = typeName as Entity['type'];
        }
        
        return {
          name,
          type,
          confidence: 0.7,
          mentions
        };
      });

    return formattedEntities.sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
  } catch (error) {
    console.error("Error in getAllEntities:", error);
    return [];
  }
}
