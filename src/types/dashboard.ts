
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

export type ResponseToneStyle = 
  | 'professional' 
  | 'friendly' 
  | 'formal' 
  | 'casual' 
  | 'humorous' 
  | 'apologetic' 
  | 'technical' 
  | 'empathetic';

export interface SeoContent {
  id: string;
  title: string;
  url: string;
  rank: number;
  impression: number;
  content: string;
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
  status?: string;
  type?: string;
  score?: number;
  publishDate?: string;
}

export interface DashboardMainContentProps {
  metrics: MetricValue[];
  alerts: ContentAlert[];
  classifiedAlerts: ContentAlert[];
  sources: ContentSource[];
  actions: ContentAction[];
  toneStyles: ResponseToneStyle[];
  recentActivity: any[];
  seoContent: SeoContent[];
  negativeContent: number;
  positiveContent: number;
  neutralContent: number;
  onSimulateNewData: () => void;
  loading: boolean;
  error: string | null;
  fetchData: () => void;
  filteredAlerts: ContentAlert[];
  onFilterChange: (filters: any) => void;
  reputationScore?: number;
  previousScore?: number;
  selectedClient?: any;
  clientEntities?: any[];
}
