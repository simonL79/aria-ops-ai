
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
  // For client matching
  associatedClientId?: string;
  associatedClientName?: string;
}

export type NewsAPISource = 'newsapi' | 'serpapi' | 'newsdata' | 'rss';

export interface RadarFilters {
  timeframe: 'last24h' | 'last3d' | 'lastWeek';
  entityTypes: ('person' | 'organization' | 'location')[];
  minRiskScore: number;
  sources: string[];
  categories: string[];
}

// For takedown templates
export interface TakedownTemplate {
  id: string;
  name: string;
  type: 'dmca' | 'legal' | 'correction' | 'right_to_be_forgotten';
  template: string;
  variables: string[];
}

// For notification preferences
export interface NotificationPreference {
  id: string;
  channel: 'email' | 'slack' | 'sms' | 'app';
  minSeverity: number;
  recipients: string[];
  active: boolean;
}

// For response suggestions
export interface ResponseSuggestion {
  entityId: string;
  entityName: string;
  articleId: string;
  suggestion: string;
  tone: 'professional' | 'apologetic' | 'clarifying' | 'defensive';
  generatedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
}

// For client matching
export interface ClientMatchConfig {
  clientId: string;
  clientName: string;
  keywords: string[];
  executives: string[];
  brands: string[];
  competitors: string[];
  alertThreshold: number;
}
