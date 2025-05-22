
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { processEntities } from './processUtils';

/**
 * Process all unprocessed scan results
 */
export const batchProcessEntities = async (): Promise<number> => {
  try {
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
