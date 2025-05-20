
export interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date;
  nextRun: Date;
  sources: number;
}

export interface MonitorablePlatform {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  coverage: number;
}

export interface Mention {
  id: string;
  content: string;
  source: string;
  timestamp: Date;
  sentiment: number;
  entities: string[];
  url?: string;
  platformId: string;
}
