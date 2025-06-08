import { hybridAIService } from '@/services/ai/hybridAIService';
import { supabase } from '@/integrations/supabase/client';

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

    // Store extraction results
    await supabase.from('entity_extractions').insert({
      content_hash: btoa(content).slice(0, 64),
      people: result.people,
      organizations: result.organizations,
      locations: result.locations,
      social_handles: result.socialHandles,
      urls: result.urls,
      products: result.products,
      confidence: result.confidence,
      source: result.source,
      ai_service: result.aiService
    });

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

import { extractEntitiesFromText } from './extractionUtils';
import { processEntities } from './processUtils';
import { batchProcessEntities } from './batchProcessor';
import { 
  getAllEntities 
} from './entityRecognitionService';
import { getScanResultsByEntity } from './entity/scanResults';
import { getEntityStatistics } from './entity/statistics';

export { 
  extractEntitiesFromText,
  processEntities,
  batchProcessEntities,
  getAllEntities,
  getScanResultsByEntity,
  getEntityStatistics,
  extractEntitiesFromContent,
};

// Explicitly re-export the Entity and EntityStatistics types
export type { Entity, EntityStatistics } from '@/types/entity';
