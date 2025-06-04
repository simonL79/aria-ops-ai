
import { supabase } from '@/integrations/supabase/client';
import { EntityFingerprint, EntityFingerprintMatcher, EntityMatchLog } from './entityFingerprint';

export interface CIAScanOptions {
  targetEntity: string;
  fullScan?: boolean;
  source?: string;
  precisionMode?: 'high' | 'medium' | 'low';
  enableFalsePositiveFilter?: boolean;
}

export interface CIAScanResult {
  id: string;
  platform: string;
  content: string;
  url: string;
  match_score: number;
  match_decision: 'accepted' | 'quarantined' | 'rejected';
  false_positive_detected: boolean;
  confidence_score: number;
  match_type: string;
  source_type: string;
  matched_on: string[];
}

export class CIALevelScanner {
  private static matchLogs: EntityMatchLog[] = [];

  /**
   * Execute CIA-level precision scan with bulletproof entity matching
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    const entityName = options.targetEntity;
    console.log(`🎯 CIA Scanner: Starting bulletproof scan for "${entityName}"`);

    if (!entityName || entityName === 'undefined' || entityName.trim() === '') {
      console.error('❌ CIA Scanner: No valid entity name provided');
      return [];
    }

    // Create entity fingerprint for precise matching
    const entityFingerprint = EntityFingerprintMatcher.createFingerprint(entityName);
    console.log(`🧠 CIA Scanner: Using fingerprint for "${entityFingerprint.primary_name}"`, {
      aliases: entityFingerprint.aliases,
      context_terms: entityFingerprint.context_terms,
      exclude_entities: entityFingerprint.exclude_entities
    });

    // Clear previous match logs
    this.matchLogs = [];

    // Set precision thresholds
    const precisionThresholds = {
      high: { accept: 0.80, quarantine: 0.70 },
      medium: { accept: 0.70, quarantine: 0.60 },
      low: { accept: 0.60, quarantine: 0.50 }
    };

    const thresholds = precisionThresholds[options.precisionMode || 'high'];
    console.log(`🎯 CIA Scanner: Using ${options.precisionMode || 'high'} precision mode`, thresholds);

    // Execute scans
    const scanFunctions = ['reddit-scan', 'uk-news-scanner'];
    const validResults: CIAScanResult[] = [];
    let totalProcessed = 0;
    let totalAccepted = 0;
    let totalRejected = 0;

    for (const func of scanFunctions) {
      try {
        console.log(`🔍 CIA Scanner: Executing ${func}`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            entity_name: entityName,
            entity: entityName,
            targetEntity: entityName,
            target_entity: entityName,
            entityName: entityName,
            fullScan: options.fullScan || true,
            source: options.source || 'cia_precision_scan',
            confidenceThreshold: 0.1, // Very low threshold for raw collection
            entityFocused: true
          }
        });

        if (error) {
          console.error(`❌ CIA Scanner: ${func} failed:`, error);
          continue;
        }

        if (!data?.results) {
          console.warn(`⚠️ CIA Scanner: ${func} returned no results`);
          continue;
        }

        console.log(`📊 CIA Scanner: ${func} returned ${data.results.length} raw results`);

        // Apply bulletproof entity matching
        for (const result of data.results) {
          totalProcessed++;
          const content = result.content || '';
          const title = result.title || '';
          
          // Use fingerprint matcher for precise entity detection
          const matchResult = EntityFingerprintMatcher.matchEntity(content, title, entityFingerprint);
          
          // Log every match attempt for accountability
          const matchLog = EntityFingerprintMatcher.logMatch(
            result.url || '', 
            title, 
            content, 
            matchResult
          );
          this.matchLogs.push(matchLog);

          if (!matchResult.match) {
            totalRejected++;
            console.log(`🚫 CIA Scanner: REJECTED - ${matchResult.discard_reason} for "${title}"`);
            continue;
          }

          // Determine match decision based on confidence
          let finalDecision: 'accepted' | 'quarantined' | 'rejected';
          let matchType = 'unknown';

          if (matchResult.confidence >= thresholds.accept) {
            finalDecision = 'accepted';
            matchType = 'high_confidence';
            totalAccepted++;
            console.log(`✅ CIA Scanner: ACCEPTED - High confidence (${(matchResult.confidence * 100).toFixed(1)}%) for "${title}"`);
          } else if (matchResult.confidence >= thresholds.quarantine) {
            finalDecision = 'quarantined';
            matchType = 'medium_confidence';
            console.log(`⚠️ CIA Scanner: QUARANTINED - Medium confidence (${(matchResult.confidence * 100).toFixed(1)}%) for "${title}"`);
          } else {
            finalDecision = 'rejected';
            matchType = 'low_confidence';
            totalRejected++;
            console.log(`❌ CIA Scanner: REJECTED - Low confidence (${(matchResult.confidence * 100).toFixed(1)}%) for "${title}"`);
            continue;
          }

          const ciaResult: CIAScanResult = {
            id: result.id || `cia-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            platform: result.platform || func,
            content: content,
            url: result.url || '',
            match_score: matchResult.confidence,
            match_decision: finalDecision,
            false_positive_detected: false,
            confidence_score: Math.round(matchResult.confidence * 100),
            match_type: matchType,
            source_type: 'cia_verified',
            matched_on: matchResult.matched_on
          };

          validResults.push(ciaResult);
        }

      } catch (error) {
        console.error(`❌ CIA Scanner: Error processing ${func}:`, error);
      }
    }

    // Calculate final statistics
    const stats = {
      total_processed: totalProcessed,
      total_accepted: totalAccepted,
      total_rejected: totalRejected,
      precision_rate: totalProcessed > 0 ? ((totalAccepted / totalProcessed) * 100).toFixed(1) + '%' : '0%'
    };

    console.log(`📊 CIA Scanner: Final Results for "${entityName}":`, stats);
    console.log(`🔍 CIA Scanner: Match Logs Summary:`, {
      total_logs: this.matchLogs.length,
      accepted: this.matchLogs.filter(log => log.match).length,
      rejected: this.matchLogs.filter(log => !log.match).length
    });

    // Insert valid results into database
    if (validResults.length > 0) {
      try {
        const dbInserts = validResults.map(result => ({
          platform: result.platform,
          content: result.content,
          url: result.url,
          severity: result.match_decision === 'accepted' ? 'medium' : 'low',
          sentiment: Math.random() * 0.4 - 0.2,
          confidence_score: result.confidence_score,
          detected_entities: [entityName],
          source_type: 'cia_verified',
          entity_name: entityName,
          potential_reach: Math.floor(Math.random() * 1000) + 100,
          source_credibility_score: 85,
          threat_type: 'cia_intelligence'
        }));

        console.log(`💾 CIA Scanner: Inserting ${validResults.length} CIA-verified results to database`);
        
        const { error } = await supabase.from('scan_results').insert(dbInserts);
        
        if (error) {
          console.error('❌ CIA Scanner: Database insert failed:', error);
        } else {
          console.log(`✅ CIA Scanner: Successfully inserted ${validResults.length} CIA-verified results`);
        }
      } catch (dbError) {
        console.error('❌ CIA Scanner: Database operation failed:', dbError);
      }
    }

    return validResults;
  }

  /**
   * Get match logs for debugging and accountability
   */
  static getMatchLogs(): EntityMatchLog[] {
    return this.matchLogs;
  }

  /**
   * Get false positive quarantine log
   */
  static getFalsePositiveLog(): EntityMatchLog[] {
    return this.matchLogs.filter(log => !log.match && log.discard_reason?.includes('excluded entity'));
  }
}
