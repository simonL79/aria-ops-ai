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
  Loader,
  Globe,
  Eye,
  Bot,
  Languages
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
    logMultilingualThreat,
    deployDarkWebAgent,
    logLLMWatchdog,
    getIntelligenceMetrics,
    isLoading,
    status
  } = useAnubisControl();

  const [metrics, setMetrics] = useState<any>(null);
  const [intelligenceMetrics, setIntelligenceMetrics] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      loadMetrics();
      loadIntelligenceMetrics();
    }
  }, [isAdmin]);

  const loadMetrics = async () => {
    const securityMetrics = await getSecurityMetrics();
    setMetrics(securityMetrics);
  };

  const loadIntelligenceMetrics = async () => {
    const intelMetrics = await getIntelligenceMetrics();
    setIntelligenceMetrics(intelMetrics);
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-8 w-8" />
            A.R.I.A™ Anubis Security Cockpit
          </CardTitle>
          <p className="text-purple-200">Advanced monitoring, security controls, and intelligence operations</p>
        </CardHeader>
      </Card>

      {/* Enhanced Security Metrics */}
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

      {/* Intelligence Metrics */}
      {intelligenceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Intelligence Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{intelligenceMetrics.multilingualThreats}</div>
                <div className="text-sm text-muted-foreground">Multilingual Threats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{intelligenceMetrics.activeAgents}</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{intelligenceMetrics.biasDetections}</div>
                <div className="text-sm text-muted-foreground">Bias Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{intelligenceMetrics.hallucinations}</div>
                <div className="text-sm text-muted-foreground">Hallucinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{intelligenceMetrics.criticalWatchdogAlerts}</div>
                <div className="text-sm text-muted-foreground">Critical Alerts</div>
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

      {/* Intelligence Operations */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Multilingual Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => logMultilingualThreat(
                'Ejemplo de amenaza en español',
                'es',
                'Example threat in Spanish'
              )}
              variant="outline"
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              Log Spanish Threat
            </Button>
            
            <Button
              onClick={() => logMultilingualThreat(
                'Exemple de menace en français',
                'fr',
                'Example threat in French'
              )}
              variant="outline"
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              Log French Threat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Dark Web Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => deployDarkWebAgent(
                'Agent-Shadow-' + Math.random().toString(36).substr(2, 5),
                'surveillance'
              )}
              variant="outline"
              className="w-full border-gray-700 text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              Deploy Surveillance Agent
            </Button>
            
            <Button
              onClick={() => deployDarkWebAgent(
                'Agent-Bait-' + Math.random().toString(36).substr(2, 5),
                'bait',
                'threat-actor-unknown'
              )}
              variant="outline"
              className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Deploy Bait Operation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              LLM Watchdog
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => logLLMWatchdog(
                'gpt-4',
                'Detected potential bias in entity representation',
                true,
                false,
                'medium'
              )}
              variant="outline"
              className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Bot className="h-4 w-4 mr-2" />
              Log Bias Detection
            </Button>
            
            <Button
              onClick={() => logLLMWatchdog(
                'claude',
                'Hallucination detected in factual response',
                false,
                true,
                'high'
              )}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Log Hallucination
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
