
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  RefreshCw,
  Download,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreeperLogEntry {
  id: string;
  module: string;
  function_name: string;
  issue_detected: boolean;
  issue_description: string;
  severity: string;
  suggested_fix?: string;
  simulated_result?: string;
  actual_result?: string;
  created_at: string;
}

const AnubisCreeperLogViewer = () => {
  const [logs, setLogs] = useState<CreeperLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCreeperLogs();
  }, []);

  const loadCreeperLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('anubis_creeper_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Failed to load creeper logs:', error);
        toast.error('Failed to load Anubis Creeper logs');
      } else {
        setLogs(data || []);
        toast.success(`Loaded ${data?.length || 0} creeper log entries`);
      }
    } catch (error) {
      console.error('Error loading creeper logs:', error);
      toast.error('Error loading creeper logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.function_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.issue_description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'healthy' && !log.issue_detected) ||
      (statusFilter === 'issues' && log.issue_detected);

    return matchesSearch && matchesModule && matchesSeverity && matchesStatus;
  });

  const getStatusIcon = (issueDetected: boolean) => {
    return issueDetected ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <CheckCircle className="h-5 w-5 text-green-500" />
    );
  };

  const getStatusBadge = (issueDetected: boolean) => {
    return issueDetected ? (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        Issue Detected
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Healthy
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-black',
      low: 'bg-blue-500 text-white'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getModuleBadge = (module: string) => {
    const colors = {
      RSI: 'bg-purple-500 text-white',
      STI: 'bg-blue-500 text-white',
      ARIA_OPS: 'bg-green-500 text-white',
      EVENT_DISPATCH: 'bg-orange-500 text-white',
      SCANNING: 'bg-teal-500 text-white'
    };
    return colors[module as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Module', 'Function', 'Status', 'Issue Description', 'Severity', 'Suggested Fix'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.module,
        log.function_name,
        log.issue_detected ? 'Issue' : 'Healthy',
        `"${log.issue_description}"`,
        log.severity,
        `"${log.suggested_fix || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anubis-creeper-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Creeper logs exported successfully');
  };

  const getStats = () => {
    const total = filteredLogs.length;
    const healthy = filteredLogs.filter(log => !log.issue_detected).length;
    const issues = total - healthy;
    const critical = filteredLogs.filter(log => log.severity === 'critical').length;
    
    return { total, healthy, issues, critical };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/10 to-red-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-orange-500" />
              Anubis Creeper Agent Logs
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Live Monitoring
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                className="bg-transparent border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadCreeperLogs}
                disabled={loading}
                className="bg-transparent border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
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
            <Card className="bg-gray-800/50 border-orange-500/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Checks</div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.healthy}</div>
                <div className="text-sm text-gray-400">Healthy</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{stats.issues}</div>
                <div className="text-sm text-gray-400">Issues</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{stats.critical}</div>
                <div className="text-sm text-gray-400">Critical</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-gray-800/50 border-orange-500/10">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-orange-500/30 text-white"
                  />
                </div>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="bg-gray-900/50 border-orange-500/30 text-white">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="RSI">RSI</SelectItem>
                    <SelectItem value="STI">STI</SelectItem>
                    <SelectItem value="ARIA_OPS">ARIA OPS</SelectItem>
                    <SelectItem value="EVENT_DISPATCH">Event Dispatch</SelectItem>
                    <SelectItem value="SCANNING">Scanning</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-gray-900/50 border-orange-500/30 text-white">
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-900/50 border-orange-500/30 text-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Log Entries */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
                <p className="text-gray-400">Loading creeper logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-400">No creeper logs found matching your criteria</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="bg-gray-800/50 border-orange-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(log.issue_detected)}
                          <span className="font-medium text-white">{log.function_name}</span>
                          {getStatusBadge(log.issue_detected)}
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{log.issue_description}</p>
                        {log.suggested_fix && (
                          <div className="bg-blue-900/20 border-l-4 border-blue-500 p-2 mt-2">
                            <p className="text-xs text-blue-300">
                              <strong>Suggested Fix:</strong> {log.suggested_fix}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getModuleBadge(log.module)}>
                          {log.module}
                        </Badge>
                        <Badge className={getSeverityBadge(log.severity)}>
                          {log.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
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
  );
};

export default AnubisCreeperLogViewer;
