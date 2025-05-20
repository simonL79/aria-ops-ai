
export interface ScrapingSource {
  id: string;
  name: string;
  type: 'google' | 'news' | 'manual' | 'crawler' | 'zapier' | 'rss' | 'custom-search' | 'headless' | 'common-crawl';
  enabled: boolean;
  lastScan?: string;
  config?: {
    query?: string;
    url?: string;
    customHeaders?: Record<string, string>;
    cronSchedule?: string;
    maxResults?: number;
    feedUrl?: string;
    useProxy?: boolean;
    browserOptions?: {
      headless: boolean;
      userAgent?: string;
      waitForSelector?: string;
    };
    filterKeywords?: string[];
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

export interface EntityWatchlist {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location';
  keywords: string[];
  sources: string[];
  alertThreshold: number; // Risk score threshold for alerts
  lastScan?: string;
  scanFrequency: 'daily' | 'weekly' | 'monthly';
  autoRespond: boolean; // Whether to generate responses automatically
  createdAt: string;
  updatedAt: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'openai' | 'huggingface' | 'custom';
  usage: 'sentiment' | 'classification' | 'response' | 'summary';
  config: {
    model: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
    endpoint?: string;
    useLocal?: boolean;
  };
  costPerToken?: number;
  active: boolean;
}

export interface ScanResultStats {
  totalScanned: number;
  risksIdentified: number;
  averageRiskScore: number;
  sourcesDistribution: Record<string, number>;
  scanDuration: number;
}
