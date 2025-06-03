
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Lock, RefreshCw } from 'lucide-react';
import { RDPComplianceEnforcer } from '@/services/ariaCore/rdpCompliance';

const RDPCompliancePanel = () => {
  const [complianceStats, setComplianceStats] = useState({
    total_violations: 0,
    violations_by_type: {},
    violations_by_stage: {},
    quarantined_items: 0
  });
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAudit, setLastAudit] = useState(new Date());

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      const stats = await RDPComplianceEnforcer.getComplianceStats();
      setComplianceStats(stats);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    }
  };

  const runSystemAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await RDPComplianceEnforcer.performSystemComplianceAudit();
      setAuditResult(result);
      setLastAudit(new Date());
      await loadComplianceData(); // Refresh stats
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            RDP-001 Compliance Monitor
          </h2>
          <p className="text-muted-foreground">Real-Only Data Policy Enforcement</p>
        </div>
        
        <Button 
          onClick={runSystemAudit}
          disabled={isAuditing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
          {isAuditing ? 'Auditing...' : 'Run Audit'}
        </Button>
      </div>

      {/* Audit Status */}
      {auditResult && (
        <Alert className={auditResult.compliant ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <div className="flex items-center gap-2">
            {auditResult.compliant ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={auditResult.compliant ? 'text-green-800' : 'text-red-800'}>
              <strong>{auditResult.audit_summary}</strong>
              <br />
              <small>Last audit: {lastAudit.toLocaleString()}</small>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complianceStats.total_violations}
            </div>
            <p className="text-xs text-muted-foreground">Since deployment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quarantined Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {complianceStats.quarantined_items}
            </div>
            <p className="text-xs text-muted-foreground">Blocked from deployment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Policy Version</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">RDP-001</div>
            <p className="text-xs text-muted-foreground">Current enforcement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Enforcement Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-100 text-green-800">
              <Lock className="h-3 w-3 mr-1" />
              ACTIVE
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Multi-stage validation</p>
          </CardContent>
        </Card>
      </div>

      {/* Violations by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Violations by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(complianceStats.violations_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                <Badge variant="destructive">{String(count)}</Badge>
              </div>
            ))}
            {Object.keys(complianceStats.violations_by_type).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                ✅ No violations detected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Violations by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Violations by Pipeline Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(complianceStats.violations_by_stage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm capitalize">{stage}</span>
                <Badge variant="outline">{String(count)}</Badge>
              </div>
            ))}
            {Object.keys(complianceStats.violations_by_stage).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                ✅ All pipeline stages compliant
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Policy Summary */}
      <Card>
        <CardHeader>
          <CardTitle>RDP-001 Policy Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-600">❌</span>
              <span>No mock, placeholder, or simulated data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>All input data from real, verified sources</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span>HTTP 200 status required for all URLs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🔒</span>
              <span>Enforcement at generation, approval, and deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">🚫</span>
              <span>Runtime rejection of test/mock/dev data</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RDPCompliancePanel;
