
import { hybridAIService } from '@/services/ai/hybridAIService';

export interface EntityExtractionResult {
  people: string[];
  organizations: string[];
  locations: string[];
  socialHandles: string[];
  urls: string[];
  products: string[];
  confidence: number;
  source: string;
  extractedAt: string;
  aiService: string;
}

export interface Entity {
  id: string;
  entity_name: string;
  entity_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EntityStatistics {
  entity_name: string;
  total_scans: number;
  positive_mentions: number;
  negative_mentions: number;
  neutral_mentions: number;
  first_scan_date: string;
  last_scan_date: string;
}

export const extractEntitiesFromContent = async (
  content: string,
  source: string = 'unknown'
): Promise<EntityExtractionResult> => {
  try {
    console.log('🔍 Extracting entities using hybrid AI service...');
    
    // Initialize hybrid AI service
    await hybridAIService.initialize();
    
    // Extract entities using hybrid AI
    const extraction = await hybridAIService.extractEntities(content);
    
    const result: EntityExtractionResult = {
      people: extraction.people || [],
      organizations: extraction.organizations || [],
      locations: extraction.locations || [],
      socialHandles: extraction.social_handles || [],
      urls: extraction.urls || [],
      products: extraction.products || [],
      confidence: extraction.confidence || 0.8,
      source,
      extractedAt: new Date().toISOString(),
      aiService: hybridAIService.getServiceStatus().active
    };

    console.log('✅ Entity extraction completed:', {
      people: result.people.length,
      organizations: result.organizations.length,
      confidence: result.confidence,
      service: result.aiService
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Entity extraction failed:', error);
    
    // Return safe fallback
    return {
      people: [],
      organizations: [],
      locations: [],
      socialHandles: [],
      urls: [],
      products: [],
      confidence: 0.0,
      source,
      extractedAt: new Date().toISOString(),
      aiService: 'fallback'
    };
  }
};

// Simplified stubs for missing functions
export const extractEntitiesFromText = extractEntitiesFromContent;
export const processEntities = async (entities: any[]) => entities;
export const batchProcessEntities = async (entityBatch: any[]) => entityBatch;
export const getAllEntities = async (): Promise<Entity[]> => [];
export const getScanResultsByEntity = async (entityName: string) => [];
export const getEntityStatistics = async (entityName: string): Promise<EntityStatistics> => ({
  entity_name: entityName,
  total_scans: 0,
  positive_mentions: 0,
  negative_mentions: 0,
  neutral_mentions: 0,
  first_scan_date: new Date().toISOString(),
  last_scan_date: new Date().toISOString()
});
