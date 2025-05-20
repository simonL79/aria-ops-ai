
// Monitoring status interface
export interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date;
  nextRun: Date;
  sources: number;
  activeSince: Date;
}

// Platform monitoring interface
export interface MonitorablePlatform {
  id: string;
  name: string;
  isActive: boolean;
}

// Mention data structure
export interface Mention {
  id: string;
  platform: string;
  content: string;
  source: string;
  date: Date;
  severity: 'high' | 'medium' | 'low';
}
