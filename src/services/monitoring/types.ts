
export interface MonitoringStatus {
  isActive: boolean;
  lastRun: string; // Changed from Date to string to match implementation
  nextRun: string; // Changed from Date to string to match implementation
  sources: number;
  activeSince?: string;
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
