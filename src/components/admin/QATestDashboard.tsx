
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TestTube,
  Clock,
  TrendingUp,
  Shield,
  Database,
  Eye,
  RefreshCw
} from 'lucide-react';
import { qaTestRunner, type QATestSuite, type QATestResult } from '@/services/testing/qaTestRunner';
import { toast } from 'sonner';

const QATestDashboard = () => {
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const runQATests = async () => {
    try {
      setRunning(true);
      toast.info('🧪 Starting ARIA™ NOC QA Master Suite...', {
        description: 'Running comprehensive system health checks'
      });
      
      const results = await qaTestRunner.runFullQASuite();
      setTestSuite(results);
      
      const { passedTests, failedTests, warningTests, gdprCompliance } = results;
      
      if (failedTests > 0) {
        toast.error(`❌ QA Suite: ${failedTests} critical failures detected`, {
          description: `${warningTests} warnings, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      } else if (warningTests > 0) {
        toast.warning(`⚠️ QA Suite: ${warningTests} warnings found`, {
          description: `All tests passed with warnings, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      } else {
        toast.success('✅ QA Suite: All systems operational!', {
          description: `${passedTests}/${results.totalTests} tests passed, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      }
      
    } catch (error) {
      console.error('QA test suite failed:', error);
      toast.error('❌ QA test suite execution failed', {
        description: 'Check console for detailed error information'
      });
    } finally {
      setRunning(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getDataSourceIcon = (dataSource?: 'live' | 'none') => {
    if (dataSource === 'live') {
      return <Database className="h-3 w-3 text-green-600" />;
    } else if (dataSource === 'none') {
      return <Eye className="h-3 w-3 text-gray-400" />;
    }
    return null;
  };

  const getPhases = (): string[] => {
    if (!testSuite) return [];
    const phases = [...new Set(testSuite.results.map(r => r.phase))];
    return ['all', ...phases];
  };

  const getFilteredResults = (): QATestResult[] => {
    if (!testSuite) return [];
    if (selectedPhase === 'all') return testSuite.results;
    return testSuite.results.filter(r => r.phase === selectedPhase);
  };

  const getPhaseStats = (phase: string) => {
    if (!testSuite) return { total: 0, passed: 0, failed: 0, warnings: 0 };
    
    const phaseResults = phase === 'all' 
      ? testSuite.results 
      : testSuite.results.filter(r => r.phase === phase);
      
    return {
      total: phaseResults.length,
      passed: phaseResults.filter(r => r.status === 'pass').length,
      failed: phaseResults.filter(r => r.status === 'fail').length,
      warnings: phaseResults.filter(r => r.status === 'warning').length
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            ARIA™ NOC QA Master Suite
          </h2>
          <p className="text-muted-foreground">
            Daily system health monitoring • GDPR compliance • Live data validation
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runQATests} 
            disabled={running}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {running ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run QA Suite
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Test Suite Overview */}
      {testSuite && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testSuite.totalTests}</div>
                <p className="text-xs text-muted-foreground">
                  {(testSuite.duration / 1000).toFixed(1)}s runtime
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Passed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{testSuite.passedTests}</div>
                <p className="text-xs text-muted-foreground">
                  {testSuite.totalTests > 0 ? Math.round((testSuite.passedTests / testSuite.totalTests) * 100) : 0}% success
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{testSuite.failedTests}</div>
                <p className="text-xs text-muted-foreground">
                  {testSuite.totalTests > 0 ? Math.round((testSuite.failedTests / testSuite.totalTests) * 100) : 0}% failure
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{testSuite.warningTests}</div>
                <p className="text-xs text-muted-foreground">
                  {testSuite.totalTests > 0 ? Math.round((testSuite.warningTests / testSuite.totalTests) * 100) : 0}% warnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  GDPR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{testSuite.gdprCompliance.compliancePercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {testSuite.gdprCompliance.compliantTests}/{testSuite.gdprCompliance.totalGdprTests} compliant
                </p>
              </CardContent>
            </Card>
          </div>

          {/* GDPR Compliance Overview */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                GDPR Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Compliance Score</span>
                  <span className="font-medium">{testSuite.gdprCompliance.compliancePercentage}%</span>
                </div>
                <Progress 
                  value={testSuite.gdprCompliance.compliancePercentage} 
                  className="h-2"
                />
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Compliant: {testSuite.gdprCompliance.compliantTests}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Non-compliant: {testSuite.gdprCompliance.totalGdprTests - testSuite.gdprCompliance.compliantTests}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall System Health</span>
                  <span>{testSuite.passedTests}/{testSuite.totalTests}</span>
                </div>
                <Progress 
                  value={(testSuite.passedTests / testSuite.totalTests) * 100} 
                  className="h-2" 
                />
                
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Passed: {testSuite.passedTests}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Failed: {testSuite.failedTests}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Warnings: {testSuite.warningTests}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results by Phase */}
          <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full">
              {getPhases().map((phase) => (
                <TabsTrigger key={phase} value={phase} className="text-xs">
                  {phase === 'all' ? 'All' : phase.replace('Phase ', 'P')}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedPhase} className="space-y-4">
              {/* Phase Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedPhase === 'all' ? 'All Tests' : selectedPhase} Results
                  </CardTitle>
                  <CardDescription>
                    {(() => {
                      const stats = getPhaseStats(selectedPhase);
                      return `${stats.total} tests: ${stats.passed} passed, ${stats.failed} failed, ${stats.warnings} warnings`;
                    })()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getFilteredResults().map((result, index) => (
                      <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <h4 className="font-medium flex items-center gap-2">
                              {result.testName}
                              {getDataSourceIcon(result.dataSource)}
                              {result.gdprCompliant !== undefined && (
                                <Shield className={`h-3 w-3 ${result.gdprCompliant ? 'text-blue-600' : 'text-red-600'}`} />
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {result.timestamp.toLocaleTimeString()}
                              <span>•</span>
                              <span>{result.phase}</span>
                              {result.dataSource && (
                                <>
                                  <span>•</span>
                                  <span className={result.dataSource === 'live' ? 'text-green-600' : 'text-gray-500'}>
                                    {result.dataSource === 'live' ? 'Live Data' : 'No Data'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                          {result.gdprCompliant !== undefined && (
                            <Badge variant="outline" className={result.gdprCompliant ? 'text-blue-600' : 'text-red-600'}>
                              {result.gdprCompliant ? 'GDPR ✓' : 'GDPR ✗'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Critical Issues Alert */}
          {testSuite.failedTests > 0 && (
            <Alert className="border-l-4 border-l-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Critical Issues Detected:</strong> {testSuite.failedTests} test(s) failed. 
                These issues may affect system functionality and should be addressed immediately.
                {testSuite.gdprCompliance.compliancePercentage < 100 && (
                  <span className="block mt-1">
                    <strong>GDPR Compliance:</strong> {100 - testSuite.gdprCompliance.compliancePercentage}% of compliance tests need attention.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Initial State */}
      {!testSuite && !running && (
        <Card className="text-center py-12">
          <CardContent>
            <TestTube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">ARIA™ NOC QA Master Suite</h3>
            <p className="text-muted-foreground mb-6">
              Comprehensive system health monitoring with GDPR compliance validation.
              No mock data - all tests use live system data only.
            </p>
            <Button onClick={runQATests} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Daily Health Check
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Running State */}
      {running && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Running ARIA™ NOC QA Suite...</h3>
            <p className="text-muted-foreground">
              Testing all system components with live data validation and GDPR compliance checks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QATestDashboard;
