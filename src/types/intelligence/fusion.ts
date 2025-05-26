
export interface ThreatCorrelation {
  id: string;
  threats: string[];
  correlationType: 'language_similarity' | 'username_pattern' | 'timing_pattern' | 'behavioral_pattern' | 'geolocation';
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

export interface OSINTEnrichment {
  id?: string;
  sourceType?: 'social_media' | 'news' | 'forum' | 'blog' | 'government' | 'academic';
  credibilityScore?: number;
  lastUpdated?: Date;
  metadata?: {
    author?: string;
    domain?: string;
    verificationStatus?: 'verified' | 'unverified' | 'disputed';
    crossReferences?: string[];
  };
  enrichedData?: {
    geolocation?: {
      country: string;
      region?: string;
      coordinates?: [number, number];
    };
    sentiment?: {
      score: number;
      magnitude: number;
    };
    entities?: {
      persons: string[];
      organizations: string[];
      locations: string[];
    };
  };
  // Additional properties used in the implementation
  domain?: any;
  archive?: any;
  threatFeeds?: any;
}

export interface AttributionAssessment {
  id?: string;
  confidence: number;
  attributionType?: 'individual' | 'group' | 'organization' | 'state_actor' | 'unknown';
  indicators: string[] | {
    linguistic: {
      patterns: string[];
      language: string;
      dialectMarkers?: string[];
    };
    technical: {
      ipGeolocation?: string[];
      deviceFingerprints?: string[];
      networkPatterns?: string[];
    };
    behavioral: {
      activityPatterns: string[];
      timingAnalysis: {
        timezone?: string;
        activeHours?: number[];
      };
    };
  };
  relatedThreats?: string[];
  assessedBy?: string;
  assessmentDate?: Date;
  // Properties used in the implementation
  suspectedOrigin: 'unknown' | 'individual' | 'botnet' | 'campaign';
  intentProfile: 'harassment' | 'disinformation' | 'competitive' | 'reputation_damage' | 'personal';
  coordinationScore: number;
  reasoning: string;
}
