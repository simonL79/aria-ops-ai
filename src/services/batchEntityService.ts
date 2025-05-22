
import { Entity } from '@/types/entity';
import { toast } from 'sonner';
import { processScanResult } from './entityRecognitionService';

/**
 * Process multiple scan results
 */
export async function batchProcessScanResults(
  scanResultIds: string[],
  mode: 'simple' | 'advanced' = 'simple',
  onProgress?: (completed: number, total: number) => void
): Promise<Record<string, Entity[]>> {
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
  }
}
