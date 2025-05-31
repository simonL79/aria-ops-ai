import { supabase } from '@/integrations/supabase/client';

export interface AnubisActivityLog {
  action: string;
  details: string;
  user_email: string;
}

export const logAnubisActivity = async (activity: AnubisActivityLog) => {
  try {
    // Use existing activity_logs table instead of anubis_activity_log
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        action: activity.action,
        details: activity.details,
        entity_type: 'anubis',
        user_email: activity.user_email
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging Anubis activity:', error);
    throw error;
  }
};
