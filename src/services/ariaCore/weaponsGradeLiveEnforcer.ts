
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * WEAPONS GRADE LIVE DATA ENFORCER
 * Zero tolerance for mock/simulation data
 * A.R.I.A™ vX Production System
 */
export class WeaponsGradeLiveEnforcer {
  
  private static readonly BANNED_KEYWORDS = [
    'mock', 'test', 'demo', 'sample', 'fake', 'simulated', 
    'placeholder', 'lorem ipsum', 'example', 'dummy',
    'testing', 'simulation', 'sandbox', 'dev', 'temp',
    'temporary', 'test_', 'mock_', 'demo_', 'sample_'
  ];

  private static readonly REQUIRED_LIVE_INDICATORS = [
    'reddit.com', 'twitter.com', 'news.', '.gov', '.org',
    '2025', 'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'today',
    'yesterday', 'hours ago', 'minutes ago', 'live', 'breaking'
  ];

  /**
   * WEAPONS GRADE: Block ALL non-live data with extreme prejudice
   */
  static async enforceWeaponsGradeLiveData(): Promise<{
    systemSecure: boolean;
    threatsNeutralized: number;
    liveDataIntegrity: number;
    message: string;
  }> {
    try {
      console.log('🔥 WEAPONS GRADE: Initiating aggressive live data enforcement protocol');
      
      let threatsNeutralized = 0;
      
      // 1. NUCLEAR OPTION: Purge ALL mock data from scan_results
      console.log('🔥 PHASE 1: Nuclear purge of scan_results mock data');
      const { data: mockData, error: checkError } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));

