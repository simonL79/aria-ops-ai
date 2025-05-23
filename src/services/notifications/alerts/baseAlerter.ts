
import { HealthCheckResult } from '../types';

export interface AlertOptions {
  webhookUrl?: string;
  recipients?: string[];
  enabled: boolean;
}

/**
 * Base class for alert channels
 */
export abstract class BaseAlerter {
  constructor(protected options: AlertOptions) {}
  
  abstract send(
    results: HealthCheckResult[],
    errors: HealthCheckResult[],
    warnings: HealthCheckResult[],
    highThreats: number
  ): Promise<void>;
  
  isConfigured(): boolean {
    return this.options.enabled;
  }
}
