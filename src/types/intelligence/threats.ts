
import React from 'react';

// Define content threat type
export type ContentThreatType = 
  'falseReviews' | 
  'coordinatedAttack' | 
  'competitorSmear' | 
  'botActivity' | 
  'misinformation' | 
  'legalRisk' | 
  'viralThreat';

// Define a content threat interface that contains more information
export interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactElement;
  detectionRate: number;
  difficulty: 'easy' | 'moderate' | 'hard';
}

// For threat vectors and analysis
export interface ThreatVector {
  type: string;
  count: number; 
  severity: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  examples: string[];
}

// For threat classification
export interface ThreatClassifierRequest {
  content: string;
  platform: string;
  brand: string;
  context?: string;
}

export interface ThreatClassificationResult {
  category: 'Neutral' | 'Positive' | 'Complaint' | 'Reputation Threat' | 'Misinformation' | 'Legal Risk';
  severity: number; // 1-10
  recommendation: string;
  ai_reasoning: string;
  explanation?: string;
  confidence?: number;
  action?: string;
}

// For managing threat collection sources
export interface ThreatSource {
  id: string;
  name: string;
  type: 'social' | 'news' | 'review' | 'messaging' | 'dark';
  platform: string;
  active: boolean;
  lastScan?: string;
  credentials: {
    type: 'api' | 'oauth' | 'bot' | 'business' | 'credentials';
    status: 'valid' | 'invalid' | 'expired';
  };
}

// Alert severity definition
export type AlertSeverity = 'low' | 'medium' | 'high';
