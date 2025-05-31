
export interface MetricValue {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
  name?: string; // Added for compatibility with dashboardApiService
  delta?: number; // Added for dashboardApiService compatibility
  deltaType?: 'increase' | 'decrease'; // Added for dashboardApiService compatibility
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
  // Additional properties used in some parts of the code
  positiveRatio?: number;
  total?: number;
  active?: boolean;
  lastUpdated?: string;
  mentionCount?: number;
  sentiment?: number;
}

export interface ContentAction {
  id: string;
  type: "urgent" | "monitoring" | "response";
  description: string;
  platform: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  // Additional properties used in some parts of the code
  action?: string;
  date?: string;
  user?: string;
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
  status: 'new' | 'read' | 'dismissed' | 'actioned' | 'reviewing' | 'resolved';
  threatType?: string;
  detectedEntities?: string[];
  confidenceScore?: number;
  potentialReach?: number;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'threatening';
  category?: string;
  recommendation?: string;
  sourceType?: string; // Added this missing property
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

export interface AutoResponseSettings {
  enabled: boolean;
  tone: ResponseToneStyle;
  language: string;
  responseDelay: number;
  keywords: string[];
  platforms: string[];
  threshold?: number;
  reviewRequired?: boolean;
  defaultTone?: ResponseToneStyle;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  tone: ResponseToneStyle;
  type?: string;
  icon?: string;
  description?: string;
  template?: string;
}

export interface SourceData {
  id: string;
  name: string;
  status: string;
  positiveRatio: number;
  total: number;
}

export interface SeoContent {
  id: string;
  title: string;
  url: string;
  rank: number;
  impression: number;
  content?: string;
  keywords?: string[];
  priority?: 'high' | 'medium' | 'low';
  status?: string;
  type?: string;
  score?: number;
  publishDate?: string;
}

export interface DashboardHeaderProps {
  title?: string;
  description?: string;
  onRefresh?: () => Promise<void>;
  totalAlerts?: number;
  highSeverityAlerts?: number;
}

export interface DashboardMainContentProps {
  metrics?: MetricValue[];
  alerts?: ContentAlert[];
  classifiedAlerts?: ContentAlert[];
  sources?: ContentSource[];
  actions?: ContentAction[];
  toneStyles?: any;
  recentActivity?: any;
  seoContent?: any;
  negativeContent?: number;
  positiveContent?: number;
  neutralContent?: number;
  onSimulateNewData?: (scanResults: any[]) => void;
  reputationScore?: number;
  previousScore?: number;
  filteredAlerts?: ContentAlert[];
  onFilterChange?: (filters: { platforms: string[]; severities: string[]; statuses: string[] }) => void;
  loading?: boolean;
  error?: string | null;
  fetchData?: () => Promise<void>;
  selectedClient?: any;
  clientEntities?: any[];
}
