import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import type { ScanOptions, LiveScanResult } from '@/types/scan';

/**
 * CONSOLIDATED LIVE OSINT SCANNING - SINGLE SOURCE OF TRUTH
 * NO MOCK DATA - 100% LIVE INTELLIGENCE ONLY
 */

/**
 * Perform real OSINT scan with strict live data enforcement
 * This is the ONLY scanning function - all others are permanently blocked
 */
export const performRealScan = async (options: ScanOptions = {}): Promise<LiveScanResult[]> => {
  try {
    // Enforce live data compliance
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    if (!isCompliant) {
      console.warn('🚫 BLOCKED: System not compliant for live data operations');
      throw new Error('Live data enforcement failed. Mock data operations blocked.');
    }

    console.log('🔍 A.R.I.A™ OSINT: Starting real intelligence scan...');
    console.log('🔍 Target Entity:', options.targetEntity);
    console.log('🔍 Options:', options);

    // Call live scanning edge functions in sequence with proper entity targeting
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
        console.log(`🔍 A.R.I.A™ OSINT: Executing ${func} for entity: ${options.targetEntity || 'general'}`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_osint',
            fullScan: options.fullScan || true,
            targetEntity: options.targetEntity || null,
            entity: options.targetEntity || null, // Additional field some functions expect
            search_query: options.targetEntity || null,
            keywords: options.targetEntity ? [options.targetEntity] : [],
            source: options.source || 'manual',
            blockMockData: true,
            enforceLiveOnly: true,
            entityFocused: true // Flag to indicate entity-specific search
          }
        });

        if (!error && data) {
          console.log(`✅ ${func} response:`, data);
          
          // Handle different response formats
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

          // Filter results for entity relevance if targetEntity is specified
          if (options.targetEntity && scanResults.length > 0) {
            const entityLower = options.targetEntity.toLowerCase();
            scanResults = scanResults.filter(result => {
              const content = (result.content || '').toLowerCase();
              const title = (result.title || '').toLowerCase();
              const contextSnippet = (result.contextSnippet || '').toLowerCase();
              
              // Check if the entity name appears in the content
              return content.includes(entityLower) || 
                     title.includes(entityLower) || 
                     contextSnippet.includes(entityLower) ||
                     (result.detected_entities && result.detected_entities.some(entity => 
                       entity && entity.toLowerCase().includes(entityLower)
                     ));
            });
            
            console.log(`🔍 Filtered ${scanResults.length} entity-relevant results from ${func}`);
          }

          // Validate and process results
          for (const result of scanResults) {
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
                threat_type: result.threat_type || 'live_intelligence',
                sentiment: result.sentiment || 0,
                confidence_score: result.confidence_score || result.matchConfidence * 100 || 75,
                potential_reach: result.potential_reach || result.spreadVelocity * 1000 || 0,
                detected_entities: result.detected_entities || [result.entityName].filter(Boolean) || [],
                source_type: 'live_osint',
                entity_name: result.entity_name || result.entityName || options.targetEntity || 'unknown',
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

    console.log(`✅ A.R.I.A™ OSINT: Validated ${results.length} results as live data for entity: ${options.targetEntity || 'general'}`);
    
    // If no entity-specific results found, log this for debugging
    if (options.targetEntity && results.length === 0) {
      console.warn(`⚠️ A.R.I.A™ OSINT: No live intelligence found for entity "${options.targetEntity}". This may indicate:
        1. The entity has limited online presence
        2. The scanning functions need entity-specific improvements
        3. The entity name needs alternative search terms
        4. Time-based filtering is too restrictive`);
    }
    
    return results;

  } catch (error) {
    console.error('❌ Real scan failed:', error);
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
  console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring - live data only');
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
