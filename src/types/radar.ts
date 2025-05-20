
import { ThreatClassificationResult } from "./intelligence";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishDate: string;
  snippet: string;
  content?: string;
  imageUrl?: string;
}

export interface EntityMention {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location';
  articles: NewsArticle[];
  sentiment: number;
  riskCategory?: string;
  riskScore: number;
  firstDetected: string;
  threatClassification?: ThreatClassificationResult;
  outreachStatus?: 'pending' | 'drafted' | 'sent' | 'responded' | 'converted';
  outreachDraft?: string;
}

export type NewsAPISource = 'newsapi' | 'serpapi' | 'newsdata' | 'rss';

export interface RadarFilters {
  timeframe: 'last24h' | 'last3d' | 'lastWeek';
  entityTypes: ('person' | 'organization' | 'location')[];
  minRiskScore: number;
  sources: string[];
  categories: string[];
}
