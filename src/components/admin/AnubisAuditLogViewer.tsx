
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search,
  RefreshCw,
  Download,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AuditLogEntry {
  id: string;
  check_name: string;
  result: string;
  passed: boolean;
  severity: string;
  run_context: string;
  run_at: string;
  notes?: string;
}

const AnubisAuditLogViewer = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [contextFilter, setContextFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('anubis_audit_log')
        .select('*')
        .order('run_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Failed to load audit logs:', error);
        toast.error('Failed to load audit logs');
      } else {
        setAuditLogs(data || []);
        toast.success(`Loaded ${data?.length || 0} audit log entries`);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Error loading audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.check_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesContext = contextFilter === 'all' || log.run_context === contextFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'passed' && log.passed) ||
      (statusFilter === 'failed' && !log.passed);

    return matchesSearch && matchesSeverity && matchesContext && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-black',
      low: 'bg-blue-500 text-white'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getContextBadge = (context: string) => {
    const colors = {
      admin_login: 'bg-purple-500 text-white',
      health_check: 'bg-blue-500 text-white',
      manual: 'bg-gray-500 text-white',
      automated: 'bg-green-500 text-white'
    };
    return colors[context as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Check Name', 'Result', 'Passed', 'Severity', 'Context', 'Notes'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.run_at).toISOString(),
        `"${log.check_name}"`,
        `"${log.result}"`,
        log.passed ? 'PASS' : 'FAIL',
        log.severity,
        log.run_context,
        `"${log.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anubis-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Audit logs exported successfully');
  };

  const getStats = () => {
    const total = filteredLogs.length;
    const passed = filteredLogs.filter(log => log.passed).length;
    const failed = total - passed;
    const critical = filteredLogs.filter(log => log.severity === 'critical').length;
    
    return { total, passed, failed, critical };
  };

  const stats = getStats();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="border-[#247CFF]/20 bg-[#0A0F2C]/90">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#247CFF]" />
                Anubis Compliance Audit Log
                <Badge className="bg-[#247CFF]/20 text-[#247CFF] border-[#247CFF]/30">
                  {stats.total} Entries
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportLogs}
                  className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAuditLogs}
                  disabled={loading}
                  className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-sm text-[#D8DEE9]/60">Total Checks</div>
                </CardContent>
              </Card>
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
                  <div className="text-sm text-[#D8DEE9]/60">Passed</div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
                  <div className="text-sm text-[#D8DEE9]/60">Failed</div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.critical}</div>
                  <div className="text-sm text-[#D8DEE9]/60">Critical</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D8DEE9]/40 h-4 w-4" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={contextFilter} onValueChange={setContextFilter}>
                    <SelectTrigger className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white">
                      <SelectValue placeholder="Context" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contexts</SelectItem>
                      <SelectItem value="admin_login">Admin Login</SelectItem>
                      <SelectItem value="health_check">Health Check</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automated">Automated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-[#0A0F2C]/50 border-[#247CFF]/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Log Entries */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#247CFF] mx-auto mb-2" />
                  <p className="text-[#D8DEE9]/60">Loading audit logs...</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-[#D8DEE9]/60">No audit logs found matching your criteria</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <Card key={log.id} className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{log.check_name}</span>
                            {log.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-[#D8DEE9]/80">{log.result}</p>
                          {log.notes && (
                            <p className="text-xs text-[#D8DEE9]/60 italic mt-1">{log.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getSeverityBadge(log.severity)}>
                            {log.severity}
                          </Badge>
                          <Badge className={getContextBadge(log.run_context)}>
                            {log.run_context}
                          </Badge>
                          <span className="text-xs text-[#D8DEE9]/40">
                            {new Date(log.run_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AnubisAuditLogViewer;
