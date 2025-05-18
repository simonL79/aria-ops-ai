
// Define intelligence types
export type IntelligenceLevel = 'basic' | 'advanced' | 'expert';
export type ContentThreatType = 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity' | 'misinformation' | 'legalRisk' | 'viralThreat';

export interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactNode;
  detectionRate: number;
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface IntelligenceStrategy {
  name: string;
  description: string;
  effectivenessRate: number;
  platforms: string[];
  timeToImplement: string;
  icon: React.ReactNode;
}

export const getIntelligenceLevelColor = (level: IntelligenceLevel) => {
  switch (level) {
    case 'basic': 
      return 'bg-blue-500 hover:bg-blue-600';
    case 'advanced':
      return 'bg-purple-600 hover:bg-purple-700';
    case 'expert':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-500';
  }
};

// Content alert specific type additions
export type AlertSeverity = 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'reviewing' | 'actioned';
export type AlertSourceType = 'social' | 'review' | 'news' | 'forum' | 'darkweb';
export type AlertSentiment = 'negative' | 'neutral' | 'sarcastic' | 'threatening';

