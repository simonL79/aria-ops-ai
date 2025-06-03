import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { RDPComplianceEnforcer } from '@/services/ariaCore/rdpCompliance';
import type { ScanOptions, LiveScanResult } from '@/types/scan';
import { 
  generateEnhancedEntityFingerprint, 
  filterWithConfidenceThreshold, 
  generateExpandedSearchQueries,
  logEnhancedFilteringStats,
  type EnhancedEntityFingerprint 
} from './enhancedEntityMatcher';

/**
 * ENHANCED A.R.I.A™ LIVE OSINT SCANNING - RDP-001 COMPLIANT
 * 100% LIVE DATA ONLY - ALL SIMULATIONS PERMANENTLY BLOCKED
 * Multi-stage validation with quarantine system
 */

/**
 * Enhanced anti-simulation validation
 */
function isSimulationContent(content: string): boolean {
  const simulationIndicators = [
    'mock', 'test', 'demo', 'sample', 'fake', 'simulated',
    'placeholder', 'lorem ipsum', 'example', 'dummy', 'synthetic',
    'generated', 'artificial', 'template', 'sandbox', 'staging',
    'dev', 'development', 'simulation', 'hypothetical', 'fictional',
    'advanced ai analysis for target entity',
    'target entity',
    'undefined',
    'null',
    'test data',
    'generic response',
    'this is a sample'
  ];
  
  const contentLower = content.toLowerCase();
  return simulationIndicators.some(indicator => contentLower.includes(indicator));
}

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
 * Perform enhanced real OSINT scan with RDP-001 compliance
 */
