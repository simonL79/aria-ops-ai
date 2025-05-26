import { supabase } from '@/integrations/supabase/client';

export interface HealthCheckResult {
  platform: string;
  status: 'healthy' | 'warning' | 'error';
  count24h: number;
  lastEntry?: string;
  message: string;
}

export interface SystemHealthMetrics {
  totalThreats24h: number;
  threatsProcessed: number;
  avgProcessingTime: number;
  errorRate: number;
  platformStatus: HealthCheckResult[];
}

export class SystemHealthService {
  private readonly PLATFORMS = ['YouTube', 'Reddit', 'uk_news', 'Instagram', 'TikTok', 'Twitter'];
  private readonly HEALTH_THRESHOLDS = {
    minThreats24h: 10,
    maxErrorRate: 0.05,
    maxProcessingTime: 30000 // 30 seconds
  };

  async runComprehensiveHealthCheck(): Promise<SystemHealthMetrics> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get platform-specific health data
    const platformStatus = await this.checkPlatformHealth(yesterday);
    
    // Get overall system metrics
    const totalThreats24h = platformStatus.reduce((sum, p) => sum + p.count24h, 0);
    const threatsProcessed = await this.getProcessedThreatsCount(yesterday);
    const avgProcessingTime = await this.getAverageProcessingTime(yesterday);
    const errorRate = await this.getErrorRate(yesterday);

    const metrics: SystemHealthMetrics = {
      totalThreats24h,
      threatsProcessed,
      avgProcessingTime,
      errorRate,
      platformStatus
    };

    // Store health check results
    await this.storeHealthCheckResults(metrics);

    // Check if alerts need to be sent
    await this.checkAndSendAlerts(metrics);

    return metrics;
  }

  private async checkPlatformHealth(since: Date): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const platform of this.PLATFORMS) {
      try {
        // Get recent entries for this platform
        const { data: recentData, error: recentError } = await supabase
          .from('scan_results')
          .select('created_at, severity, threat_type')
          .eq('platform', platform)
          .gte('created_at', since.toISOString())
          .order('created_at', { ascending: false });

        if (recentError) {
          results.push({
            platform,
            status: 'error',
            count24h: 0,
            message: `Error: ${recentError.message}`
          });
          continue;
        }

        // Get the latest entry
        const { data: latestData } = await supabase
          .from('scan_results')
          .select('created_at')
          .eq('platform', platform)
          .order('created_at', { ascending: false })
          .limit(1);

        const count24h = recentData?.length || 0;
        const latestEntry = latestData?.[0]?.created_at;

        // Determine health status
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        let message = `${count24h} entries in last 24h`;

        if (count24h === 0) {
          const lastEntryDate = latestEntry ? new Date(latestEntry) : null;
          const twoDaysAgo = new Date(since.getTime() - 24 * 60 * 60 * 1000);
          
          status = lastEntryDate && lastEntryDate < twoDaysAgo ? 'error' : 'warning';
          message = latestEntry 
            ? `No entries in 24h (last: ${new Date(latestEntry).toLocaleString()})`
            : 'No entries found';
        } else if (count24h < 5) {
          status = 'warning';
          message = `Low activity: ${count24h} entries`;
        }

        results.push({
          platform,
          status,
          count24h,
          lastEntry: latestEntry,
          message
        });

      } catch (error) {
        results.push({
          platform,
          status: 'error',
          count24h: 0,
          message: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    return results;
  }

  private async getProcessedThreatsCount(since: Date): Promise<number> {
    const { count } = await supabase
      .from('scan_results')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
      .not('threat_type', 'is', null);

    return count || 0;
  }

  private async getAverageProcessingTime(since: Date): Promise<number> {
    // Mock implementation - would need actual processing time tracking
    return Math.random() * 10000 + 5000; // 5-15 seconds
  }

  private async getErrorRate(since: Date): Promise<number> {
    const { data: totalScans } = await supabase
      .from('scan_results')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());

    const { data: failedScans } = await supabase
      .from('scan_results')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
      .eq('threat_type', 'system_error');

    const total = (totalScans as any)?.count || 0;
    const failed = (failedScans as any)?.count || 0;

    return total > 0 ? failed / total : 0;
  }

  private async storeHealthCheckResults(metrics: SystemHealthMetrics): Promise<void> {
    const healthChecks = [
      {
        check_type: 'system_overview',
        status: this.getOverallStatus(metrics),
        message: `${metrics.totalThreats24h} threats processed, ${(metrics.errorRate * 100).toFixed(2)}% error rate`,
        metadata: {
          totalThreats24h: metrics.totalThreats24h,
          threatsProcessed: metrics.threatsProcessed,
          avgProcessingTime: metrics.avgProcessingTime,
          errorRate: metrics.errorRate
        }
      },
      ...metrics.platformStatus.map(platform => ({
        check_type: `platform_${platform.platform.toLowerCase()}`,
        status: platform.status,
        message: platform.message,
        metadata: {
          platform: platform.platform,
          count24h: platform.count24h,
          lastEntry: platform.lastEntry
        }
      }))
    ];

    for (const check of healthChecks) {
      await (supabase as any)
        .from('system_health_checks')
        .insert(check);
    }
  }

  private getOverallStatus(metrics: SystemHealthMetrics): 'healthy' | 'warning' | 'error' {
    const hasErrors = metrics.platformStatus.some(p => p.status === 'error');
    const hasWarnings = metrics.platformStatus.some(p => p.status === 'warning');
    const lowActivity = metrics.totalThreats24h < this.HEALTH_THRESHOLDS.minThreats24h;
    const highErrorRate = metrics.errorRate > this.HEALTH_THRESHOLDS.maxErrorRate;

    if (hasErrors || highErrorRate) return 'error';
    if (hasWarnings || lowActivity) return 'warning';
    return 'healthy';
  }

  private async checkAndSendAlerts(metrics: SystemHealthMetrics): Promise<void> {
    const overallStatus = this.getOverallStatus(metrics);
    
    if (overallStatus === 'error' || overallStatus === 'warning') {
      // Import slack alerter dynamically to avoid circular dependencies
      const { SlackAlerter } = await import('../notifications/alerts/slackAlerter');
      
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (webhookUrl) {
        const alerter = new SlackAlerter({
          webhookUrl,
          enabled: true
        });

        const errors = metrics.platformStatus.filter(p => p.status === 'error');
        const warnings = metrics.platformStatus.filter(p => p.status === 'warning');
        const highThreats = metrics.totalThreats24h;

        await alerter.send(metrics.platformStatus, errors, warnings, highThreats);
      }
    }
  }

  async getLatestHealthStatus(): Promise<SystemHealthMetrics | null> {
    const { data } = await (supabase as any)
      .from('system_health_checks')
      .select('*')
      .eq('check_type', 'system_overview')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!data) return null;

    // Reconstruct metrics from stored data
    return {
      totalThreats24h: data.metadata?.totalThreats24h || 0,
      threatsProcessed: data.metadata?.threatsProcessed || 0,
      avgProcessingTime: data.metadata?.avgProcessingTime || 0,
      errorRate: data.metadata?.errorRate || 0,
      platformStatus: [] // Would need to fetch platform-specific checks
    };
  }
}

export const systemHealthService = new SystemHealthService();
