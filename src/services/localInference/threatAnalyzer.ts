
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LocalThreatAnalysis {
  threatLevel: number;
  category: string;
  explanation: string;
  confidence: number;
  provider: 'local_ollama' | 'openai_fallback';
  analysisTime: number;
}

export interface MemorySearchResult {
  content: string;
  similarity: number;
  metadata: {
    entityName: string;
    timestamp: string;
    source: string;
  };
}

/**
 * Analyze threats using local Ollama inference
 */
export const analyzeWithLocalInference = async (
  content: string,
  platform: string,
  entityName: string,
  analysisType: 'classify' | 'summarize' | 'legal-analysis' = 'classify'
): Promise<LocalThreatAnalysis | null> => {
  try {
    const startTime = Date.now();
    
    console.log(`Starting local threat analysis for ${entityName}`);
    
    const { data, error } = await supabase.functions.invoke('local-threat-analysis', {
      body: {
        content,
        platform,
        entityName,
        analysisType
      }
    });

    if (error) {
      console.error('Local inference error:', error);
      toast.error('Local analysis failed, consider fallback to OpenAI');
      return null;
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Local analysis failed');
    }

    const analysisTime = Date.now() - startTime;
    
    // Parse the result from local inference
    const result = data.result;
    
    console.log(`Local analysis completed in ${analysisTime}ms`);
    
    return {
      threatLevel: result.threatLevel || result.severity || 5,
      category: result.category || 'unknown',
      explanation: result.explanation || result.summary || 'Local analysis completed',
      confidence: result.confidence || 0.85,
      provider: 'local_ollama',
      analysisTime
    };

  } catch (error) {
    console.error('Local threat analysis error:', error);
    toast.error('Local analysis failed');
    return null;
  }
};

/**
 * Search entity memories using Qdrant vector search
 */
export const searchEntityMemories = async (
  query: string,
  entityName: string,
  searchType: string = 'threat_patterns',
  limit: number = 5
): Promise<MemorySearchResult[]> => {
  try {
    console.log(`Searching memories for entity: ${entityName}, query: ${query}`);
    
    const { data, error } = await supabase.functions.invoke('local-memory-search', {
      body: {
        query,
        entityName,
        searchType,
        limit
      }
    });

    if (error) {
      console.error('Memory search error:', error);
      return [];
    }

    if (!data?.success) {
      console.warn('Memory search returned no results');
      return [];
    }

    console.log(`Found ${data.resultsCount} relevant memories`);
    
    return data.results || [];

  } catch (error) {
    console.error('Memory search error:', error);
    return [];
  }
};

/**
 * Enhanced threat analysis with memory context
 */
export const analyzeWithMemoryContext = async (
  content: string,
  platform: string,
  entityName: string
): Promise<LocalThreatAnalysis | null> => {
  try {
    // First search for relevant memories
    const memories = await searchEntityMemories(content, entityName, 'threat_patterns', 3);
    
    // Enhance content with memory context
    let enhancedContent = content;
    if (memories.length > 0) {
      const memoryContext = memories.map(m => `Previous context: ${m.content}`).join('\n');
      enhancedContent = `${content}\n\nRelevant historical context:\n${memoryContext}`;
    }
    
    // Perform analysis with enhanced context
    const analysis = await analyzeWithLocalInference(
      enhancedContent,
      platform,
      entityName,
      'classify'
    );
    
    if (analysis) {
      // Store this analysis as a new memory
      await supabase.from('anubis_entity_memory').insert({
        entity_name: entityName,
        memory_type: 'threat_analysis',
        memory_summary: `Threat level ${analysis.threatLevel}: ${analysis.category}`,
        context_reference: platform,
        key_findings: {
          threatLevel: analysis.threatLevel,
          category: analysis.category,
          confidence: analysis.confidence,
          memoriesUsed: memories.length
        }
      });
    }
    
    return analysis;

  } catch (error) {
    console.error('Enhanced analysis error:', error);
    return null;
  }
};
