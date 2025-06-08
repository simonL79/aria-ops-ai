
import { hybridAIService } from '@/services/ai/hybridAIService';

export interface ThreatClassificationResult {
  threatLevel: string;
  confidence: number;
  category: string;
  reasoning: string;
  suggestedActions: string[];
  entities: string[];
  severity: number;
  source: string;
  timestamp: string;
  recommendation: string;
  ai_reasoning: string;
  explanation?: string;
}

export interface ThreatClassificationOptions {
  content: string;
  source?: string;
  entityName?: string;
}

export const classifyThreat = async (
  content: string,
  source: string = 'unknown',
  entityName?: string
): Promise<ThreatClassificationResult> => {
  try {
    console.log('🔍 Classifying threat using hybrid AI service...');
    
    // Initialize hybrid AI service if not already done
    await hybridAIService.initialize();
    
    // Use hybrid AI service for classification
    const analysis = await hybridAIService.classifyThreat(
      content, 
      entityName || 'unknown_entity'
    );
    
    const result: ThreatClassificationResult = {
      threatLevel: analysis.threatLevel || 'medium',
      confidence: analysis.confidence || 0.7,
      category: analysis.category || 'unknown',
      reasoning: analysis.reasoning || 'Analysis completed',
      suggestedActions: analysis.suggestedActions || ['monitor'],
      entities: analysis.entities || [],
      severity: analysis.severity || 5.0,
      source,
      timestamp: new Date().toISOString(),
      recommendation: analysis.reasoning || 'Monitor situation',
      ai_reasoning: analysis.reasoning || 'AI analysis completed',
      explanation: analysis.reasoning || 'Threat classification completed'
    };

    console.log('✅ Threat classification completed:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Threat classification failed:', error);
    
    // Return safe fallback
    return {
      threatLevel: 'medium',
      confidence: 0.5,
      category: 'unknown',
      reasoning: 'Classification failed - manual review required',
      suggestedActions: ['manual_review', 'escalate'],
      entities: entityName ? [entityName] : [],
      severity: 5.0,
      source,
      timestamp: new Date().toISOString(),
      recommendation: 'Manual review required',
      ai_reasoning: 'Classification service unavailable',
      explanation: 'Classification failed - manual review required'
    };
  }
};

export const classifyThreatAdvanced = async (
  content: string,
  source: string = 'unknown',
  entityName?: string
): Promise<ThreatClassificationResult> => {
  // For now, use the same logic as classifyThreat
  return await classifyThreat(content, source, entityName);
};

export const batchClassifyThreats = async (
  options: ThreatClassificationOptions[]
): Promise<ThreatClassificationResult[]> => {
  const results: ThreatClassificationResult[] = [];
  
  for (const option of options) {
    try {
      const result = await classifyThreat(option.content, option.source, option.entityName);
      results.push(result);
    } catch (error) {
      console.error('❌ Batch threat classification failed for content:', option.content, error);
      
      // Push fallback result
      results.push({
        threatLevel: 'medium',
        confidence: 0.5,
        category: 'unknown',
        reasoning: 'Classification failed - manual review required',
        suggestedActions: ['manual_review', 'escalate'],
        entities: option.entityName ? [option.entityName] : [],
        severity: 5.0,
        source: option.source || 'batch',
        timestamp: new Date().toISOString(),
        recommendation: 'Manual review required',
        ai_reasoning: 'Batch classification failed',
        explanation: 'Classification failed - manual review required'
      });
    }
  }
  
  return results;
};
