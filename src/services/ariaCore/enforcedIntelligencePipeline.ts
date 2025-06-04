
import { supabase } from '@/integrations/supabase/client';
import { IntelligenceValidationCore } from './intelligenceValidationCore';

/**
 * A.R.I.A™ Enforced Intelligence Pipeline with CIA-Level Precision
 * Enhanced with Intelligence Validation Core and Tiered Confidence System
 */
export class EnforcedIntelligencePipeline {
  
  /**
   * Execute CIA-level precision scan with tiered confidence
   */
  static async executeCIAPrecisionScan(entityName: string): Promise<any[]> {
    console.log(`🎯 CIA Precision Scan initiated for: ${entityName}`);
    
    try {
      // Get recent scan results for this entity
      const { data: rawResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('content', `%${entityName}%`)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch scan results:', error);
        return [];
      }

      if (!rawResults || rawResults.length === 0) {
        console.log('No scan results found for entity');
        return [];
      }

      // Process each result through IVC
      const processedResults = [];
      
      for (const result of rawResults) {
        // Calculate base confidence score
        const baseConfidence = this.calculateBaseConfidence(result, entityName);
        
        // Validate through IVC with CIA-level precision
        const validation = await IntelligenceValidationCore.validateIntelligence(
          result.content,
          entityName,
          result.platform,
          baseConfidence,
          'cia_precision_scan'
        );

        if (validation.isValid) {
          processedResults.push({
            ...result,
            confidence_score: Math.round(validation.confidence * 100),
            match_score: Math.round(validation.confidence * 100),
            matchQuality: this.getMatchQuality(validation.tier),
            requiresReview: validation.tier === 'review',
            contextBoosts: validation.contextBoosts,
            ciaValidated: true,
            validationTier: validation.tier
          });
        } else {
          console.log(`🚫 Result rejected by IVC: ${validation.rejectionReason}`);
        }
      }

      console.log(`✅ CIA Precision Scan complete: ${processedResults.length}/${rawResults.length} results validated`);
      return processedResults;

    } catch (error) {
      console.error('CIA Precision Scan failed:', error);
      throw error;
    }
  }

  /**
   * Calculate base confidence score for scan result
   */
  private static calculateBaseConfidence(result: any, entityName: string): number {
    let confidence = 0.5; // Base score
    
    // Platform authority boost
    const platformBoosts = {
      'uk_news': 0.2,
      'bbc': 0.25,
      'reddit': 0.1,
      'youtube': 0.15,
      'twitter': 0.12,
      'instagram': 0.08
    };
    
    confidence += platformBoosts[result.platform?.toLowerCase()] || 0.05;
    
    // Sentiment consideration
    if (result.sentiment !== null) {
      // Neutral sentiment often indicates factual content
      if (Math.abs(result.sentiment) < 0.3) {
        confidence += 0.1;
      }
    }
    
    // Content length consideration
    if (result.content && result.content.length > 100) {
      confidence += 0.05;
    }
    
    // Threat type consideration
    if (result.threat_type && result.threat_type !== 'low') {
      confidence += 0.1;
    }
    
    // Entity name prominence
    const entityMentions = (result.content?.toLowerCase().match(new RegExp(entityName.toLowerCase(), 'g')) || []).length;
    if (entityMentions > 1) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Convert validation tier to match quality
   */
  private static getMatchQuality(tier: string): string {
    switch (tier) {
      case 'accept':
        return 'strong';
      case 'review':
        return 'moderate';
      case 'quarantine':
        return 'weak';
      default:
        return 'rejected';
    }
  }

  /**
   * Enhanced threat classification with CIA-level validation
   */
  static async classifyThreatWithCIA(
    content: string,
    entityName: string,
    platform: string
  ): Promise<any> {
    try {
      // Basic threat classification
      const baseClassification = this.performBasicClassification(content, entityName);
      
      // Validate through IVC
      const validation = await IntelligenceValidationCore.validateIntelligence(
        content,
        entityName,
        platform,
        baseClassification.confidence,
        'threat_classification'
      );

      if (!validation.isValid) {
        return {
          category: 'Invalid Data',
          severity: 0,
          action: 'Discard',
          explanation: validation.rejectionReason,
          confidence: 0,
          ciaValidated: false
        };
      }

      return {
        ...baseClassification,
        confidence: validation.confidence,
        ciaValidated: true,
        validationTier: validation.tier,
        contextBoosts: validation.contextBoosts
      };

    } catch (error) {
      console.error('CIA threat classification failed:', error);
      throw error;
    }
  }

  /**
   * Basic threat classification logic
   */
  private static performBasicClassification(content: string, entityName: string): any {
    const lowerContent = content.toLowerCase();
    
    // Threat detection patterns
    const threatPatterns = {
      legal: { keywords: ['lawsuit', 'legal action', 'court', 'sue'], severity: 8 },
      reputation: { keywords: ['scam', 'fraud', 'fake', 'corrupt'], severity: 7 },
      misinformation: { keywords: ['false', 'hoax', 'fake news', 'lie'], severity: 6 },
      complaint: { keywords: ['complaint', 'issue', 'problem', 'disappointed'], severity: 4 }
    };

    let category = 'Neutral';
    let severity = 1;
    let confidence = 0.6;

    // Check for threat patterns
    for (const [type, pattern] of Object.entries(threatPatterns)) {
      if (pattern.keywords.some(keyword => lowerContent.includes(keyword))) {
        category = type.charAt(0).toUpperCase() + type.slice(1) + ' Threat';
        severity = pattern.severity;
        confidence = 0.8;
        break;
      }
    }

    // Check for positive indicators
    const positiveKeywords = ['excellent', 'great', 'amazing', 'recommend', 'love'];
    if (positiveKeywords.some(keyword => lowerContent.includes(keyword))) {
      category = 'Positive';
      severity = 1;
      confidence = 0.7;
    }

    return {
      category,
      severity,
      action: severity >= 6 ? 'Escalation' : severity >= 4 ? 'Human Review' : 'Monitor',
      explanation: `CIA-validated classification: ${category} with severity ${severity}/10`,
      confidence
    };
  }
}
