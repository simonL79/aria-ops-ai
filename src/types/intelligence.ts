
// NOTE: These are legacy types that are gradually being moved to the more organized structure
// in the intelligence/ directory. New code should import from @/types/intelligence directly
// which will provide types from the more organized files.

export type IntelligenceLevel = 'basic' | 'advanced' | 'enterprise';

// These interfaces are now defined in their respective files in the intelligence/ directory
// but are kept here for backward compatibility
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
  type: string;
  count: number;
  severity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  examples: string[];
}

export interface DataSourceStats {
  source: string;
  mentions: number;
  sentiment: number;
  coverage: number;
}

export interface ThreatClassificationResult {
  category: string;
  severity: number;
  recommendation: string;
  action?: string;
  ai_reasoning: string;
  explanation?: string;
  confidence?: number;
}

export interface ThreatClassifierRequest {
  content: string;
  platform: string;
  brand: string;
  context?: string;
}

export const getIntelligenceLevelColor = (level: IntelligenceLevel): string => {
  switch (level) {
    case 'basic':
      return 'bg-blue-600';
    case 'advanced':
      return 'bg-purple-600';
    case 'enterprise':
      return 'bg-amber-600';
    default:
      return 'bg-gray-600';
  }
};
