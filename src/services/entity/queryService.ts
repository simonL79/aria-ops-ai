
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity, EntityStatistics } from '@/types/entity';
import { checkColumnExists, hasScanProperty } from '@/utils/databaseUtils';

// Define type for scan result rows
type ScanRow = {
  detected_entities?: any[];
  risk_entity_name?: string | null;
  risk_entity_type?: string | null;
  [key: string]: any;
};

// Type guard for ScanRow
function isScanRow(obj: any): obj is ScanRow {
  return obj && typeof obj === 'object';
}

/**
 * Get all unique entities from scan results
 */
export const getAllEntities = async (): Promise<Entity[]> => {
  try {
    // Check if required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasRiskEntityName = await checkColumnExists('scan_results', 'risk_entity_name');
    const hasRiskEntityType = await checkColumnExists('scan_results', 'risk_entity_type');
    
    if (!hasDetectedEntities && !hasRiskEntityName) {
      toast.error("Required database columns for entity recognition are missing");
      return [];
    }
    
    // Build query based on available columns
    let selectStatement = '*';
    if (hasDetectedEntities && hasRiskEntityName && hasRiskEntityType) {
      selectStatement = 'detected_entities, risk_entity_name, risk_entity_type';
    } else if (hasDetectedEntities) {
      selectStatement = 'detected_entities';
    } else if (hasRiskEntityName) {
      selectStatement = 'risk_entity_name, risk_entity_type';
    }
    
    // If columns are accessible, proceed with the query
    const { data, error } = await supabase
      .from('scan_results')
      .select(selectStatement);
    
    if (error) {
      console.error('Error fetching entities:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const entityMap = new Map<string, Entity>();
    
    data.forEach((result: any) => {
      // Skip if not a valid object
      if (!isScanRow(result)) return;
      
      // Safely process detected_entities if it exists and is an array
      if (hasDetectedEntities && hasScanProperty(result, 'detected_entities')) {
        const detectedEntities = result.detected_entities;
        if (Array.isArray(detectedEntities)) {
          detectedEntities.forEach((name: string) => {
            if (entityMap.has(name)) {
              const entity = entityMap.get(name)!;
              entityMap.set(name, { ...entity, mentions: (entity.mentions || 0) + 1 });
            } else {
              // Determine entity type based on available data
              let type: Entity['type'] = 'unknown';
              
              if (hasRiskEntityName && hasRiskEntityType && 
                  hasScanProperty(result, 'risk_entity_name') &&
                  hasScanProperty(result, 'risk_entity_type') &&
                  result.risk_entity_name === name &&
                  typeof result.risk_entity_name === 'string' &&
                  typeof result.risk_entity_type === 'string') {
                  
                const riskType = result.risk_entity_type as string;
                if (['person', 'organization', 'handle', 'location'].includes(riskType)) {
                  type = riskType as Entity['type'];
                }
              } else if (name.startsWith('@')) {
                type = 'handle';
              }
              
              entityMap.set(name, {
                name,
                type,
                confidence: 0.7,
                mentions: 1
              });
            }
          });
        }
      }
      
      // Safely process risk_entity_name if it exists and is not already included
      if (hasRiskEntityName && hasScanProperty(result, 'risk_entity_name')) {
        const riskEntityName = result.risk_entity_name as string | null;
        
        if (typeof riskEntityName === 'string' && riskEntityName && !entityMap.has(riskEntityName)) {
          let type: Entity['type'] = 'unknown';
          
          if (hasRiskEntityType && hasScanProperty(result, 'risk_entity_type')) {
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
    
    // Convert Map to Array and sort by mentions count
    return Array.from(entityMap.values()).sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
  } catch (error) {
    console.error('Error getting all entities:', error);
    return [];
  }
};

/**
 * Get scan results by entity name
 */
export const getScanResultsByEntity = async (entityName: string): Promise<any[]> => {
  try {
    // Check if required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasRiskEntityName = await checkColumnExists('scan_results', 'risk_entity_name');
    
    if (!hasDetectedEntities && !hasRiskEntityName) {
      toast.error("Required database columns for entity recognition are missing");
      return [];
    }
    
    // Try different approaches based on available columns
    let results: any[] = [];
    
    // First try with the risk_entity_name field if it exists
    if (hasRiskEntityName) {
      const { data: nameData, error: nameError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('risk_entity_name', entityName);
      
      if (!nameError && nameData && nameData.length > 0) {
        return nameData;
      }
    }
    
    // Try using the detected_entities array if it exists
    if (hasDetectedEntities) {
      const { data: arrayData, error: arrayError } = await supabase
        .from('scan_results')
        .select('*')
        .contains('detected_entities', [entityName]);
      
      if (!arrayError && arrayData) {
        results = arrayData;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in getScanResultsByEntity:', error);
    return [];
  }
};

/**
 * Get entity statistics
 */
export const getEntityStatistics = async (): Promise<EntityStatistics> => {
  try {
    const entities = await getAllEntities();
    
    const personEntities = entities.filter(e => e.type === 'person').length;
    const orgEntities = entities.filter(e => e.type === 'organization').length;
    const handleEntities = entities.filter(e => e.type === 'handle').length;
    
    // Sort by mentions to find most mentioned
    const sortedEntities = [...entities].sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
    
    return {
      totalEntities: entities.length,
      personEntities,
      orgEntities,
      handleEntities,
      mostMentioned: sortedEntities.length > 0 ? sortedEntities[0] : null
    };
  } catch (error) {
    console.error('Error getting entity statistics:', error);
    return {
      totalEntities: 0,
      personEntities: 0,
      orgEntities: 0,
      handleEntities: 0,
      mostMentioned: null
    };
  }
};
