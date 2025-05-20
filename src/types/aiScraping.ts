
// Add or ensure these types are defined
export interface ScanParameters {
  platforms?: string[];
  keywords?: string[];
  timeframe?: "day" | "week" | "month";
  intensity?: "low" | "medium" | "high";
  threatTypes?: string[];
  keywordFilters?: string[];
  maxResults?: number;
  includeCustomerEnquiries?: boolean;
  prioritizeSeverity?: "low" | "medium" | "high"; // String, not boolean
}

// ScrapingQuery definition
export interface ScrapingQuery {
  query: string;
  entityTypes: ('person' | 'organization' | 'location')[];
  maxResults: number;
}

// ScrapingResult definition
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
  sentiment: number;
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

// ScrapingSource definition
export interface ScrapingSource {
  id: string;
  name: string;
  type: 'google' | 'news' | 'crawler' | 'manual' | 'zapier';
  enabled: boolean;
  config?: {
    maxResults?: number;
    url?: string;
  };
  lastScan?: string;
}

// EntityWatchlist definition
export interface EntityWatchlist {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location';
  keywords: string[];
  sources: string[];
  alertThreshold: number;
  scanFrequency: 'daily' | 'weekly' | 'monthly';
  autoRespond: boolean;
  lastScan?: string;
  createdAt: string;
  updatedAt: string;
}

// ScanResultStats definition
export interface ScanResultStats {
  totalScanned: number;
  risksIdentified: number;
  averageRiskScore: number;
  scanDuration: number;
  sourcesDistribution: Record<string, number>;
}

// ModelConfig definition
export interface ModelConfig {
  id: string;
  name: string;
  isDefault: boolean;
  parameters: {
    temperature: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
}

// EmailDigestSettings definition
export interface EmailDigestSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'immediate';
  minRiskScore: number;
  recipients: string[];
  lastSent?: string;
}

// Add any other AI scraping related types here
