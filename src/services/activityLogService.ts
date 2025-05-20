
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserProfile } from './api/userService';

export interface ActivityLog {
  id: string;
  action: string;
  details?: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
}

export enum LogAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SCAN = 'scan',
  CLASSIFY = 'classify',
  RESPOND = 'respond',
  EXPORT = 'export',
  SYSTEM = 'system'
}

/**
 * Log an activity
 */
export const logActivity = async (
  action: LogAction | string,
  details: string,
  entityType?: string,
  entityId?: string
): Promise<boolean> => {
  try {
    let userId = null;
    let userEmail = null;
    
    // Try to get current user
    const profile = await getCurrentUserProfile();
    if (profile) {
      userId = profile.id;
      userEmail = profile.email;
    }
    
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        action,
        details,
        user_id: userId,
        user_email: userEmail,
        entity_type: entityType,
        entity_id: entityId
      });
    
    if (error) {
      console.error("Error logging activity:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in logActivity:", error);
    return false;
  }
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (limit: number = 10): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
    
    return data.map(log => ({
      id: log.id,
      action: log.action,
      details: log.details,
      userId: log.user_id,
      userEmail: log.user_email,
      timestamp: log.created_at,
      entityType: log.entity_type,
      entityId: log.entity_id
    })) || [];
    
  } catch (error) {
    console.error("Error in getRecentActivities:", error);
    return [];
  }
};

/**
 * Get activities for a specific entity
 */
export const getEntityActivities = async (entityType: string, entityId: string): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching entity activities:", error);
      return [];
    }
    
    return data.map(log => ({
      id: log.id,
      action: log.action,
      details: log.details,
      userId: log.user_id,
      userEmail: log.user_email,
      timestamp: log.created_at,
      entityType: log.entity_type,
      entityId: log.entity_id
    })) || [];
    
  } catch (error) {
    console.error("Error in getEntityActivities:", error);
    return [];
  }
};
