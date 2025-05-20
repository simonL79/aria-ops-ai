
export interface MonitoringStatus {
  isActive: boolean;
  lastRun: string | null;
  nextRun: string | null;
  sources: number;
  activeSince?: Date;
}

export interface MonitorablePlatform {
  id: string;
  name: string;
  isActive: boolean;
  type?: string;
}

export interface Mention {
  id: string;
  platform: string;
  content: string;
  source: string;
  date: Date;
  severity: 'high' | 'medium' | 'low';
  status?: 'new' | 'read' | 'actioned' | 'resolved' | 'reviewing';
  threatType?: string;
}

export interface ScanResult {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'read' | 'actioned' | 'resolved' | 'reviewing';
  url: string;
  threatType?: string;
  sentiment?: number;
  detectedEntities?: string[];
  potentialReach?: number;
}

export type MentionUpdate = Partial<Mention> & { id: string };
