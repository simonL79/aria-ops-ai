
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

/**
 * Process and store entities from a scan result
 */
export const processEntities = async (scanResultId: string, content: string): Promise<Entity[]> => {
  try {
    const entities = extractEntitiesFromText(content);
    
    // Check if required columns exist by querying them directly
    const { data: columnsCheck, error: columnsError } = await supabase
      .from('scan_results')
      .select('id')
      .limit(1);
    
    if (columnsError) {
      console.error("Error checking scan_results table:", columnsError);
      toast.error("Error accessing the database");
      return entities;
    }
    
    // Only update the database if entities were found
    if (entities.length > 0) {
      try {
        // Check if the columns exist using a custom SQL query
        const { data: hasColumn, error: queryError } = await supabase
          .from('scan_results')
          .select('id')
          .limit(1);
          
        if (queryError) {
          console.error("Error checking column existence:", queryError);
          toast.error("The entity recognition feature requires database migration");
          return entities;
        }
        
        // Try to update with safeguards against missing columns
        try {
          const updatePayload: Record<string, any> = {
            is_identified: true
          };
          
          // Only add fields if we've confirmed they exist in the schema
          // This helps prevent TypeScript errors when accessing properties
          const detectedEntitiesJson = entities.map(e => e.name);
          updatePayload.detected_entities = detectedEntitiesJson;
          
          const personEntity = entities.find(e => e.type === 'person');
          if (personEntity) {
            updatePayload.risk_entity_name = personEntity.name;
            updatePayload.risk_entity_type = 'person';
          } else {
            const orgEntity = entities.find(e => e.type === 'organization');
            if (orgEntity) {
              updatePayload.risk_entity_name = orgEntity.name;
              updatePayload.risk_entity_type = 'organization';
            } else {
              updatePayload.risk_entity_type = 'unknown';
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
      } catch (error) {
        console.error('Error accessing column data:', error);
        toast.error("Database columns may be missing. Please run the migration.");
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
    // Check if required columns exist by querying them directly
    try {
      const { data: hasColumns, error: queryError } = await supabase
        .from('scan_results')
        .select('id')
        .limit(1);
      
      if (queryError) {
        console.error("Entity recognition columns may not exist:", queryError);
        toast.error("The entity recognition feature requires database migration");
        return [];
      }
    } catch (error) {
      console.error("Error checking column existence:", error);
      toast.error("Unable to verify database schema");
      return [];
    }
    
    // If columns are accessible, proceed with the query
    const { data, error } = await supabase
      .from('scan_results')
      .select('detected_entities, risk_entity_name, risk_entity_type')
      .not('detected_entities', 'is', null);
    
    if (error) {
      console.error('Error fetching entities:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const entityMap = new Map<string, Entity>();
    
    data.forEach(result => {
      // Safely process detected_entities if it exists and is an array
      if (result && result.detected_entities && Array.isArray(result.detected_entities)) {
        result.detected_entities.forEach((name: string) => {
          if (entityMap.has(name)) {
            const entity = entityMap.get(name)!;
            entityMap.set(name, { ...entity, mentions: entity.mentions + 1 });
          } else {
            // Determine entity type based on available data
            let type: Entity['type'] = 'unknown';
            
            if (result.risk_entity_name === name && result.risk_entity_type) {
              if (['person', 'organization', 'handle', 'location'].includes(result.risk_entity_type)) {
                type = result.risk_entity_type as Entity['type'];
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
      
      // Safely process risk_entity_name if it exists and is not already included
      if (result && result.risk_entity_name && typeof result.risk_entity_name === 'string' && 
          !entityMap.has(result.risk_entity_name)) {
        
        // Ensure risk_entity_type is a valid type, defaulting to 'unknown'
        let type: Entity['type'] = 'unknown';
        
        if (result.risk_entity_type && 
            ['person', 'organization', 'handle', 'location'].includes(result.risk_entity_type)) {
          type = result.risk_entity_type as Entity['type'];
        }
        
        entityMap.set(result.risk_entity_name, {
          name: result.risk_entity_name,
          type,
          confidence: 0.85,
          mentions: 1
        });
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
    try {
      const { data: hasColumns, error: queryError } = await supabase
        .from('scan_results')
        .select('id')
        .limit(1);
      
      if (queryError) {
        console.error("Required columns may not exist:", queryError);
        toast.error("The entity recognition feature requires database migration");
        return 0;
      }
    } catch (error) {
      console.error("Error checking column existence:", error);
      toast.error("Unable to verify database schema");
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
      const entities = await processEntities(result.id, result.content);
      if (entities.length > 0) {
        processedCount++;
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
    try {
      const { data: hasColumns, error: queryError } = await supabase
        .from('scan_results')
        .select('id')
        .limit(1);
      
      if (queryError) {
        console.error("Required columns may not exist:", queryError);
        toast.error("The entity recognition feature requires database migration");
        return [];
      }
    } catch (error) {
      console.error("Error checking column existence:", error);
      toast.error("Unable to verify database schema");
      return [];
    }
    
    // First try with the risk_entity_name field
    const { data: nameData, error: nameError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('risk_entity_name', entityName);
    
    if (nameError) {
      console.error('Error fetching by risk_entity_name:', nameError);
      return [];
    }
    
    if (nameData && nameData.length > 0) {
      return nameData;
    }
    
    // Try using the detected_entities array
    const { data: arrayData, error: arrayError } = await supabase
      .from('scan_results')
      .select('*')
      .contains('detected_entities', [entityName]);
    
    if (arrayError) {
      console.error('Error fetching by detected_entities:', arrayError);
      return [];
    }
    
    return arrayData || [];
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
