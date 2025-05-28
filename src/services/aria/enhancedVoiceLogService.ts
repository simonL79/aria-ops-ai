
import { supabase } from '@/integrations/supabase/client';
import { anubisSecurityService } from './anubisSecurityService';

export interface EnhancedVoiceLogEntry {
  id: string;
  user_id: string;
  transcript: string;
  timestamp: string;
  source: string;
  processed: boolean;
  response?: string;
  response_time?: string;
  hotword_detected?: boolean;
  security_flagged?: boolean;
  attack_vector?: string;
}

export const enhancedVoiceLogService = {
  async logVoiceInteraction(entry: {
    user_id: string;
    transcript: string;
    source: string;
    response?: string;
  }): Promise<boolean> {
    try {
      // Check for hotword detection
      const hotwordDetected = anubisSecurityService.detectHotword(entry.transcript, entry.user_id);
      
      // Analyze for AI attacks if this is user input
      let securityFlagged = false;
      let attackVector = '';
      
      if (entry.source === 'mic') {
        const analysis = anubisSecurityService.analyzePromptForAttacks(entry.transcript, 'voice_input');
        securityFlagged = analysis.isAttack;
        attackVector = analysis.attackVector || '';
      }

      // Log to the original voice log table
      const { error: voiceLogError } = await supabase
        .from('anubis_voice_log')
        .insert({
          user_id: entry.user_id,
          transcript: entry.transcript,
          response: entry.response,
          source: entry.source,
          processed: !!entry.response,
          response_time: entry.response ? new Date().toISOString() : null
        });

      if (voiceLogError) {
        console.error('Error logging voice interaction:', voiceLogError);
        return false;
      }

      // Log security events if detected
      if (securityFlagged) {
        await anubisSecurityService.queueSlackEvent({
          channel: '#security-alerts',
          event_type: 'voice_attack_detected',
          payload: {
            user_id: entry.user_id,
            transcript: entry.transcript.substring(0, 200),
            attack_vector: attackVector,
            timestamp: new Date().toISOString()
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error in enhanced voice logging:', error);
      return false;
    }
  },

  async getEnhancedVoiceLogs(limit = 50): Promise<EnhancedVoiceLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('anubis_voice_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching enhanced voice logs:', error);
        return [];
      }

      // Enhance with security information
      const enhancedLogs = await Promise.all(
        (data || []).map(async (log) => {
          // Check if hotword was detected for this transcript
          const hotwordEvents = await anubisSecurityService.getHotwordEvents(log.user_id, 10);
          const hotwordDetected = hotwordEvents.some(
            event => event.captured_phrase === log.transcript && event.triggered
          );

          // Check if security flagged
          const attackLogs = await anubisSecurityService.getAIAttackLogs(10);
          const securityEvent = attackLogs.find(
            attack => attack.prompt.includes(log.transcript.substring(0, 50))
          );

          return {
            ...log,
            hotword_detected: hotwordDetected,
            security_flagged: !!securityEvent,
            attack_vector: securityEvent?.attack_vector
          };
        })
      );

      return enhancedLogs;
    } catch (error) {
      console.error('Error in getEnhancedVoiceLogs:', error);
      return [];
    }
  }
};
