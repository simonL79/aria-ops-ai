import { supabase } from '@/integrations/supabase/client';
import { AdvancedEntityMatcher, type AdvancedEntityFingerprint } from './advancedEntityMatcher';
import type { ScanOptions, LiveScanResult } from '@/types/scan';

/**
 * CIA-Level Intelligence Scanner
 * Isolated from other services - Admin only
 */

export interface CIAScanOptions extends ScanOptions {
  entityFingerprint?: AdvancedEntityFingerprint;
  precisionMode?: 'high' | 'medium' | 'low';
  enableFalsePositiveFilter?: boolean;
}

export interface CIAScanResult extends LiveScanResult {
  match_decision: 'accepted' | 'rejected' | 'quarantined';
  match_score: number;
  precision_confidence: 'high' | 'medium' | 'low';
  false_positive_detected: boolean;
  context_matches: Record<string, number>;
  query_variant_used: string;
}

export class CIALevelScanner {
  /**
   * Execute CIA-level precision scan with entity disambiguation
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    console.log('🎯 CIA-Level Scanner: Starting precision intelligence gathering...');
    
    const entityName = options.targetEntity || 'Simon Lindsay';
    
    // Get or create entity fingerprint
    let entityFingerprint = options.entityFingerprint;
    if (!entityFingerprint) {
      entityFingerprint = await this.getOrCreateDefaultFingerprint(entityName);
    }

    console.log('🔍 Entity Fingerprint:', {
      primary_name: entityFingerprint.primary_name,
      aliases: entityFingerprint.aliases,
      organization: entityFingerprint.organization,
      locations: entityFingerprint.locations
    });

    // Generate intelligent query variants
    const queryVariants = AdvancedEntityMatcher.generateQueryVariants(entityFingerprint);
    console.log(`📡 Generated ${queryVariants.length} query variants for disambiguation`);

    const ciaResults: CIAScanResult[] = [];
    
    // Execute scans with each query variant
    for (const variant of queryVariants) {
      try {
        console.log(`🔍 Executing: ${variant.query_text} (${variant.query_type})`);
        
        const variantResults = await this.executeSingleQueryScan(
          variant,
          entityFingerprint,
          options
        );
        
        ciaResults.push(...variantResults);
        
        // Log query execution for tracking
        await AdvancedEntityMatcher.logQueryExecution(
          entityFingerprint.id,
          variant,
          'multi-platform',
          variantResults.length,
          variantResults.filter(r => r.match_decision === 'accepted').length,
          variantResults.reduce((sum, r) => sum + r.match_score, 0) / variantResults.length || 0
        );
        
      } catch (error) {
        console.error(`❌ Query variant failed: ${variant.query_text}`, error);
      }
    }

    // Remove duplicates based on URL and content similarity
    const deduplicatedResults = this.deduplicateResults(ciaResults);
    
    console.log(`✅ CIA Scan Complete: ${deduplicatedResults.length} precision results`);
    this.logPrecisionSummary(deduplicatedResults);
    
    return deduplicatedResults;
  }

  /**
   * Execute scan with single query variant
   */
  private static async executeSingleQueryScan(
    variant: any,
    fingerprint: AdvancedEntityFingerprint,
    options: CIAScanOptions
  ): Promise<CIAScanResult[]> {
    const scanFunctions = [
      'reddit-scan',
      'uk-news-scanner', 
      'enhanced-intelligence'
    ];

    const results: CIAScanResult[] = [];
    
    for (const func of scanFunctions) {
      try {
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'cia_precision_scan',
            search_query: variant.query_text,
            entity: fingerprint.primary_name,
            blockMockData: true,
            blockSimulations: true,
            enforceLiveOnly: true,
            precisionMode: options.precisionMode || 'high'
          }
        });

