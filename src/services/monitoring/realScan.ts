
import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import type { ScanOptions, LiveScanResult } from '@/types/scan';
import { 
  generateEnhancedEntityFingerprint, 
  filterWithConfidenceThreshold, 
  generateExpandedSearchQueries,
  logEnhancedFilteringStats,
  type EnhancedEntityFingerprint 
} from './enhancedEntityMatcher';

/**
 * ENHANCED A.R.I.A™ LIVE OSINT SCANNING - HIGH RECALL, HIGH PRECISION
 * Broad-then-filtered approach with layered confidence scoring
 */

/**
 * Log scanner queries for debugging and audit trail
 */
async function logScannerQuery(
  entityName: string,
  searchTerms: string[],
  platform: string,
  totalResults: number,
  matchedResults: number,
  stats: any
): Promise<void> {
  try {
    const { error } = await supabase.from('scanner_query_log').insert({
      entity_name: entityName,
      search_terms: searchTerms,
      platform: platform,
      total_results_returned: totalResults,
      results_matched_entity: matchedResults,
      executed_at: new Date().toISOString()
    });
    
    if (error) {
      console.error('Failed to log scanner query:', error);
    }
  } catch (error) {
    console.error('Failed to log scanner query:', error);
  }
}

/**
 * Perform enhanced real OSINT scan with layered confidence scoring
 */
