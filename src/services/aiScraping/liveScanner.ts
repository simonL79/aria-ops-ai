
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Live OSINT Scanner - 100% Real Data, No Mock Content
 * Direct web crawling and RSS processing without API dependencies
 */

export interface LiveScanOptions {
  maxResults?: number;
  includeRealTimeAlerts?: boolean;
  platforms?: string[];
}

export interface LiveScanResult {
  id: string;
  platform: string;
  content: string;
  url: string;
  severity: 'low' | 'medium' | 'high';
  sentiment: number;
  confidence_score: number;
  detected_entities: string[];
  source_type: string;
  entity_name?: string;
  created_at: string;
}

/**
 * Perform live OSINT scan using real web crawling and RSS feeds
 */
export const performLiveScan = async (
  query: string,
  platforms: string[] = ['Reddit', 'News', 'Forums'],
  options: LiveScanOptions = {}
): Promise<LiveScanResult[]> => {
  try {
    console.log('🔍 A.R.I.A™ OSINT: Starting live intelligence scan for:', query);
    
    const results: LiveScanResult[] = [];
    
    // Reddit RSS Crawling (no API key required)
    if (platforms.includes('Reddit')) {
      try {
        const { data: redditData, error } = await supabase.functions.invoke('reddit-scan', {
          body: { 
            entity: query,
            source: 'live_scanner',
            scan_type: 'rss_crawl'
          }
        });
        
        if (!error && redditData?.results) {
          results.push(...redditData.results);
          console.log(`✅ Reddit OSINT: ${redditData.results.length} live results`);
        }
      } catch (error) {
        console.warn('Reddit scan error:', error);
      }
    }

    // News RSS Feeds (no API key required)
    if (platforms.includes('News')) {
      try {
        const { data: newsData, error } = await supabase.functions.invoke('uk-news-scanner', {
          body: { 
            entity: query,
            sources: ['BBC', 'Guardian', 'Telegraph', 'Reuters'],
            scan_type: 'entity_monitoring'
          }
        });
        
        if (!error && newsData?.results) {
          results.push(...newsData.results);
          console.log(`✅ News OSINT: ${newsData.results.length} live results`);
        }
      } catch (error) {
        console.warn('News scan error:', error);
      }
    }

    // RSS Aggregator (no API key required)
    if (platforms.includes('Forums') || platforms.includes('RSS')) {
      try {
        const { data: rssData, error } = await supabase.functions.invoke('rss-scraper', {
          body: { 
            entity: query,
            sources: ['general', 'tech', 'business'],
            scan_type: 'entity_search'
          }
        });
        
        if (!error && rssData?.results) {
          results.push(...rssData.results);
          console.log(`✅ RSS OSINT: ${rssData.results.length} live results`);
        }
      } catch (error) {
        console.warn('RSS scan error:', error);
      }
    }

    // Store live results in database
    if (results.length > 0) {
      const { error: dbError } = await supabase
        .from('scan_results')
        .insert(
          results.map(result => ({
            platform: result.platform,
            content: result.content,
            url: result.url,
            severity: result.severity,
            sentiment: result.sentiment,
            confidence_score: result.confidence_score,
            detected_entities: result.detected_entities,
            source_type: 'live_osint',
            entity_name: result.entity_name || query,
            threat_type: 'live_intelligence'
          }))
        );
        
      if (dbError) {
        console.error('Failed to store live results:', dbError);
      } else {
        console.log(`✅ Stored ${results.length} live OSINT results in database`);
      }
    }

    console.log(`🔍 A.R.I.A™ OSINT: Live scan complete - ${results.length} intelligence items processed`);
    return results;

  } catch (error) {
    console.error('❌ Live OSINT scan failed:', error);
    throw error;
  }
};

/**
 * Perform real-time monitoring using live feeds
 */
export const performRealTimeMonitoring = async (): Promise<LiveScanResult[]> => {
  try {
    console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring sweep...');
    
    // Get recent live scan results (last 2 hours)
    const { data: recentResults, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('source_type', 'live_osint')
      .gte('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Real-time monitoring error:', error);
      return [];
    }
    
    const results = recentResults?.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      url: item.url || '',
      severity: item.severity as 'low' | 'medium' | 'high',
      sentiment: item.sentiment || 0,
      confidence_score: item.confidence_score || 0,
      detected_entities: Array.isArray(item.detected_entities) ? 
        item.detected_entities.map(entity => String(entity)) : [],
      source_type: item.source_type,
      entity_name: item.entity_name,
      created_at: item.created_at
    })) || [];
    
    console.log(`✅ Real-time monitoring: ${results.length} live items`);
    return results;
    
  } catch (error) {
    console.error('❌ Real-time monitoring failed:', error);
    return [];
  }
};

/**
 * Get monitoring status from live sources
 */
export const getMonitoringStatus = async () => {
  try {
    const { data: status, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Monitoring status error:', error);
      return { is_active: false, last_run: null };
    }
    
    return status?.[0] || { is_active: false, last_run: null };
    
  } catch (error) {
    console.error('Failed to get monitoring status:', error);
    return { is_active: false, last_run: null };
  }
};

/**
 * Validate that system is using only live data
 */
export const validateLiveDataOnly = async (): Promise<boolean> => {
  try {
    const { data: mockCheck, error } = await supabase
      .from('scan_results')
      .select('id')
      .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
      .limit(1);
    
    if (error) {
      console.error('Live data validation error:', error);
      return false;
    }
    
    const hasMockData = mockCheck && mockCheck.length > 0;
    
    if (hasMockData) {
      console.warn('🚫 BLOCKED: Mock data detected in system');
      toast.error('Mock data detected - System requires 100% live intelligence');
      return false;
    }
    
    console.log('✅ Live data validation passed');
    return true;
    
  } catch (error) {
    console.error('Live data validation failed:', error);
    return false;
  }
};

// Block any mock data functions
export const generateMockData = () => {
  console.error('🚫 BLOCKED: Mock data generation disabled in live OSINT system');
  throw new Error('Mock data operations are disabled. A.R.I.A™ uses 100% live intelligence.');
};

export const mockScanResults = [];
