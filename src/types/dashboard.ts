export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'read' | 'reviewing' | 'actioned';
  url: string;
  threatType?: string;
  sourceType: string;
  confidenceScore: number;
  sentiment: 'positive' | 'negative' | 'neutral' | 'threatening';
  detectedEntities: string[];
  potentialReach?: number;
  category?: string;
  recommendation?: string;
  source_credibility_score?: number;
  media_is_ai_generated?: boolean;
  ai_detection_confidence?: number;
  incident_playbook?: string;
}

export interface ContentSource {
  id: string;
  name: string;
  status: "critical" | "good" | "warning";
  positiveRatio: number;
  total: number;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
}

export interface ContentAction {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  user: string;
  platform: string;
  action: string;
  date: string;
}

export interface MetricValue {
  name: string;
  value: number;
  delta: number;
  deltaType: "increase" | "decrease";
}
