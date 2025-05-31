
/**
 * Core scanning types - isolated to prevent circular imports
 */
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

export interface ScanOptions {
  fullScan?: boolean;
  source?: string;
  targetEntity?: string | null;
  scan_depth?: string;
  target_entity?: string | null;
}

export interface LiveScanResult {
  id: string;
  platform: string;
  content: string;
  url: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  threat_type: string;
  sentiment: number;
  confidence_score: number;
  potential_reach: number;
  detected_entities: string[];
  source_type: string;
  entity_name: string;
  source_credibility_score: number;
  media_is_ai_generated: boolean;
  ai_detection_confidence: number;
}