      if (!checkError && mockData && mockData.length > 0) {
        console.log(`🔥 DETECTED: ${mockData.length} mock data entries - executing immediate purge`);
        
        const { error: purgeError } = await supabase
          .from('scan_results')
          .delete()
          .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));
          
        if (!purgeError) {
          threatsNeutralized += mockData.length;
          console.log(`🔥 NEUTRALIZED: ${mockData.length} mock data entries destroyed`);
          toast.success(`🔥 WEAPONS GRADE: ${mockData.length} mock data threats neutralized`);
        }
      }

      // 2. PURGE: Mock data from content_sources
      console.log('🔥 PHASE 2: Purging content_sources mock data');
      const { data: mockContent, error: contentError } = await supabase
        .from('content_sources')
        .select('id, title, url')
        .or(this.BANNED_KEYWORDS.map(keyword => `title.ilike.%${keyword}%`).join(','));

      if (!contentError && mockContent && mockContent.length > 0) {
        const { error: purgeContentError } = await supabase
          .from('content_sources')
          .delete()
          .or(this.BANNED_KEYWORDS.map(keyword => `title.ilike.%${keyword}%`).join(','));
          
        if (!purgeContentError) {
          threatsNeutralized += mockContent.length;
          console.log(`🔥 NEUTRALIZED: ${mockContent.length} mock content sources destroyed`);
        }
      }

      // 3. PURGE: Mock entities
      console.log('🔥 PHASE 3: Purging mock entities');
      const { data: mockEntities, error: entityError } = await supabase
        .from('entities')
        .select('id, name')
        .or(this.BANNED_KEYWORDS.map(keyword => `name.ilike.%${keyword}%`).join(','));

      if (!entityError && mockEntities && mockEntities.length > 0) {
        const { error: purgeEntityError } = await supabase
          .from('entities')
          .delete()
          .or(this.BANNED_KEYWORDS.map(keyword => `name.ilike.%${keyword}%`).join(','));
          
        if (!purgeEntityError) {
          threatsNeutralized += mockEntities.length;
          console.log(`🔥 NEUTRALIZED: ${mockEntities.length} mock entities destroyed`);
        }
      }

      // 4. VALIDATE: Only live OSINT sources remain
      const { data: liveData, error: liveError } = await supabase
        .from('scan_results')
        .select('id, platform, content, created_at')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const liveDataCount = liveData?.length || 0;
      
      // 5. ACTIVATE: Live OSINT feeds if insufficient data
      if (liveDataCount < 10) {
        console.log('🔥 PHASE 4: Activating emergency OSINT feed collection');
        await this.activateEmergencyOSINTFeeds();
      }
      
      // 6. ENFORCE: System configuration lockdown
      await this.lockdownSystemConfiguration();
      
      // 7. VALIDATE: Real-time source integrity
      const sourceIntegrity = await this.validateSourceIntegrity();
      
      const liveDataIntegrity = Math.min(100, Math.max(0, (liveDataCount / 20) * 100)); // Scale based on expected volume

      const systemSecure = sourceIntegrity && threatsNeutralized >= 0 && liveDataIntegrity > 50;

      return {
        systemSecure,
        threatsNeutralized,
        liveDataIntegrity,
        message: `WEAPONS GRADE: ${threatsNeutralized} threats neutralized. Live data integrity: ${liveDataIntegrity.toFixed(1)}%. ${systemSecure ? 'System secured.' : 'System requires additional validation.'}`
      };

    } catch (error) {
      console.error('🔥 WEAPONS GRADE ENFORCEMENT FAILED:', error);
      return {
        systemSecure: false,
        threatsNeutralized: 0,
        liveDataIntegrity: 0,
        message: 'WEAPONS GRADE: Enforcement protocol failed - system may be compromised'
      };
    }
  }

  /**
   * EMERGENCY: Activate OSINT feeds for live data collection
   */
  private static async activateEmergencyOSINTFeeds(): Promise<void> {
    try {
      console.log('🔥 EMERGENCY: Activating live OSINT data collection');
      
      // Trigger live scanning edge functions
      const scanFunctions = [
        'reddit-scan',
        'uk-news-scanner', 
        'enhanced-intelligence',
        'discovery-scanner'
      ];

      for (const func of scanFunctions) {
        try {
          console.log(`🔥 Activating ${func} for live data collection`);
          await supabase.functions.invoke(func, {
            body: { 
              emergency: true,
              priority: 'weapons_grade',
              source: 'emergency_activation'
            }
          });
        } catch (error) {
          console.warn(`Failed to activate ${func}:`, error);
        }
      }

      // Log emergency activation
      await supabase
        .from('activity_logs')
        .insert({
          entity_type: 'emergency_activation',
          action: 'osint_feeds_activated',
          details: 'Emergency OSINT feed activation due to insufficient live data',
          user_email: 'system@aria.com'
        });

    } catch (error) {
      console.error('Emergency OSINT activation failed:', error);
    }
  }

  /**
   * LOCKDOWN: System configuration for live-only operations
   */
  private static async lockdownSystemConfiguration(): Promise<void> {
    const configs = [
      { key: 'allow_mock_data', value: 'DISABLED' },
      { key: 'system_mode', value: 'WEAPONS_GRADE_LIVE' },
      { key: 'data_validation', value: 'NUCLEAR' },
      { key: 'simulation_tolerance', value: 'ZERO' },
      { key: 'live_enforcement_level', value: 'MAXIMUM' },
      { key: 'osint_priority', value: 'EMERGENCY' }
    ];

    for (const config of configs) {
      try {
        await supabase
          .from('system_config')
          .upsert({
            config_key: config.key,
            config_value: config.value,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.warn(`Config lockdown warning for ${config.key}:`, error);
      }
    }
  }

  /**
   * VALIDATE: Source integrity for live intelligence
   */
  private static async validateSourceIntegrity(): Promise<boolean> {
    try {
      // Check for recent live data from known good sources
      const { data: recentLive, error } = await supabase
        .from('scan_results')
        .select('id, platform, url, content')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
        .limit(20);

      if (error || !recentLive) {
        console.warn('🔥 WARNING: No recent live data detected');
        return false;
      }

      // Validate URLs are from legitimate sources
      const validSources = recentLive.filter(item => 
        item.url && (
          item.url.includes('reddit.com') ||
          item.url.includes('news.') ||
          item.url.includes('.gov') ||
          item.url.includes('rss') ||
          item.platform === 'Reddit' ||
          item.platform === 'uk_news'
        )
      );

      // Also validate content has live indicators
      const validContent = recentLive.filter(item =>
        this.REQUIRED_LIVE_INDICATORS.some(indicator =>
          item.content?.toLowerCase().includes(indicator.toLowerCase())
        )
      );

      const urlIntegrityScore = validSources.length / Math.max(recentLive.length, 1);
      const contentIntegrityScore = validContent.length / Math.max(recentLive.length, 1);
      
      const overallIntegrity = (urlIntegrityScore + contentIntegrityScore) / 2;
      
      console.log(`🔥 Source integrity: ${(overallIntegrity * 100).toFixed(1)}%`);
      return overallIntegrity >= 0.6; // 60% must be from verified sources with live indicators

    } catch (error) {
      console.error('🔥 Source integrity validation failed:', error);
      return false;
    }
  }

  /**
   * REAL-TIME: Continuous threat scanning validation
   */
  static async validateLiveDataInput(content: string, source: string): Promise<boolean> {
    // 1. REJECT: Any banned keywords
    const contentLower = content.toLowerCase();
    const hasBannedContent = this.BANNED_KEYWORDS.some(keyword => 
      contentLower.includes(keyword)
    );
    
    if (hasBannedContent) {
      console.error('🔥 BLOCKED: Banned keyword detected in content');
      toast.error('WEAPONS GRADE: Mock data insertion blocked');
      return false;
    }

    // 2. REQUIRE: Live indicators
    const hasLiveIndicators = this.REQUIRED_LIVE_INDICATORS.some(indicator => 
      contentLower.includes(indicator.toLowerCase()) || 
      source.toLowerCase().includes(indicator.toLowerCase())
    );

    if (!hasLiveIndicators && content.length > 10) {
      console.warn('🔥 SUSPICIOUS: Content lacks live data indicators');
      return false;
    }

    // 3. VALIDATE: Content characteristics
    const isRealContent = content.length > 20 && 
                         !content.includes('Lorem ipsum') &&
                         !content.match(/test\s*\d+/i) &&
                         !content.includes('example.com');

    return isRealContent;
  }

  /**
   * EMERGENCY: System status for weapons-grade operations
   */
  static async getWeaponsGradeStatus(): Promise<{
    status: 'SECURE' | 'COMPROMISED' | 'DEGRADED';
    liveDataCount: number;
    mockDataBlocked: number;
    lastValidation: string;
    liveDataIntegrity: number;
    message: string;
    recommendations: string[];
  }> {
    try {
      // Count live data from last 24 hours
      const { data: liveData } = await supabase
        .from('scan_results')
        .select('id, platform, content')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Check for any remaining mock data
      const { data: mockData } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));

      const liveDataCount = liveData?.length || 0;
      const mockDataBlocked = mockData?.length || 0;
      const liveDataIntegrity = Math.min(100, Math.max(0, (liveDataCount / 20) * 100));

      let status: 'SECURE' | 'COMPROMISED' | 'DEGRADED' = 'SECURE';
      const recommendations: string[] = [];

      if (mockDataBlocked > 0) {
        status = 'COMPROMISED';
        recommendations.push(`IMMEDIATE: Purge ${mockDataBlocked} remaining mock data entries`);
        recommendations.push('Execute emergency mock data purge protocol');
      } else if (liveDataCount < 10) {
        status = 'DEGRADED';
        recommendations.push('URGENT: Activate emergency OSINT data collection');
        recommendations.push('Verify live intelligence feeds are operational');
      } else if (liveDataIntegrity < 70) {
        status = 'DEGRADED';
        recommendations.push('WARNING: Live data quality below threshold');
        recommendations.push('Increase live data collection frequency');
      }

      if (liveDataCount === 0) {
        status = 'COMPROMISED';
        recommendations.push('CRITICAL: No live data detected - immediate OSINT activation required');
      }

      const message = `WEAPONS GRADE: ${liveDataCount} live entries, ${mockDataBlocked} threats blocked. Integrity: ${liveDataIntegrity.toFixed(1)}%`;

      return {
        status,
        liveDataCount,
        mockDataBlocked,
        lastValidation: new Date().toISOString(),
        liveDataIntegrity,
        message,
        recommendations
      };

    } catch (error) {
      console.error('🔥 Status check failed:', error);
      return {
        status: 'COMPROMISED',
        liveDataCount: 0,
        mockDataBlocked: -1,
        lastValidation: new Date().toISOString(),
        liveDataIntegrity: 0,
        message: 'WEAPONS GRADE: System status unknown - critical failure detected',
        recommendations: ['EMERGENCY: System status unknown - immediate investigation required']
      };
    }
  }
}
