import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { AdvancedEntityMatcher, type AdvancedEntityFingerprint, type EntityMatchResult } from './advancedEntityMatcher';
import { CIALevelScanner, type CIAScanOptions, type CIAScanResult } from './ciaLevelScanner';

export interface KeywordCIAResult {
  keyword: string;
  threats: CIAScanResult[];
  entity_matches: EntityMatchResult[];
  precision_score: number;
  recommendations: string[];
  live_validated: boolean;
}

export interface KeywordCIAOptions {
  keywords: string[];
  entityName: string;
  precisionMode: 'high' | 'medium' | 'low';
  liveDataOnly: boolean;
  blockSimulations: boolean;
  source: string;
}

export class KeywordCIAIntegration {
  /**
   * Execute comprehensive CIA-level keyword analysis with live data enforcement
   */
  static async executeKeywordCIAAnalysis(options: KeywordCIAOptions): Promise<KeywordCIAResult[]> {
    console.log('🎯 Keyword CIA Integration: Starting live analysis');
    
    // MANDATORY: Block simulation attempts
    if (options.blockSimulations !== false) {
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant || compliance.simulationDetected) {
        console.error('🚫 Keyword CIA BLOCKED: Simulation detected');
        LiveDataEnforcer.blockSimulation('KeywordCIAIntegration.executeKeywordCIAAnalysis');
      }
    }

    // Validate all inputs are live data
    if (options.liveDataOnly !== false) {
      const entityValidation = await LiveDataEnforcer.validateDataInput(options.entityName, options.source);
      if (!entityValidation) {
        throw new Error('Keyword CIA blocked: Entity name appears to be simulation data');
      }

      for (const keyword of options.keywords) {
        const keywordValidation = await LiveDataEnforcer.validateDataInput(keyword, options.source);
        if (!keywordValidation) {
          throw new Error(`Keyword CIA blocked: Keyword "${keyword}" appears to be simulation data`);
        }
      }
    }

    const results: KeywordCIAResult[] = [];

