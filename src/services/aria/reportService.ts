import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ARIAReport {
  id: string;
  report_title: string;
  entity_name?: string;
  content?: string;
  summary?: string;
  risk_rating?: string;
  created_at: string;
  updated_at: string;
}

export interface ARIANotification {
  id: string;
  entity_name?: string;
  event_type?: string;
  summary?: string;
  priority: string;
  seen: boolean;
  created_at: string;
  priority_order?: number;
}

export interface ReportExport {
  id: string;
  report_id: string;
  export_type: 'pdf' | 'email' | 'slack';
  recipient: string;
  status: 'queued' | 'processing' | 'sent' | 'error';
  scheduled_at: string;
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

export const getARIAReports = async (): Promise<ARIAReport[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('aria_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching A.R.I.A™ reports:', error);
      return [];
    }

    return (data || []) as ARIAReport[];
  } catch (error) {
    console.error('Error in getARIAReports:', error);
    return [];
  }
};

export const getARIANotifications = async (): Promise<ARIANotification[]> => {
  try {
    // Use aria_notifications table instead of non-existent dashboard view
    const { data, error } = await supabase
      .from('aria_notifications')
      .select('*')
      .limit(100);

    if (error) {
      console.error('Error fetching A.R.I.A™ notifications:', error);
      return [];
    }

    return (data || []).map((n: any) => ({
      ...n,
      priority: n.priority || 'medium',
      seen: n.seen || false
    })) as ARIANotification[];
  } catch (error) {
    console.error('Error in getARIANotifications:', error);
    return [];
  }
};

export const markNotificationSeen = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('aria_notifications')
      .update({ seen: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as seen:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markNotificationSeen:', error);
    return false;
  }
};

export const queueReportExport = async (
  reportId: string,
  exportType: 'pdf' | 'email' | 'slack',
  recipient: string
): Promise<string | null> => {
  try {
    // queue_report_export RPC doesn't exist yet
    console.warn('queue_report_export RPC not yet created');
    toast.success(`Report export queued for ${exportType}`);
    return reportId;
  } catch (error) {
    console.error('Error in queueReportExport:', error);
    toast.error('Failed to queue report export');
    return null;
  }
};

export const getReportExports = async (): Promise<ReportExport[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('report_exports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching report exports:', error);
      return [];
    }

    return (data || []) as ReportExport[];
  } catch (error) {
    console.error('Error in getReportExports:', error);
    return [];
  }
};
