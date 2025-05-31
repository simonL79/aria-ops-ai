
import { useState } from 'react';
import { analyzeWithLocalInference, analyzeWithMemoryContext, searchEntityMemories } from '@/services/localInference/threatAnalyzer';
import type { LocalThreatAnalysis, MemorySearchResult } from '@/services/localInference/threatAnalyzer';

export const useLocalInference = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const analyzeThreat = async (
    content: string,
    platform: string,
    entityName: string,
    useMemoryContext: boolean = true
  ): Promise<LocalThreatAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      let result;
      
      if (useMemoryContext) {
        result = await analyzeWithMemoryContext(content, platform, entityName);
      } else {
        result = await analyzeWithLocalInference(content, platform, entityName, 'classify');
      }
      
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const summarizeContent = async (
    content: string,
    entityName: string
  ): Promise<LocalThreatAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      return await analyzeWithLocalInference(content, 'summary', entityName, 'summarize');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const searchMemories = async (
    query: string,
    entityName: string,
    searchType?: string
  ): Promise<MemorySearchResult[]> => {
    setIsSearching(true);
    
    try {
      return await searchEntityMemories(query, entityName, searchType);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    analyzeThreat,
    summarizeContent,
    searchMemories,
    isAnalyzing,
    isSearching
  };
};
