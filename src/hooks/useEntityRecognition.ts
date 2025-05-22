
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

      setEntities(data.entities || []);
      return data.entities || [];
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
      const { data, error } = await supabase
        .from('scan_results')
        .select('detected_entities')
        .not('detected_entities', 'is', null);

      if (error) {
        console.error("Error fetching entities:", error);
        return [];
      }

      // Combine all entities and count occurrences
      const entityCounts = new Map<string, number>();
      const entityTypes = new Map<string, string>();

      data.forEach(result => {
        if (Array.isArray(result.detected_entities)) {
          result.detected_entities.forEach((entity: string) => {
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
      });

      const formattedEntities: Entity[] = Array.from(entityCounts.entries()).map(([name, mentions]) => ({
        name,
        type: entityTypes.get(name) as any || 'unknown',
        confidence: 0.7,
        mentions
      }));

      return formattedEntities.sort((a, b) => (b.mentions || 0) - (a.mentions || 0));
    } catch (error) {
      console.error("Error in getAllEntities:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
