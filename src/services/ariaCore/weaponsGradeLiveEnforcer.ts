
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
    'temporary', 'test_', 'mock_', 'demo_', 'sample_',
    'undefined', 'target entity - undefined', 'advanced ai analysis'
  ];

  private static readonly BANNED_PLATFORMS = [
    'Enhanced Intelligence' // This platform generates mock data
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
      
      // Target Enhanced Intelligence platform specifically
      const { data: enhancedIntelMockData, error: enhancedError } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .eq('platform', 'Enhanced Intelligence')
        .or('content.ilike.%undefined%,content.ilike.%Advanced AI analysis%');

      if (!enhancedError && enhancedIntelMockData && enhancedIntelMockData.length > 0) {
        console.log(`🔥 DETECTED: ${enhancedIntelMockData.length} Enhanced Intelligence mock entries - executing purge`);
        
        const { error: purgeEnhancedError } = await supabase
          .from('scan_results')
          .delete()
          .eq('platform', 'Enhanced Intelligence')
          .or('content.ilike.%undefined%,content.ilike.%Advanced AI analysis%');
          
        if (!purgeEnhancedError) {
          threatsNeutralized += enhancedIntelMockData.length;
          console.log(`🔥 NEUTRALIZED: ${enhancedIntelMockData.length} Enhanced Intelligence mock entries destroyed`);
          toast.success(`🔥 WEAPONS GRADE: ${enhancedIntelMockData.length} Enhanced Intelligence mock threats neutralized`);
        }
      }

      // 2. General mock data purge
      const { data: mockData, error: checkError } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));

      if (!checkError && mockData && mockData.length > 0) {
        console.log(`🔥 DETECTED: ${mockData.length} additional mock data entries - executing purge`);
        
        const { error: purgeError } = await supabase
          .from('scan_results')
          .delete()
          .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));
          
        if (!purgeError) {
          threatsNeutralized += mockData.length;
          console.log(`🔥 NEUTRALIZED: ${mockData.length} general mock data entries destroyed`);
        }
      }

      // 3. PURGE: Mock data from content_sources
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

      // 4. PURGE: Mock entities
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

      // 5. VALIDATE: Only live OSINT sources remain
      const { data: liveData, error: liveError } = await supabase
        .from('scan_results')
        .select('id, platform, content, created_at')
        .eq('source_type', 'live_osint')
        .not('platform', 'in', `(${this.BANNED_PLATFORMS.map(p => `"${p}"`).join(',')})`)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const liveDataCount = liveData?.length || 0;
      
      // 6. ACTIVATE: Live OSINT feeds if insufficient data
      if (liveDataCount < 10) {
        console.log('🔥 PHASE 4: Activating emergency OSINT feed collection');
        await this.activateEmergencyOSINTFeeds();
      }
      
      // 7. ENFORCE: System configuration lockdown
      await this.lockdownSystemConfiguration();
      
      // 8. VALIDATE: Real-time source integrity
      const sourceIntegrity = await this.validateSourceIntegrity();
      
      const liveDataIntegrity = Math.min(100, Math.max(0, (liveDataCount / 20) * 100));
      const systemSecure = sourceIntegrity && threatsNeutralized >= 0 && liveDataIntegrity > 50;

      return {
        systemSecure,
        threatsNeutralized,
        liveDataIntegrity,
        message: `WEAPONS GRADE: ${threatsNeutralized} threats neutralized (including Enhanced Intelligence mock data). Live data integrity: ${liveDataIntegrity.toFixed(1)}%. ${systemSecure ? 'System secured.' : 'System requires additional validation.'}`
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
        'discovery-scanner'
      ];

      for (const func of scanFunctions) {
        try {
          console.log(`🔥 Activating ${func} for live data collection`);
          await supabase.functions.invoke(func, {
            body: { 
              emergency: true,
              priority: 'weapons_grade',
              source: 'emergency_activation',
              blockEnhancedIntelligence: true
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
          details: 'Emergency OSINT feed activation due to insufficient live data and Enhanced Intelligence mock contamination',
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
      { key: 'osint_priority', value: 'EMERGENCY' },
      { key: 'block_enhanced_intelligence', value: 'TRUE' }
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
        .not('platform', 'in', `(${this.BANNED_PLATFORMS.map(p => `"${p}"`).join(',')})`)
        .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
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
        ) && !this.BANNED_PLATFORMS.includes(item.platform)
      );

      // Also validate content has live indicators and doesn't contain mock data
      const validContent = recentLive.filter(item =>
        this.REQUIRED_LIVE_INDICATORS.some(indicator =>
          item.content?.toLowerCase().includes(indicator.toLowerCase())
        ) && !this.BANNED_KEYWORDS.some(banned =>
          item.content?.toLowerCase().includes(banned.toLowerCase())
        )
      );

      const urlIntegrityScore = validSources.length / Math.max(recentLive.length, 1);
      const contentIntegrityScore = validContent.length / Math.max(recentLive.length, 1);
      
      const overallIntegrity = (urlIntegrityScore + contentIntegrityScore) / 2;
      
      console.log(`🔥 Source integrity: ${(overallIntegrity * 100).toFixed(1)}%`);
      return overallIntegrity >= 0.6;

    } catch (error) {
      console.error('🔥 Source integrity validation failed:', error);
      return false;
    }
  }

  /**
   * REAL-TIME: Continuous threat scanning validation
   */
  static async validateLiveDataInput(content: string, source: string, platform?: string): Promise<boolean> {
    // 1. REJECT: Banned platforms
    if (platform && this.BANNED_PLATFORMS.includes(platform)) {
      console.error('🔥 BLOCKED: Banned platform detected:', platform);
      toast.error('WEAPONS GRADE: Mock platform blocked');
      return false;
    }

    // 2. REJECT: Any banned keywords
    const contentLower = content.toLowerCase();
    const sourceLower = source.toLowerCase();
    
    const hasBannedContent = this.BANNED_KEYWORDS.some(keyword => 
      contentLower.includes(keyword) || sourceLower.includes(keyword)
    );
    
    if (hasBannedContent) {
      console.error('🔥 BLOCKED: Banned keyword detected in content');
      toast.error('WEAPONS GRADE: Mock data insertion blocked');
      return false;
    }

    // 3. REQUIRE: Live indicators for substantial content
    const hasLiveIndicators = this.REQUIRED_LIVE_INDICATORS.some(indicator => 
      contentLower.includes(indicator.toLowerCase()) || 
      sourceLower.includes(indicator.toLowerCase())
    );

    if (!hasLiveIndicators && content.length > 10) {
      console.warn('🔥 SUSPICIOUS: Content lacks live data indicators');
      return false;
    }

    // 4. VALIDATE: Content characteristics
    const isRealContent = content.length > 20 && 
                         !content.includes('Lorem ipsum') &&
                         !content.match(/test\s*\d+/i) &&
                         !content.includes('example.com') &&
                         !content.includes('undefined');

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
      // Count live data from last 24 hours (excluding banned platforms)
      const { data: liveData } = await supabase
        .from('scan_results')
        .select('id, platform, content')
        .eq('source_type', 'live_osint')
        .not('platform', 'in', `(${this.BANNED_PLATFORMS.map(p => `"${p}"`).join(',')})`)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Check for any remaining mock data including Enhanced Intelligence
      const { data: mockData } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .or([
          ...this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`),
          ...this.BANNED_PLATFORMS.map(platform => `platform.eq."${platform}"`)
        ].join(','));

      const liveDataCount = liveData?.length || 0;
      const mockDataBlocked = mockData?.length || 0;
      const liveDataIntegrity = Math.min(100, Math.max(0, (liveDataCount / 20) * 100));

      let status: 'SECURE' | 'COMPROMISED' | 'DEGRADED' = 'SECURE';
      const recommendations: string[] = [];

      if (mockDataBlocked > 0) {
        status = 'COMPROMISED';
        recommendations.push(`IMMEDIATE: Purge ${mockDataBlocked} remaining mock data entries (including Enhanced Intelligence)`);
        recommendations.push('Execute emergency mock data purge protocol');
        recommendations.push('Block Enhanced Intelligence platform permanently');
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

      const message = `WEAPONS GRADE: ${liveDataCount} live entries, ${mockDataBlocked} threats blocked (Enhanced Intelligence filtered). Integrity: ${liveDataIntegrity.toFixed(1)}%`;

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
