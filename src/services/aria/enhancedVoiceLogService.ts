
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

      // Log to activity_logs table since anubis_voice_log doesn't exist
      const { error: voiceLogError } = await supabase
        .from('activity_logs')
        .insert({
          action: 'voice_interaction',
          details: JSON.stringify({
            transcript: entry.transcript,
            response: entry.response,
            source: entry.source,
            processed: !!entry.response,
            response_time: entry.response ? new Date().toISOString() : null,
            hotword_detected: hotwordDetected,
            security_flagged: securityFlagged,
            attack_vector: attackVector
          }),
          entity_type: 'voice_log',
          user_id: entry.user_id
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
        .from('activity_logs')
        .select('*')
        .eq('action', 'voice_interaction')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching enhanced voice logs:', error);
        return [];
      }

      // Transform activity logs to voice log entries
      const enhancedLogs: EnhancedVoiceLogEntry[] = (data || []).map((log) => {
        const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
        return {
          id: log.id,
          user_id: log.user_id || '',
          transcript: details.transcript || '',
          timestamp: log.created_at,
          source: details.source || 'unknown',
          processed: details.processed || false,
          response: details.response,
          response_time: details.response_time,
          hotword_detected: details.hotword_detected || false,
          security_flagged: details.security_flagged || false,
          attack_vector: details.attack_vector
        };
      });

      return enhancedLogs;
    } catch (error) {
      console.error('Error in getEnhancedVoiceLogs:', error);
      return [];
    }
  }
};
