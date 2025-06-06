import { supabase } from '@/integrations/supabase/client';

export interface LocalThreatAnalysis {
  platform: string;
  entityName: string;
  threatLevel: string;
  reasoning: string;
  suggestedActions: string[];
  rawAnalysis: string;
  timestamp: string;
}

export interface MemorySearchResult {
  id: string;
  entity_name: string;
  content: string;
  similarity: number;
  created_at: string;
}

/**
 * Send inference request to local Ollama server
 */
const sendOllamaRequest = async (prompt: string, model: string = 'llama3.2:3b'): Promise<any> => {
  try {
    console.log(`🧠 Sending request to Ollama (${model})...`);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🧠 Ollama response received:', data);
    
    return data.response || data.text || 'No response generated';
  } catch (error) {
    console.error('❌ Ollama request failed:', error);
    throw error;
  }
};

/**
 * Analyze content for potential threats using local inference
 */
export const analyzeWithLocalInference = async (
  content: string,
  platform: string,
  entityName: string,
  analysisType: string = 'classify'
): Promise<LocalThreatAnalysis | null> => {
  try {
    console.log(`🔍 Analyzing content from ${platform} for ${entityName}...`);
    
    let prompt;
    
    if (analysisType === 'classify') {
      prompt = `Analyze the following content from ${platform} about ${entityName} and classify the threat level as high, medium, or low.
      Also provide reasoning for the classification and suggest actions to mitigate the threat.
      
      Content: ${content}
      
      Respond in JSON format:
      {
        "threatLevel": "high|medium|low",
        "reasoning": "Explanation of the threat level",
        "suggestedActions": ["action1", "action2"]
      }`;
    } else if (analysisType === 'summarize') {
      prompt = `Summarize the following content from ${platform} about ${entityName} in a concise manner.
      
      Content: ${content}
      `;
    } else {
      console.warn('❌ Unknown analysis type:', analysisType);
      return null;
    }
    
    const rawAnalysis = await sendOllamaRequest(prompt);
    
    let analysisResult;
    
    if (analysisType === 'classify') {
      try {
        analysisResult = JSON.parse(rawAnalysis);
      } catch (error) {
        console.error('❌ Failed to parse JSON response:', error);
        analysisResult = {
          threatLevel: 'unknown',
          reasoning: 'Failed to parse analysis',
          suggestedActions: []
        };
      }
      
      const threatAnalysis: LocalThreatAnalysis = {
        platform,
        entityName,
        threatLevel: analysisResult.threatLevel || 'unknown',
        reasoning: analysisResult.reasoning || 'No reasoning provided',
        suggestedActions: analysisResult.suggestedActions || [],
        rawAnalysis,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Threat analysis complete:', threatAnalysis);
      return threatAnalysis;
    } else if (analysisType === 'summarize') {
      analysisResult = { summary: rawAnalysis };
      
      const threatAnalysis: LocalThreatAnalysis = {
        platform,
        entityName,
        threatLevel: 'informational',
        reasoning: analysisResult.summary || 'No summary provided',
        suggestedActions: [],
        rawAnalysis,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Content summarization complete:', threatAnalysis);
      return threatAnalysis;
    } else {
      return null;
    }
    
  } catch (error) {
    console.error('❌ Local threat analysis failed:', error);
    return null;
  }
};

/**
 * Analyze content with memory context
 */
export const analyzeWithMemoryContext = async (
  content: string,
  platform: string,
  entityName: string
): Promise<LocalThreatAnalysis | null> => {
  try {
    console.log(`🔍 Analyzing content from ${platform} for ${entityName} with memory context...`);
    
    // 1. Search for relevant memories
    const memories = await searchEntityMemories(content, entityName, 'similarity');
    
    // 2. Prepare the prompt with memory context
    let prompt = `You are an expert threat analyst. Analyze the following content from ${platform} about ${entityName},
    considering the following information about the entity:
    
    Content: ${content}\n\n`;
    
    if (memories.length > 0) {
      prompt += 'Relevant Memory Context:\n';
      memories.forEach((memory, index) => {
        prompt += `Memory ${index + 1}: ${memory.content}\n`;
      });
    } else {
      prompt += 'No relevant memory context found.\n';
    }
    
    prompt += `\nClassify the threat level as high, medium, or low.
    Provide reasoning for the classification and suggest actions to mitigate the threat.
    
    Respond in JSON format:
    {
      "threatLevel": "high|medium|low",
      "reasoning": "Explanation of the threat level",
      "suggestedActions": ["action1", "action2"]
    }`;
    
    // 3. Send to Ollama for analysis
    const rawAnalysis = await sendOllamaRequest(prompt);
    
    // 4. Parse and return the result
    let analysisResult;
    try {
      analysisResult = JSON.parse(rawAnalysis);
    } catch (error) {
      console.error('❌ Failed to parse JSON response:', error);
      analysisResult = {
        threatLevel: 'unknown',
        reasoning: 'Failed to parse analysis',
        suggestedActions: []
      };
    }
    
    const threatAnalysis: LocalThreatAnalysis = {
      platform,
      entityName,
      threatLevel: analysisResult.threatLevel || 'unknown',
      reasoning: analysisResult.reasoning || 'No reasoning provided',
      suggestedActions: analysisResult.suggestedActions || [],
      rawAnalysis,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Threat analysis with memory context complete:', threatAnalysis);
    return threatAnalysis;
    
  } catch (error) {
    console.error('❌ Local threat analysis with memory context failed:', error);
    return null;
  }
};

/**
 * Search entity memories using Supabase
 */
export const searchEntityMemories = async (
  query: string,
  entityName: string,
  searchType: string = 'similarity'
): Promise<MemorySearchResult[]> => {
  try {
    console.log(`🔍 Searching memories for ${entityName} with query: ${query}`);
    
    if (searchType === 'similarity') {
      const { data, error } = await supabase.rpc('match_entity_memories', {
        query_embedding: `[${Array(1536).fill(0).join(',')}]`, // Replace with actual embedding generation
        match_threshold: 0.75,
        match_count: 3,
        entity_name: entityName
      });
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Memory search complete:', data);
      return (data || []).map(item => ({
        id: item.id,
        entity_name: item.entity_name,
        content: item.content,
        similarity: item.similarity,
        created_at: item.created_at
      }));
    } else {
      // Implement keyword-based search if needed
      console.warn('❌ Keyword search not implemented yet.');
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to search entity memories:', error);
    return [];
  }
};
