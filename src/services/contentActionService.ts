
import { ContentAlert } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Request removal of content
 */
export const requestContentRemoval = async (alert: ContentAlert): Promise<boolean> => {
  try {
    console.log('Requesting content removal for alert:', alert.id);
    
    // Simulate API call for content removal request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the action using activity_logs instead of content_actions
    await supabase.from('activity_logs').insert({
      action: 'content_removal_request',
      details: JSON.stringify({
        alert_id: alert.id,
        platform: alert.platform,
        content_excerpt: alert.content.substring(0, 100),
        status: 'requested'
      }),
      entity_type: 'content_action',
      entity_id: alert.id
    });
    
    return true;
  } catch (error) {
    console.error('Failed to request content removal:', error);
    throw error;
  }
};

/**
 * Mark alert as read
 */
export const markAlertAsRead = async (alert: ContentAlert): Promise<boolean> => {
  try {
    console.log('Marking alert as read:', alert.id);
    
    // Simulate API call to update alert status
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log the action using activity_logs
    await supabase.from('activity_logs').insert({
      action: 'alert_marked_read',
      details: JSON.stringify({
        alert_id: alert.id,
        platform: alert.platform,
        content_excerpt: alert.content.substring(0, 100)
      }),
      entity_type: 'content_action',
      entity_id: alert.id
    });
    
    return true;
  } catch (error) {
    console.error('Failed to mark alert as read:', error);
    throw error;
  }
};

/**
 * Dismiss an alert
 */
export const dismissAlert = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Log the dismiss action using activity_logs instead of content_actions
    const { error } = await supabase.from('activity_logs').insert({
      action: 'alert_dismissed',
      details: JSON.stringify({
        alert_id: alert.id,
        platform: alert.platform,
        content_excerpt: alert.content.substring(0, 50),
        status: 'dismissed'
      }),
      entity_type: 'content_action',
      entity_id: alert.id
    });

    if (error) {
      console.error("Error dismissing alert:", error);
      toast.error("Failed to dismiss alert");
      return false;
    }

    toast.success("Alert dismissed successfully");
    return true;
  } catch (error) {
    console.error("Error dismissing alert:", error);
    toast.error("Failed to dismiss alert");
    return false;
  }
};
