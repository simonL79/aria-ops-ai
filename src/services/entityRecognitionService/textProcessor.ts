
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Entity, isEntityArray } from '@/types/entity';

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
