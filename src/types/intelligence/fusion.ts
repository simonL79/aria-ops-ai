
export interface ThreatCorrelation {
  id: string;
  threats: string[]; // threat IDs
  correlationType: 'language_similarity' | 'username_pattern' | 'geolocation' | 'timing_pattern';
  confidence: number; // 0-1
  similarityScore: number;
  metadata: {
    sharedTokens?: string[];
    usernames?: string[];
    locations?: string[];
    timeWindow?: { start: Date; end: Date };
  };
  caseThreadId?: string;
}

export interface CaseThread {
  id: string;
  title: string;
  status: 'active' | 'monitoring' | 'closed';
  threats: string[];
  correlations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAnalyst?: string;
  created: Date;
  lastActivity: Date;
  tags: string[];
  summary: string;
}

export interface OSINTEnrichment {
  domain?: {
    whois: any;
    dnsHistory: any[];
    reputation: number;
  };
  archive?: {
    snapshots: any[];
    changes: any[];
  };
  threatFeeds?: {
    knownActor: boolean;
    ttps: string[];
    confidence: number;
  };
}

export interface AttributionAssessment {
  suspectedOrigin: 'individual' | 'botnet' | 'campaign' | 'unknown';
  intentProfile: 'harassment' | 'disinformation' | 'reputation_damage' | 'competitive' | 'personal';
  coordinationScore: number; // 0-1
  confidence: number; // 0-1
  indicators: string[];
  reasoning: string;
}
