
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnubisSecurityEvent {
  event_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
}

export interface SlackEvent {
  channel: string;
  event_type: string;
  payload: any;
}

export interface TestResult {
  module: string;
  test_name: string;
  passed: boolean;
  execution_time_ms: number;
  error_message?: string;
}

export interface MobileSession {
  user_id: string;
  device_name: string;
  platform: 'iOS' | 'Android' | 'WebApp';
  push_token?: string;
}

export interface AIAttack {
  source: string;
  prompt: string;
  attack_vector: string;
  confidence_score: number;
  mitigation_action?: string;
}

export interface SecurityMetrics {
  attacksDetected: number;
  activeSessions: number;
  threatLevel: string;
  lastUpdate: string;
}

export class AnubisSecurityService {
  
  static async logSecurityEvent(
    eventType: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    userId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: eventType,
          details: description,
          entity_type: 'security_event',
          user_id: userId
        });

      if (error) {
        console.error('Failed to log security event:', error);
        return false;
      }

      console.log(`🔒 Security event logged: ${eventType} - ${severity}`);
      return true;
    } catch (error) {
      console.error('Security event logging failed:', error);
      return false;
    }
  }

  static async queueSlackEvent(event: SlackEvent): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'slack_event_queued',
          details: JSON.stringify(event),
          entity_type: 'slack_integration'
        });

      return !error;
    } catch (error) {
      console.error('Failed to queue Slack event:', error);
      return false;
    }
  }

  static async logTestResult(result: TestResult): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'test_result',
          details: JSON.stringify(result),
          entity_type: 'qa_testing'
        });

      return !error;
    } catch (error) {
      console.error('Failed to log test result:', error);
      return false;
    }
  }

  static async registerMobileSession(session: MobileSession): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'mobile_session_registered',
          details: JSON.stringify(session),
          entity_type: 'mobile_session',
          user_id: session.user_id
        });

      return !error;
    } catch (error) {
      console.error('Failed to register mobile session:', error);
      return false;
    }
  }

  static async logAIAttack(attack: AIAttack): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'ai_attack_detected',
          details: JSON.stringify(attack),
          entity_type: 'ai_security'
        });

      return !error;
    } catch (error) {
      console.error('Failed to log AI attack:', error);
      return false;
    }
  }

  static async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'security_event')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      return {
        attacksDetected: data?.length || 0,
        activeSessions: 1, // Mock value
        threatLevel: 'low',
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return {
        attacksDetected: 0,
        activeSessions: 0,
        threatLevel: 'unknown',
        lastUpdate: new Date().toISOString()
      };
    }
  }

  static detectHotword(phrase: string, userId: string): boolean {
    const hotwords = ['anubis', 'aria', 'emergency', 'security', 'threat'];
    const detected = hotwords.some(word => phrase.toLowerCase().includes(word));
    
    if (detected) {
      this.logSecurityEvent(
        'hotword_detected',
        `Hotword detected in phrase: "${phrase}"`,
        'medium',
        userId
      );
    }
    
    return detected;
  }

  static async emergencyShutdown(reason: string): Promise<boolean> {
    try {
      console.warn('🚨 ANUBIS EMERGENCY SHUTDOWN INITIATED:', reason);
      
      await supabase
        .from('activity_logs')
        .insert({
          action: 'emergency_shutdown',
          details: `Emergency shutdown initiated: ${reason}`,
          entity_type: 'system_emergency'
        });
      
      toast.error(`Emergency shutdown: ${reason}`);
      return true;
    } catch (error) {
      console.error('Failed to execute emergency shutdown:', error);
      return false;
    }
  }

  static async validateSystemIntegrity(): Promise<boolean> {
    try {
      // Basic integrity check using existing tables
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('System integrity validation failed:', error);
      return false;
    }
  }
}
