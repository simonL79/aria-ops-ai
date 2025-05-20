
export interface EntityMention {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location';
  articles: NewsArticle[];
  sentiment: number;
  riskCategory: string;
  riskScore: number;
  firstDetected: string;
  outreachStatus: 'pending' | 'drafted' | 'sent' | 'responded' | 'converted';
  outreachDraft?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishDate: string;
  snippet: string;
  imageUrl?: string;
}

export interface RadarFilters {
  timeframe: 'last24h' | 'last7d' | 'last30d' | 'thisMonth' | 'last3d' | 'lastWeek';
  entityTypes: ('person' | 'organization' | 'location')[];
  minRiskScore: number;
  industries?: string[];
  riskLevels?: string[];
  sentimentType?: 'positive' | 'negative' | 'neutral' | 'all';
  sources?: string[];
  categories?: string[];
}
