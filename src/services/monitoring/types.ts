
/**
 * Type definitions for monitoring service
 */

export interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  sourcesCount: number;
  sources?: number; // For backward compatibility
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
  status: 'new' | 'read' | 'actioned' | 'resolved' | 'reviewing';
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
  sourceType?: string;
  source_type?: string;
  confidenceScore?: number;
  confidence_score?: number;
  sentiment?: number;
  detectedEntities?: string[];
  potentialReach?: number;
  potential_reach?: number;
  category?: string;
}

export interface MonitoringConfig {
  depth: 'quick' | 'standard' | 'deep';
  platforms: string[];
  timeframe: string;
}
