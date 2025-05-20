
import { supabase } from '@/integrations/supabase/client';
import { ContentAlert } from '@/types/dashboard';
import { toast } from 'sonner';

/**
 * Store a content action in the database
 */
export const trackContentAction = async (
  alertId: string,
  action: string,
  type: string,
  description: string,
  platform: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('content_actions')
      .insert({
        alert_id: alertId,
        action,
        type,
        description,
        platform,
        status: 'pending',
        user_id: supabase.auth.getUser() ? (await supabase.auth.getUser()).data.user?.id : null
      })
      .select();
      
    if (error) {
      console.error("Error tracking content action:", error);
      toast.error("Failed to track content action");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in trackContentAction:", error);
    return false;
  }
};

/**
 * Dismiss an alert
 */
export const dismissAlert = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Track the dismiss action
    const tracked = await trackContentAction(
      alert.id,
      'dismiss',
      'moderation',
      `Alert "${alert.content.substring(0, 20)}..." was dismissed`,
      alert.platform
    );
    
    if (!tracked) {
      return false;
    }
    
    // Update the alert status in the content_alerts table
    const { error } = await supabase
      .from('content_alerts')
      .update({
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', alert.id);
      
    if (error) {
      console.error("Error updating alert status:", error);
      toast.error("Failed to update alert status");
      return false;
    }
    
    toast.success("Alert dismissed successfully");
    return true;
  } catch (error) {
    console.error("Exception in dismissAlert:", error);
    return false;
  }
};

/**
 * Mark an alert as read
 */
export const markAlertAsRead = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Track the read action
    const tracked = await trackContentAction(
      alert.id,
      'read',
      'viewing',
      `Alert "${alert.content.substring(0, 20)}..." was marked as read`,
      alert.platform
    );
    
    if (!tracked) {
      return false;
    }
    
    // Update the alert status in the content_alerts table
    const { error } = await supabase
      .from('content_alerts')
      .update({
        status: 'read',
        updated_at: new Date().toISOString()
      })
      .eq('id', alert.id);
      
    if (error) {
      console.error("Error updating alert status:", error);
      toast.error("Failed to update alert status");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in markAlertAsRead:", error);
    return false;
  }
};

/**
 * Request content removal
 */
export const requestContentRemoval = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Track the removal request
    const tracked = await trackContentAction(
      alert.id,
      'removal_request',
      'moderation',
      `Removal requested for content "${alert.content.substring(0, 20)}..."`,
      alert.platform
    );
    
    if (!tracked) {
      return false;
    }
    
    // Update the alert status
    const { error } = await supabase
      .from('content_alerts')
      .update({
        status: 'actioned',
        updated_at: new Date().toISOString()
      })
      .eq('id', alert.id);
      
    if (error) {
      console.error("Error updating alert status:", error);
      toast.error("Failed to update alert status");
      return false;
    }
    
    toast.success("Removal request submitted");
    return true;
  } catch (error) {
    console.error("Exception in requestContentRemoval:", error);
    return false;
  }
};
