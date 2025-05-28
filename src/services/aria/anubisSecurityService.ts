
import { supabase } from '@/integrations/supabase/client';

export interface AnubisTestResult {
  id: string;
  module: string;
  test_name: string;
  passed: boolean;
  execution_time_ms: number;
  error_message?: string;
  tested_at: string;
}

export interface HotwordEvent {
  id: string;
  user_id: string;
  hotword: string;
  captured_phrase: string;
  triggered: boolean;
  detected_at: string;
}

export interface SlackEvent {
  id: string;
  channel: string;
  event_type: string;
  payload: any;
  dispatched: boolean;
  dispatched_at?: string;
  created_at: string;
}

export interface MobileSession {
  id: string;
  user_id: string;
  device_name: string;
  platform: 'iOS' | 'Android' | 'WebApp';
  push_token?: string;
  last_seen: string;
  active: boolean;
}

export interface AIAttackLog {
  id: string;
  source: string;
  prompt: string;
  attack_vector: string;
  confidence_score: number;
  mitigation_action?: string;
  created_at: string;
}

class AnubisSecurityService {
  // Test Results Management
  async logTestResult(testData: {
    module: string;
    test_name: string;
    passed: boolean;
    execution_time_ms: number;
    error_message?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_test_results')
        .insert(testData);

      if (error) {
        console.error('Error logging test result:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in logTestResult:', error);
      return false;
    }
  }

  async getTestResults(module?: string, limit = 50): Promise<AnubisTestResult[]> {
    try {
      let query = supabase
        .from('anubis_test_results')
        .select('*')
        .order('tested_at', { ascending: false })
        .limit(limit);

      if (module) {
        query = query.eq('module', module);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching test results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTestResults:', error);
      return [];
    }
  }

  // Hotword Detection
  async logHotwordEvent(eventData: {
    user_id: string;
    hotword?: string;
    captured_phrase: string;
    triggered: boolean;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_hotword_events')
        .insert(eventData);

      if (error) {
        console.error('Error logging hotword event:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in logHotwordEvent:', error);
      return false;
    }
  }

  async getHotwordEvents(userId?: string, limit = 50): Promise<HotwordEvent[]> {
    try {
      let query = supabase
        .from('anubis_hotword_events')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching hotword events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHotwordEvents:', error);
      return [];
    }
  }

  // Slack Integration
  async queueSlackEvent(eventData: {
    channel: string;
    event_type: string;
    payload: any;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_slack_events')
        .insert(eventData);

      if (error) {
        console.error('Error queueing Slack event:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in queueSlackEvent:', error);
      return false;
    }
  }

  async markSlackEventDispatched(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_slack_events')
        .update({
          dispatched: true,
          dispatched_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Error marking Slack event as dispatched:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in markSlackEventDispatched:', error);
      return false;
    }
  }

  async getPendingSlackEvents(): Promise<SlackEvent[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_slack_events')
        .select('*')
        .eq('dispatched', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching pending Slack events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingSlackEvents:', error);
      return [];
    }
  }

  // Mobile Session Management
  async registerMobileSession(sessionData: {
    user_id: string;
    device_name: string;
    platform: 'iOS' | 'Android' | 'WebApp';
    push_token?: string;
  }): Promise<boolean> {
    try {
      // First deactivate any existing sessions for this user/device
      await supabase
        .from('anubis_mobile_sessions')
        .update({ active: false })
        .eq('user_id', sessionData.user_id)
        .eq('device_name', sessionData.device_name);

      // Insert new active session
      const { error } = await supabase
        .from('anubis_mobile_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Error registering mobile session:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in registerMobileSession:', error);
      return false;
    }
  }

  async updateMobileSessionActivity(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_mobile_sessions')
        .update({
          last_seen: new Date().toISOString(),
          active: true
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating mobile session activity:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in updateMobileSessionActivity:', error);
      return false;
    }
  }

  async getActiveMobileSessions(userId?: string): Promise<MobileSession[]> {
    try {
      let query = supabase
        .from('anubis_mobile_sessions')
        .select('*')
        .eq('active', true)
        .order('last_seen', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching active mobile sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveMobileSessions:', error);
      return [];
    }
  }

  // AI Attack Detection
  async logAIAttack(attackData: {
    source: string;
    prompt: string;
    attack_vector: string;
    confidence_score: number;
    mitigation_action?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('anubis_ai_attack_log')
        .insert(attackData);

      if (error) {
        console.error('Error logging AI attack:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in logAIAttack:', error);
      return false;
    }
  }

  async getAIAttackLogs(limit = 50): Promise<AIAttackLog[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_ai_attack_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching AI attack logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAIAttackLogs:', error);
      return [];
    }
  }

  async getHighConfidenceAttacks(threshold = 0.8): Promise<AIAttackLog[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_ai_attack_log')
        .select('*')
        .gte('confidence_score', threshold)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching high confidence attacks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHighConfidenceAttacks:', error);
      return [];
    }
  }

  // Analytics and Reporting
  async getSecurityMetrics(): Promise<{
    totalTests: number;
    passedTests: number;
    failedTests: number;
    hotwordTriggers: number;
    activeSessions: number;
    attacksDetected: number;
    highRiskAttacks: number;
  }> {
    try {
      const [testResults, hotwordEvents, mobileSessions, attackLogs] = await Promise.all([
        this.getTestResults(undefined, 1000),
        this.getHotwordEvents(undefined, 1000),
        this.getActiveMobileSessions(),
        this.getAIAttackLogs(1000)
      ]);

      const totalTests = testResults.length;
      const passedTests = testResults.filter(t => t.passed).length;
      const failedTests = totalTests - passedTests;
      const hotwordTriggers = hotwordEvents.filter(h => h.triggered).length;
      const activeSessions = mobileSessions.length;
      const attacksDetected = attackLogs.length;
      const highRiskAttacks = attackLogs.filter(a => a.confidence_score >= 0.8).length;

      return {
        totalTests,
        passedTests,
        failedTests,
        hotwordTriggers,
        activeSessions,
        attacksDetected,
        highRiskAttacks
      };
    } catch (error) {
      console.error('Error getting security metrics:', error);
      return {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        hotwordTriggers: 0,
        activeSessions: 0,
        attacksDetected: 0,
        highRiskAttacks: 0
      };
    }
  }

  // Hotword detection for voice commands
  detectHotword(transcript: string, userId: string): boolean {
    const hotwords = ['hey anubis', 'anubis', 'aria'];
    const lowerTranscript = transcript.toLowerCase();
    
    for (const hotword of hotwords) {
      if (lowerTranscript.includes(hotword)) {
        // Log the hotword detection
        this.logHotwordEvent({
          user_id: userId,
          hotword: hotword,
          captured_phrase: transcript,
          triggered: true
        });
        return true;
      }
    }

    // Log non-triggered phrases for analysis
    if (transcript.length > 5) {
      this.logHotwordEvent({
        user_id: userId,
        hotword: 'none',
        captured_phrase: transcript,
        triggered: false
      });
    }

    return false;
  }

  // AI prompt injection detection
  analyzePromptForAttacks(prompt: string, source: string): {
    isAttack: boolean;
    attackVector?: string;
    confidence: number;
  } {
    const injectionPatterns = [
      { pattern: /ignore.*previous.*instructions/i, vector: 'instruction_override', weight: 0.9 },
      { pattern: /\bprompt\b.*\binjection\b/i, vector: 'prompt_injection', weight: 0.8 },
      { pattern: /system.*role.*admin/i, vector: 'role_escalation', weight: 0.7 },
      { pattern: /forget.*context/i, vector: 'context_manipulation', weight: 0.6 },
      { pattern: /\bjailbreak\b/i, vector: 'jailbreak_attempt', weight: 0.8 },
      { pattern: /reveal.*system.*prompt/i, vector: 'prompt_extraction', weight: 0.7 }
    ];

    let maxConfidence = 0;
    let detectedVector = '';

    for (const { pattern, vector, weight } of injectionPatterns) {
      if (pattern.test(prompt)) {
        if (weight > maxConfidence) {
          maxConfidence = weight;
          detectedVector = vector;
        }
      }
    }

    const isAttack = maxConfidence > 0.5;

    if (isAttack) {
      // Log the detected attack
      this.logAIAttack({
        source,
        prompt: prompt.substring(0, 500), // Limit prompt length for storage
        attack_vector: detectedVector,
        confidence_score: maxConfidence,
        mitigation_action: 'prompt_blocked'
      });
    }

    return {
      isAttack,
      attackVector: isAttack ? detectedVector : undefined,
      confidence: maxConfidence
    };
  }
}

export const anubisSecurityService = new AnubisSecurityService();
