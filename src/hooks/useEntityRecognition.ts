
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Entity } from '@/types/entity';
import { 
  processText, 
  processScanResult, 
  getAllEntities 
} from '@/services/entityRecognitionService';
import { batchProcessScanResults } from '@/services/batchEntityService';

export const useEntityRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);

  // Process text wrapper
  const processTextHandler = useCallback(async (
    text: string, 
    mode: 'simple' | 'advanced' = 'simple'
  ) => {
    setLoading(true);
    try {
      const resultEntities = await processText(text, mode);
      setEntities(resultEntities);
      return resultEntities;
    } finally {
      setLoading(false);
    }
  }, []);

  // Process scan result wrapper
  const processScanResultHandler = useCallback(async (
    scanResultId: string, 
    mode: 'simple' | 'advanced' = 'simple'
  ) => {
    setLoading(true);
    try {
      const resultEntities = await processScanResult(scanResultId, mode);
      setEntities(resultEntities);
      return resultEntities;
    } finally {
      setLoading(false);
    }
  }, []);

  // Batch process wrapper
  const batchProcessScanResultsHandler = useCallback(async (
    scanResultIds: string[],
    mode: 'simple' | 'advanced' = 'simple',
    onProgress?: (completed: number, total: number) => void
  ) => {
    setLoading(true);
    try {
      return await batchProcessScanResults(scanResultIds, mode, onProgress);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all entities wrapper
  const getAllEntitiesHandler = useCallback(async () => {
    setLoading(true);
    try {
      const allEntities = await getAllEntities();
      setEntities(allEntities);
      return allEntities;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    entities,
    processText: processTextHandler,
    processScanResult: processScanResultHandler,
    batchProcessScanResults: batchProcessScanResultsHandler,
    getAllEntities: getAllEntitiesHandler
  };
};

export default useEntityRecognition;
