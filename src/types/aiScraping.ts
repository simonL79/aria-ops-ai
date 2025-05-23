
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
  sentiment: 'positive' | 'negative' | 'neutral';
  entities: string[];
}
