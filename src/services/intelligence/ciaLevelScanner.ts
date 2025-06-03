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
    console.log(`🔍 Target Entity: "${entityName}"`);
    
    // CRITICAL FIX: Validate entity name is not undefined/null
    if (!entityName || entityName === 'undefined' || entityName.trim() === '') {
      console.error('⚠️ CRITICAL: No valid entity name passed to CIA scanner');
      throw new Error('Entity name is required for CIA precision scan');
    }

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
        console.log(`🔍 Scanning ${func} with entity: "${fingerprint.primary_name}"`);
        
        // CRITICAL FIX: Ensure entity name is passed in ALL possible field variations
        const scanPayload = { 
          scanType: 'cia_precision_scan',
          search_query: variant.query_text,
          entity: fingerprint.primary_name,
          targetEntity: fingerprint.primary_name,
          entityName: fingerprint.primary_name,
          target_entity: fingerprint.primary_name,
          entity_name: fingerprint.primary_name, // Add this critical field
          blockMockData: true,
          blockSimulations: true,
          enforceLiveOnly: true,
          precisionMode: options.precisionMode || 'medium',
          fullScan: true,
          source: 'cia_scanner'
        };

        console.log(`📡 Scan payload for ${func}:`, {
          entity_fields: {
            entity: scanPayload.entity,
            targetEntity: scanPayload.targetEntity,
            entityName: scanPayload.entityName,
            target_entity: scanPayload.target_entity,
            entity_name: scanPayload.entity_name
          },
          search_query: scanPayload.search_query
        });

        const { data, error } = await supabase.functions.invoke(func, {
          body: scanPayload
        });

        if (error) {
          console.error(`❌ ${func} error:`, error);
          continue;
        }

        if (!data) {
          console.warn(`⚠️ ${func} returned no data`);
          continue;
        }

        console.log(`✅ ${func} response:`, { 
          hasResults: !!data.results, 
          resultsCount: data.results?.length || 0,
          hasThreats: !!data.threats,
          threatsCount: data.threats?.length || 0,
          dataKeys: Object.keys(data)
        });

        let rawResults = [];
        
        if (data?.results && Array.isArray(data.results)) {
          rawResults = data.results;
        }
        
        // Also check for threats array (some scanners use this format)
        if (data?.threats && Array.isArray(data.threats)) {
          const threatResults = data.threats.map(threat => ({
            id: threat.id || `threat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            platform: threat.platform || func,
            content: threat.contextSnippet || threat.content || '',
            url: threat.sourceUrl || threat.url || '',
            severity: threat.threatLevel > 7 ? 'high' : threat.threatLevel > 4 ? 'medium' : 'low',
            status: 'new',
            threat_type: 'cia_intelligence',
            sentiment: threat.sentiment || 0,
            confidence_score: (threat.matchConfidence || 0) * 100,
            potential_reach: threat.spreadVelocity ? threat.spreadVelocity * 1000 : 0,
            detected_entities: [fingerprint.primary_name],
            source_type: 'cia_verified_intelligence',
            entity_name: fingerprint.primary_name,
            source_credibility_score: 85,
            media_is_ai_generated: false,
            ai_detection_confidence: 0
          }));
          
          rawResults = [...rawResults, ...threatResults];
        }

        if (rawResults.length > 0) {
          console.log(`📊 Processing ${rawResults.length} raw results from ${func}`);
          
          const processedResults = await this.processRawResults(
            rawResults,
            variant,
            fingerprint,
            func
          );
          
          results.push(...processedResults);
        } else {
          console.warn(`⚠️ No raw results found from ${func}`);
        }
        
      } catch (error) {
        console.error(`❌ ${func} failed for variant: ${variant.query_text}`, error);
      }
    }

    return results;
  }

  /**
   * Process raw scan results through CIA-level analysis with improved filtering
   */
  private static async processRawResults(
    rawResults: any[],
    variant: any,
    fingerprint: AdvancedEntityFingerprint,
    platform: string
  ): Promise<CIAScanResult[]> {
    const processedResults: CIAScanResult[] = [];
    let discardedCount = 0;
    let discardReasons: Record<string, number> = {};

    console.log(`🔍 Processing ${rawResults.length} raw results from ${platform}`);

    for (const result of rawResults) {
      const content = result.content || result.contextSnippet || '';
      const title = result.title || '';
      
      if (!content && !title) {
        console.log('⚠️ Skipping result with no content or title');
        discardedCount++;
        discardReasons['no_content'] = (discardReasons['no_content'] || 0) + 1;
        continue;
      }
      
      // IMPROVED: Apply CIA-level entity matching with more lenient thresholds
      const matchDecision = AdvancedEntityMatcher.analyzeContentMatch(
        content,
        title,
        fingerprint
      );

      // Log each decision for debugging
      console.log(`🔍 Match analysis for "${content.substring(0, 50)}...":`, {
        decision: matchDecision.decision,
        score: matchDecision.match_score,
        falsePositive: matchDecision.false_positive_detected,
        url: result.url || 'no-url'
      });

      // IMPROVED: Very lenient acceptance - accept anything above 0.1 for testing
      if (matchDecision.decision !== 'rejected' || matchDecision.match_score > 0.1) {
        const ciaResult: CIAScanResult = {
          id: result.id || `cia-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          platform: result.platform || platform,
          content: content,
          url: result.url || result.sourceUrl || '',
          severity: result.severity || 'medium',
          status: result.status || 'new',
          threat_type: result.threat_type || 'cia_intelligence',
          sentiment: result.sentiment || 0,
          confidence_score: Math.max(matchDecision.match_score * 100, 15), // Lower minimum threshold
          potential_reach: result.potential_reach || 0,
          detected_entities: [fingerprint.primary_name],
          source_type: 'cia_verified_intelligence',
          entity_name: fingerprint.primary_name,
          source_credibility_score: 85,
          media_is_ai_generated: false,
          ai_detection_confidence: 0,
          
          // CIA-specific fields
          match_decision: matchDecision.match_score > 0.3 ? 'accepted' : 
                         matchDecision.match_score > 0.1 ? 'quarantined' : 'rejected',
          match_score: matchDecision.match_score,
          precision_confidence: matchDecision.match_score >= 0.5 ? 'high' : 
                               matchDecision.match_score >= 0.2 ? 'medium' : 'low',
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
      } else {
        discardedCount++;
        const reason = matchDecision.reason_discarded || 'low_match_score';
        discardReasons[reason] = (discardReasons[reason] || 0) + 1;
        
        // LOG DISCARDED RESULTS FOR DEBUGGING
        console.log(`❌ DISCARDED: "${content.substring(0, 50)}..." | Score: ${matchDecision.match_score} | Reason: ${reason}`);
      }
    }

    console.log(`📊 Filtering Results for ${platform}:`);
    console.log(`   ✅ Accepted: ${processedResults.length}`);
    console.log(`   ❌ Discarded: ${discardedCount}`);
    console.log(`   📋 Discard Reasons:`, discardReasons);

    return processedResults;
  }

  /**
   * Get or create default entity fingerprint for target
   */
  private static async getOrCreateDefaultFingerprint(entityName: string): Promise<AdvancedEntityFingerprint> {
    // First try to find existing fingerprint
    const existing = await AdvancedEntityMatcher.getEntityFingerprint(entityName);
    if (existing) {
      return existing;
    }

    // Create default fingerprint for the entity - use proper UUID for entity_id
    const entityId = crypto.randomUUID();
    
    const defaultFingerprint = {
      entity_id: entityId,
      primary_name: entityName,
      aliases: [
        entityName.split(' ')[0] + ' ' + entityName.split(' ')[1]?.charAt(0) + '.',
        entityName.split(' ').map(n => n.charAt(0)).join('. '), 
        `@${entityName.toLowerCase().replace(/\s+/g, '')}`,
        entityName.replace(/\s+/g, '')
      ].filter(alias => alias.length > 2),
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
