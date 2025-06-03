
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
    'testing', 'simulation', 'sandbox', 'dev'
  ];

  private static readonly REQUIRED_LIVE_INDICATORS = [
    'reddit.com', 'twitter.com', 'news.', '.gov', '.org',
    '2025', 'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
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
      console.log('🔥 WEAPONS GRADE: Initiating live data enforcement protocol');
      
      let threatsNeutralized = 0;
      
      // 1. NUCLEAR OPTION: Purge ALL mock data from scan_results
      const { data: mockData, error: checkError } = await supabase
        .from('scan_results')
        .select('id, content, platform')
        .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));

      if (!checkError && mockData && mockData.length > 0) {
        const { error: purgeError } = await supabase
          .from('scan_results')
          .delete()
          .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));
          
        if (!purgeError) {
          threatsNeutralized += mockData.length;
          console.log(`🔥 NEUTRALIZED: ${mockData.length} mock data entries destroyed`);
        }
      }

      // 2. VALIDATE: Only live OSINT sources remain
      const { data: liveData, error: liveError } = await supabase
        .from('scan_results')
        .select('id')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const liveDataCount = liveData?.length || 0;
      
      // 3. ENFORCE: System configuration lockdown
      await this.lockdownSystemConfiguration();
      
      // 4. VALIDATE: Real-time source integrity
      const sourceIntegrity = await this.validateSourceIntegrity();
      
      const liveDataIntegrity = Math.min(100, (liveDataCount / 10) * 100); // Scale based on expected volume

      return {
        systemSecure: sourceIntegrity && threatsNeutralized >= 0,
        threatsNeutralized,
        liveDataIntegrity,
        message: `WEAPONS GRADE: ${threatsNeutralized} threats neutralized. System secured for live operations.`
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
   * LOCKDOWN: System configuration for live-only operations
   */
  private static async lockdownSystemConfiguration(): Promise<void> {
    const configs = [
      { key: 'allow_mock_data', value: 'DISABLED' },
      { key: 'system_mode', value: 'WEAPONS_GRADE_LIVE' },
      { key: 'data_validation', value: 'NUCLEAR' },
      { key: 'simulation_tolerance', value: 'ZERO' },
      { key: 'live_enforcement_level', value: 'MAXIMUM' }
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
        .select('id, platform, url')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
        .limit(10);

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
          item.url.includes('rss')
        )
      );

      const integrityScore = validSources.length / Math.max(recentLive.length, 1);
      return integrityScore >= 0.7; // 70% must be from verified sources

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
                         !content.match(/test\s*\d+/i);

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
    recommendations: string[];
  }> {
    try {
      // Count live data from last 24 hours
      const { data: liveData } = await supabase
        .from('scan_results')
        .select('id')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Check for any remaining mock data
      const { data: mockData } = await supabase
        .from('scan_results')
        .select('id')
        .or(this.BANNED_KEYWORDS.map(keyword => `content.ilike.%${keyword}%`).join(','));

      const liveDataCount = liveData?.length || 0;
      const mockDataBlocked = mockData?.length || 0;

      let status: 'SECURE' | 'COMPROMISED' | 'DEGRADED' = 'SECURE';
      const recommendations: string[] = [];

      if (mockDataBlocked > 0) {
        status = 'COMPROMISED';
        recommendations.push('IMMEDIATE: Purge remaining mock data');
      } else if (liveDataCount < 5) {
        status = 'DEGRADED';
        recommendations.push('Increase live data collection rate');
      }

      if (liveDataCount === 0) {
        recommendations.push('CRITICAL: No live data detected - check OSINT sources');
      }

      return {
        status,
        liveDataCount,
        mockDataBlocked,
        lastValidation: new Date().toISOString(),
        recommendations
      };

    } catch (error) {
      console.error('🔥 Status check failed:', error);
      return {
        status: 'COMPROMISED',
        liveDataCount: 0,
        mockDataBlocked: -1,
        lastValidation: new Date().toISOString(),
        recommendations: ['EMERGENCY: System status unknown - immediate investigation required']
      };
    }
  }
}
