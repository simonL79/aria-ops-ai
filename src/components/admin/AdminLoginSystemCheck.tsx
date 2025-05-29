
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Activity,
  Settings
} from 'lucide-react';
import { SystemConfigManager, SystemConfigResult, SystemBugScanResult } from '@/services/ariaCore/systemConfigManager';
import { toast } from 'sonner';

interface AdminLoginSystemCheckProps {
  onComplete?: (success: boolean) => void;
}

const AdminLoginSystemCheck = ({ onComplete }: AdminLoginSystemCheckProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [bugScanResult, setBugScanResult] = useState<SystemBugScanResult | null>(null);
  const [configResult, setConfigResult] = useState<SystemConfigResult | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    runAutomatedChecks();
  }, []);

  const runAutomatedChecks = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      // Step 1: Bug Scan
      setCurrentStep('Running system bug scan...');
      setProgress(20);
      
      const bugScan = await SystemConfigManager.runSystemBugScan();
      setBugScanResult(bugScan);
      setProgress(50);

      // Step 2: System Configuration
      setCurrentStep('Configuring system for live operations...');
      setProgress(70);
      
      const config = await SystemConfigManager.configureLiveSystem();
      setConfigResult(config);
      setProgress(90);

      // Step 3: Final validation
      setCurrentStep('Validating system integrity...');
      setProgress(100);

      const overallSuccess = bugScan.success && config.success;
      
      setTimeout(() => {
        setCompleted(true);
        setIsRunning(false);
        setCurrentStep(overallSuccess ? 'System ready for operations' : 'System checks completed with issues');
        
        if (overallSuccess) {
          toast.success('A.R.I.A™ system fully initialized and ready');
        } else {
          toast.warning('System initialized with some issues - review required');
        }
        
        onComplete?.(overallSuccess);
      }, 1000);

    } catch (error) {
      console.error('Admin login system check failed:', error);
      setCurrentStep('System check failed');
      setIsRunning(false);
      toast.error('System check failed');
      onComplete?.(false);
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

  return (
    <div className="space-y-6">
      <Card className="border-[#247CFF]/20 bg-[#0A0F2C]/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#247CFF]" />
            A.R.I.A™ Admin Login System Check
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
                    Automated system integrity and configuration validation
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

          {/* System Status Summary */}
          {completed && (
            <Card className="bg-[#247CFF]/10 border-[#247CFF]/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(getOverallStatus())}
                  <div>
                    <p className="text-white font-medium">Admin Login System Check Complete</p>
                    <p className="text-[#D8DEE9]/80 text-sm mt-1">
                      {getOverallStatus() === 'success' ? 
                        'All systems operational. A.R.I.A™ is ready for live operations.' :
                        'System check completed with issues. Some manual intervention may be required.'
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
