import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from './liveDataEnforcer';

/**
 * A.R.I.A™ Intelligence Validation Core (IVC) - CIA-Level Precision
 * Universal wrapper for all intelligence operations with zero tolerance policy
 */
export class IntelligenceValidationCore {
  
  /**
   * Tiered Confidence System scoring
   */
  static readonly CONFIDENCE_TIERS = {
    ACCEPT: 0.60,     // >60% → Accept ✅
    REVIEW: 0.30,     // 30-59% → Accept w/ review flag ⚠️
    QUARANTINE: 0.15, // 15-29% → Quarantine 🧃
    DISCARD: 0.00     // <15% → Discard ❌
  };

  /**
   * CIA-level validation wrapper for all intelligence operations
   */
  static async validateIntelligence(
    content: string,
    entityName: string,
    platform: string,
    confidenceScore: number,
    operation: string = 'scan'
  ): Promise<{
    isValid: boolean;
    tier: 'accept' | 'review' | 'quarantine' | 'discard';
    confidence: number;
    rejectionReason?: string;
    contextBoosts: string[];
  }> {
    try {
      console.log(`🔍 IVC: Validating ${operation} for entity: ${entityName}`);
      
      // Step 1: Live data enforcement - Zero tolerance policy
      const isLiveData = await LiveDataEnforcer.validateDataInput(content, platform);
      if (!isLiveData) {
        await this.logRejection(entityName, content, 'live_data_violation', operation);
        return {
          isValid: false,
          tier: 'discard',
          confidence: 0,
          rejectionReason: 'Live data validation failed - CIA-grade enforcement',
          contextBoosts: []
        };
      }

      // Step 2: Entity presence validation - Forced content check
      const entityPresent = this.validateEntityPresence(content, entityName);
      if (!entityPresent.isPresent) {
        await this.logRejection(entityName, content, 'entity_not_found', operation);
        return {
          isValid: false,
          tier: 'discard',
          confidence: 0,
          rejectionReason: `Entity "${entityName}" not found in content`,
          contextBoosts: []
        };
      }

      // Step 3: Context boosting analysis
      const contextBoosts = this.analyzeContextBoosts(content, entityName);
      
      // Step 4: Apply context boosting to confidence score
      let adjustedConfidence = confidenceScore;
      contextBoosts.forEach(boost => {
        switch (boost) {
          case 'high_authority_source':
            adjustedConfidence += 0.15;
            break;
          case 'recent_timestamp':
            adjustedConfidence += 0.10;
            break;
          case 'entity_context_rich':
            adjustedConfidence += 0.08;
            break;
          case 'social_engagement_high':
            adjustedConfidence += 0.05;
            break;
        }
      });

      // Cap at 1.0
      adjustedConfidence = Math.min(adjustedConfidence, 1.0);

      // Step 5: Tiered confidence classification
      const tier = this.classifyConfidenceTier(adjustedConfidence);
      
      // Step 6: Log validation result
      await this.logValidation(entityName, content, tier, adjustedConfidence, operation, contextBoosts);

      return {
        isValid: tier !== 'discard',
        tier,
        confidence: adjustedConfidence,
        contextBoosts
      };

    } catch (error) {
      console.error('❌ IVC validation failed:', error);
      await this.logRejection(entityName, content, 'validation_error', operation, error.message);
      return {
        isValid: false,
        tier: 'discard',
        confidence: 0,
        rejectionReason: `Validation error: ${error.message}`,
        contextBoosts: []
      };
    }
  }

  /**
   * Validate entity presence in content - CIA enforced requirement
   */
  private static validateEntityPresence(content: string, entityName: string): {
    isPresent: boolean;
    occurrences: number;
  } {
    const contentLower = content.toLowerCase();
    const entityLower = entityName.toLowerCase();
    
    // Count direct mentions
    const directMatches = (contentLower.match(new RegExp(entityLower, 'g')) || []).length;
    
    // Check for partial matches (for compound names)
    const entityParts = entityName.split(' ').filter(part => part.length > 2);
    let partialMatches = 0;
    
    entityParts.forEach(part => {
      if (contentLower.includes(part.toLowerCase())) {
        partialMatches++;
      }
    });
    
    // Entity must appear at least once directly OR have most parts present
    const isPresent = directMatches >= 1 || (entityParts.length > 1 && partialMatches >= Math.ceil(entityParts.length * 0.7));
    
    return {
      isPresent,
      occurrences: directMatches + partialMatches
    };
  }

