
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity } from '@/types/entity';
import { checkColumnExists } from '@/utils/databaseUtils';
import { extractEntitiesFromText } from './extractionUtils';
import { parseDetectedEntities } from '@/utils/parseDetectedEntities';

/**
 * Process and store entities from a scan result
 */
export const processEntities = async (scanResultId: string, content: string): Promise<Entity[]> => {
  try {
    const entities = extractEntitiesFromText(content);
    
    // Check if required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasRiskEntityName = await checkColumnExists('scan_results', 'risk_entity_name');
    const hasRiskEntityType = await checkColumnExists('scan_results', 'risk_entity_type');
    const hasIsIdentified = await checkColumnExists('scan_results', 'is_identified');
    
    // Only update the database if entities were found and required columns exist
    if (entities.length > 0) {
      try {
        // Prepare update payload
        const updatePayload: Record<string, any> = {};
        
        // Only add columns that exist
        if (hasIsIdentified) {
          updatePayload.is_identified = true;
        }
        
        if (hasDetectedEntities) {
          // Store only the entity names in the database
          updatePayload.detected_entities = entities.map(e => e.name);
          
          // Add risk entity fields if they exist
          if (hasRiskEntityName && hasRiskEntityType) {
            const personEntity = entities.find(e => e.type === 'person');
            if (personEntity) {
              updatePayload.risk_entity_name = personEntity.name;
              updatePayload.risk_entity_type = 'person';
            } else {
              const orgEntity = entities.find(e => e.type === 'organization');
              if (orgEntity) {
                updatePayload.risk_entity_name = orgEntity.name;
                updatePayload.risk_entity_type = 'organization';
              } else if (hasRiskEntityType) {
                updatePayload.risk_entity_type = 'unknown';
              }
            }
          }
        }
        
        // Only update if there are fields to update
        if (Object.keys(updatePayload).length > 0) {
          const { error: updateError } = await supabase
            .from('scan_results')
            .update(updatePayload)
            .eq('id', scanResultId);
          
          if (updateError) {
            console.error('Error storing entities:', updateError);
          }
        }
      } catch (updateError) {
        console.error('Error updating scan results:', updateError);
      }
    }
    
    return entities;
  } catch (error) {
    console.error('Error processing entities:', error);
    return [];
  }
};
