
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  contactname: string;
  contactemail: string;
  industry: string;
  website?: string;
  notes?: string;
  client_type: 'brand' | 'individual' | 'organization';
  keywordtargets?: string;
  eidetic_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScanSubmission {
  id: string;
  full_name: string;
  email: string;
  keywords: string;
  status: 'new' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  url?: string;
  severity?: string;
  status?: string;
  threat_type?: string;
  confidence_score?: number;
  potential_reach?: number;
  detected_entities?: Record<string, any>;
  sentiment?: number;
  client_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadMagnet {
  id: string;
  name: string;
  email: string;
  lead_magnet: string;
  status: 'new' | 'contacted' | 'converted' | 'unqualified';
  created_at: string;
  updated_at: string;
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'dismissed';
export type ThreatType = 'reputation' | 'security' | 'compliance' | 'operational';
