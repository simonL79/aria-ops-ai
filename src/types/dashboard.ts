export interface MetricValue {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface ContentSource {
  id: string;
  name: string;
  type: string;
  status: string;
  lastUpdate: string;
  metrics: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface ContentAction {
  id: string;
  type: string;
  description: string;
  platform: string;
  status: string;
  timestamp: string;
}

export interface DashboardData {
  metrics: MetricValue[];
  alerts: ContentAlert[];
  classifiedAlerts: ContentAlert[];
  sources: ContentSource[];
  actions: ContentAction[];
  toneStyles: ToneStyle[];
  recentActivity: ActivityItem[];
  seoContent: string;
  negativeContent: number;
  positiveContent: number;
  neutralContent: number;
}

export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  url?: string;
  status: 'new' | 'read' | 'dismissed';
  threatType?: string;
  detectedEntities?: string[];
  confidenceScore?: number;
  potentialReach?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  recommendation?: string;
  sourceType?: string;
}

export interface ToneStyle {
  id: string;
  name: string;
  description: string;
}

export type ResponseToneStyle = 'professional' | 'casual' | 'empathetic' | 'assertive';

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}
