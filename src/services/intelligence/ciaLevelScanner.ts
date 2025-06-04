
import { supabase } from '@/integrations/supabase/client';
import { AdvancedEntityMatcher, type AdvancedEntityFingerprint } from './advancedEntityMatcher';

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
}

export class CIALevelScanner {
  /**
   * Check if content actually contains the target entity
   */
  private static containsEntityReference(content: string, title: string, entityName: string): boolean {
    const fullText = `${title} ${content}`.toLowerCase();
    const targetName = entityName.toLowerCase().trim();
    
    // Check for exact name match
    if (fullText.includes(targetName)) {
      console.log(`✅ Found exact match for "${targetName}" in content`);
      return true;
    }
    
    // Check for name variations (first name, last name)
    const nameParts = targetName.split(' ').filter(part => part.length > 1);
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      // Both first and last name must be present
      if (fullText.includes(firstName) && fullText.includes(lastName)) {
        console.log(`✅ Found name parts "${firstName}" and "${lastName}" in content`);
        return true;
      }
    }
    
    console.log(`❌ No entity reference found for "${targetName}" in content: "${fullText.substring(0, 100)}..."`);
    return false;
  }

  /**
   * Calculate relevance score based on entity presence and context
   */
  private static calculateRelevanceScore(content: string, title: string, entityName: string): number {
    const fullText = `${title} ${content}`.toLowerCase();
    const targetName = entityName.toLowerCase().trim();
    
    let score = 0;
    
    // Exact name match gets highest score
    if (fullText.includes(targetName)) {
      score += 0.8;
      
      // Count occurrences for additional relevance
      const occurrences = (fullText.match(new RegExp(targetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      score += Math.min(occurrences * 0.1, 0.2);
    }
    
    // Check for relevant context keywords
    const contextKeywords = ['fraud', 'arrest', 'warrant', 'investigation', 'lawsuit', 'criminal', 'allegations'];
    const foundContexts = contextKeywords.filter(keyword => fullText.includes(keyword));
    if (foundContexts.length > 0) {
      score += foundContexts.length * 0.05;
      console.log(`📝 Found context keywords: ${foundContexts.join(', ')}`);
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Execute CIA-level precision scan with enhanced filtering
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    const entityName = options.targetEntity;
    console.log(`🎯 CIA Scanner: Starting precision scan for "${entityName}"`);

    if (!entityName || entityName === 'undefined' || entityName.trim() === '') {
      console.error('❌ CIA Scanner: No valid entity name provided');
      return [];
    }

    // Set precision thresholds based on mode
    const precisionThresholds = {
      high: { accept: 0.75, quarantine: 0.60 },
      medium: { accept: 0.65, quarantine: 0.45 },
      low: { accept: 0.50, quarantine: 0.35 }
    };

    const thresholds = precisionThresholds[options.precisionMode || 'high'];
    console.log(`🎯 CIA Scanner: Using ${options.precisionMode || 'high'} precision mode`, thresholds);

    // Execute scans
    const scanFunctions = ['reddit-scan', 'uk-news-scanner'];
    const allResults: CIAScanResult[] = [];

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

        // Apply strict entity relevance filtering
        for (const result of data.results) {
          const content = result.content || '';
          const title = result.title || '';
          
          // First check: Does this content actually mention our entity?
          if (!this.containsEntityReference(content, title, entityName)) {
            console.log(`🚫 CIA Scanner: REJECTED - No entity reference in "${title}"`);
            continue;
          }
          
          // Calculate relevance score
          const relevanceScore = this.calculateRelevanceScore(content, title, entityName);
          
          if (relevanceScore < 0.4) {
            console.log(`🚫 CIA Scanner: REJECTED - Low relevance score (${relevanceScore.toFixed(2)}) for "${title}"`);
            continue;
          }

          // Determine match decision based on relevance
          let finalDecision: 'accepted' | 'quarantined' | 'rejected';
          let confidenceScore = Math.round(relevanceScore * 100);

          if (relevanceScore >= thresholds.accept) {
            finalDecision = 'accepted';
            console.log(`✅ CIA Scanner: ACCEPTED - High relevance (${confidenceScore}%) for "${title}"`);
          } else if (relevanceScore >= thresholds.quarantine) {
            finalDecision = 'quarantined';
            console.log(`⚠️ CIA Scanner: QUARANTINED - Medium relevance (${confidenceScore}%) for "${title}"`);
          } else {
            finalDecision = 'rejected';
            console.log(`❌ CIA Scanner: REJECTED - Low relevance (${confidenceScore}%) for "${title}"`);
            continue;
          }

          // Determine match type based on score
          let matchType = 'unknown';
          if (relevanceScore >= 0.9) {
            matchType = 'exact';
          } else if (relevanceScore >= 0.7) {
            matchType = 'high_confidence';
          } else if (relevanceScore >= 0.5) {
            matchType = 'contextual';
          } else {
            matchType = 'low_confidence';
          }

          const ciaResult: CIAScanResult = {
            id: result.id || `cia-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            platform: result.platform || func,
            content: content,
            url: result.url || '',
            match_score: relevanceScore,
            match_decision: finalDecision,
            false_positive_detected: false,
            confidence_score: confidenceScore,
            match_type: matchType,
            source_type: 'cia_verified'
          };

          allResults.push(ciaResult);
        }

      } catch (error) {
        console.error(`❌ CIA Scanner: Error processing ${func}:`, error);
      }
    }

    // Calculate final statistics
    const stats = {
      total: allResults.length,
      accepted: allResults.filter(r => r.match_decision === 'accepted').length,
      quarantined: allResults.filter(r => r.match_decision === 'quarantined').length,
      rejected: allResults.filter(r => r.match_decision === 'rejected').length,
      false_positives: allResults.filter(r => r.false_positive_detected).length
    };

    console.log(`📊 CIA Scanner: Final Results for "${entityName}":`, {
      ...stats,
      precision: stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) + '%' : '0%'
    });

    // Only return accepted and quarantined results
    const validResults = allResults.filter(r => 
      r.match_decision === 'accepted' || r.match_decision === 'quarantined'
    );

    // Insert valid results into database with CIA verification marker
    if (validResults.length > 0) {
      try {
        const dbInserts = validResults.map(result => ({
          platform: result.platform,
          content: result.content,
          url: result.url,
          severity: result.match_decision === 'accepted' ? 'medium' : 'low',
          sentiment: Math.random() * 0.4 - 0.2, // Random sentiment for now
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
}
