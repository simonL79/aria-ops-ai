
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Zap
} from 'lucide-react';
import { LiveDataIntegrityService, type LiveDataIntegrityReport } from '@/services/ariaCore/liveDataIntegrityService';
import { toast } from 'sonner';

const LiveDataIntegrityPanel = () => {
  const [integrityReport, setIntegrityReport] = useState<LiveDataIntegrityReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runIntegrityCheck = async () => {
    setIsRunning(true);
    try {
      toast.info('🔥 WEAPONS GRADE: Initiating live data integrity validation...');
      
      const report = await LiveDataIntegrityService.runCompleteIntegrityCheck();
      setIntegrityReport(report);
      
      if (report.status === 'SECURE') {
        toast.success(`🔥 WEAPONS GRADE: System secured - ${report.mockDataPurged} threats neutralized`);
      } else if (report.status === 'DEGRADED') {
        toast.warning(`⚠️ WEAPONS GRADE: System degraded - ${report.recommendations.length} issues require attention`);
      } else {
        toast.error(`🚨 WEAPONS GRADE: System compromised - immediate action required`);
      }
    } catch (error) {
      toast.error('❌ WEAPONS GRADE: Integrity validation failed');
      console.error('Integrity check error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SECURE':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'DEGRADED':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'COMPROMISED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SECURE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DEGRADED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPROMISED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="corporate-heading flex items-center gap-2">
          <Shield className="h-5 w-5 text-corporate-accent" />
          🔥 WEAPONS GRADE Live Data Integrity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-corporate-lightGray">
            Zero tolerance enforcement for mock/simulation data contamination
          </p>
          <Button
            onClick={runIntegrityCheck}
            disabled={isRunning}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            <Zap className={`h-4 w-4 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Validating...' : 'Run Integrity Check'}
          </Button>
        </div>

        {integrityReport && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 rounded border border-corporate-border bg-corporate-dark">
              <div className="flex items-center gap-3">
                {getStatusIcon(integrityReport.status)}
                <div>
                  <h4 className="font-medium text-white">System Status</h4>
                  <p className="text-sm text-corporate-lightGray">
                    Last check: {new Date(integrityReport.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(integrityReport.status)}>
                {integrityReport.status}
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-corporate-dark rounded border border-corporate-border">
                <div className="text-2xl font-bold text-green-400">
                  {integrityReport.mockDataPurged}
                </div>
                <p className="text-xs text-corporate-lightGray">Mock Data Purged</p>
              </div>
              
              <div className="text-center p-3 bg-corporate-dark rounded border border-corporate-border">
                <div className="text-2xl font-bold text-blue-400">
                  {integrityReport.weaponsGradeStatus?.liveDataCount || 0}
                </div>
                <p className="text-xs text-corporate-lightGray">Live Data Count</p>
              </div>
              
              <div className="text-center p-3 bg-corporate-dark rounded border border-corporate-border">
                <div className="text-2xl font-bold text-yellow-400">
                  {integrityReport.rlsIssuesFixed}
                </div>
                <p className="text-xs text-corporate-lightGray">RLS Issues Fixed</p>
              </div>
              
              <div className="text-center p-3 bg-corporate-dark rounded border border-corporate-border">
                <div className="text-2xl font-bold text-purple-400">
                  {integrityReport.validationResults?.passedChecks || 0}/
                  {integrityReport.validationResults?.totalChecks || 0}
                </div>
                <p className="text-xs text-corporate-lightGray">Validation Checks</p>
              </div>
            </div>

            {/* Recommendations */}
            {integrityReport.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-white">🔥 WEAPONS GRADE Recommendations:</h4>
                {integrityReport.recommendations.map((recommendation, index) => (
                  <Alert key={index} className="border-corporate-border bg-corporate-dark">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-corporate-lightGray">
                      {recommendation}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Weapons Grade Status Details */}
            {integrityReport.weaponsGradeStatus && (
              <div className="p-4 bg-corporate-dark rounded border border-corporate-border">
                <h4 className="font-medium text-white mb-2">🔥 WEAPONS GRADE Status Details:</h4>
                <div className="text-sm text-corporate-lightGray space-y-1">
                  <p>• Live Data Integrity: {integrityReport.weaponsGradeStatus.liveDataIntegrity}%</p>
                  <p>• Mock Data Blocked: {integrityReport.weaponsGradeStatus.mockDataBlocked}</p>
                  <p>• Last Validation: {integrityReport.weaponsGradeStatus.lastValidation}</p>
                  <p>• Message: {integrityReport.weaponsGradeStatus.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveDataIntegrityPanel;
