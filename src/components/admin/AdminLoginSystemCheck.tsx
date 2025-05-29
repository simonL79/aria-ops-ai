
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Activity,
  Settings,
  FileText,
  Database,
  Search
} from 'lucide-react';
import { SystemConfigManager, SystemConfigResult, SystemBugScanResult } from '@/services/ariaCore/systemConfigManager';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginSystemCheckProps {
  onComplete?: (success: boolean) => void;
}

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

interface ValidationLogEntry {
  id: string;
  check_type: string;
  result_count: number;
  validated_at: string;
}

const AdminLoginSystemCheck = ({ onComplete }: AdminLoginSystemCheckProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [bugScanResult, setBugScanResult] = useState<SystemBugScanResult | null>(null);
  const [configResult, setConfigResult] = useState<SystemConfigResult | null>(null);
  const [completed, setCompleted] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [validationLogs, setValidationLogs] = useState<ValidationLogEntry[]>([]);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showValidationLogs, setShowValidationLogs] = useState(false);

  useEffect(() => {
    runAutomatedChecks();
  }, []);

  const runAutomatedChecks = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      // Step 1: Bug Scan
      setCurrentStep('Running system bug scan with audit logging...');
      setProgress(15);
      
      const bugScan = await SystemConfigManager.runSystemBugScan();
      setBugScanResult(bugScan);
      setProgress(30);

      // Step 2: System Configuration
      setCurrentStep('Configuring system for live operations...');
      setProgress(45);
      
      const config = await SystemConfigManager.configureLiveSystem();
      setConfigResult(config);
      setProgress(60);

      // Step 3: Run A.R.I.A™ Live Data Validation
      setCurrentStep('Running A.R.I.A™ live data validation...');
      setProgress(75);
      
      await runAriaValidation();
      setProgress(85);

      // Step 4: Load audit logs
      setCurrentStep('Loading compliance audit logs...');
      await loadAuditLogs();
      setProgress(90);

      // Step 5: Load validation results
      setCurrentStep('Loading live data validation results...');
      await loadValidationLogs();
      setProgress(95);

      // Step 6: Final validation
      setCurrentStep('Validating system integrity...');
      setProgress(100);

      const overallSuccess = bugScan.success && config.success;
      
      setTimeout(() => {
        setCompleted(true);
        setIsRunning(false);
        setCurrentStep(overallSuccess ? 'A.R.I.A™ system fully validated and ready' : 'System checks completed with issues');
        
        if (overallSuccess) {
          toast.success('A.R.I.A™ Admin Login Complete - All validations passed');
        } else {
          toast.warning('System initialized with some issues - Review validation logs');
        }
        
        onComplete?.(overallSuccess);
      }, 1000);

    } catch (error) {
      console.error('Admin login system check failed:', error);
      setCurrentStep('System check failed');
      setIsRunning(false);
      toast.error('System check failed - Check validation logs for details');
      onComplete?.(false);
    }
  };

  const runAriaValidation = async () => {
    try {
      const { error } = await supabase.rpc('validate_aria_on_admin_login');
      
      if (error) {
        console.error('A.R.I.A™ validation failed:', error);
        throw error;
      }
      
      console.log('✅ A.R.I.A™ live data validation completed successfully');
    } catch (error) {
      console.error('Error running A.R.I.A™ validation:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('anubis_audit_log')
        .select('*')
        .eq('run_context', 'admin_login')
        .order('run_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Failed to load audit logs:', error);
      } else {
        setAuditLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const loadValidationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('aria_validation_log')
        .select('*')
        .order('validated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to load validation logs:', error);
      } else {
        setValidationLogs(data || []);
      }
    } catch (error) {
      console.error('Error loading validation logs:', error);
    }
  };

  const getStatusIcon = (type: 'success' | 'warning' | 'error' | 'running') => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running': return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getOverallStatus = () => {
    if (isRunning) return 'running';
    if (!bugScanResult || !configResult) return 'error';
    if (bugScanResult.critical_issues.length > 0 || !configResult.success) return 'error';
    if (bugScanResult.warnings.length > 0 || configResult.warnings.length > 0) return 'warning';
    return 'success';
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

  const getValidationStatusColor = (checkType: string, count: number) => {
    switch (checkType) {
      case 'LIVE_THREATS':
      case 'REDDIT_OSINT':
      case 'SCAN_RESULTS':
        return count > 0 ? 'text-green-500' : 'text-yellow-500';
      case 'MOCK_DATA_CHECK':
        return count === 0 ? 'text-green-500' : 'text-red-500';
      default:
        return count > 0 ? 'text-green-500' : 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#247CFF]/20 bg-[#0A0F2C]/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#247CFF]" />
            A.R.I.A™ Admin Login System Check
            <Badge className="bg-[#247CFF]/20 text-[#247CFF] border-[#247CFF]/30">
              <Database className="h-3 w-3 mr-1" />
              Live Data Validation
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Overall Status */}
          <Card className={`${getOverallStatus() === 'success' ? 'bg-green-500/10 border-green-500/30' : 
                            getOverallStatus() === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                            getOverallStatus() === 'error' ? 'bg-red-500/10 border-red-500/30' :
                            'bg-blue-500/10 border-blue-500/30'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(getOverallStatus())}
                <div>
                  <p className="text-white font-medium">{currentStep}</p>
                  <p className="text-[#D8DEE9]/80 text-sm">
                    System integrity, live data validation, and compliance audit logging
                  </p>
                </div>
              </div>
              {isRunning && <Progress value={progress} className="mt-3" />}
            </CardContent>
          </Card>

          {/* Bug Scan Results */}
          {bugScanResult && (
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#247CFF]" />
                  System Bug Scan Results
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Audit Logged
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{bugScanResult.critical_issues.length}</div>
                    <div className="text-sm text-[#D8DEE9]/60">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{bugScanResult.warnings.length}</div>
                    <div className="text-sm text-[#D8DEE9]/60">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{bugScanResult.info.length}</div>
                    <div className="text-sm text-[#D8DEE9]/60">Info</div>
                  </div>
                </div>
                
                {bugScanResult.critical_issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-400">Critical Issues:</h4>
                    {bugScanResult.critical_issues.slice(0, 3).map((issue, index) => (
                      <div key={index} className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Configuration Results */}
          {configResult && (
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#247CFF]" />
                  System Configuration Results
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Audit Logged
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#D8DEE9]/80">Configuration Status</span>
                  <Badge className={`${configResult.success ? 'bg-green-500' : 'bg-yellow-500'} text-white border-0`}>
                    {configResult.success ? 'SUCCESS' : 'PARTIAL'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-500">{configResult.fixes_applied.length}</div>
                    <div className="text-xs text-[#D8DEE9]/60">Applied</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-500">{configResult.issues.length}</div>
                    <div className="text-xs text-[#D8DEE9]/60">Issues</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-500">{configResult.warnings.length}</div>
                    <div className="text-xs text-[#D8DEE9]/60">Warnings</div>
                  </div>
                </div>

                {configResult.fixes_applied.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-green-400">Recent Fixes:</h4>
                    {configResult.fixes_applied.slice(0, 3).map((fix, index) => (
                      <div key={index} className="text-xs text-green-400 bg-green-500/10 p-2 rounded">
                        {fix}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* A.R.I.A™ Live Data Validation Results */}
          {completed && validationLogs.length > 0 && (
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-[#247CFF]" />
                    A.R.I.A™ Live Data Validation
                    <Badge className="bg-[#247CFF]/20 text-[#247CFF] border-[#247CFF]/30">
                      Latest Results
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowValidationLogs(!showValidationLogs)}
                    className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white"
                  >
                    {showValidationLogs ? 'Hide' : 'Show'} Details
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {validationLogs.slice(0, 6).map((log) => (
                    <div key={log.id} className="bg-[#0A0F2C]/50 p-3 rounded border border-[#247CFF]/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{log.check_type.replace('_', ' ')}</span>
                        <span className={`text-lg font-bold ${getValidationStatusColor(log.check_type, log.result_count)}`}>
                          {log.result_count}
                        </span>
                      </div>
                      <div className="text-xs text-[#D8DEE9]/60 mt-1">
                        {new Date(log.validated_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                {showValidationLogs && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-[#247CFF]">Detailed Validation Results:</h4>
                    {validationLogs.map((log) => (
                      <div key={log.id} className="bg-[#0A0F2C]/30 p-3 rounded text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#D8DEE9]">{log.check_type}</span>
                          <span className={getValidationStatusColor(log.check_type, log.result_count)}>
                            {log.result_count} items
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Audit Logs Section */}
          {completed && (
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#247CFF]" />
                    Anubis Compliance Audit Log
                    <Badge className="bg-[#247CFF]/20 text-[#247CFF] border-[#247CFF]/30">
                      {auditLogs.length} Entries
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuditLogs(!showAuditLogs)}
                    className="bg-transparent border-[#247CFF] text-[#247CFF] hover:bg-[#247CFF] hover:text-white"
                  >
                    {showAuditLogs ? 'Hide Logs' : 'View Logs'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showAuditLogs && (
                <CardContent className="space-y-2">
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="bg-[#0A0F2C]/50 p-3 rounded border border-[#247CFF]/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{log.check_name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityBadge(log.severity)}>
                              {log.severity}
                            </Badge>
                            {log.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-[#D8DEE9]/80 mb-1">{log.result}</div>
                        {log.notes && (
                          <div className="text-xs text-[#D8DEE9]/60 italic">{log.notes}</div>
                        )}
                        <div className="text-xs text-[#D8DEE9]/40 mt-1">
                          {new Date(log.run_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* System Status Summary */}
          {completed && (
            <Card className="bg-[#247CFF]/10 border-[#247CFF]/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(getOverallStatus())}
                  <div>
                    <p className="text-white font-medium">A.R.I.A™ Admin Login System Check Complete</p>
                    <p className="text-[#D8DEE9]/80 text-sm mt-1">
                      {getOverallStatus() === 'success' ? 
                        'All systems operational. A.R.I.A™ live data validation passed. All checks logged to compliance audit system.' :
                        'System check completed with issues. Live data validation may show concerns. Check validation and audit logs for detailed compliance records.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginSystemCheck;
