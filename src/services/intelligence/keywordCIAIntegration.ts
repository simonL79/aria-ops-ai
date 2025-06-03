
import { CIALevelScanner, type CIAScanOptions, type CIAScanResult } from './ciaLevelScanner';
import { AdvancedEntityMatcher, type AdvancedEntityFingerprint } from './advancedEntityMatcher';

/**
 * CIA-Level Integration for Keyword-to-Article System
 * Isolated service that doesn't affect other scanning operations
 */

export class KeywordCIAIntegration {
  /**
   * Execute CIA-level precision scan specifically for keyword system
   * This is completely isolated from other scanning services
   */
  static async executeKeywordPrecisionScan(
    entityName: string,
    options: {
      precisionMode?: 'high' | 'medium' | 'low';
      enableFalsePositiveFilter?: boolean;
      contextTags?: string[];
    } = {}
  ): Promise<{
    results: CIAScanResult[];
    precisionStats: {
      total_scanned: number;
      accepted: number;
      quarantined: number;
      rejected: number;
      false_positives_blocked: number;
      avg_precision_score: number;
      confidence_level: 'high' | 'medium' | 'low';
    };
  }> {
    console.log('🎯 CIA Keyword Integration: Starting precision scan for:', entityName);

    // Enhanced scan options for keyword system
    const scanOptions: CIAScanOptions = {
      targetEntity: entityName,
      fullScan: true,
      source: 'cia_keyword_system',
      precisionMode: options.precisionMode || 'high',
      enableFalsePositiveFilter: options.enableFalsePositiveFilter !== false
    };

    // Execute CIA-level scan
    const results = await CIALevelScanner.executePrecisionScan(scanOptions);

    // Calculate precision statistics
    const precisionStats = this.calculatePrecisionStats(results);

    console.log('✅ CIA Keyword Integration Complete:', {
      entity: entityName,
      results: results.length,
      precision: precisionStats.avg_precision_score,
      confidence: precisionStats.confidence_level
    });

    return {
      results,
      precisionStats
    };
  }

  /**
   * Create entity fingerprint specifically for keyword targeting
   */
  static async createKeywordEntityFingerprint(
    entityName: string,
    keywordContext: {
      aliases?: string[];
      organization?: string;
      locations?: string[];
      threatKeywords?: string[];
      blocklist?: string[];
    }
  ): Promise<string> {
    const fingerprint = {
      entity_id: `keyword-${entityName.toLowerCase().replace(/\s+/g, '-')}`,
      primary_name: entityName,
      aliases: keywordContext.aliases || [],
      organization: keywordContext.organization,
      locations: keywordContext.locations || [],
      context_tags: keywordContext.threatKeywords || [],
      false_positive_blocklist: keywordContext.blocklist || []
    };

    return await AdvancedEntityMatcher.createEntityFingerprint(fingerprint);
  }

