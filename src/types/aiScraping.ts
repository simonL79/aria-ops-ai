
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
