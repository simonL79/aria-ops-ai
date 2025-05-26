
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  format: 'csv' | 'json';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: {
    severity?: string[];
    platforms?: string[];
    threatTypes?: string[];
    status?: string[];
  };
}

export interface ExportableData {
  threats: any[];
  caseThreads: any[];
  healthChecks: any[];
  activityLogs: any[];
}

export class DataExportService {
  
  async exportThreats(options: ExportOptions): Promise<void> {
    const data = await this.gatherExportData(options);
    
    if (options.format === 'csv') {
      await this.exportAsCSV(data, 'threats');
    } else {
      await this.exportAsJSON(data, 'threats');
    }
  }

  async exportCaseThreads(options: ExportOptions): Promise<void> {
    const data = await this.gatherCaseThreadData(options);
    
    if (options.format === 'csv') {
      await this.exportCaseThreadsAsCSV(data);
    } else {
      await this.exportAsJSON({ caseThreads: data }, 'case_threads');
    }
  }

  async exportSystemHealth(options: ExportOptions): Promise<void> {
    const data = await this.gatherHealthData(options);
    
    if (options.format === 'csv') {
      await this.exportHealthAsCSV(data);
    } else {
      await this.exportAsJSON({ healthChecks: data }, 'system_health');
    }
  }

  async exportCompleteAudit(options: ExportOptions): Promise<void> {
    const data = await this.gatherCompleteAuditData(options);
    
    if (options.format === 'json') {
      await this.exportAsJSON(data, 'complete_audit');
    } else {
      // For CSV, export each type separately
      await this.exportAsCSV({ threats: data.threats }, 'threats');
      await this.exportCaseThreadsAsCSV(data.caseThreads);
      await this.exportHealthAsCSV(data.healthChecks);
      await this.exportActivityLogsAsCSV(data.activityLogs);
    }
  }

  private async gatherExportData(options: ExportOptions): Promise<ExportableData> {
    let query = supabase.from('scan_results').select('*');

    // Apply date range filter
    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start.toISOString())
        .lte('created_at', options.dateRange.end.toISOString());
    }

    // Apply filters
    if (options.filters) {
      if (options.filters.severity?.length) {
        query = query.in('severity', options.filters.severity);
      }
      if (options.filters.platforms?.length) {
        query = query.in('platform', options.filters.platforms);
      }
      if (options.filters.threatTypes?.length) {
        query = query.in('threat_type', options.filters.threatTypes);
      }
      if (options.filters.status?.length) {
        query = query.in('status', options.filters.status);
      }
    }

    const { data: threats, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Export error:', error);
      throw new Error(`Failed to export data: ${error.message}`);
    }

    return {
      threats: threats || [],
      caseThreads: [],
      healthChecks: [],
      activityLogs: []
    };
  }

  private async gatherCaseThreadData(options: ExportOptions): Promise<any[]> {
    let query = supabase.from('case_threads').select('*');

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start.toISOString())
        .lte('created_at', options.dateRange.end.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Case threads export error:', error);
      throw new Error(`Failed to export case threads: ${error.message}`);
    }

    return data || [];
  }

  private async gatherHealthData(options: ExportOptions): Promise<any[]> {
    let query = supabase.from('system_health_checks').select('*');

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start.toISOString())
        .lte('created_at', options.dateRange.end.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Health data export error:', error);
      throw new Error(`Failed to export health data: ${error.message}`);
    }

    return data || [];
  }

  private async gatherActivityData(options: ExportOptions): Promise<any[]> {
    let query = supabase.from('activity_logs').select('*');

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start.toISOString())
        .lte('created_at', options.dateRange.end.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Activity logs export error:', error);
      throw new Error(`Failed to export activity logs: ${error.message}`);
    }

    return data || [];
  }

  private async gatherCompleteAuditData(options: ExportOptions): Promise<ExportableData> {
    const [threats, caseThreads, healthChecks, activityLogs] = await Promise.all([
      this.gatherExportData(options).then(data => data.threats),
      this.gatherCaseThreadData(options),
      this.gatherHealthData(options),
      this.gatherActivityData(options)
    ]);

    return {
      threats,
      caseThreads,
      healthChecks,
      activityLogs
    };
  }

  private async exportAsCSV(data: Partial<ExportableData>, type: string): Promise<void> {
    const threats = data.threats || [];
    
    if (threats.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(threats[0]).join(',');
    const rows = threats.map(threat => 
      Object.values(threat).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${type}_export_${timestamp}.csv`);
  }

  private async exportCaseThreadsAsCSV(data: any[]): Promise<void> {
    if (data.length === 0) {
      throw new Error('No case threads to export');
    }

    const processedData = data.map(thread => ({
      ...thread,
      threats: Array.isArray(thread.threats) ? thread.threats.join(';') : thread.threats,
      correlations: Array.isArray(thread.correlations) ? thread.correlations.join(';') : thread.correlations,
      tags: Array.isArray(thread.tags) ? thread.tags.join(';') : thread.tags
    }));

    const headers = Object.keys(processedData[0]).join(',');
    const rows = processedData.map(thread => 
      Object.values(thread).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `case_threads_export_${timestamp}.csv`);
  }

  private async exportHealthAsCSV(data: any[]): Promise<void> {
    if (data.length === 0) {
      throw new Error('No health data to export');
    }

    const processedData = data.map(check => ({
      ...check,
      metadata: JSON.stringify(check.metadata || {})
    }));

    const headers = Object.keys(processedData[0]).join(',');
    const rows = processedData.map(check => 
      Object.values(check).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `system_health_export_${timestamp}.csv`);
  }

  private async exportActivityLogsAsCSV(data: any[]): Promise<void> {
    if (data.length === 0) {
      throw new Error('No activity logs to export');
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(log => 
      Object.values(log).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `activity_logs_export_${timestamp}.csv`);
  }

  private async exportAsJSON(data: any, filename: string): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${filename}_export_${timestamp}.json`);
  }
}

export const dataExportService = new DataExportService();
