
import { supabase } from '@/integrations/supabase/client';

interface HotwordEvent {
  captured_phrase: string;
  triggered: boolean;
}

interface AIAttackLog {
  prompt: string;
  attack_vector?: string;
}

class AnubisSecurityService {
  static detectHotword(transcript: string, userId: string): boolean {
    // Simple hotword detection logic
    const hotwords = ['emergency', 'alert', 'crisis', 'urgent'];
    return hotwords.some(word => transcript.toLowerCase().includes(word));
  }

  static analyzePromptForAttacks(prompt: string, inputType: string) {
    // Simple attack detection logic
    const attackPatterns = ['inject', 'bypass', 'override', 'hack'];
    const isAttack = attackPatterns.some(pattern => prompt.toLowerCase().includes(pattern));
    
    return {
      isAttack,
      attackVector: isAttack ? 'prompt_injection' : undefined
    };
  }

  static async queueSlackEvent(event: any): Promise<void> {
    console.log('Slack event queued:', event);
    // Simulate slack notification
  }

  detectHotword(transcript: string, userId: string): boolean {
    return AnubisSecurityService.detectHotword(transcript, userId);
  }

  analyzePromptForAttacks(prompt: string, inputType: string) {
    return AnubisSecurityService.analyzePromptForAttacks(prompt, inputType);
  }

  async queueSlackEvent(event: any): Promise<void> {
    return AnubisSecurityService.queueSlackEvent(event);
  }

  async getHotwordEvents(userId: string, limit: number): Promise<HotwordEvent[]> {
    // Return empty array since table doesn't exist
    return [];
  }

  async getAIAttackLogs(limit: number): Promise<AIAttackLog[]> {
    // Return empty array since table doesn't exist
    return [];
  }

  async logSecurityEvent(event: any): Promise<void> {
    try {
      await supabase.from('activity_logs').insert({
        action: 'security_event',
        details: JSON.stringify(event),
        entity_type: 'security'
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  async logTestResult(result: any): Promise<void> {
    try {
      await supabase.from('activity_logs').insert({
        action: 'test_result',
        details: JSON.stringify(result),
        entity_type: 'test'
      });
    } catch (error) {
      console.error('Error logging test result:', error);
    }
  }

  async registerMobileSession(sessionData: any): Promise<void> {
    try {
      await supabase.from('activity_logs').insert({
        action: 'mobile_session',
        details: JSON.stringify(sessionData),
        entity_type: 'session'
      });
    } catch (error) {
      console.error('Error registering mobile session:', error);
    }
  }

  async logAIAttack(attackData: any): Promise<void> {
    try {
      await supabase.from('activity_logs').insert({
        action: 'ai_attack',
        details: JSON.stringify(attackData),
        entity_type: 'security'
      });
    } catch (error) {
      console.error('Error logging AI attack:', error);
    }
  }

  async getSecurityMetrics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'security')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return {
        totalEvents: data?.length || 0,
        recentAlerts: data?.slice(0, 10) || [],
        securityScore: 85 // Mock score
      };
    } catch (error) {
      console.error('Error getting security metrics:', error);
      return { totalEvents: 0, recentAlerts: [], securityScore: 0 };
    }
  }
}

export { AnubisSecurityService };
export const anubisSecurityService = new AnubisSecurityService();
