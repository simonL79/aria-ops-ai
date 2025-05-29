
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Shield,
  Activity,
  Zap
} from 'lucide-react';
import { SystemConfigManager, SystemConfigResult } from '@/services/ariaCore/systemConfigManager';
import { toast } from 'sonner';

const SystemConfigurationPanel = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configResult, setConfigResult] = useState<SystemConfigResult | null>(null);
  const [progress, setProgress] = useState(0);

  const runSystemConfiguration = async () => {
    setIsConfiguring(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 500);

      const result = await SystemConfigManager.configureLiveSystem();
      
      clearInterval(progressInterval);
      setProgress(100);
      setConfigResult(result);
      
      if (result.success) {
        toast.success('A.R.I.A™ system successfully configured for live operations');
      } else {
        toast.warning('Configuration completed with some issues');
      }
    } catch (error) {
      console.error('Configuration error:', error);
      toast.error('System configuration failed');
    } finally {
      setIsConfiguring(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const getStatusIcon = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#247CFF]/20 bg-[#0A0F2C]/90">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-[#247CFF]" />
              A.R.I.A™ System Configuration
            </CardTitle>
            <Button
              onClick={runSystemConfiguration}
              disabled={isConfiguring}
              className="bg-[#247CFF] hover:bg-[#1c63cc] text-white"
            >
              {isConfiguring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Configuring...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Configure Live System
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Progress Bar */}
          {isConfiguring && (
            <Card className="bg-[#247CFF]/10 border-[#247CFF]/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-[#247CFF] animate-spin" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Configuring A.R.I.A™ System</p>
                    <p className="text-[#D8DEE9]/60 text-sm">
                      Setting up live operations, initializing modules, and verifying configuration...
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="mt-3" />
              </CardContent>
            </Card>
          )}

          {/* Configuration Results */}
          {configResult && (
            <div className="space-y-4">
              {/* Success Summary */}
              <Card className={`${configResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(configResult.success ? 'success' : 'warning')}
                    <div>
                      <p className="text-white font-medium">
                        Configuration {configResult.success ? 'Completed Successfully' : 'Completed with Issues'}
                      </p>
                      <p className="text-[#D8DEE9]/80 text-sm">
                        {configResult.fixes_applied.length} fixes applied, {configResult.issues.length} issues, {configResult.warnings.length} warnings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fixes Applied */}
              {configResult.fixes_applied.length > 0 && (
                <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Fixes Applied ({configResult.fixes_applied.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {configResult.fixes_applied.map((fix, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-[#D8DEE9]/90 text-sm">{fix}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Issues */}
              {configResult.issues.length > 0 && (
                <Card className="bg-[#1C1C1E]/50 border-red-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Issues ({configResult.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {configResult.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-[#D8DEE9]/90 text-sm">{issue}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {configResult.warnings.length > 0 && (
                <Card className="bg-[#1C1C1E]/50 border-yellow-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Warnings ({configResult.warnings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {configResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-[#D8DEE9]/90 text-sm">{warning}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Configuration Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#D8DEE9]/60">System Mode</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Activity className="h-4 w-4 text-[#247CFF]" />
                      <span className="text-white font-medium">Live Operations</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    ACTIVE
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#D8DEE9]/60">Data Validation</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-[#247CFF]" />
                      <span className="text-white font-medium">Strict Mode</span>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 text-white border-0">
                    ENABLED
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#D8DEE9]/60">Mock Data</p>
                    <div className="flex items-center gap-2 mt-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-white font-medium">Disabled</span>
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white border-0">
                    BLOCKED
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <Card className="bg-[#247CFF]/10 border-[#247CFF]/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#247CFF] mt-0.5" />
                <div>
                  <p className="text-white font-medium">System Configuration Manager</p>
                  <p className="text-[#D8DEE9]/80 text-sm mt-1">
                    This tool configures A.R.I.A™ for live operations, disables mock data, initializes monitoring modules, 
                    and ensures proper system security settings. Run this after system updates or when switching from development to production.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfigurationPanel;
