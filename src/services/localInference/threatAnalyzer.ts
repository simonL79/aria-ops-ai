
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
 * Check if local inference server is available
 */
const checkLocalServer = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/health', {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Analyze threats using local Ollama inference with fallback
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
    
    // Check if local server is available first
    const isServerAvailable = await checkLocalServer();
    if (!isServerAvailable) {
      console.warn('Local inference server not available, returning fallback analysis');
      return {
        threatLevel: 3,
        category: 'general',
        explanation: 'Local inference server unavailable - using fallback analysis',
        confidence: 0.6,
        provider: 'local_ollama',
        analysisTime: Date.now() - startTime
      };
    }

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
      return {
        threatLevel: 2,
        category: 'analysis_error',
        explanation: 'Local analysis encountered an error',
        confidence: 0.5,
        provider: 'local_ollama',
        analysisTime: Date.now() - startTime
      };
    }

    if (!data?.success) {
      console.warn('Local analysis failed:', data?.error);
      return {
        threatLevel: 2,
        category: 'service_unavailable', 
        explanation: data?.error || 'Local analysis service unavailable',
        confidence: 0.5,
        provider: 'local_ollama',
        analysisTime: Date.now() - startTime
      };
    }

    const analysisTime = Date.now() - startTime;
    const result = data.result;
    
    console.log(`Local analysis completed in ${analysisTime}ms`);
    
    return {
      threatLevel: result.threatLevel || result.severity || 3,
      category: result.category || 'general',
      explanation: result.explanation || result.summary || 'Local analysis completed successfully',
      confidence: result.confidence || 0.75,
      provider: 'local_ollama',
      analysisTime
    };

  } catch (error) {
    console.error('Local threat analysis error:', error);
    return {
      threatLevel: 2,
      category: 'error',
      explanation: 'Local threat analysis failed with error',
      confidence: 0.3,
      provider: 'local_ollama',
      analysisTime: 0
    };
  }
};

/**
 * Search entity memories using vector search with fallback
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
 * Enhanced threat analysis with memory context and fallback
 */
export const analyzeWithMemoryContext = async (
  content: string,
  platform: string,
  entityName: string
): Promise<LocalThreatAnalysis | null> => {
  try {
    // First search for relevant memories
    const memories = await searchEntityMemories(content, entityName, 'threat_patterns', 3);
    
    // Enhance content with memory context if available
    let enhancedContent = content;
    if (memories.length > 0) {
      const memoryContext = memories.map(m => `Context: ${m.content}`).join('\n');
      enhancedContent = `${content}\n\nRelevant context:\n${memoryContext}`;
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
      try {
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
      } catch (memoryError) {
        console.warn('Failed to store analysis memory:', memoryError);
      }
    }
    
    return analysis;

  } catch (error) {
    console.error('Enhanced analysis error:', error);
    return null;
  }
};
