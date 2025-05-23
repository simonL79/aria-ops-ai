/**
 * Type definitions for monitoring service
 */

export interface MonitoringStatus {
  isActive: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  sourcesCount: number;
  sources: number; // For backward compatibility
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
  content: string;
  platform: string;
  url: string;
  date: string;
  sentiment?: number;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threatType?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
  detectedEntities?: string[];
  sourceType?: string;
  source_type?: string;
  potentialReach?: number;
  confidenceScore?: number;
  confidence_score?: number;
  category?: string;
  source_credibility_score?: number;
  media_is_ai_generated?: boolean;
  ai_detection_confidence?: number;
  incident_playbook?: string;
}

export interface MonitoringConfig {
  depth: 'quick' | 'standard' | 'deep';
  platforms: string[];
  timeframe: string;
}
