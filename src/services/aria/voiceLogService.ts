
import { supabase } from '@/integrations/supabase/client';

export interface VoiceLogEntry {
  id: string;
  user_id: string;
  transcript: string;
  timestamp: string;
  source: string;
  processed: boolean;
  response?: string;
  response_time?: string;
}

export const getVoiceLogs = async (limit: number = 50): Promise<VoiceLogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('anubis_voice_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching voice logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getVoiceLogs:', error);
    return [];
  }
};

export const markVoiceLogProcessed = async (id: string, response: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('anubis_voice_log')
      .update({
        processed: true,
        response: response,
        response_time: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating voice log:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markVoiceLogProcessed:', error);
    return false;
  }
};

export const getUnprocessedVoiceLogs = async (): Promise<VoiceLogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('anubis_voice_log')
      .select('*')
      .eq('processed', false)
      .eq('source', 'mic')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching unprocessed voice logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUnprocessedVoiceLogs:', error);
    return [];
  }
};