export const performRealScan = async (options: ScanOptions = {}): Promise<LiveScanResult[]> => {
  try {
    // Enforce live data compliance
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    if (!isCompliant) {
      console.warn('🚫 BLOCKED: System not compliant for live data operations');
      throw new Error('Live data enforcement failed. Mock data operations blocked.');
    }

    const entityName = options.targetEntity || 'Simon Lindsay';
    console.log('🔍 A.R.I.A™ Enhanced OSINT: Starting HIGH RECALL, HIGH PRECISION scan for:', entityName);

    // Generate enhanced entity fingerprint with expanded variations
    const entityFingerprint = generateEnhancedEntityFingerprint(entityName);
    const searchQueries = generateExpandedSearchQueries(entityFingerprint);
    
    console.log('🎯 Enhanced Entity Fingerprint Generated:', {
      entity: entityFingerprint.entity_name,
      exact_phrases: entityFingerprint.exact_phrases,
      alias_variations: entityFingerprint.alias_variations,
      search_queries_count: searchQueries.length
    });

    const scanFunctions = [
      'reddit-scan',
      'uk-news-scanner', 
      'enhanced-intelligence',
      'discovery-scanner',
      'monitoring-scan'
    ];

    const results: LiveScanResult[] = [];
    
    for (const func of scanFunctions) {
      try {
        console.log(`🔍 A.R.I.A™ Enhanced OSINT: Executing ${func} with expanded search strategy`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'enhanced_entity_osint',
            fullScan: options.fullScan || true,
            targetEntity: entityName,
            entity: entityName,
            search_query: entityName,
            search_queries: searchQueries,
            entity_fingerprint: entityFingerprint,
            keywords: searchQueries,
            source: options.source || 'manual',
            blockMockData: true,
            enforceLiveOnly: true,
            entityFocused: true,
            confidenceThreshold: 0.6 // Configurable threshold
          }
        });

        if (!error && data) {
          console.log(`✅ ${func} response:`, data);
          
          let scanResults = [];
          if (data.results && Array.isArray(data.results)) {
            scanResults = data.results;
          } else if (data.threats && Array.isArray(data.threats)) {
            scanResults = data.threats.map(threat => ({
              platform: threat.platform,
              content: threat.contextSnippet || threat.content,
              url: threat.sourceUrl || threat.url,
              severity: threat.threatLevel > 7 ? 'high' : threat.threatLevel > 4 ? 'medium' : 'low',
              sentiment: threat.sentiment || 0,
              confidence_score: (threat.matchConfidence || 0) * 100,
              detected_entities: [threat.entityName],
              source_type: 'live_osint'
            }));
          }

          // Apply ENHANCED entity filtering with confidence scoring
          const beforeFilterCount = scanResults.length;
          const { filtered: filteredResults, stats } = filterWithConfidenceThreshold(
            scanResults, 
            entityFingerprint,
            0.4 // Lower threshold for broader recall
          );
          
          // Log comprehensive matching statistics
          logEnhancedFilteringStats(entityName, func, stats, searchQueries);
          
          // Log the query for audit trail
          await logScannerQuery(entityName, searchQueries, func, beforeFilterCount, filteredResults.length, stats);

          // Process filtered results with confidence preservation
          for (const result of filteredResults) {
            // Skip generic/template content
            if (isGenericContent(result.content || result.contextSnippet || '')) {
              continue;
            }

            const isValidLiveData = await LiveDataEnforcer.validateDataInput(
              result.content || result.contextSnippet || '', 
              result.platform || 'unknown'
            );
            
            if (isValidLiveData) {
              results.push({
                id: result.id || `enhanced-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                platform: result.platform || 'Unknown',
                content: result.content || result.contextSnippet || '',
                url: result.url || result.sourceUrl || '',
                severity: (result.severity as 'low' | 'medium' | 'high') || mapThreatLevelToSeverity(result.threatLevel),
                status: (result.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
                threat_type: result.threat_type || 'enhanced_entity_threat',
                sentiment: result.sentiment || 0,
                confidence_score: result.confidence_score || result.entity_match?.confidence_score || 85,
                potential_reach: result.potential_reach || result.spreadVelocity * 1000 || 0,
                detected_entities: [entityName],
                source_type: 'enhanced_live_osint',
                entity_name: entityName,
                source_credibility_score: result.source_credibility_score || 75,
                media_is_ai_generated: result.media_is_ai_generated || false,
                ai_detection_confidence: result.ai_detection_confidence || 0,
                // Enhanced fields
                match_type: result.entity_match?.match_type,
                matched_alias: result.entity_match?.matched_alias,
                context_keywords: result.entity_match?.context_keywords
              });
            } else {
              console.warn('🚫 BLOCKED: Mock data detected and filtered:', result.platform);
            }
          }
        } else {
          console.warn(`❌ ${func} failed:`, error);
        }
      } catch (error) {
        console.warn(`❌ Scan function ${func} failed:`, error);
      }
    }

    console.log(`✅ A.R.I.A™ Enhanced OSINT: Scan complete - ${results.length} high-confidence entity results for "${entityName}"`);
    
    if (results.length === 0) {
      console.log('ℹ️ No high-confidence entity matches detected. This could mean:');
      console.log('   • No recent mentions above confidence threshold (0.4)');
      console.log('   • All mentions are positive/neutral');
      console.log('   • Content exists but doesn\'t meet threat criteria');
      console.log('   • Consider lowering confidence threshold for broader recall');
    } else {
      // Log confidence distribution
      const confidenceDistribution = results.reduce((acc, result) => {
        const range = result.confidence_score >= 85 ? 'high' : 
                     result.confidence_score >= 60 ? 'medium' : 'low';
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Confidence Distribution:', confidenceDistribution);
    }
    
    return results;

  } catch (error) {
    console.error('❌ Enhanced entity scan failed:', error);
    throw error;
  }
};

/**
 * Check if content appears to be generic/template content
 */
function isGenericContent(content: string): boolean {
  const genericPatterns = [
    'advanced ai analysis for target entity',
    'target entity',
    'undefined',
    'sample',
    'test',
    'demo',
    'mock',
    'placeholder'
  ];
  
  const contentLower = content.toLowerCase();
  return genericPatterns.some(pattern => contentLower.includes(pattern));
}

/**
 * Map numeric threat level to severity string
 */
function mapThreatLevelToSeverity(threatLevel?: number): 'low' | 'medium' | 'high' {
  if (!threatLevel) return 'low';
  if (threatLevel >= 7) return 'high';
  if (threatLevel >= 4) return 'medium';
  return 'low';
}

/**
 * Get live threat score for entity
 */
export const getLiveThreatScore = async (entityId: string): Promise<number> => {
  try {
    const results = await performRealScan({ targetEntity: entityId, fullScan: false });
    
    if (results.length === 0) return 0;
    
    // Calculate threat score based on severity and confidence
    const threatScore = results.reduce((score, result) => {
      let severityWeight = 1;
      if (result.severity === 'medium') severityWeight = 2;
      if (result.severity === 'high') severityWeight = 3;
      
      return score + (severityWeight * (result.confidence_score / 100));
    }, 0);
    
    return Math.min(threatScore / results.length, 100);
  } catch (error) {
    console.error('Error calculating live threat score:', error);
    return 0;
  }
};

/**
 * Perform real-time monitoring scan
 */
export const performRealTimeMonitoring = async (): Promise<LiveScanResult[]> => {
  console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring - precision entity-specific live data only');
  return await performRealScan({ fullScan: true, source: 'real_time_monitoring' });
};

/**
 * PERMANENTLY BLOCK ALL MOCK OPERATIONS
 */
export const performMockScan = (): never => {
  console.error('🚫 BLOCKED: Mock scan operations are permanently disabled. Use performRealScan() for live intelligence.');
  throw new Error('Mock data operations blocked by A.R.I.A™ live enforcement system');
};

export const generateMockData = (): never => {
  console.error('🚫 BLOCKED: Mock data generation permanently disabled');
  throw new Error('Mock data generation is permanently disabled. A.R.I.A™ uses 100% live intelligence.');
};
