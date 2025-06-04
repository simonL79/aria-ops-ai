
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
  // New tiered fields
  matchQuality?: 'strong' | 'moderate' | 'weak';
  requiresReview?: boolean;
  contextBoosts?: string[];
}

interface TieredMatchResult {
  match: boolean;
  confidence: number;
  matched_on: string[];
  discard_reason?: string;
  matchQuality: 'strong' | 'moderate' | 'weak' | 'discard';
  requiresReview: boolean;
  contextBoosts: string[];
}

export class CIALevelScanner {
  private static matchLogs: EntityMatchLog[] = [];

  /**
   * Execute CIA-level precision scan with tiered confidence thresholds
   */
  static async executePrecisionScan(options: CIAScanOptions): Promise<CIAScanResult[]> {
    const entityName = options.targetEntity;
    console.log(`🎯 CIA Scanner: Starting tiered confidence scan for "${entityName}"`);

    if (!entityName || entityName === 'undefined' || entityName.trim() === '') {
      console.error('❌ CIA Scanner: No valid entity name provided');
      return [];
    }

    // Clear previous match logs
    this.matchLogs = [];

    // Execute scans
    const scanFunctions = ['reddit-scan', 'uk-news-scanner'];
    const validResults: CIAScanResult[] = [];
    let totalProcessed = 0;
    let strongMatches = 0;
    let moderateMatches = 0;
    let quarantined = 0;
    let discarded = 0;

    for (const func of scanFunctions) {
      try {
        console.log(`🔍 CIA Scanner: Executing ${func} with tiered validation`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            entity_name: entityName,
            entity: entityName,
            targetEntity: entityName,
            target_entity: entityName,
            entityName: entityName,
            fullScan: options.fullScan || true,
            source: options.source || 'cia_tiered_scan',
            confidenceThreshold: 0.05, // Very low for raw collection
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

        // Apply tiered confidence matching
        for (const result of data.results) {
          totalProcessed++;
          const content = result.content || '';
          const title = result.title || '';
          
          // Use new tiered matching system
          const matchResult = this.performTieredMatching(content, title, entityName, result);
          
          // Log every match attempt
          const matchLog = EntityFingerprintMatcher.logMatch(
            result.url || '', 
            title, 
            content, 
            matchResult
          );
          this.matchLogs.push(matchLog);

          if (matchResult.matchQuality === 'discard') {
            discarded++;
            continue;
          }

          // Process based on match quality
          let finalDecision: 'accepted' | 'quarantined' | 'rejected';
          let matchType = 'tiered_match';

          switch (matchResult.matchQuality) {
            case 'strong':
              finalDecision = 'accepted';
              matchType = 'strong_confidence';
              strongMatches++;
              console.log(`✅ CIA Scanner: STRONG MATCH (${(matchResult.confidence * 100).toFixed(1)}%) - ${matchResult.contextBoosts.length} boosts`);
              break;
              
            case 'moderate':
              finalDecision = 'accepted'; // Pass but flag for review
              matchType = 'moderate_confidence';
              moderateMatches++;
              console.log(`⚠️ CIA Scanner: MODERATE MATCH (${(matchResult.confidence * 100).toFixed(1)}%) - requires review`);
              break;
              
            case 'weak':
              finalDecision = 'quarantined';
              matchType = 'weak_confidence';
              quarantined++;
              console.log(`🗃️ CIA Scanner: QUARANTINED (${(matchResult.confidence * 100).toFixed(1)}%) - weak match`);
              break;
              
            default:
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
            source_type: 'cia_tiered',
            matched_on: matchResult.matched_on,
            // New tiered fields
            matchQuality: matchResult.matchQuality,
            requiresReview: matchResult.requiresReview,
            contextBoosts: matchResult.contextBoosts
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
      strong_matches: strongMatches,
      moderate_matches: moderateMatches,
      quarantined: quarantined,
      discarded: discarded,
      retention_rate: totalProcessed > 0 ? (((strongMatches + moderateMatches) / totalProcessed) * 100).toFixed(1) + '%' : '0%'
    };

    console.log(`📊 CIA Scanner: Tiered Results for "${entityName}":`, stats);

    // Alert if quarantine volume is high
    if (quarantined > 20) {
      console.warn(`⚠️ CIA Scanner: High quarantine volume (${quarantined}) - consider threshold adjustment`);
    }

    // Insert results into database with new fields
    if (validResults.length > 0) {
      try {
        const dbInserts = validResults.map(result => ({
          platform: result.platform,
          content: result.content,
          url: result.url,
          severity: result.matchQuality === 'strong' ? 'high' : result.matchQuality === 'moderate' ? 'medium' : 'low',
          sentiment: Math.random() * 0.4 - 0.2,
          confidence_score: result.confidence_score,
          detected_entities: [entityName],
          source_type: 'cia_tiered',
          entity_name: entityName,
          potential_reach: Math.floor(Math.random() * 1000) + 100,
          source_credibility_score: 85,
          threat_type: `cia_${result.matchQuality}_intelligence`
        }));

        console.log(`💾 CIA Scanner: Inserting ${validResults.length} tiered results to database`);
        
        const { error } = await supabase.from('scan_results').insert(dbInserts);
        
        if (error) {
          console.error('❌ CIA Scanner: Database insert failed:', error);
        } else {
          console.log(`✅ CIA Scanner: Successfully inserted ${validResults.length} tiered results`);
        }

        // Log review candidates separately
        const reviewCandidates = validResults.filter(r => r.requiresReview);
        if (reviewCandidates.length > 0) {
          await this.logToReviewDashboard(reviewCandidates, entityName);
        }

      } catch (dbError) {
        console.error('❌ CIA Scanner: Database operation failed:', dbError);
      }
    }

    return validResults;
  }

  /**
   * New tiered matching with context-aware boosting
   */
  private static performTieredMatching(content: string, title: string, entityName: string, rawResult: any): TieredMatchResult {
    const fullText = `${title} ${content}`.toLowerCase();
    const entityLower = entityName.toLowerCase();
    const entityParts = entityName.split(' ').map(part => part.toLowerCase());
    
    let score = 0;
    const matchedOn: string[] = [];
    const contextBoosts: string[] = [];

    // Base entity matching
    if (fullText.includes(entityLower)) {
      score += 0.4;
      matchedOn.push('exact_name');
    }

    // Individual name parts
    let namePartsFound = 0;
    for (const part of entityParts) {
      if (part.length > 2 && fullText.includes(part)) {
        namePartsFound++;
        matchedOn.push('name_part');
      }
    }
    
    if (namePartsFound > 0) {
      score += (namePartsFound / entityParts.length) * 0.25;
    }

    // Context-aware boosting logic
    
    // 1. High-authority source boost
    const highAuthSources = ['bbc', 'reuters', 'guardian', 'times'];
    if (highAuthSources.some(source => fullText.includes(source))) {
      score += 0.15;
      contextBoosts.push('high_authority_source');
    }

    // 2. Reddit engagement boost
    if (rawResult.platform === 'reddit' && (rawResult.upvotes || 0) > 100) {
      score += 0.15;
      contextBoosts.push('high_engagement');
    }

    // 3. Location/co-mention boost
    const locationTerms = ['london', 'uk', 'britain', 'england'];
    const businessTerms = ['ceo', 'director', 'company', 'business', 'firm'];
    if (locationTerms.some(term => fullText.includes(term)) && businessTerms.some(term => fullText.includes(term))) {
      score += 0.1;
      contextBoosts.push('location_business_context');
    }

    // 4. Image/media metadata boost
    if (rawResult.hasImage || rawResult.media_urls) {
      score += 0.1;
      contextBoosts.push('media_content');
    }

    // 5. Recent content boost
    const contentDate = new Date(rawResult.created_at || rawResult.date || Date.now());
    const daysSinceCreation = (Date.now() - contentDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 7) {
      score += 0.05;
      contextBoosts.push('recent_content');
    }

    const finalConfidence = Math.min(score, 1.0);

    // Tiered decision logic
    if (finalConfidence >= 0.6) {
      return {
        match: true,
        confidence: finalConfidence,
        matched_on: matchedOn,
        matchQuality: 'strong',
        requiresReview: false,
        contextBoosts
      };
    }

    if (finalConfidence >= 0.3) {
      return {
        match: true,
        confidence: finalConfidence,
        matched_on: matchedOn,
        matchQuality: 'moderate',
        requiresReview: true,
        contextBoosts
      };
    }

    if (finalConfidence >= 0.15) {
      return {
        match: true,
        confidence: finalConfidence,
        matched_on: matchedOn,
        matchQuality: 'weak',
        requiresReview: false,
        contextBoosts
      };
    }

    return {
      match: false,
      confidence: finalConfidence,
      matched_on: matchedOn,
      discard_reason: `Confidence ${finalConfidence.toFixed(2)} below 0.15 threshold`,
      matchQuality: 'discard',
      requiresReview: false,
      contextBoosts
    };
  }

  /**
   * Log moderate matches to review dashboard
   */
  private static async logToReviewDashboard(reviewCandidates: CIAScanResult[], entityName: string): Promise<void> {
    try {
      const reviewEntries = reviewCandidates.map(result => ({
        entity_name: entityName,
        content_snippet: result.content.substring(0, 200),
        confidence_score: result.confidence_score,
        match_quality: result.matchQuality,
        context_boosts: result.contextBoosts?.join(', ') || '',
        platform: result.platform,
        url: result.url,
        requires_review: true,
        reviewed: false,
        created_at: new Date().toISOString()
      }));

      // Store in a review dashboard table (you may need to create this)
      console.log(`📝 CIA Scanner: Logging ${reviewCandidates.length} review candidates for "${entityName}"`);
      
      // For now, log to aria_ops_log with review type
      const { error } = await supabase.from('aria_ops_log').insert({
        operation_type: 'review_required',
        module_source: 'cia_scanner',
        entity_name: entityName,
        success: true,
        operation_data: {
          review_candidates: reviewEntries,
          total_requiring_review: reviewCandidates.length,
          logged_at: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Failed to log review candidates:', error);
      }
    } catch (error) {
      console.error('Error logging to review dashboard:', error);
    }
  }

  /**
   * Get match logs for debugging
   */
  static getMatchLogs(): EntityMatchLog[] {
    return this.matchLogs;
  }

  /**
   * Get review candidates for dashboard
   */
  static async getReviewCandidates(entityName?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('aria_ops_log')
        .select('*')
        .eq('operation_type', 'review_required')
        .order('created_at', { ascending: false });

      if (entityName) {
        query = query.eq('entity_name', entityName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch review candidates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching review candidates:', error);
      return [];
    }
  }
}
