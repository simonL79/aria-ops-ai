
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  action: string;
  user_email?: string;
  details?: string;
  entity_type?: string;
  created_at: string;
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('login')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (action.includes('access')) {
      return <Shield className="h-4 w-4 text-blue-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading audit logs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No audit logs found matching your criteria
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getActionIcon(log.action)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                        {log.user_email && (
                          <div className="text-sm text-gray-600 mb-1">
                            User: {log.user_email}
                          </div>
                        )}
                        {log.details && (
                          <div className="text-sm text-gray-600 mb-1">
                            {log.details}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button onClick={loadAuditLogs} size="sm" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Refresh Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
