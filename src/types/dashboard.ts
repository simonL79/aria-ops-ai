
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
  action: 'removal_requested' | 'reported' | 'content_hidden';
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