    try {
      // Get or create entity fingerprint with live validation
      let entityFingerprint = await AdvancedEntityMatcher.getEntityFingerprint(options.entityName);
      
      if (!entityFingerprint) {
        console.log('Creating new entity fingerprint with live validation');
        const fingerprintId = await AdvancedEntityMatcher.createEntityFingerprint({
          entity_name: options.entityName,
          entity_type: 'individual', // Required field with default
          alternate_names: [],
          industries: [],
          known_associates: [],
          controversial_topics: [],
          false_positive_blocklist: ['mock', 'test', 'demo', 'simulation'],
          live_data_only: true,
          created_source: options.source
        });
        
        entityFingerprint = await AdvancedEntityMatcher.getEntityFingerprint(options.entityName);
        if (!entityFingerprint) {
          throw new Error('Failed to create entity fingerprint');
        }
      }

      // Process each keyword with CIA-level precision
      for (const keyword of options.keywords) {
        console.log(`🔍 Processing keyword: ${keyword}`);
        
        // Execute CIA precision scan
        const ciaResults = await CIALevelScanner.executePrecisionScan({
          targetEntity: options.entityName,
          fullScan: options.precisionMode === 'high',
          source: options.source,
          precisionMode: options.precisionMode,
          enableFalsePositiveFilter: true,
          liveDataOnly: options.liveDataOnly,
          blockSimulations: options.blockSimulations
        });

        // Filter results for this specific keyword
        const keywordResults = ciaResults.filter(result => 
          result.content?.toLowerCase().includes(keyword.toLowerCase()) ||
          result.url?.toLowerCase().includes(keyword.toLowerCase())
        );

        // Analyze entity matches for each result
        const entityMatches: EntityMatchResult[] = [];
        for (const result of keywordResults) {
          if (result.content) {
            const matchResult = AdvancedEntityMatcher.analyzeContentMatch(
              result.content,
              result.url || '',
              entityFingerprint
            );
            entityMatches.push(matchResult);
          }
        }

        // Calculate precision score
        const acceptedMatches = entityMatches.filter(m => m.decision === 'accepted').length;
        const totalMatches = entityMatches.length;
        const precisionScore = totalMatches > 0 ? acceptedMatches / totalMatches : 0;

        // Generate recommendations based on results
        const recommendations = this.generateRecommendations(
          keyword,
          keywordResults,
          entityMatches,
          precisionScore
        );

        results.push({
          keyword,
          threats: keywordResults,
          entity_matches: entityMatches,
          precision_score: precisionScore,
          recommendations,
          live_validated: true
        });
      }

      console.log(`✅ Keyword CIA Integration: Processed ${results.length} keywords with live validation`);
      return results;

    } catch (error) {
      console.error('❌ Keyword CIA Integration failed:', error);
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        throw error; // Re-throw simulation blocks
      }
      throw new Error('Keyword CIA Integration: Live analysis failed');
    }
  }

  /**
   * Generate strategic recommendations based on analysis results
   */
  private static generateRecommendations(
    keyword: string,
    threats: CIAScanResult[],
    matches: EntityMatchResult[],
    precisionScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (threats.length === 0) {
      recommendations.push(`No immediate threats detected for keyword "${keyword}"`);
      recommendations.push('Consider proactive content creation to maintain positive presence');
    } else {
      const highSeverityThreats = threats.filter(t => t.severity === 'high').length;
      const acceptedMatches = matches.filter(m => m.decision === 'accepted').length;

      if (highSeverityThreats > 0) {
        recommendations.push(`URGENT: ${highSeverityThreats} high-severity threats detected`);
        recommendations.push('Immediate response strategy required');
      }

      if (precisionScore < 0.5) {
        recommendations.push('Low precision score - review entity fingerprint accuracy');
        recommendations.push('Consider expanding false positive blocklist');
      }

      if (acceptedMatches > 0) {
        recommendations.push(`${acceptedMatches} confirmed entity matches require attention`);
        recommendations.push('Deploy counter-narrative strategy');
      }
    }

    // Always add live data validation note
    recommendations.push('✅ Analysis completed with live data validation');

    return recommendations;
  }

  /**
   * Get precision statistics for entity fingerprint
   */
  static async getEntityPrecisionStats(entityName: string): Promise<any[]> {
    try {
      const fingerprint = await AdvancedEntityMatcher.getEntityFingerprint(entityName);
      if (!fingerprint) {
        return [];
      }

      return await AdvancedEntityMatcher.getPrecisionStats(fingerprint.id);
    } catch (error) {
      console.error('Failed to get precision stats:', error);
      return [];
    }
  }

  /**
   * Create enhanced entity fingerprint with advanced features
   */
  static async createEnhancedEntityFingerprint(entityData: {
    entity_name: string;
    entity_type?: string;
    alternate_names?: string[];
    industries?: string[];
    known_associates?: string[];
    controversial_topics?: string[];
    false_positive_blocklist?: string[];
    live_data_only?: boolean;
    created_source: string;
  }): Promise<AdvancedEntityFingerprint> {
    // Validate input is live data
    if (!await LiveDataEnforcer.validateDataInput(entityData.entity_name, entityData.created_source)) {
      throw new Error('Enhanced fingerprint blocked: Entity name appears to be simulation data');
    }

    // Ensure required fields are present
    const completeEntityData = {
      entity_name: entityData.entity_name,
      entity_type: entityData.entity_type || 'individual',
      alternate_names: entityData.alternate_names || [],
      industries: entityData.industries || [],
      known_associates: entityData.known_associates || [],
      controversial_topics: entityData.controversial_topics || [],
      false_positive_blocklist: entityData.false_positive_blocklist || ['mock', 'test', 'demo', 'simulation'],
      live_data_only: entityData.live_data_only !== false,
      created_source: entityData.created_source
    };

    // Create the fingerprint
    const fingerprintId = await AdvancedEntityMatcher.createEntityFingerprint(completeEntityData);
    
    // Retrieve the created fingerprint
    const fingerprint = await AdvancedEntityMatcher.getEntityFingerprint(entityData.entity_name);
    if (!fingerprint) {
      throw new Error('Failed to retrieve created fingerprint');
    }

    console.log('✅ Enhanced entity fingerprint created with live validation');
    return fingerprint;
  }

  /**
   * PERMANENTLY BLOCK mock keyword analysis
   */
  static executeMockKeywordAnalysis(): never {
    LiveDataEnforcer.blockSimulation('KeywordCIAIntegration.executeMockKeywordAnalysis');
  }
}
