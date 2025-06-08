
import { toast } from 'sonner';

export interface LocalModelConfig {
  endpoint: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LocalInferenceRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LocalInferenceResponse {
  content: string;
  model: string;
  tokens?: number;
  processingTime: number;
}

class LocalInferenceClient {
  private defaultConfig: LocalModelConfig = {
    endpoint: 'http://localhost:11434/api/generate',
    model: 'mixtral:8x7b-instruct',
    temperature: 0.7,
    maxTokens: 2048
  };

  private fallbackModels = [
    'mixtral:8x7b-instruct',
    'llama3:8b-instruct',
    'mistral:7b-instruct',
    'codellama:7b-instruct'
  ];

  async checkOllamaHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      console.log('🟢 Ollama available models:', data.models?.map(m => m.name));
      return data.models && data.models.length > 0;
    } catch (error) {
      console.log('🔴 Ollama not available:', error.message);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      return data.models?.map(m => m.name) || [];
    } catch (error) {
      console.error('Failed to get available models:', error);
      return [];
    }
  }

  async generateResponse(request: LocalInferenceRequest): Promise<LocalInferenceResponse> {
    const startTime = Date.now();
    
    // Try primary model first
    for (const modelName of this.fallbackModels) {
      try {
        const response = await this.callOllama(request, modelName);
        if (response) {
          return {
            content: response,
            model: modelName,
            processingTime: Date.now() - startTime
          };
        }
      } catch (error) {
        console.log(`❌ Model ${modelName} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error('All local models failed - check Ollama installation');
  }

  private async callOllama(request: LocalInferenceRequest, model: string): Promise<string> {
    const { prompt, systemPrompt, temperature, maxTokens } = request;
    
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`
      : prompt;

    const response = await fetch(this.defaultConfig.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: temperature || this.defaultConfig.temperature,
          max_tokens: maxTokens || this.defaultConfig.maxTokens,
          top_p: 0.9,
          top_k: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  }

  async classifyThreat(content: string, entity: string): Promise<any> {
    const systemPrompt = `You are an elite threat intelligence analyst. Analyze content for reputation threats with precision.

Return analysis in this exact JSON format:
{
  "threatLevel": "low|medium|high|critical",
  "confidence": 0.95,
  "category": "defamation|misinformation|negative_sentiment|harassment|legal_threat",
  "reasoning": "Brief explanation",
  "suggestedActions": ["action1", "action2"],
  "entities": ["entity1", "entity2"],
  "severity": 7.5
}`;

    const prompt = `Analyze this content about ${entity}:

Content: "${content}"

Provide threat assessment in JSON format.`;

    const response = await this.generateResponse({
      prompt,
      systemPrompt,
      temperature: 0.3
    });

    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse threat analysis JSON:', error);
      return {
        threatLevel: 'medium',
        confidence: 0.7,
        category: 'unknown',
        reasoning: 'Analysis completed but parsing failed',
        suggestedActions: ['manual_review'],
        entities: [entity],
        severity: 5.0
      };
    }
  }

  async generateSEOContent(title: string, keywords: string[], entity: string): Promise<string> {
    const systemPrompt = `You are an expert SEO content writer specializing in reputation management. Create high-quality, search-optimized content that naturally incorporates keywords while maintaining readability and authority.`;

    const prompt = `Create a comprehensive article with these specifications:

Title: ${title}
Target Entity: ${entity}
Keywords: ${keywords.join(', ')}

Requirements:
- 800-1200 words
- Natural keyword integration
- Professional, authoritative tone
- Include relevant industry insights
- Structured with clear headings
- SEO-optimized but human-readable

Generate the complete article content.`;

    const response = await this.generateResponse({
      prompt,
      systemPrompt,
      temperature: 0.6,
      maxTokens: 3000
    });

    return response.content;
  }

  async extractEntities(content: string): Promise<any> {
    const systemPrompt = `You are an expert entity extraction system. Extract all relevant entities from text with high precision.

Return results in this exact JSON format:
{
  "people": ["person1", "person2"],
  "organizations": ["org1", "org2"],
  "locations": ["location1", "location2"],
  "social_handles": ["@handle1", "@handle2"],
  "urls": ["url1", "url2"],
  "products": ["product1", "product2"],
  "confidence": 0.95
}`;

    const prompt = `Extract all entities from this content:

"${content}"

Return entities in JSON format.`;

    const response = await this.generateResponse({
      prompt,
      systemPrompt,
      temperature: 0.2
    });

    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse entity extraction JSON:', error);
      return {
        people: [],
        organizations: [],
        locations: [],
        social_handles: [],
        urls: [],
        products: [],
        confidence: 0.0
      };
    }
  }
}

export const localInferenceClient = new LocalInferenceClient();
