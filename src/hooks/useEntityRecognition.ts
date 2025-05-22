
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'location' | 'unknown';
  confidence: number;
  mentions?: number;
}

export const useEntityRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);

  // Helper to check if a column exists in the scan_results table
  const checkColumnExists = useCallback(async (columnName: string): Promise<boolean> => {
    try {
      // Use the edge function directly instead of rpc
      const { data, error } = await supabase.functions.invoke('column_exists', {
        body: JSON.stringify({
          table_name: 'scan_results',
          column_name: columnName
        })
      });
      
      if (error) {
        console.error(`Error checking if column ${columnName} exists:`, error);
        return false;
      }
      
      return data?.exists || false;
    } catch (error) {
      console.error(`Error in checkColumnExists for ${columnName}:`, error);
      return false;
    }
  }, []);

  // Process text through the edge function
  const processText = useCallback(async (text: string, mode: 'simple' | 'advanced' = 'simple') => {
    setLoading(true);
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

      setEntities(data?.entities || []);
      return data?.entities || [];
    } catch (error) {
      console.error("Error in processText:", error);
      toast.error("An error occurred during entity recognition");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Process a specific scan result
  const processScanResult = useCallback(async (scanResultId: string, mode: 'simple' | 'advanced' = 'simple') => {
    setLoading(true);
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

      setEntities(data.entities || []);
      return data.entities || [];
    } catch (error) {
      console.error("Error in processScanResult:", error);
      toast.error("An error occurred during entity recognition");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Process multiple scan results
  const batchProcessScanResults = useCallback(async (
    scanResultIds: string[],
    mode: 'simple' | 'advanced' = 'simple',
    onProgress?: (completed: number, total: number) => void
  ) => {
    setLoading(true);
    const results: Record<string, Entity[]> = {};
    let completed = 0;

    try {
      for (const id of scanResultIds) {
        const entities = await processScanResult(id, mode);
        results[id] = entities;
        
        completed++;
        if (onProgress) {
          onProgress(completed, scanResultIds.length);
        }
      }

      toast.success(`Processed ${completed} scan results for entities`);
      return results;
    } catch (error) {
      console.error("Error in batchProcessScanResults:", error);
      toast.error("Failed to complete batch processing");
      return results;
    } finally {
      setLoading(false);
    }
  }, [processScanResult]);

  // Get all entities from database
  const getAllEntities = useCallback(async () => {
    setLoading(true);
    try {
      // Check if the required columns exist
      const hasDetectedEntities = await checkColumnExists('detected_entities');
      const hasRiskEntityName = await checkColumnExists('risk_entity_name');
      const hasRiskEntityType = await checkColumnExists('risk_entity_type');
      
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
        // Safe type guard for each property
        if (result) {
          // Safely check if detected_entities exists and is an array
          const detectedEntities = result.detected_entities;
          if (hasDetectedEntities && detectedEntities && Array.isArray(detectedEntities)) {
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
          
          // Process risk_entity_name if it exists and is not null/undefined
          const riskEntityName = result.risk_entity_name;
          if (hasRiskEntityName && riskEntityName && typeof riskEntityName === 'string') {
            entityCounts.set(riskEntityName, (entityCounts.get(riskEntityName) || 0) + 1);
            
            // Use risk_entity_type if available, otherwise default to unknown
            const riskEntityType = result.risk_entity_type;
            if (hasRiskEntityType && riskEntityType && typeof riskEntityType === 'string') {
              const validTypes = ['person', 'organization', 'handle', 'location'];
              const entityType = validTypes.includes(riskEntityType) ? riskEntityType : 'unknown';
              entityTypes.set(riskEntityName, entityType);
            } else {
              entityTypes.set(riskEntityName, 'unknown');
            }
          }
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
    } finally {
      setLoading(false);
    }
  }, [checkColumnExists]);

  return {
    loading,
    entities,
    processText,
    processScanResult,
    batchProcessScanResults,
    getAllEntities
  };
};

export default useEntityRecognition;
