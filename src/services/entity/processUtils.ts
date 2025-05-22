
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity } from '@/types/entity';
import { hasScanProperty } from '@/utils/databaseUtils';
import { extractEntitiesFromText } from './extractionUtils';

/**
 * Process and store entities from a scan result
 */
export const processEntities = async (scanResultId: string, content: string): Promise<Entity[]> => {
  try {
    const entities = extractEntitiesFromText(content);
    
    // Only update the database if entities were found
    if (entities.length > 0) {
      try {
        // Prepare update payload
        const updatePayload: Record<string, any> = {
          is_identified: true,
          detected_entities: entities.map(e => e.name)
        };
        
        // Add risk entity fields if a person or organization was found
        const personEntity = entities.find(e => e.type === 'person');
        if (personEntity) {
          updatePayload.risk_entity_name = personEntity.name;
          updatePayload.risk_entity_type = 'person';
        } else {
          const orgEntity = entities.find(e => e.type === 'organization');
          if (orgEntity) {
            updatePayload.risk_entity_name = orgEntity.name;
            updatePayload.risk_entity_type = 'organization';
          }
        }
        
        const { error: updateError } = await supabase
          .from('scan_results')
          .update(updatePayload)
          .eq('id', scanResultId);
        
        if (updateError) {
          console.error('Error storing entities:', updateError);
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
