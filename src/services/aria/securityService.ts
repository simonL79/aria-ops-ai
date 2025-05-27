
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModuleRegistry {
  id: string;
  module_name: string;
  owner: string;
  classification: string;
  declared_at: string;
}

export interface AccessAudit {
  id: string;
  user_email?: string;
  user_id?: string;
  attempted_action: string;
  module_target: string;
  success: boolean;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  attempted_at: string;
}

export interface ModuleAccessStats {
  module_name: string;
  total_attempts: number;
  successful_access: number;
  blocked_attempts: number;
  last_access: string;
}

export const getModuleRegistry = async (): Promise<ModuleRegistry[]> => {
  try {
    const { data, error } = await supabase
      .from('private_modules_registry')
      .select('*')
      .order('declared_at', { ascending: false });

    if (error) {
      console.error('Error fetching module registry:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getModuleRegistry:', error);
    return [];
  }
};

export const getAccessAuditLogs = async (limit: number = 100): Promise<AccessAudit[]> => {
  try {
    const { data, error } = await supabase
      .from('aria_access_audit')
      .select('*')
      .order('attempted_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching access audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAccessAuditLogs:', error);
    return [];
  }
};

export const getModuleAccessStats = async (): Promise<ModuleAccessStats[]> => {
  try {
    const { data, error } = await supabase.rpc('get_module_access_stats');

    if (error) {
      console.error('Error fetching module access stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getModuleAccessStats:', error);
    return [];
  }
};

export const logModuleUsage = async (
  moduleName: string,
  action: string,
  details?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('log_module_usage', {
      p_module_name: moduleName,
      p_action: action,
      p_details: details
    });

    if (error) {
      console.error('Error logging module usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logModuleUsage:', error);
    return false;
  }
};

export const checkInternalAccess = async (moduleName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('check_internal_access', {
      module_name: moduleName
    });

    if (error) {
      console.error('Access denied:', error);
      toast.error(`Access denied to ${moduleName}: ${error.message}`);
      return false;
    }

    toast.success(`Access granted to ${moduleName}`);
    return true;
  } catch (error) {
    console.error('Error in checkInternalAccess:', error);
    toast.error('Access verification failed');
    return false;
  }
};
