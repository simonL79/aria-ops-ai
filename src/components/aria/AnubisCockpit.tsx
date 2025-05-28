
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Brain, 
  Mic, 
  MessageSquare, 
  TestTube, 
  Smartphone, 
  AlertTriangle,
  Activity,
  Loader
} from 'lucide-react';
import { useAnubisControl } from '@/hooks/useAnubisControl';
import { useAuth } from '@/hooks/useAuth';

const AnubisCockpit = () => {
  const { user, isAdmin } = useAuth();
  const {
    runDiagnostic,
    logHotword,
    logSlackEvent,
    pushTestResult,
    registerMobileDevice,
    logAIAttack,
    getSecurityMetrics,
    isLoading,
    status
  } = useAnubisControl();

  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      loadMetrics();
    }
  }, [isAdmin]);

  const loadMetrics = async () => {
    const securityMetrics = await getSecurityMetrics();
    setMetrics(securityMetrics);
  };

  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">Admin privileges required for Anubis Cockpit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-8 w-8" />
            A.R.I.A™ Anubis Security Cockpit
          </CardTitle>
          <p className="text-purple-200">Advanced monitoring, security controls, and diagnostics</p>
        </CardHeader>
      </Card>

      {/* Security Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.passedTests}</div>
                <div className="text-sm text-muted-foreground">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{metrics.attacksDetected}</div>
                <div className="text-sm text-muted-foreground">Attacks Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.activeSessions}</div>
                <div className="text-sm text-muted-foreground">Active Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{metrics.hotwordTriggers}</div>
                <div className="text-sm text-muted-foreground">Hotword Triggers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              System Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runDiagnostic}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run System Diagnostic
                </>
              )}
            </Button>
            
            <Separator />
            
            <Button
              onClick={() => pushTestResult('AnubisCockpit', 'manual_test', true, 150)}
              variant="outline"
              className="w-full"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Log Test Result
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice & Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => logHotword('Hey Anubis, status report', true)}
              variant="outline"
              className="w-full"
            >
              <Mic className="h-4 w-4 mr-2" />
              Log Hotword Detection
            </Button>
            
            <Button
              onClick={() => registerMobileDevice('Test Device', 'WebApp', 'test-token-123')}
              variant="outline"
              className="w-full"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Register Mobile Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security & Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => logSlackEvent('#security-alerts', 'test_alert', { 
                message: '🛡️ Anubis cockpit test alert',
                timestamp: new Date().toISOString(),
                severity: 'low'
              })}
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Queue Slack Alert
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => logAIAttack(
                'cockpit_test', 
                'This is a test attack simulation', 
                'prompt_injection', 
                0.85, 
                'quarantined_by_cockpit'
              )}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Simulate AI Attack
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Display */}
      {status && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Status</Badge>
              <span className="text-sm font-mono">{status}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnubisCockpit;
