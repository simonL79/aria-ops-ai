import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import type { ScanOptions, LiveScanResult } from '@/types/scan';
import { 
  generateEntityFingerprint, 
  filterEntitySpecificResults, 
  generateEntitySearchQueries,
  logEntityMatchingStats,
  type EntityFingerprint 
} from './entityMatcher';

/**
 * CONSOLIDATED LIVE OSINT SCANNING - PRECISION ENTITY-SPECIFIC INTELLIGENCE
 * NO MOCK DATA - 100% LIVE INTELLIGENCE WITH EXACT ENTITY TARGETING
 */

/**
 * Log scanner queries for debugging and audit trail
 */
async function logScannerQuery(
  entityName: string,
  searchTerms: string[],
  platform: string,
  totalResults: number,
  matchedResults: number
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
 * Perform real OSINT scan with precision entity targeting
 */
export const performRealScan = async (options: ScanOptions = {}): Promise<LiveScanResult[]> => {
  try {
    // Enforce live data compliance
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    if (!isCompliant) {
      console.warn('🚫 BLOCKED: System not compliant for live data operations');
      throw new Error('Live data enforcement failed. Mock data operations blocked.');
    }

    const entityName = options.targetEntity || 'Simon Lindsay'; // Default for testing
    console.log('🔍 A.R.I.A™ OSINT: Starting PRECISION entity-specific intelligence scan for:', entityName);

    // Generate entity fingerprint for precision matching
    const entityFingerprint = generateEntityFingerprint(entityName);
    const searchQueries = generateEntitySearchQueries(entityFingerprint);
    
    console.log('🎯 Entity Fingerprint Generated:', {
      entity: entityFingerprint.entity_name,
      exact_phrases: entityFingerprint.exact_phrases,
      search_queries: searchQueries
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
        console.log(`🔍 A.R.I.A™ OSINT: Executing ${func} with precision entity targeting`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'precision_entity_osint',
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
            entityFocused: true
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

          // Apply PRECISION entity filtering - only results specifically about this entity
          const beforeFilterCount = scanResults.length;
          const { filtered: filteredResults, stats } = filterEntitySpecificResults(scanResults, entityFingerprint);
          
          // Log matching statistics
          logEntityMatchingStats(entityName, func, stats, searchQueries);
          
          // Log the query for audit trail
          await logScannerQuery(entityName, searchQueries, func, beforeFilterCount, filteredResults.length);

          // Process filtered results
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
                id: result.id || `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                platform: result.platform || 'Unknown',
                content: result.content || result.contextSnippet || '',
                url: result.url || result.sourceUrl || '',
                severity: (result.severity as 'low' | 'medium' | 'high') || mapThreatLevelToSeverity(result.threatLevel),
                status: (result.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
                threat_type: result.threat_type || 'precision_entity_threat',
                sentiment: result.sentiment || 0,
                confidence_score: result.confidence_score || result.matchConfidence * 100 || 85,
                potential_reach: result.potential_reach || result.spreadVelocity * 1000 || 0,
                detected_entities: [entityName],
                source_type: 'live_osint',
                entity_name: entityName,
                source_credibility_score: result.source_credibility_score || 75,
                media_is_ai_generated: result.media_is_ai_generated || false,
                ai_detection_confidence: result.ai_detection_confidence || 0
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

    console.log(`✅ A.R.I.A™ OSINT: Precision entity scan complete - ${results.length} verified entity-specific results for "${entityName}"`);
    
    if (results.length === 0) {
      console.log('ℹ️ No entity-specific threats detected. This could mean:');
      console.log('   • The entity has a clean online presence');
      console.log('   • No recent activity mentioning this entity');
      console.log('   • All mentions are positive/neutral');
      console.log('   • Content exists but doesn\'t meet threat criteria');
    }
    
    return results;

  } catch (error) {
    console.error('❌ Precision entity scan failed:', error);
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
