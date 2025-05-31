
export interface SentinelClient {
  id: string;
  client_name: string;
  entity_names: string[];
  contact_email: string;
  protection_level: 'basic' | 'standard' | 'premium' | 'enterprise';
  guardian_mode_enabled: boolean;
  auto_response_enabled: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  status: 'active' | 'paused' | 'terminated';
}

export interface SentinelThreatDiscovery {
  id: string;
  client_id: string;
  entity_name: string;
  threat_content: string;
  platform: string;
  source_url?: string;
  social_handle?: string;
  threat_type: 'reputation_risk' | 'legal_threat' | 'product_issue' | 'misinformation' | 'harassment' | 'competitive_attack';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  potential_reach?: number;
  discovery_method: 'live_scan' | 'deep_scan' | 'guardian_monitoring' | 'manual_input';
  discovered_at: string;
  last_verified: string;
  status: 'active' | 'resolved' | 'monitoring' | 'false_positive';
  created_at: string;
}

export interface SentinelResponsePlan {
  id: string;
  threat_id: string;
  plan_type: 'soft' | 'hard' | 'nuclear';
  strategy_summary: string;
  specific_actions: ResponseAction[];
  estimated_effectiveness: number;
  time_to_execute: string;
  resource_requirements?: string;
  risk_assessment?: string;
  success_criteria?: string;
  generated_by: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface ResponseAction {
  type: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  estimated_time?: string;
  resources_needed?: string[];
}

export interface SentinelMissionLog {
  id: string;
  plan_id: string;
  client_id: string;
  action_type: string;
  action_details: Record<string, any>;
  execution_status: 'pending' | 'executing' | 'completed' | 'failed' | 'escalated';
  started_at?: string;
  completed_at?: string;
  result_summary?: string;
  effectiveness_score?: number;
  next_action_recommended?: string;
  executed_by: string;
  created_at: string;
}

export interface SentinelGuardianRegistry {
  id: string;
  client_id: string;
  entity_name: string;
  monitoring_keywords: string[];
  alert_threshold: 'low' | 'medium' | 'high' | 'any';
  auto_response_enabled: boolean;
  last_scan: string;
  scan_frequency_minutes: number;
  total_threats_detected: number;
  threats_resolved: number;
  status: 'active' | 'paused' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface ThreatDiscoveryResult {
  threat_count: number;
  discovery_summary: string;
}

export interface ResponsePlanGeneration {
  plan_type: string;
  strategy_summary: string;
  actions_count: number;
}
