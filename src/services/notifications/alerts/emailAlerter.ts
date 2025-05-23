
import { BaseAlerter, AlertOptions } from './baseAlerter';
import { HealthCheckResult } from '../types';
import { toast } from "sonner";

/**
 * Email alerter implementation (placeholder - would need email service integration)
 */
export class EmailAlerter extends BaseAlerter {
  constructor(options: AlertOptions) {
    super(options);
  }
  
  isConfigured(): boolean {
    return super.isConfigured() && (this.options.recipients?.length || 0) > 0;
  }
  
  async send(
    results: HealthCheckResult[],
    errors: HealthCheckResult[],
    warnings: HealthCheckResult[],
    highThreats: number
  ): Promise<void> {
    if (!this.isConfigured()) return;
    
    // This would integrate with your email service (SendGrid, Resend, etc.)
    console.log(`📧 Would send email alert to: ${this.options.recipients!.join(', ')}`);
    console.log(`Content: ${errors.length} errors, ${warnings.length} warnings, ${highThreats} threats`);
    
    // For now, just log the intended email content
    toast.info('Email alert logged', {
      description: `Alert would be sent to ${this.options.recipients!.length} recipient(s)`
    });
  }
}
