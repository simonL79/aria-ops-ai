
import { ReactNode } from 'react';

export interface MonitoringSource {
  id: string;
  name: string;
  type: 'social' | 'news' | 'review' | 'forum';
  platform: string;
  enabled: boolean;
  lastScan?: string;
  status: 'active' | 'inactive' | 'error';
  icon: ReactNode;
  description: string;
  requiresSetup?: boolean;
}

export interface ScanResult {
  source: string;
  status: string;
  matches_found: number;
  processed: number;
  results: any[];
  platform?: string;
  threat_severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  threat_summary?: string;
  risk_entity_type?: string;
  risk_entity_name?: string;
  content?: string;
}

export interface AutomationSuggestion {
  type: 'action' | 'email' | 'escalation';
  priority: 'low' | 'medium' | 'high';
  description: string;
  automated: boolean;
}