  /**
   * Get CIA precision recommendations for keyword optimization
   */
  static async getKeywordOptimizationRecommendations(
    entityName: string
  ): Promise<{
    recommendations: Array<{
      type: 'alias' | 'location' | 'context' | 'blocklist';
      suggestion: string;
      reasoning: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    currentPrecision: number;
    targetPrecision: number;
  }> {
    const fingerprint = await AdvancedEntityMatcher.getEntityFingerprint(entityName);
    
    if (!fingerprint) {
      return {
        recommendations: [{
          type: 'alias',
          suggestion: 'Create entity fingerprint',
          reasoning: 'No entity fingerprint found for precision targeting',
          impact: 'high'
        }],
        currentPrecision: 0,
        targetPrecision: 0.85
      };
    }

    const stats = await AdvancedEntityMatcher.getPrecisionStats(fingerprint.id);
    const currentPrecision = stats?.[0]?.avg_precision_score || 0;

    const recommendations = [];

    // Analyze and suggest improvements
    if (fingerprint.aliases.length < 3) {
      recommendations.push({
        type: 'alias' as const,
        suggestion: 'Add more aliases and variations',
        reasoning: 'More aliases improve entity recognition recall',
        impact: 'high' as const
      });
    }

    if (fingerprint.locations.length === 0) {
      recommendations.push({
        type: 'location' as const,
        suggestion: 'Add geographic context',
        reasoning: 'Location context helps eliminate false positives',
        impact: 'medium' as const
      });
    }

    if (currentPrecision < 0.8) {
      recommendations.push({
        type: 'blocklist' as const,
        suggestion: 'Expand false positive blocklist',
        reasoning: 'Recent scans show false positive issues',
        impact: 'high' as const
      });
    }

    return {
      recommendations,
      currentPrecision,
      targetPrecision: 0.85
    };
  }

  /**
   * Calculate precision statistics from scan results
   */
  private static calculatePrecisionStats(results: CIAScanResult[]) {
    const total = results.length;
    const accepted = results.filter(r => r.match_decision === 'accepted').length;
    const quarantined = results.filter(r => r.match_decision === 'quarantined').length;
    const rejected = results.filter(r => r.match_decision === 'rejected').length;
    const falsePositives = results.filter(r => r.false_positive_detected).length;
    
    const avgScore = total > 0 
      ? results.reduce((sum, r) => sum + r.match_score, 0) / total 
      : 0;

    let confidenceLevel: 'high' | 'medium' | 'low';
    if (avgScore >= 0.8) confidenceLevel = 'high';
    else if (avgScore >= 0.6) confidenceLevel = 'medium';
    else confidenceLevel = 'low';

    return {
      total_scanned: total,
      accepted,
      quarantined,
      rejected,
      false_positives_blocked: falsePositives,
      avg_precision_score: avgScore,
      confidence_level: confidenceLevel
    };
  }

  /**
   * Test CIA precision against known false positives
   */
  static async testPrecisionAgainstKnownFalsePositives(
    entityName: string
  ): Promise<{
    passed: boolean;
    blockedFalsePositives: string[];
    score: number;
  }> {
    try {
      const testCases = [
        `Lindsay Lohan arrested for ${entityName} related charges`,
        `Simon Cowell comments on ${entityName} situation`,
        `${entityName} not to be confused with Lindsay Graham`,
        `Breaking: ${entityName} speaks out about recent events`
      ];

      let fingerprint = await AdvancedEntityMatcher.getEntityFingerprint(entityName);
      
      // If no fingerprint exists, create a default one for testing
      if (!fingerprint) {
        console.log(`Creating default fingerprint for testing: ${entityName}`);
        const defaultFingerprint = {
          entity_id: entityName.toLowerCase().replace(/\s+/g, '-'),
          primary_name: entityName,
          aliases: [
            'Simon L.',
            'S. Lindsay', 
            '@simonlindsay',
            'Simon KSL'
          ],
          organization: 'KSL Hair',
          locations: ['Glasgow', 'Scotland', 'UK'],
          context_tags: [
            'fraud', 'arrest', 'bench warrant', 'investigation',
            'criminal', 'lawsuit', 'allegations', 'misconduct'
          ],
          false_positive_blocklist: [
            'lindsay lohan', 'simon cowell', 'lindsay graham',
            'simon pegg', 'lindsay fox', 'simon baker'
          ]
        };

        const fingerprintId = await AdvancedEntityMatcher.createEntityFingerprint(defaultFingerprint);
        fingerprint = {
          id: fingerprintId,
          ...defaultFingerprint
        };
      }

      const blockedFalsePositives: string[] = [];
      let correctDecisions = 0;

      for (const testCase of testCases) {
        const decision = AdvancedEntityMatcher.analyzeContentMatch(
          testCase,
          '',
          fingerprint
        );

        if (decision.false_positive_detected || decision.decision === 'rejected') {
          blockedFalsePositives.push(testCase);
          correctDecisions++;
        }
      }

      const score = correctDecisions / testCases.length;
      const passed = score >= 0.75; // 75% accuracy threshold

      return {
        passed,
        blockedFalsePositives,
        score
      };
    } catch (error) {
      console.error('Error in testPrecisionAgainstKnownFalsePositives:', error);
      return {
        passed: false,
        blockedFalsePositives: [],
        score: 0
      };
    }
  }
}