        if (!error && data?.results) {
          const processedResults = await this.processRawResults(
            data.results,
            variant,
            fingerprint,
            func
          );
          
          results.push(...processedResults);
        }
      } catch (error) {
        console.error(`❌ ${func} failed for variant: ${variant.query_text}`, error);
      }
    }

    return results;
  }

  /**
   * Process raw scan results through CIA-level analysis
   */
  private static async processRawResults(
    rawResults: any[],
    variant: any,
    fingerprint: AdvancedEntityFingerprint,
    platform: string
  ): Promise<CIAScanResult[]> {
    const processedResults: CIAScanResult[] = [];

    for (const result of rawResults) {
      const content = result.content || result.contextSnippet || '';
      const title = result.title || '';
      
      // Apply CIA-level entity matching
      const matchDecision = AdvancedEntityMatcher.analyzeContentMatch(
        content,
        title,
        fingerprint
      );

      // Only proceed if not rejected for false positive
      if (matchDecision.decision !== 'rejected' || !matchDecision.false_positive_detected) {
        const ciaResult: CIAScanResult = {
          id: result.id || `cia-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          platform: result.platform || platform,
          content: content,
          url: result.url || result.sourceUrl || '',
          severity: result.severity || 'medium',
          status: result.status || 'new',
          threat_type: result.threat_type || 'cia_intelligence',
          sentiment: result.sentiment || 0,
          confidence_score: matchDecision.match_score * 100,
          potential_reach: result.potential_reach || 0,
          detected_entities: [fingerprint.primary_name],
          source_type: 'cia_verified_intelligence',
          entity_name: fingerprint.primary_name,
          source_credibility_score: 85,
          media_is_ai_generated: false,
          ai_detection_confidence: 0,
          
          // CIA-specific fields
          match_decision: matchDecision.decision,
          match_score: matchDecision.match_score,
          precision_confidence: matchDecision.match_score >= 0.8 ? 'high' : 
                               matchDecision.match_score >= 0.6 ? 'medium' : 'low',
          false_positive_detected: matchDecision.false_positive_detected,
          context_matches: matchDecision.context_matches,
          query_variant_used: variant.query_text
        };

        processedResults.push(ciaResult);

        // Log match decision for audit trail
        await AdvancedEntityMatcher.logMatchDecision(
          variant.id,
          matchDecision,
          ciaResult.url
        );
      }
    }

    return processedResults;
  }

  /**
   * Get or create default entity fingerprint for target
   * Fixed to generate proper entity_id and handle creation properly
   */
  private static async getOrCreateDefaultFingerprint(entityName: string): Promise<AdvancedEntityFingerprint> {
    // First try to find existing fingerprint
    const existing = await AdvancedEntityMatcher.getEntityFingerprint(entityName);
    if (existing) {
      return existing;
    }

    // Create default fingerprint for the entity
    const entityId = `entity_${entityName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
    
    const defaultFingerprint = {
      entity_id: entityId,
      primary_name: entityName,
      aliases: [
        entityName.split(' ')[0] + ' ' + entityName.split(' ')[1]?.charAt(0) + '.',
        entityName.split(' ').map(n => n.charAt(0)).join('. '), 
        `@${entityName.toLowerCase().replace(/\s+/g, '')}`,
        entityName.replace(/\s+/g, '')
      ].filter(alias => alias.length > 2), // Remove very short aliases
      organization: 'Unknown',
      locations: ['UK', 'United Kingdom'],
      context_tags: [
        'fraud', 'arrest', 'bench warrant', 'investigation',
        'criminal', 'lawsuit', 'allegations', 'misconduct'
      ],
      false_positive_blocklist: [
        'lindsay lohan', 'simon cowell', 'lindsay graham',
        'simon pegg', 'lindsay fox', 'simon baker'
      ]
    };

    try {
      const fingerprintId = await AdvancedEntityMatcher.createEntityFingerprint(defaultFingerprint);
      
      return {
        id: fingerprintId,
        ...defaultFingerprint
      };
    } catch (error) {
      console.error('Failed to create entity fingerprint, using temporary one:', error);
      // Return a temporary fingerprint if database creation fails
      return {
        id: `temp_${Date.now()}`,
        ...defaultFingerprint
      };
    }
  }

  /**
   * Remove duplicate results based on URL and content similarity
   */
  private static deduplicateResults(results: CIAScanResult[]): CIAScanResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.url}-${result.content.substring(0, 100)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Log precision summary for monitoring
   */
  private static logPrecisionSummary(results: CIAScanResult[]): void {
    const summary = {
      total: results.length,
      accepted: results.filter(r => r.match_decision === 'accepted').length,
      quarantined: results.filter(r => r.match_decision === 'quarantined').length,
      rejected: results.filter(r => r.match_decision === 'rejected').length,
      high_confidence: results.filter(r => r.precision_confidence === 'high').length,
      false_positives_blocked: results.filter(r => r.false_positive_detected).length,
      avg_match_score: results.reduce((sum, r) => sum + r.match_score, 0) / results.length || 0
    };

    console.log('📊 CIA Precision Summary:', summary);
  }
}
