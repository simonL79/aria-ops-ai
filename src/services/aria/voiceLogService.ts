
import { supabase } from '@/integrations/supabase/client';

export interface VoiceLogEntry {
  id: string;
  user_id: string;
  transcript: string;
  timestamp: string;
  source: string;
  processed: boolean;
  response?: string;
}

export const logVoiceInteraction = async (entry: {
  user_id: string;
  transcript: string;
  source: string;
  response?: string;
}): Promise<boolean> => {
  try {
    // Use activity_logs table instead of anubis_voice_log
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        action: 'voice_interaction',
        details: JSON.stringify({
          transcript: entry.transcript,
          response: entry.response,
          source: entry.source,
          processed: !!entry.response
        }),
        entity_type: 'voice_log',
        user_id: entry.user_id
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging voice interaction:', error);
    return false;
  }
};

export const getVoiceLogs = async (limit = 50): Promise<VoiceLogEntry[]> => {
  try {
    // Use activity_logs table instead of anubis_voice_log
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', 'voice_interaction')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform to VoiceLogEntry format
    const voiceLogs: VoiceLogEntry[] = (data || []).map((item: any) => {
      const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
      return {
        id: item.id,
        user_id: item.user_id || '',
        transcript: details.transcript || '',
        timestamp: item.created_at,
        source: details.source || 'unknown',
        processed: details.processed || false,
        response: details.response
      };
    });

    return voiceLogs;
  } catch (error) {
    console.error('Error fetching voice logs:', error);
    return [];
  }
};
