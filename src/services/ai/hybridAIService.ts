
import { callOpenAI } from '@/services/api/openaiClient';
import { localInferenceClient } from './localInferenceClient';
import { toast } from 'sonner';

export interface AIServiceConfig {
  preferLocal: boolean;
  openaiFallback: boolean;
  localFallback: boolean;
  timeout: number;
}

export class HybridAIService {
  private config: AIServiceConfig = {
    preferLocal: false, // Default to OpenAI for quality
    openaiFallback: true,
    localFallback: true,
    timeout: 30000
  };

  private openaiAvailable: boolean = true;
  private localAvailable: boolean = false;

  async initialize(): Promise<void> {
    console.log('🧠 Initializing Hybrid AI Service...');
    
    // Check local availability
    this.localAvailable = await localInferenceClient.checkOllamaHealth();
    
    if (this.localAvailable) {
      const models = await localInferenceClient.getAvailableModels();
      console.log('✅ Local AI available:', models);
      toast.success('Local AI models ready', { 
        description: `${models.length} models available offline` 
      });
    } else {
      console.log('❌ Local AI not available - Ollama not running');
    }

    // Test OpenAI availability (without making actual request)
    this.openaiAvailable = !!import.meta.env.VITE_OPENAI_API_KEY || 
                          localStorage.getItem('openai_api_key') !== null;
    
    console.log('🔍 AI Service Status:', {
      local: this.localAvailable,
      openai: this.openaiAvailable
    });
  }

  setPreferLocal(prefer: boolean): void {
    this.config.preferLocal = prefer;
    console.log(`🔄 AI preference changed to: ${prefer ? 'Local' : 'OpenAI'}`);
  }

  async classifyThreat(content: string, entity: string): Promise<any> {
    const useLocal = this.config.preferLocal && this.localAvailable;
    const useOpenAI = !this.config.preferLocal && this.openaiAvailable;

    try {
      if (useLocal) {
        console.log('🏠 Using local AI for threat classification');
        return await localInferenceClient.classifyThreat(content, entity);
      } else if (useOpenAI) {
        console.log('☁️ Using OpenAI for threat classification');
        return await this.callOpenAIThreatClassification(content, entity);
      } else {
        throw new Error('No AI service available');
      }
    } catch (error) {
      console.error('🚨 Primary AI service failed, trying fallback:', error);
      
      // Try fallback
      if (useLocal && this.config.openaiFallback && this.openaiAvailable) {
        console.log('📡 Falling back to OpenAI');
        return await this.callOpenAIThreatClassification(content, entity);
      } else if (useOpenAI && this.config.localFallback && this.localAvailable) {
        console.log('🏠 Falling back to local AI');
        return await localInferenceClient.classifyThreat(content, entity);
      } else {
        throw new Error('All AI services failed');
      }
    }
  }

  async generateSEOContent(title: string, keywords: string[], entity: string): Promise<string> {
    const useLocal = this.config.preferLocal && this.localAvailable;
    const useOpenAI = !this.config.preferLocal && this.openaiAvailable;

    try {
      if (useLocal) {
        console.log('🏠 Using local AI for SEO content generation');
        return await localInferenceClient.generateSEOContent(title, keywords, entity);
      } else if (useOpenAI) {
        console.log('☁️ Using OpenAI for SEO content generation');
        return await this.callOpenAISEOGeneration(title, keywords, entity);
      } else {
        throw new Error('No AI service available');
      }
    } catch (error) {
      console.error('🚨 Primary AI service failed for content generation:', error);
      
      // Try fallback
      if (useLocal && this.config.openaiFallback && this.openaiAvailable) {
        console.log('📡 Falling back to OpenAI for content generation');
        return await this.callOpenAISEOGeneration(title, keywords, entity);
      } else if (useOpenAI && this.config.localFallback && this.localAvailable) {
        console.log('🏠 Falling back to local AI for content generation');
        return await localInferenceClient.generateSEOContent(title, keywords, entity);
      } else {
        throw new Error('All AI services failed for content generation');
      }
    }
  }

  async extractEntities(content: string): Promise<any> {
    const useLocal = this.config.preferLocal && this.localAvailable;
    const useOpenAI = !this.config.preferLocal && this.openaiAvailable;

    try {
      if (useLocal) {
        console.log('🏠 Using local AI for entity extraction');
        return await localInferenceClient.extractEntities(content);
      } else if (useOpenAI) {
        console.log('☁️ Using OpenAI for entity extraction');
        return await this.callOpenAIEntityExtraction(content);
      } else {
        throw new Error('No AI service available');
      }
    } catch (error) {
      console.error('🚨 Primary AI service failed for entity extraction:', error);
      
      // Try fallback
      if (useLocal && this.config.openaiFallback && this.openaiAvailable) {
        console.log('📡 Falling back to OpenAI for entity extraction');
        return await this.callOpenAIEntityExtraction(content);
      } else if (useOpenAI && this.config.localFallback && this.localAvailable) {
        console.log('🏠 Falling back to local AI for entity extraction');
        return await localInferenceClient.extractEntities(content);
      } else {
        throw new Error('All AI services failed for entity extraction');
      }
    }
  }

  private async callOpenAIThreatClassification(content: string, entity: string): Promise<any> {
    const response = await callOpenAI({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an elite threat intelligence analyst. Analyze content for reputation threats with precision.

Return analysis in this exact JSON format:
{
  "threatLevel": "low|medium|high|critical",
  "confidence": 0.95,
  "category": "defamation|misinformation|negative_sentiment|harassment|legal_threat",
  "reasoning": "Brief explanation",
  "suggestedActions": ["action1", "action2"],
  "entities": ["entity1", "entity2"],
  "severity": 7.5
}`
        },
        {
          role: 'user',
          content: `Analyze this content about ${entity}:

Content: "${content}"

Provide threat assessment in JSON format.`
        }
      ],
      temperature: 0.3
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return {
        threatLevel: 'medium',
        confidence: 0.8,
        category: 'unknown',
        reasoning: 'OpenAI analysis completed but parsing failed',
        suggestedActions: ['manual_review'],
        entities: [entity],
        severity: 5.0
      };
    }
  }

  private async callOpenAISEOGeneration(title: string, keywords: string[], entity: string): Promise<string> {
    const response = await callOpenAI({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO content writer specializing in reputation management. Create high-quality, search-optimized content that naturally incorporates keywords while maintaining readability and authority.'
        },
        {
          role: 'user',
          content: `Create a comprehensive article with these specifications:

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

Generate the complete article content.`
        }
      ],
      temperature: 0.6
    });

    return response.choices[0].message.content;
  }

  private async callOpenAIEntityExtraction(content: string): Promise<any> {
    const response = await callOpenAI({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert entity extraction system. Extract all relevant entities from text with high precision.

Return results in this exact JSON format:
{
  "people": ["person1", "person2"],
  "organizations": ["org1", "org2"],
  "locations": ["location1", "location2"],
  "social_handles": ["@handle1", "@handle2"],
  "urls": ["url1", "url2"],
  "products": ["product1", "product2"],
  "confidence": 0.95
}`
        },
        {
          role: 'user',
          content: `Extract all entities from this content:

"${content}"

Return entities in JSON format.`
        }
      ],
      temperature: 0.2
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
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

  getServiceStatus(): { local: boolean; openai: boolean; active: string } {
    return {
      local: this.localAvailable,
      openai: this.openaiAvailable,
      active: this.config.preferLocal && this.localAvailable ? 'local' : 
              this.openaiAvailable ? 'openai' : 'none'
    };
  }
}

export const hybridAIService = new HybridAIService();
