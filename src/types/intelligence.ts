
// Intelligence System Types

export type IntelligenceLevel = 'basic' | 'advanced' | 'enterprise' | 'expert';

export type AlertSeverity = 'high' | 'medium' | 'low';

export type AlertSourceType = 'social' | 'review' | 'news' | 'forum' | 'darkweb';

export type ContentThreatType = 
  | 'falseReviews' 
  | 'coordinatedAttack' 
  | 'competitorSmear' 
  | 'botActivity' 
  | 'misinformation' 
  | 'legalRisk'
  | 'viralThreat';

export interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactElement;
  detectionRate: number;
  difficulty: string;
}

export interface IntelligenceStrategy {
  name: string;
  description: string;
  effectivenessRate: number;
  platforms: string[];
  timeToImplement: string;
  icon: React.ReactElement;
}

export interface ThreatSource {
  id: string;
  name: string;
  type: 'social' | 'news' | 'review' | 'forum' | 'dark';
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials?: {
    type: 'api' | 'oauth' | 'credentials';
    status: 'valid' | 'expired' | 'invalid';
  }
}

export interface IntelligenceReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  threatLevel: number;
  topics: string[];
  sources: number;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ThreatVector {
  type: ContentThreatType;
  count: number;
  severity: number; // 1-10
  trend: 'increasing' | 'stable' | 'decreasing';
  examples: string[];
}

export interface DataSourceStats {
  source: string;
  mentions: number;
  sentiment: number; // -10 to 10
  coverage: number; // percentage
}

export const getIntelligenceLevelColor = (level: IntelligenceLevel): string => {
  switch (level) {
    case 'basic':
      return 'bg-blue-600';
    case 'advanced':
      return 'bg-purple-600';
    case 'enterprise':
      return 'bg-indigo-800';
    case 'expert':
      return 'bg-red-700';
    default:
      return 'bg-gray-500';
  }
};

export const threatTypeLabels: Record<ContentThreatType, string> = {
  falseReviews: 'False Reviews',
  coordinatedAttack: 'Coordinated Attack',
  competitorSmear: 'Competitor Smear',
  botActivity: 'Bot Activity',
  misinformation: 'Misinformation',
  legalRisk: 'Legal Risk',
  viralThreat: 'Viral Threat'
};

export const threatTypeSeverity: Record<ContentThreatType, number> = {
  falseReviews: 6,
  coordinatedAttack: 9,
  competitorSmear: 7,
  botActivity: 5,
  misinformation: 8,
  legalRisk: 10,
  viralThreat: 9
};
