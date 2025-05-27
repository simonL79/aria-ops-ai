
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock,
  Activity,
  Search,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { 
  getModuleRegistry,
  getAccessAuditLogs,
  getModuleAccessStats,
  logModuleUsage,
  checkInternalAccess,
  type ModuleRegistry,
  type AccessAudit,
  type ModuleAccessStats
} from '@/services/aria/securityService';
import { toast } from 'sonner';

const ARIASecurityPanel = () => {
  const [modules, setModules] = useState<ModuleRegistry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AccessAudit[]>([]);
  const [accessStats, setAccessStats] = useState<ModuleAccessStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'blocked'>('all');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      const [modulesData, auditData, statsData] = await Promise.all([
        getModuleRegistry(),
        getAccessAuditLogs(200),
        getModuleAccessStats()
      ]);
      
      setModules(modulesData);
      setAuditLogs(auditData);
      setAccessStats(statsData);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccess = async (moduleName: string) => {
    await checkInternalAccess(moduleName);
    // Reload audit logs to show the new attempt
    setTimeout(() => loadSecurityData(), 1000);
  };

  const handleLogUsage = async (moduleName: string, action: string) => {
    const success = await logModuleUsage(moduleName, action, 'Manual usage logging from security panel');
    if (success) {
      toast.success(`Logged ${action} for ${moduleName}`);
      setTimeout(() => loadSecurityData(), 1000);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'confidential': return 'text-red-600 bg-red-100';
      case 'restricted': return 'text-orange-600 bg-orange-100';
      case 'internal': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action: string, success: boolean) => {
    if (action.includes('blocked') || !success) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (action.includes('verified') || action.includes('access')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesFilter = filter === 'all' || 
      (filter === 'success' && log.success) ||
      (filter === 'blocked' && !log.success);
    
    const matchesSearch = !searchTerm || 
      log.module_target?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.attempted_action?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading A.R.I.A™ Security Panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Security & Access Control
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor module access, audit logs, and confidentiality enforcement
          </p>
        </div>
        <Button onClick={loadSecurityData} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protected Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Access Attempts</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked Attempts</p>
                <p className="text-2xl font-bold text-red-600">
                  {auditLogs.filter(log => !log.success).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs.length > 0 
                    ? Math.round((auditLogs.filter(log => log.success).length / auditLogs.length) * 100)
                    : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="modules">Module Registry</TabsTrigger>
          <TabsTrigger value="audit">Access Audit Log</TabsTrigger>
          <TabsTrigger value="stats">Module Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Protected IP Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{module.module_name}</h4>
                        <p className="text-sm text-gray-600">Owner: {module.owner}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getClassificationColor(module.classification)}>
                          {module.classification.toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestAccess(module.module_name)}
                          >
                            Test Access
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLogUsage(module.module_name, 'manual_inspection')}
                          >
                            Log Usage
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Declared: {new Date(module.declared_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Access Audit Log</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'success' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('success')}
                  >
                    Success
                  </Button>
                  <Button
                    variant={filter === 'blocked' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('blocked')}
                  >
                    Blocked
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="border rounded p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getActionIcon(log.attempted_action, log.success)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.module_target}</span>
                            <Badge variant={log.success ? 'default' : 'destructive'}>
                              {log.success ? 'SUCCESS' : 'BLOCKED'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Action: {log.attempted_action}
                          </div>
                          {log.user_email && (
                            <div className="text-sm text-gray-600 mb-1">
                              User: {log.user_email}
                            </div>
                          )}
                          {log.reason && (
                            <div className="text-sm text-gray-600 mb-1">
                              Reason: {log.reason}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.attempted_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredAuditLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No audit logs found matching your criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Module Access Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessStats.map((stat) => (
                  <div key={stat.module_name} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{stat.module_name}</h4>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Last Access: {stat.last_access ? new Date(stat.last_access).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Attempts:</span>
                        <span className="font-medium ml-2">{stat.total_attempts}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Successful:</span>
                        <span className="font-medium ml-2">{stat.successful_access}</span>
                      </div>
                      <div>
                        <span className="text-red-600">Blocked:</span>
                        <span className="font-medium ml-2">{stat.blocked_attempts}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {accessStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No module statistics available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARIASecurityPanel;
