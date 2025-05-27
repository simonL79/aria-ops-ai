
import { qaTestRunner } from './qaTestRunner';
import { toast } from 'sonner';

export interface HealthCheckSchedule {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  lastRun: Date | null;
  nextRun: Date | null;
}

export class DailyHealthCheck {
  private schedule: HealthCheckSchedule = {
    enabled: false,
    frequency: 'daily',
    lastRun: null,
    nextRun: null
  };

  private intervalId: NodeJS.Timeout | null = null;

  start(frequency: 'hourly' | 'daily' | 'weekly' = 'daily') {
    this.schedule.enabled = true;
    this.schedule.frequency = frequency;
    
    const intervalMs = this.getIntervalMs(frequency);
    this.schedule.nextRun = new Date(Date.now() + intervalMs);

    this.intervalId = setInterval(async () => {
      await this.runScheduledHealthCheck();
    }, intervalMs);

    toast.success(`🏥 Health monitoring started`, {
      description: `Automated ${frequency} health checks enabled`
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.schedule.enabled = false;
    this.schedule.nextRun = null;

    toast.info('🏥 Health monitoring stopped', {
      description: 'Automated health checks disabled'
    });
  }

  async runManualHealthCheck() {
    return await this.runScheduledHealthCheck(true);
  }

  private async runScheduledHealthCheck(manual = false) {
    try {
      console.log(`🏥 Running ${manual ? 'manual' : 'scheduled'} health check...`);
      
      const results = await qaTestRunner.runFullQASuite();
      this.schedule.lastRun = new Date();
      
      if (!manual) {
        const nextInterval = this.getIntervalMs(this.schedule.frequency);
        this.schedule.nextRun = new Date(Date.now() + nextInterval);
      }

      // Send notifications based on results
      await this.handleHealthCheckResults(results);
      
      return results;
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('🚨 Health check failed', {
        description: 'System monitoring encountered an error'
      });
    }
  }

  private async handleHealthCheckResults(results: any) {
    const { failedTests, warningTests, gdprCompliance } = results;
    
    if (failedTests > 0) {
      toast.error(`🚨 Critical: ${failedTests} system failures`, {
        description: `Immediate attention required. GDPR: ${gdprCompliance.compliancePercentage}%`,
        duration: 10000
      });
    } else if (warningTests > 3) {
      toast.warning(`⚠️ Multiple warnings: ${warningTests} issues`, {
        description: `System monitoring detected several warnings`,
        duration: 5000
      });
    } else if (gdprCompliance.compliancePercentage < 100) {
      toast.warning(`🛡️ GDPR Compliance: ${gdprCompliance.compliancePercentage}%`, {
        description: `Some compliance checks need attention`,
        duration: 5000
      });
    }
  }

  private getIntervalMs(frequency: 'hourly' | 'daily' | 'weekly'): number {
    switch (frequency) {
      case 'hourly':
        return 60 * 60 * 1000; // 1 hour
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7 days
      default:
        return 24 * 60 * 60 * 1000; // Default to daily
    }
  }

  getStatus(): HealthCheckSchedule {
    return { ...this.schedule };
  }
}

export const dailyHealthCheck = new DailyHealthCheck();
