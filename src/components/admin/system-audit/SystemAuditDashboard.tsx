
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, X, Play, FileText } from "lucide-react";
import { executeSystemAudit, type ComprehensiveAuditReport } from "@/services/ariaCore/systemAudit";
import { toast } from "sonner";

const SystemAuditDashboard = () => {
  const [auditReport, setAuditReport] = useState<ComprehensiveAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleExecuteAudit = async () => {
    setIsAuditing(true);
    try {
      toast.info("Starting comprehensive A.R.I.A™ system audit...", {
        description: "Verifying 100% live data compliance across all components"
      });
      
      const report = await executeSystemAudit();
      setAuditReport(report);
      
      if (report.overallCompliance) {
        toast.success("System Audit Complete: 100% Compliance Verified", {
          description: "All components confirmed using live data sources only"
        });
      } else {
        toast.error("System Audit Complete: Critical Issues Found", {
          description: `${report.criticalIssues.length} issues require immediate attention`
        });
      }
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error("System audit failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LIVE_VERIFIED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'MOCK_DETECTED':
      case 'SIMULATION_FOUND':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'ERROR':
        return <X className="h-5 w-5 text-orange-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE_VERIFIED':
        return 'default';
      case 'MOCK_DETECTED':
      case 'SIMULATION_FOUND':
        return 'destructive';
      case 'ERROR':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">A.R.I.A™ System Audit</h2>
          <p className="text-corporate-lightGray">
            Comprehensive live data compliance verification for client-dependent services
          </p>
        </div>
        
        <Button 
          onClick={handleExecuteAudit}
          disabled={isAuditing}
          className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          <Play className="h-4 w-4 mr-2" />
          {isAuditing ? 'Auditing System...' : 'Execute Full Audit'}
        </Button>
      </div>

      {isAuditing && (
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-corporate-accent animate-pulse" />
              <div>
                <h3 className="font-semibold text-white">System Audit in Progress</h3>
                <p className="text-sm text-corporate-lightGray">
                  Verifying live data compliance across all A.R.I.A™ components...
                </p>
              </div>
            </div>
            <Progress value={75} className="w-full" />
          </CardContent>
        </Card>
      )}

      {auditReport && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <Alert className={`border-2 ${auditReport.overallCompliance ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-white">
              <div className="font-semibold mb-2">Executive Summary</div>
              {auditReport.executiveSummary}
              <div className="mt-2 text-sm">
                Audit completed: {new Date(auditReport.timestamp).toLocaleString()}
              </div>
            </AlertDescription>
          </Alert>

          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {auditReport.totalComponents}
                    </div>
                    <div className="text-xs text-corporate-lightGray">Total Components</div>
                  </div>
                  <FileText className="h-8 w-8 text-corporate-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {auditReport.liveComponents}
                    </div>
                    <div className="text-xs text-corporate-lightGray">Live Verified</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {auditReport.issueComponents}
                    </div>
                    <div className="text-xs text-corporate-lightGray">Issues Found</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round((auditReport.liveComponents / auditReport.totalComponents) * 100)}%
                    </div>
                    <div className="text-xs text-corporate-lightGray">Compliance Rate</div>
                  </div>
                  <Shield className="h-8 w-8 text-corporate-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Issues */}
          {auditReport.criticalIssues.length > 0 && (
            <Card className="bg-corporate-dark border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Issues Requiring Immediate Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditReport.criticalIssues.map((issue, index) => (
                    <div key={index} className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-200">
                      {issue}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white">Component Audit Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditReport.auditResults.map((result, index) => (
                  <div key={index} className="p-4 border border-corporate-border rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <h4 className="font-semibold text-white">{result.component}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(result.status)}>
                          {result.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-sm text-corporate-lightGray">
                          {result.complianceScore}% compliant
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-corporate-lightGray mb-3">{result.details}</p>
                    
                    {result.issues.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold text-red-400 mb-2">Issues:</h5>
                        <ul className="text-sm text-red-300 space-y-1">
                          {result.issues.map((issue, issueIndex) => (
                            <li key={issueIndex}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.recommendations.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-yellow-400 mb-2">Recommendations:</h5>
                        <ul className="text-sm text-yellow-300 space-y-1">
                          {result.recommendations.map((rec, recIndex) => (
                            <li key={recIndex}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SystemAuditDashboard;
