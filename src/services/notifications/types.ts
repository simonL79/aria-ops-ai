
export interface HealthCheckResult {
  platform: string;
  status: 'healthy' | 'warning' | 'error';
  lastEntry?: string;
  count24h: number;
  message: string;
}

export interface AlertChannels {
  slack?: {
    webhookUrl: string;
    enabled: boolean;
  };
  email?: {
    recipients: string[];
    enabled: boolean;
  };
  discord?: {
    webhookUrl: string;
    enabled: boolean;
  };
}