  /**
   * Analyze context for confidence boosting factors
   */
  private static analyzeContextBoosts(content: string, entityName: string): string[] {
    const boosts: string[] = [];
    const contentLower = content.toLowerCase();
    
    // High authority source indicators
    const authorityIndicators = ['according to', 'reported by', 'confirmed by', 'announced', 'statement'];
    if (authorityIndicators.some(indicator => contentLower.includes(indicator))) {
      boosts.push('high_authority_source');
    }
    
    // Recent timestamp indicators
    const recentIndicators = ['today', 'yesterday', 'this week', '2025', 'recently', 'just announced'];
    if (recentIndicators.some(indicator => contentLower.includes(indicator))) {
      boosts.push('recent_timestamp');
    }
    
    // Entity context richness
    const contextKeywords = ['company', 'ceo', 'founder', 'business', 'industry', 'market'];
    const contextMatches = contextKeywords.filter(keyword => contentLower.includes(keyword)).length;
    if (contextMatches >= 2) {
      boosts.push('entity_context_rich');
    }
    
    // Social engagement indicators
    const engagementIndicators = ['comments', 'shares', 'likes', 'viral', 'trending'];
    if (engagementIndicators.some(indicator => contentLower.includes(indicator))) {
      boosts.push('social_engagement_high');
    }
    
    return boosts;
  }

  /**
   * Classify confidence into tiers
   */
  private static classifyConfidenceTier(confidence: number): 'accept' | 'review' | 'quarantine' | 'discard' {
    if (confidence >= this.CONFIDENCE_TIERS.ACCEPT) return 'accept';
    if (confidence >= this.CONFIDENCE_TIERS.REVIEW) return 'review';
    if (confidence >= this.CONFIDENCE_TIERS.QUARANTINE) return 'quarantine';
    return 'discard';
  }

  /**
   * Log validation success with CIA-grade audit trail
   */
  private static async logValidation(
    entityName: string,
    content: string,
    tier: string,
    confidence: number,
    operation: string,
    contextBoosts: string[]
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'ivc_validation',
        module_source: 'intelligence_validation_core',
        success: true,
        entity_name: entityName,
        operation_data: {
          tier,
          confidence,
          operation,
          context_boosts: contextBoosts,
          content_length: content.length,
          validation_timestamp: new Date().toISOString(),
          cia_grade: true
        }
      });
    } catch (error) {
      console.error('Failed to log IVC validation:', error);
    }
  }

  /**
   * Log rejection with reason - CIA audit requirement
   */
  private static async logRejection(
    entityName: string,
    content: string,
    reason: string,
    operation: string,
    errorDetails?: string
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'ivc_rejection',
        module_source: 'intelligence_validation_core',
        success: false,
        entity_name: entityName,
        error_message: reason,
        operation_data: {
          rejection_reason: reason,
          operation,
          content_preview: content.substring(0, 200),
          error_details: errorDetails,
          rejection_timestamp: new Date().toISOString(),
          cia_grade: true
        }
      });
      
      console.warn(`🚫 IVC REJECTION: ${reason} for entity: ${entityName}`);
    } catch (error) {
      console.error('Failed to log IVC rejection:', error);
    }
  }

  /**
   * Get validation statistics for monitoring
   */
  static async getValidationStats(timeframe: string = '24h'): Promise<{
    totalValidations: number;
    acceptedCount: number;
    reviewCount: number;
    quarantinedCount: number;
    discardedCount: number;
    avgConfidence: number;
  }> {
    try {
      const hoursAgo = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 1;
      const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
      
      const { data: validations } = await supabase
        .from('aria_ops_log')
        .select('operation_data, success')
        .eq('operation_type', 'ivc_validation')
        .gte('created_at', since);
        
      const { data: rejections } = await supabase
        .from('aria_ops_log')
        .select('id')
        .eq('operation_type', 'ivc_rejection')
        .gte('created_at', since);

      const validationData = validations || [];
      
      // Safe type casting for operation_data
      const acceptedCount = validationData.filter(v => {
        const operationData = v.operation_data as any;
        return operationData?.tier === 'accept';
      }).length;
      
      const reviewCount = validationData.filter(v => {
        const operationData = v.operation_data as any;
        return operationData?.tier === 'review';
      }).length;
      
      const quarantinedCount = validationData.filter(v => {
        const operationData = v.operation_data as any;
        return operationData?.tier === 'quarantine';
      }).length;
      
      const discardedCount = (rejections?.length || 0);
      
      const totalValidations = validationData.length + discardedCount;
      const avgConfidence = validationData.length > 0 
        ? validationData.reduce((sum, v) => {
            const operationData = v.operation_data as any;
            return sum + (operationData?.confidence || 0);
          }, 0) / validationData.length
        : 0;

      return {
        totalValidations,
        acceptedCount,
        reviewCount,
        quarantinedCount,
        discardedCount,
        avgConfidence
      };
    } catch (error) {
      console.error('Failed to get validation stats:', error);
      return {
        totalValidations: 0,
        acceptedCount: 0,
        reviewCount: 0,
        quarantinedCount: 0,
        discardedCount: 0,
        avgConfidence: 0
      };
    }
  }
}
