import { localInferenceClient } from './localInferenceClient';
import { generateAIResponse } from '../secureOpenaiService';

export interface AIServiceStatus {
  openai: 'available' | 'unavailable' | 'rate_limited';
  local: 'available' | 'unavailable' | 'initializing' | 'disabled';
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
    local: 'disabled', // Changed from 'unavailable' to 'disabled'
    active: 'none'
  };

  private initialized = false;
  private preferLocal = false;
  private ollamaDisabled = true; // Flag to disable Ollama for testing

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🔄 Initializing Hybrid AI Service (Ollama disabled for testing)...');
    
    // Check OpenAI availability
    try {
      await this.checkOpenAIHealth();
    } catch (error) {
      console.log('⚠️ OpenAI not available:', error.message);
      this.status.openai = 'unavailable';
    }

    // Skip local inference check when disabled
    if (this.ollamaDisabled) {
      console.log('🔇 Local inference disabled for testing');
      this.status.local = 'disabled';
    } else {
      // Keep original local inference check code for re-enabling later
      try {
        const localAvailable = await localInferenceClient.checkOllamaHealth();
        this.status.local = localAvailable ? 'available' : 'unavailable';
      } catch (error) {
        console.log('⚠️ Local inference not available:', error.message);
        this.status.local = 'unavailable';
      }
    }

    // Set active service based on preference and availability
    this.updateActiveService();

    this.initialized = true;
    console.log('✅ Hybrid AI Service initialized (local disabled):', this.status);
  }

  private updateActiveService(): void {
    if (this.preferLocal && this.status.local === 'available' && !this.ollamaDisabled) {
      this.status.active = 'local';
    } else if (this.status.openai === 'available') {
      this.status.active = 'openai';
    } else if (this.status.local === 'available' && !this.ollamaDisabled) {
      this.status.active = 'local';
    } else {
      this.status.active = 'none';
    }
  }

  setPreferLocal(prefer: boolean): void {
    this.preferLocal = prefer;
    this.updateActiveService();
  }

  // Method to enable/disable Ollama for testing
  setOllamaEnabled(enabled: boolean): void {
    this.ollamaDisabled = !enabled;
    if (this.ollamaDisabled) {
      this.status.local = 'disabled';
    }
    this.updateActiveService();
    console.log(`🔧 Ollama ${enabled ? 'enabled' : 'disabled'} for testing`);
  }

  private async checkOpenAIHealth(): Promise<void> {
    try {
      // Simple test to check if OpenAI is working
      const testResponse = await generateAIResponse({
        responseType: "test",
        toneStyle: "professional",
        content: "test"
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

    if (this.status.openai === 'available' && (!this.preferLocal || this.status.local !== 'available' || this.ollamaDisabled)) {
      try {
        console.log('🔍 Using OpenAI for threat classification...');
        const response = await generateAIResponse({
          responseType: "threat_analysis",
          toneStyle: "professional",
          content: content,
          platform: "analysis"
        });

        return this.parseOpenAIThreatResponse(response);
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.updateActiveService();
      }
    }

    // Only use local inference if not disabled
    if (this.status.local === 'available' && !this.ollamaDisabled) {
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
      reasoning: 'Unable to classify - all AI services unavailable or disabled',
      suggestedActions: ['manual_review'],
      entities: [entity],
      severity: 5.0
    };
  }

  async generateSEOContent(title: string, keywords: string[], entity: string): Promise<string> {
    await this.initialize();

    if (this.status.openai === 'available' && (!this.preferLocal || this.status.local !== 'available' || this.ollamaDisabled)) {
      try {
        console.log('📝 Using OpenAI for SEO content generation...');
        const response = await generateAIResponse({
          responseType: "content_generation",
          toneStyle: "professional",
          content: `Generate SEO content for: ${title}. Keywords: ${keywords.join(', ')}. Entity: ${entity}`
        });

        return typeof response === 'string' ? response : String(response);
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.updateActiveService();
      }
    }

    // Only use local inference if not disabled
    if (this.status.local === 'available' && !this.ollamaDisabled) {
      try {
        console.log('📝 Using local inference for SEO content generation...');
        return await localInferenceClient.generateSEOContent(title, keywords, entity);
      } catch (error) {
        console.error('❌ Local inference failed:', error);
      }
    }

    // Fallback content
    return `# ${title}\n\nContent about ${entity} covering ${keywords.join(', ')}. Generated with fallback system (local AI disabled for testing).`;
  }

  async extractEntities(content: string): Promise<EntityExtractionResult> {
    await this.initialize();

    if (this.status.openai === 'available' && (!this.preferLocal || this.status.local !== 'available' || this.ollamaDisabled)) {
      try {
        console.log('🔍 Using OpenAI for entity extraction...');
        const response = await generateAIResponse({
          responseType: "entity_extraction",
          toneStyle: "professional",
          content: content
        });

        return this.parseOpenAIEntityResponse(response);
      } catch (error) {
        console.log('⚠️ OpenAI failed, falling back to local inference...');
        this.status.openai = 'rate_limited';
        this.updateActiveService();
      }
    }

    // Only use local inference if not disabled
    if (this.status.local === 'available' && !this.ollamaDisabled) {
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
