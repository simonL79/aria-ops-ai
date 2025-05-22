
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity, isEntityArray } from '@/types/entity';
import { checkColumnExists, hasScanProperty } from '@/utils/databaseUtils';

/**
 * Process text through the edge function to extract entities
 */
export async function processText(
  text: string, 
  mode: 'simple' | 'advanced' = 'simple'
): Promise<Entity[]> {
  try {
    const { data, error } = await supabase.functions.invoke('entity-recognition', {
      body: JSON.stringify({
        content: text,
        mode
      })
    });

    if (error) {
      console.error("Error processing text:", error);
      toast.error("Failed to process text for entities");
      return [];
    }

    return data && isEntityArray(data.entities) ? data.entities : [];
  } catch (error) {
    console.error("Error in processText:", error);
    toast.error("An error occurred during entity recognition");
    return [];
  }
}

/**
 * Process a specific scan result
 */
export async function processScanResult(
  scanResultId: string, 
  mode: 'simple' | 'advanced' = 'simple'
): Promise<Entity[]> {
  try {
    const { data, error } = await supabase.functions.invoke('entity-recognition', {
      body: JSON.stringify({
        contentId: scanResultId,
        mode
      })
    });

    if (error) {
      console.error("Error processing scan result:", error);
      toast.error("Failed to process scan result for entities");
      return [];
    }

    return data && isEntityArray(data.entities) ? data.entities : [];
  } catch (error) {
    console.error("Error in processScanResult:", error);
    toast.error("An error occurred during entity recognition");
    return [];
  }
}

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

    data.forEach(result => {
      // Only process if result is an object (not an error)
      if (!result || typeof result !== 'object') return;
      
      // Safely check if detected_entities exists and is an array
      if (hasDetectedEntities && hasScanProperty(result, 'detected_entities')) {
        const detectedEntities = result.detected_entities;
        if (Array.isArray(detectedEntities)) {
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
        }
      }
      
      // Process risk_entity_name if it exists and is not null/undefined
      if (hasRiskEntityName && 
          hasScanProperty(result, 'risk_entity_name') && 
          result.risk_entity_name && 
          typeof result.risk_entity_name === 'string') {
        
        const riskEntityName = result.risk_entity_name;
        entityCounts.set(riskEntityName, (entityCounts.get(riskEntityName) || 0) + 1);
        
        // Use risk_entity_type if available, otherwise default to unknown
        let entityType = 'unknown';
        if (hasRiskEntityType && 
            hasScanProperty(result, 'risk_entity_type') && 
            result.risk_entity_type && 
            typeof result.risk_entity_type === 'string') {
          
          const riskEntityType = result.risk_entity_type;
          const validTypes = ['person', 'organization', 'handle', 'location'];
          entityType = validTypes.includes(riskEntityType) ? riskEntityType : 'unknown';
        }
        
        entityTypes.set(riskEntityName, entityType);
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
