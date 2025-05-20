
export interface ScrapingSource {
  id: string;
  name: string;
  type: 'google' | 'news' | 'manual' | 'crawler' | 'zapier';
  enabled: boolean;
  lastScan?: string;
  config?: {
    query?: string;
    url?: string;
    customHeaders?: Record<string, string>;
    cronSchedule?: string;
    maxResults?: number;
  };
}

export interface ScrapingResult {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: string;
  entityName: string;
  entityType: 'person' | 'organization' | 'location';
  content: string;
  url?: string;
  timestamp: string;
  sentiment: number;
  category?: string;
  riskScore?: number;
  aiAnalysis?: {
    summary?: string;
    recommendation?: string;
    threatClassification?: string;
  };
  processed: boolean;
  notified?: boolean; // Whether this result has been included in a notification
}

export interface ScrapingQuery {
  query: string;
  sources?: string[];
  entityTypes?: ('person' | 'organization' | 'location')[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  maxResults?: number;
}

export interface GPTPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  usage: 'web' | 'search' | 'social' | 'reputation' | 'response';
}

export type ResponseToneType = 'empathetic' | 'legal' | 'confident' | 'firm';

export interface EmailDigestSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'immediate';
  minRiskScore: number;
  recipients: string[];
  lastSent?: string;
}
