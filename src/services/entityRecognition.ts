
/**
 * Entity Recognition Utility Functions
 * 
 * This service provides functions to extract and manage entities from content.
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'location' | 'unknown';
  confidence: number;
  mentions: number;
}

// Type guard to check if an object is a scan result with specific properties
function hasScanProperty(obj: any, property: string): boolean {
  return obj && typeof obj === 'object' && property in obj;
}

/**
 * Extract entities from text content using regex and heuristics
 * 
 * In a production environment, this would be enhanced with NLP or API calls
 */
export const extractEntitiesFromText = (text: string): Entity[] => {
  if (!text) return [];
  
  const entities: Map<string, Entity> = new Map();
  
  // Extract mentions (@username)
  const mentionRegex = /@[\w\d_]{2,}/g;
  const mentions = text.match(mentionRegex) || [];
  
  mentions.forEach(mention => {
    entities.set(mention, {
      name: mention,
      type: 'handle',
      confidence: 0.9,
      mentions: 1
    });
  });
  
  // Extract person names (capitalized words in sequence)
  const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const names = text.match(nameRegex) || [];
  
  names.forEach(name => {
    // Skip if name contains common words that might be false positives
    const commonWords = ['The', 'This', 'That', 'These', 'Those', 'Their', 'Your', 'Our'];
    if (commonWords.some(word => name.includes(word))) return;
    
    if (entities.has(name)) {
      const entity = entities.get(name)!;
      entities.set(name, { ...entity, mentions: entity.mentions + 1 });
    } else {
      entities.set(name, {
        name,
        type: 'person',
        confidence: 0.7,
        mentions: 1
      });
    }
  });
  
  // Extract organization names (simplistic approach)
  const orgIndicators = [
    'Inc', 'LLC', 'Ltd', 'Limited', 'Corp', 'Corporation', 
    'Company', 'Co', 'Group', 'Foundation', 'Association'
  ];
  
  orgIndicators.forEach(indicator => {
    const orgRegex = new RegExp(`\\b[A-Z][\\w\\s]*\\s+${indicator}\\b`, 'g');
    const orgs = text.match(orgRegex) || [];
    
    orgs.forEach(org => {
      if (entities.has(org)) {
        const entity = entities.get(org)!;
        entities.set(org, { ...entity, type: 'organization', mentions: entity.mentions + 1 });
      } else {
        entities.set(org, {
          name: org,
          type: 'organization',
          confidence: 0.8,
          mentions: 1
        });
      }
    });
  });
  
  return Array.from(entities.values());
};

// Helper function to check if a column exists in a table
const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    // Use direct fetch to edge function instead of RPC
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/column_exists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        table_name: tableName,
        column_name: columnName
      })
    });
    
    if (!response.ok) {
      console.error(`Error checking if column ${columnName} exists in ${tableName}: HTTP ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    return !!data?.exists;
  } catch (error) {
    console.error(`Error in checkColumnExists for ${columnName}:`, error);
    return false;
  }
};

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
    
    data.forEach(result => {
      // Skip if not a valid object
      if (!result || typeof result !== 'object') return;
      
      // Safely process detected_entities if it exists and is an array
      if (hasDetectedEntities && hasScanProperty(result, 'detected_entities')) {
        const detectedEntities = result.detected_entities;
        if (Array.isArray(detectedEntities)) {
          detectedEntities.forEach((name: string) => {
            if (entityMap.has(name)) {
              const entity = entityMap.get(name)!;
              entityMap.set(name, { ...entity, mentions: entity.mentions + 1 });
            } else {
              // Determine entity type based on available data
              let type: Entity['type'] = 'unknown';
              
              if (hasRiskEntityName && hasRiskEntityType && 
                  hasScanProperty(result, 'risk_entity_name') &&
                  hasScanProperty(result, 'risk_entity_type') &&
                  result.risk_entity_name === name) {
                const riskType = result.risk_entity_type;
                if (typeof riskType === 'string' && 
                    ['person', 'organization', 'handle', 'location'].includes(riskType)) {
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
        const riskEntityName = result.risk_entity_name;
        if (riskEntityName && typeof riskEntityName === 'string' && 
            !entityMap.has(riskEntityName)) {
          
          let type: Entity['type'] = 'unknown';
          
          if (hasRiskEntityType && hasScanProperty(result, 'risk_entity_type')) {
            const riskEntityType = result.risk_entity_type;
            if (riskEntityType && typeof riskEntityType === 'string' && 
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
    return Array.from(entityMap.values()).sort((a, b) => b.mentions - a.mentions);
  } catch (error) {
    console.error('Error getting all entities:', error);
    return [];
  }
};

// Simple interface for scan results to avoid recursive type issues
interface ScanResultWithEntities {
  id: string;
  detected_entities?: string[];
  risk_entity_name?: string;
  risk_entity_type?: string;
  content: string;
}

/**
 * Process all unprocessed scan results
 */
export const batchProcessEntities = async (): Promise<number> => {
  try {
    // Check if required columns exist
    const hasDetectedEntities = await checkColumnExists('scan_results', 'detected_entities');
    const hasIsIdentified = await checkColumnExists('scan_results', 'is_identified');
    
    if (!hasDetectedEntities || !hasIsIdentified) {
      toast.error("Required database columns for entity recognition are missing");
      return 0;
    }
    
    // Get scan results that haven't been processed
    const { data: scanResults, error } = await supabase
      .from('scan_results')
      .select('id, content')
      .is('is_identified', null)
      .limit(100);
    
    if (error) {
      console.error('Error fetching unprocessed scan results:', error);
      return 0;
    }
    
    if (!scanResults || scanResults.length === 0) {
      return 0;
    }
    
    let processedCount = 0;
    
    // Process each scan result
    for (const result of scanResults) {
      // Type guard to ensure result has expected properties
      if (result && typeof result === 'object' && 'id' in result && 'content' in result) {
        const entities = await processEntities(result.id, result.content);
        if (entities.length > 0) {
          processedCount++;
        }
      }
    }
    
    if (processedCount > 0) {
      toast.success(`Processed entities from ${processedCount} scan results`);
    }
    
    return processedCount;
  } catch (error) {
    console.error('Error in batch processing entities:', error);
    return 0;
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
export const getEntityStatistics = async (): Promise<{
  totalEntities: number;
  personEntities: number;
  orgEntities: number;
  handleEntities: number;
  mostMentioned: Entity | null;
}> => {
  try {
    const entities = await getAllEntities();
    
    const personEntities = entities.filter(e => e.type === 'person').length;
    const orgEntities = entities.filter(e => e.type === 'organization').length;
    const handleEntities = entities.filter(e => e.type === 'handle').length;
    
    // Sort by mentions to find most mentioned
    const sortedEntities = [...entities].sort((a, b) => b.mentions - a.mentions);
    
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
