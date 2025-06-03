import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import type { ScanOptions, LiveScanResult } from '@/types/scan';

/**
 * CONSOLIDATED LIVE OSINT SCANNING - ENTITY-SPECIFIC INTELLIGENCE
 * NO MOCK DATA - 100% LIVE INTELLIGENCE WITH PRECISE TARGETING
 */

interface EntitySearchProfile {
  entity_name: string;
  alternate_names: string[];
  context_tags: string[];
  search_variations: string[];
}

/**
 * Generate entity-specific search variations for targeted scanning
 */
function generateEntitySearchVariations(entityName: string, contextTags: string[] = []): EntitySearchProfile {
  const baseEntity = entityName.trim();
  
  // Create more comprehensive alternate names
  const alternate_names = [
    baseEntity,
    `@${baseEntity.replace(/\s+/g, '').toLowerCase()}`,
    baseEntity.split(' ')[0] + ' ' + baseEntity.split(' ').slice(-1)[0].charAt(0) + '.',
    baseEntity.replace(/\s+/g, ''), // "SimonLindsay"
    baseEntity.toLowerCase(), // "simon lindsay"
  ];

  // Create comprehensive search variations - simpler approach
  const search_variations = [
    baseEntity, // "Simon Lindsay"
    `"${baseEntity}"`, // Exact phrase search
    baseEntity.split(' ')[0], // First name only
    baseEntity.split(' ').slice(-1)[0], // Last name only
    ...alternate_names.slice(0, 3) // Top alternate names
  ];

  return {
    entity_name: baseEntity,
    alternate_names,
    context_tags: contextTags,
    search_variations
  };
}

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
 * STRICT entity-specific content filtering - only return results specifically about the target entity
 */
function filterEntityContent(results: any[], entityProfile: EntitySearchProfile): any[] {
  console.log(`🔍 Filtering ${results.length} results for entity: ${entityProfile.entity_name}`);
  
  return results.filter(result => {
    const content = (result.content || result.title || result.contextSnippet || '').toLowerCase();
    const url = (result.url || '').toLowerCase();
    const fullText = content + ' ' + url;
    
    const entityName = entityProfile.entity_name.toLowerCase();
    
    // For specific entity matching - require either:
    // 1. Full name match (e.g., "simon lindsay")
    // 2. Exact phrase match with quotes
    // 3. Match with context that suggests it's the same person
    
    const hasFullName = fullText.includes(entityName);
    const hasExactPhrase = fullText.includes(`"${entityName}"`);
    
    // Check for contextual matches - if searching for "Simon Lindsay", 
    // require additional context clues if only partial name matches
    let hasContextualMatch = false;
    if (entityProfile.context_tags.length > 0) {
      const hasContextTags = entityProfile.context_tags.some(tag => 
        fullText.includes(tag.toLowerCase())
      );
      
      // If we have context tags like "Glasgow", "KSL Hair", etc.,
      // we can be more flexible with partial name matches
      if (hasContextTags) {
        const nameParts = entityName.split(' ');
        const hasAllNameParts = nameParts.every(part => fullText.includes(part));
        hasContextualMatch = hasAllNameParts;
      }
    }
    
    const isEntityMatch = hasFullName || hasExactPhrase || hasContextualMatch;
    
    if (!isEntityMatch) {
      console.log(`🔍 Filtered out: ${content.substring(0, 100)}... (no specific entity match)`);
      return false;
    }
    
    console.log(`✅ Specific entity match found: ${content.substring(0, 100)}...`);
    return true;
  });
}

/**
 * Perform real OSINT scan with strict entity targeting
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
    console.log('🔍 A.R.I.A™ OSINT: Starting ENTITY-SPECIFIC intelligence scan for:', entityName);

    // Generate entity search profile with context
    const entityProfile = generateEntitySearchVariations(entityName, [
      'Glasgow', 'KSL Hair', 'fraud', 'bench warrant', 'controversy', 'lawsuit'
    ]);
    
    console.log('🔍 Entity Search Profile:', entityProfile);

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
        console.log(`🔍 A.R.I.A™ OSINT: Executing ${func} with entity variations:`, entityProfile.search_variations);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'entity_specific_osint',
            fullScan: options.fullScan || true,
            targetEntity: entityName,
            entity: entityName,
            search_query: entityName,
            keywords: entityProfile.search_variations,
            alternate_names: entityProfile.alternate_names,
            context_tags: entityProfile.context_tags,
            search_variations: entityProfile.search_variations,
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

          // Apply STRICT entity filtering - only results specifically about this entity
          const beforeFilterCount = scanResults.length;
          const filteredResults = filterEntityContent(scanResults, entityProfile);
          const afterFilterCount = filteredResults.length;
          
          console.log(`🔍 ${func}: ${beforeFilterCount} raw results → ${afterFilterCount} entity-specific results`);
          
          // Log the query for audit trail
          await logScannerQuery(entityName, entityProfile.search_variations, func, beforeFilterCount, afterFilterCount);

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
                threat_type: result.threat_type || 'entity_specific_threat',
                sentiment: result.sentiment || 0,
                confidence_score: result.confidence_score || result.matchConfidence * 100 || 75,
                potential_reach: result.potential_reach || result.spreadVelocity * 1000 || 0,
                detected_entities: [entityName, ...entityProfile.alternate_names],
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

    console.log(`✅ A.R.I.A™ OSINT: Entity-specific scan complete - ${results.length} verified results for "${entityName}"`);
    
    console.log(`🔍 Final results: ${results.length} entity-specific intelligence items`);
    
    return results;

  } catch (error) {
    console.error('❌ Entity-specific scan failed:', error);
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
  console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring - entity-specific live data only');
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
