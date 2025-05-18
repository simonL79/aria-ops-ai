
// Define content alert type
export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'actioned' | 'read';
  threatType?: 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity' | 'misinformation' | 'legalRisk' | 'viralThreat';
  confidenceScore?: number;
  sourceType?: 'social' | 'review' | 'news' | 'forum' | 'darkweb';
  sentiment?: 'negative' | 'neutral' | 'sarcastic' | 'threatening';
  potentialReach?: number;
  detectedEntities?: string[];
}

// Define source type
export interface ContentSource {
  name: string;
  status: 'critical' | 'warning' | 'good';
  positiveRatio: number;
  total: number;
}

// Define action type
export interface ContentAction {
  id: string;
  platform: string;
  action: 'removal_requested' | 'reported' | 'content_hidden' | 'auto_responded';
  date: string;
  status: 'completed' | 'pending' | 'rejected';
}

// Define test profile data type
export interface TestProfileData {
  reputationScore: number;
  previousScore: number;
  sources: ContentSource[];
  alerts: ContentAlert[];
  metrics: {
    monitoredSources: number;
    negativeContent: number;
    removedContent: number;
  };
}

// Define SEO Content type
export interface SeoContent {
  id: string;
  title: string;
  keywords: string[];
  status: 'draft' | 'optimizing' | 'published' | 'indexed';
  dateCreated: string;
  publishDate?: string;
  url?: string;
  score?: number;
}

// Define auto-response settings
export interface AutoResponseSettings {
  enabled: boolean;
  threshold: 'all' | 'high' | 'medium' | 'none';
  reviewRequired: boolean;
  defaultTone: ResponseToneStyle;
}

// Define response tone styles
export type ResponseToneStyle = 
  'professional' | 
  'friendly' | 
  'formal' | 
  'casual' | 
  'humorous' | 
  'apologetic' | 
  'technical' | 
  'empathetic';
