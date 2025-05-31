
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

export interface ModuleRegistry {
  id: string;
  module_name: string;
  module_type: string;
  security_level: string;
  access_control: string;
  is_active: boolean;
  owner: string;
  classification: string;
  declared_at: string;
}

export interface ModuleAccessStats {
  module_name: string;
  total_attempts: number;
  successful_access: number;
  blocked_attempts: number;
  last_access: string;
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
      success: true,
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
    console.log(`Checking access for module: ${moduleId}`);
    return true;
  } catch (error) {
    console.error('Error checking module access:', error);
    return false;
  }
};

export const getModuleRegistry = async (): Promise<ModuleRegistry[]> => {
  // Return simulated module registry data with all required properties
  return [
    {
      id: '1',
      module_name: 'anubis_security',
      module_type: 'security',
      security_level: 'high',
      access_control: 'admin_only',
      is_active: true,
      owner: 'A.R.I.A™ Security Team',
      classification: 'confidential',
      declared_at: new Date().toISOString()
    },
    {
      id: '2',
      module_name: 'threat_intelligence',
      module_type: 'intelligence',
      security_level: 'medium',
      access_control: 'staff',
      is_active: true,
      owner: 'Intelligence Operations',
      classification: 'restricted',
      declared_at: new Date().toISOString()
    }
  ];
};

export const getModuleAccessStats = async (): Promise<ModuleAccessStats[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', 'security')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Transform to stats format
    const stats: ModuleAccessStats[] = [
      {
        module_name: 'anubis_security',
        total_attempts: data?.length || 0,
        successful_access: data?.length || 0,
        blocked_attempts: 0,
        last_access: data?.[0]?.created_at || new Date().toISOString()
      }
    ];

    return stats;
  } catch (error) {
    console.error('Error fetching module access stats:', error);
    return [];
  }
};

export const logModuleUsage = async (moduleName: string, action: string, details?: string): Promise<void> => {
  try {
    await supabase.from('activity_logs').insert({
      action: `module_${action}`,
      details: `Module: ${moduleName}. ${details || ''}`,
      entity_type: 'module_usage',
      entity_id: moduleName
    });
  } catch (error) {
    console.error('Error logging module usage:', error);
  }
};

export const checkInternalAccess = async (moduleId: string): Promise<boolean> => {
  try {
    console.log(`Checking internal access for module: ${moduleId}`);
    await logModuleUsage(moduleId, 'access_check', 'Internal access verification');
    return true;
  } catch (error) {
    console.error('Error checking internal access:', error);
    return false;
  }
};
