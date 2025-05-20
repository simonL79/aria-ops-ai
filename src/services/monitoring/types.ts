
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
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threatType?: string;
  sentiment?: number;
  url?: string;
  detectedEntities?: string[];
  potentialReach?: number;
}

// Scan result type
export interface ScanResult {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: string;
  url?: string;
  threatType?: string;
  sentiment?: number;
  detectedEntities?: string[];
  potentialReach?: number;
}
