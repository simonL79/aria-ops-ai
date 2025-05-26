
export interface ThreatCorrelation {
  id: string;
  threats: string[];
  correlationType: 'language_similarity' | 'username_pattern' | 'timing_pattern' | 'behavioral_pattern';
  confidence: number;
  similarityScore: number;
  metadata: {
    sharedTokens?: string[];
    usernames?: string[];
    timeWindow?: {
      start: Date;
      end: Date;
    };
    [key: string]: any;
  };
}

export interface CaseThread {
  id: string;
  title: string;
  status: 'active' | 'monitoring' | 'closed';
  threats: string[];
  correlations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  created: Date;
  lastActivity: Date;
  tags: string[];
  summary: string;
  assignedAnalyst?: string;
}

export interface FusionIntelligence {
  correlations: ThreatCorrelation[];
  caseThreads: CaseThread[];
  riskAssessment: {
    overallThreatLevel: number;
    criticalVectors: string[];
    emergingPatterns: string[];
  };
}