export const performRealScan = async (options: ScanOptions = {}): Promise<LiveScanResult[]> => {
  try {
    // STAGE 1: Generation Input Validation (RDP-001)
    await RDPComplianceEnforcer.enforceOnGeneration(options);
    
    // Legacy compliance check
    const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
    if (!compliance.isCompliant || compliance.simulationDetected) {
      console.error('🚫 WEAPONS-GRADE BLOCK: System simulation detected');
      throw new Error('SIMULATION DETECTED: A.R.I.A™ requires 100% live intelligence. All simulations permanently blocked.');
    }

    const entityName = options.targetEntity || 'Simon Lindsay';
    console.log('🔍 A.R.I.A™ RDP-001 OSINT: Starting compliant scan for:', entityName);

    // Enhanced entity fingerprint generation
    const entityFingerprint = generateEnhancedEntityFingerprint(entityName);
    const searchQueries = generateExpandedSearchQueries(entityFingerprint);
    
    console.log('🎯 Live Entity Fingerprint Generated:', {
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
        console.log(`🔍 A.R.I.A™ RDP-001: Executing ${func} with compliance enforcement`);
        
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_only_osint',
            fullScan: options.fullScan || true,
            targetEntity: entityName,
            entity: entityName,
            search_query: entityName,
            search_queries: searchQueries,
            entity_fingerprint: entityFingerprint,
            keywords: searchQueries,
            source: options.source || 'manual',
            blockMockData: true,
            blockSimulations: true,
            enforceLiveOnly: true,
            entityFocused: true,
            confidenceThreshold: 0.6,
            simulationTolerance: 0,
            rdpCompliant: true // RDP-001 flag
          }
        });

        if (!error && data) {
          console.log(`✅ ${func} RDP-001 compliant response:`, data);
          
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

          // STAGE 2: Approval Validation (RDP-001)
          const beforeFilterCount = scanResults.length;
          const approvedResults = [];
          
          for (const result of scanResults) {
            try {
              // RDP-001 approval validation
              await RDPComplianceEnforcer.validateArticlePayload({
                title: result.content?.substring(0, 100) || '',
                content: result.content || '',
                external_links: result.url ? [result.url] : []
              });
              
              // Legacy simulation blocking
              const content = result.content || result.contextSnippet || '';
              if (isSimulationContent(content)) {
                console.warn('🚫 SIMULATION BLOCKED:', content.substring(0, 50));
                continue;
              }
              
              approvedResults.push(result);
            } catch (rdpError) {
              console.warn(`🚫 RDP-001 BLOCKED: ${rdpError.message}`);
              // Item automatically quarantined by RDPComplianceEnforcer
            }
          }
          
          console.log(`🔍 RDP-001 Approval: ${beforeFilterCount} → ${approvedResults.length} (${beforeFilterCount - approvedResults.length} blocked)`);
          
          // Entity filtering with confidence scoring
          const { filtered: filteredResults, stats } = filterWithConfidenceThreshold(
            approvedResults, 
            entityFingerprint,
            0.4
          );
          
          // Log comprehensive matching statistics
          logEnhancedFilteringStats(entityName, func, stats, searchQueries);
          
          // Log the query for audit trail
          await logScannerQuery(entityName, searchQueries, func, beforeFilterCount, filteredResults.length, stats);

          // STAGE 3: Final processing with deployment validation
          for (const result of filteredResults) {
            try {
              // STAGE 3: Deployment Validation (RDP-001)
              await RDPComplianceEnforcer.enforceOnDeployment({
                content: result.content || result.contextSnippet || '',
                url: result.url || result.sourceUrl || ''
              });
              
              // Enhanced live data validation
              const isValidLiveData = await LiveDataEnforcer.validateDataInput(
                result.content || result.contextSnippet || '', 
                result.platform || 'unknown'
              );
              
              if (isValidLiveData) {
                const processedResult: LiveScanResult = {
                  id: result.id || `rdp-compliant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  platform: result.platform || 'Unknown',
                  content: result.content || result.contextSnippet || '',
                  url: result.url || result.sourceUrl || '',
                  severity: (result.severity as 'low' | 'medium' | 'high') || mapThreatLevelToSeverity(result.threatLevel),
                  status: (result.status as 'new' | 'read' | 'actioned' | 'resolved') || 'new',
                  threat_type: result.threat_type || 'rdp_compliant_intelligence',
                  sentiment: result.sentiment || 0,
                  confidence_score: result.confidence_score || result.entity_match?.confidence_score || 85,
                  potential_reach: result.potential_reach || result.spreadVelocity * 1000 || 0,
                  detected_entities: [entityName],
                  source_type: 'rdp_verified_live_osint',
                  entity_name: entityName,
                  source_credibility_score: result.source_credibility_score || 75,
                  media_is_ai_generated: result.media_is_ai_generated || false,
                  ai_detection_confidence: result.ai_detection_confidence || 0
                };

                // Add enhanced fields if they exist
                if (result.entity_match?.match_type) {
                  processedResult.match_type = result.entity_match.match_type;
                }
                if (result.entity_match?.matched_alias) {
                  processedResult.matched_alias = result.entity_match.matched_alias;
                }
                if (result.entity_match?.context_keywords) {
                  processedResult.context_keywords = result.entity_match.context_keywords;
                }

                results.push(processedResult);
              } else {
                console.warn('🚫 BLOCKED: Failed live validation:', result.platform);
              }
            } catch (deploymentError) {
              console.warn(`🚫 RDP-001 DEPLOYMENT BLOCKED: ${deploymentError.message}`);
              // Item automatically quarantined by RDPComplianceEnforcer
            }
          }
        } else {
          console.warn(`❌ ${func} failed:`, error);
        }
      } catch (error) {
        console.warn(`❌ Scan function ${func} failed:`, error);
      }
    }

    console.log(`✅ A.R.I.A™ RDP-001 OSINT: Scan complete - ${results.length} VERIFIED COMPLIANT intelligence items`);
    
    if (results.length === 0) {
      console.log('ℹ️ No RDP-001 compliant intelligence detected.');
      console.log('   • All simulations permanently blocked');
      console.log('   • Multi-stage validation enforced');
      console.log('   • Quarantine system active');
    } else {
      // Log live data confidence distribution
      const confidenceDistribution = results.reduce((acc, result) => {
        const range = result.confidence_score >= 85 ? 'high' : 
                     result.confidence_score >= 60 ? 'medium' : 'low';
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 RDP-001 Compliant Intelligence Distribution:', confidenceDistribution);
    }
    
    return results;

  } catch (error) {
    console.error('❌ RDP-001 compliant intelligence scan failed:', error);
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
 * PERMANENTLY BLOCK ALL SIMULATION OPERATIONS
 */
export const performMockScan = (): never => {
  LiveDataEnforcer.blockSimulation('Mock Scan');
};

export const generateMockData = (): never => {
  LiveDataEnforcer.blockSimulation('Mock Data Generation');
};

export const performSimulation = (): never => {
  LiveDataEnforcer.blockSimulation('Simulation Operations');
};
