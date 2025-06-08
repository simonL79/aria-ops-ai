
import { localInferenceClient } from './localInferenceClient';
import { generateAIResponse } from '../secureOpenaiService';
import { toast } from 'sonner';

export interface AIServiceStatus {
  openai: 'available' | 'unavailable' | 'rate_limited';
  local: 'available' | 'unavailable' | 'initializing';
  active: 'openai' | 'local' | 'none';
}

export interface EntityExtractionResult {
  people: string[];
  organizations: string[];
  locations: string[];
  social_handles: string[];
  urls: string[];
  products: string[];
  confidence: number;
}

export interface ThreatAnalysisResult {
  threatLevel: string;
  confidence: number;
  category: string;
  reasoning: string;
  suggestedActions: string[];
  entities: string[];
  severity: number;
}

class HybridAIService {
  private status: AIServiceStatus = {
    openai: 'unavailable',
    local: 'unavailable',
    active: 'none'
  };

  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🔄 Initializing Hybrid AI Service...');
    
    // Check OpenAI availability
    try {
      await this.checkOpenAIHealth();
    } catch (error) {
      console.log('⚠️ OpenAI not available:', error.message);
      this.status.openai = 'unavailable';
    }

    // Check local inference availability
    try {
      const localAvailable = await localInferenceClient.checkOllamaHealth();
      this.status.local = localAvailable ? 'available' : 'unavailable';
    } catch (error) {
      console.log('⚠️ Local inference not available:', error.message);
      this.status.local = 'unavailable';
    }

    // Set active service
    this.status.active = this.status.openai === 'available' ? 'openai' : 
                        this.status.local === 'available' ? 'local' : 'none';

    this.initialized = true;
    console.log('✅ Hybrid AI Service initialized:', this.status);
  }

  private async checkOpenAIHealth(): Promise<void> {
    try {
      // Simple test to check if OpenAI is working
      const testResponse = await generateAIResponse({
        prompt: "Test",
        type: "general",
        context: {}
      });
      
      this.status.openai = testResponse ? 'available' : 'unavailable';
    } catch (error) {
      this.status.openai = 'unavailable';
      throw error;
    }
  }

  getServiceStatus(): AIServiceStatus {
    return { ...this.status };
  }

  async classifyThreat(content: string, entity: string): Promise<ThreatAnalysisResult> {
    await this.initialize();

    if (this.status.openai === 'available') {
      try {
        console.log('🔍 Using OpenAI for threat classification...');
        const response = await generateAIResponse({
          prompt: `Analyze this content for threats against ${entity}: "${content}"`,
          type: "threat_analysis",
          context: { entity, content }
        });

        return this.parseOpenAIThreatResponse(response);
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.status.active = 'local';
      }
    }

    if (this.status.local === 'available') {
      try {
        console.log('🔍 Using local inference for threat classification...');
        return await localInferenceClient.classifyThreat(content, entity);
      } catch (error) {
        console.error('❌ Local inference failed:', error);
      }
    }

    // Fallback response
    return {
      threatLevel: 'medium',
      confidence: 0.5,
      category: 'unknown',
      reasoning: 'Unable to classify - all AI services unavailable',
      suggestedActions: ['manual_review'],
      entities: [entity],
      severity: 5.0
    };
  }

  async generateSEOContent(title: string, keywords: string[], entity: string): Promise<string> {
    await this.initialize();

    if (this.status.openai === 'available') {
      try {
        console.log('📝 Using OpenAI for SEO content generation...');
        const response = await generateAIResponse({
          prompt: `Create SEO-optimized content with title: ${title}, keywords: ${keywords.join(', ')}, for entity: ${entity}`,
          type: "content_generation",
          context: { title, keywords, entity }
        });

        return response?.content || '';
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.status.active = 'local';
      }
    }

    if (this.status.local === 'available') {
      try {
        console.log('📝 Using local inference for SEO content generation...');
        return await localInferenceClient.generateSEOContent(title, keywords, entity);
      } catch (error) {
        console.error('❌ Local inference failed:', error);
      }
    }

    // Fallback content
    return `# ${title}\n\nContent about ${entity} covering ${keywords.join(', ')}. Generated with fallback system.`;
  }

  async extractEntities(content: string): Promise<EntityExtractionResult> {
    await this.initialize();

    if (this.status.openai === 'available') {
      try {
        console.log('🔍 Using OpenAI for entity extraction...');
        const response = await generateAIResponse({
          prompt: `Extract entities from this content: "${content}"`,
          type: "entity_extraction",
          context: { content }
        });

        return this.parseOpenAIEntityResponse(response);
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.status.active = 'local';
      }
    }

    if (this.status.local === 'available') {
      try {
        console.log('🔍 Using local inference for entity extraction...');
        return await localInferenceClient.extractEntities(content);
      } catch (error) {
        console.error('❌ Local inference failed:', error);
      }
    }

    // Fallback response
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

  private parseOpenAIThreatResponse(response: any): ThreatAnalysisResult {
    try {
      if (typeof response === 'string') {
        const parsed = JSON.parse(response);
        return {
          threatLevel: parsed.threatLevel || 'medium',
          confidence: parsed.confidence || 0.7,
          category: parsed.category || 'unknown',
          reasoning: parsed.reasoning || 'Analysis completed',
          suggestedActions: parsed.suggestedActions || ['monitor'],
          entities: parsed.entities || [],
          severity: parsed.severity || 5.0
        };
      }
      
      return {
        threatLevel: response?.threatLevel || 'medium',
        confidence: response?.confidence || 0.7,
        category: response?.category || 'unknown',
        reasoning: response?.reasoning || 'Analysis completed',
        suggestedActions: response?.suggestedActions || ['monitor'],
        entities: response?.entities || [],
        severity: response?.severity || 5.0
      };
    } catch (error) {
      console.error('Failed to parse OpenAI threat response:', error);
      return {
        threatLevel: 'medium',
        confidence: 0.5,
        category: 'unknown',
        reasoning: 'Response parsing failed',
        suggestedActions: ['manual_review'],
        entities: [],
        severity: 5.0
      };
    }
  }

  private parseOpenAIEntityResponse(response: any): EntityExtractionResult {
    try {
      if (typeof response === 'string') {
        const parsed = JSON.parse(response);
        return {
          people: parsed.people || [],
          organizations: parsed.organizations || [],
          locations: parsed.locations || [],
          social_handles: parsed.social_handles || [],
          urls: parsed.urls || [],
          products: parsed.products || [],
          confidence: parsed.confidence || 0.7
        };
      }

      return {
        people: response?.people || [],
        organizations: response?.organizations || [],
        locations: response?.locations || [],
        social_handles: response?.social_handles || [],
        urls: response?.urls || [],
        products: response?.products || [],
        confidence: response?.confidence || 0.7
      };
    } catch (error) {
      console.error('Failed to parse OpenAI entity response:', error);
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

export const hybridAIService = new HybridAIService();
