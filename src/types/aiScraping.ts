
export interface ScanParameters {
  platforms?: string[];
  keywordFilters?: string[];
  maxResults: number;
  prioritizeSeverity?: 'high' | 'medium' | 'low';
  includeCustomerEnquiries: boolean;
}

export interface AiScrapingResult {
  id: string;
  content: string;
  platform: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral' | 'threatening';
  entities: string[];
}

export interface ScrapingSource {
  id: string;
  name: string;
  type: 'google' | 'news' | 'manual' | 'crawler' | 'zapier';
  enabled: boolean;
  config?: {
    maxResults?: number;
    url?: string;
    [key: string]: any;
  };
  lastScan?: string;
}

export interface ScrapingResult {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: string;
  entityName: string;
  entityType: string;
  content: string;
  url?: string;
  timestamp: string;
  sentiment: number; // -1 to 1
  riskScore?: number;
  category?: string;
  aiAnalysis?: {
    summary?: string;
    recommendation?: string;
    threatClassification?: string;
  };
  processed: boolean;
  notified: boolean;
}

export interface ScrapingQuery {
  query: string;
  entityTypes: ('person' | 'organization' | 'location')[];
  maxResults: number;
  sources?: string[];
  filters?: {
    minRiskScore?: number;
    sentiment?: 'positive' | 'negative' | 'neutral' | 'threatening';
  };
}

export interface ModelConfig {
  id: string;
  name: string;
  type: 'openai' | 'huggingface' | 'custom';
  usage: 'sentiment' | 'classification' | 'response' | 'summary';
  isDefault?: boolean;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  config: {
    model: string;
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
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
  scanDuration: number;
  sourcesDistribution: Record<string, number>;
  timeDistribution?: Record<string, number>;
  entityDistribution?: Record<string, number>;
}

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
  entityType: 'person' | 'organization' | 'location' | 'keyword';
  type?: 'person' | 'organization' | 'location';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  keywords?: string[];
  sources?: string[];
  alertThreshold?: number;
  scanFrequency?: 'daily' | 'weekly' | 'monthly';
  autoRespond?: boolean;
  autoAlert: boolean;
  createdAt: string;
  updatedAt?: string;
  lastScan?: string;
  lastAlertAt?: string;
}
