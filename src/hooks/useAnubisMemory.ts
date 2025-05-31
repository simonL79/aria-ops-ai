
import { useState } from 'react';
import { 
  storeEntityMemory, 
  recallEntityMemories, 
  analyzeThreatPatterns,
  mapEntityRelationships,
  getEntityContext,
  EntityMemory,
  ThreatPattern,
  EntityRelationship
} from '@/services/localInference/memoryManager';
import { toast } from 'sonner';

export const useAnubisMemory = () => {
  const [isStoring, setIsStoring] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const storeMemory = async (memory: EntityMemory): Promise<boolean> => {
    setIsStoring(true);
    try {
      const success = await storeEntityMemory(memory);
      if (success) {
        toast.success('Memory stored successfully');
      }
      return success;
    } finally {
      setIsStoring(false);
    }
  };

  const recallMemories = async (
    entityName: string,
    query: string,
    limit?: number
  ): Promise<EntityMemory[]> => {
    setIsRecalling(true);
    try {
      return await recallEntityMemories(entityName, query, limit);
    } finally {
      setIsRecalling(false);
    }
  };

  const analyzePatterns = async (
    entityName: string,
    content: string,
    platform: string
  ): Promise<ThreatPattern | null> => {
    setIsAnalyzing(true);
    try {
      const pattern = await analyzeThreatPatterns(entityName, content, platform);
      if (pattern) {
        toast.success(`Threat pattern identified: ${pattern.threatType}`);
      }
      return pattern;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mapRelationships = async (
    entities: string[],
    context: string
  ): Promise<EntityRelationship[]> => {
    setIsAnalyzing(true);
    try {
      const relationships = await mapEntityRelationships(entities, context);
      if (relationships.length > 0) {
        toast.success(`Mapped ${relationships.length} entity relationships`);
      }
      return relationships;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFullContext = async (entityName: string) => {
    setIsRecalling(true);
    try {
      const context = await getEntityContext(entityName);
      toast.success(`Retrieved comprehensive context for ${entityName}`);
      return context;
    } finally {
      setIsRecalling(false);
    }
  };

  return {
    storeMemory,
    recallMemories,
    analyzePatterns,
    mapRelationships,
    getFullContext,
    isStoring,
    isRecalling,
    isAnalyzing
  };
};
