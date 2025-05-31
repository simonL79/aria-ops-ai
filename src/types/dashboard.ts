
export interface MetricValue {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
  delta: number;
  deltaType: 'increase' | 'decrease';
}

export interface ContentAlert {
  id: string;
  content: string;
  platform: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved' | 'dismissed' | 'reviewing';
  date: string;
  url?: string;
  sourceType?: string;
  detectedEntities?: string[];
  category?: string;
  recommendation?: string;
  threatType?: string;
  confidenceScore?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  potentialReach?: number;
}

export interface ContentSource {
  id: string;
  name: string;
  type: string;
  status: 'critical' | 'good' | 'warning';
  lastUpdate: string;
  metrics: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
  positiveRatio: number;
  total: number;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
}

export interface ContentAction {
  id: string;
  type: 'urgent' | 'monitoring' | 'response';
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  platform: string;
  action: string;
  date: string;
}
