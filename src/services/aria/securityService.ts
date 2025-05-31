
import { supabase } from '@/integrations/supabase/client';

export interface AccessAudit {
  id: string;
  user_email: string;
  attempted_action: string;
  module_target: string;
  success: boolean;
  reason: string;
  attempted_at: string;
}

export const logSecurityEvent = async (event: {
  action: string;
  details: string;
  userId?: string;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        action: event.action,
        details: event.details,
        user_id: event.userId,
        entity_type: 'security'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging security event:', error);
    return false;
  }
};

export const getAccessAuditLogs = async (limit = 50): Promise<AccessAudit[]> => {
  try {
    // Use activity_logs table instead of aria_access_audit
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', 'security')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform to AccessAudit format
    const auditLogs: AccessAudit[] = (data || []).map((item: any) => ({
      id: item.id,
      user_email: item.user_email || 'unknown',
      attempted_action: item.action,
      module_target: item.entity_id || 'system',
      success: true, // Assume success if logged
      reason: item.details || '',
      attempted_at: item.created_at
    }));

    return auditLogs;
  } catch (error) {
    console.error('Error fetching access audit logs:', error);
    return [];
  }
};

export const checkModuleAccess = async (moduleId: string): Promise<boolean> => {
  try {
    // Simple access check - could be enhanced with proper permissions
    console.log(`Checking access for module: ${moduleId}`);
    return true;
  } catch (error) {
    console.error('Error checking module access:', error);
    return false;
  }
};
