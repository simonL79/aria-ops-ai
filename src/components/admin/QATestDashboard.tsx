
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
  TrendingUp
} from 'lucide-react';
import { qaTestRunner, type QATestSuite, type QATestResult } from '@/services/testing/qaTestRunner';
import { toast } from 'sonner';

const QATestDashboard = () => {
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const runQATests = async () => {
    try {
      setRunning(true);
      toast.info('Starting QA test suite...');
      
      const results = await qaTestRunner.runFullQASuite();
      setTestSuite(results);
      
      const { passedTests, failedTests, warningTests } = results;
      
      if (failedTests > 0) {
        toast.error(`QA Suite completed with ${failedTests} failures`);
      } else if (warningTests > 0) {
        toast.warning(`QA Suite completed with ${warningTests} warnings`);
      } else {
        toast.success('QA Suite passed all tests!');
      }
      
    } catch (error) {
      console.error('QA test suite failed:', error);
      toast.error('QA test suite execution failed');
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
            QA Test Dashboard
          </h2>
          <p className="text-muted-foreground">
            ARIA™ NOC QA Master Suite - Comprehensive system testing
          </p>
        </div>
        
        <Button 
          onClick={runQATests} 
          disabled={running}
          size="lg"
        >
          <Play className={`h-4 w-4 mr-2 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running Tests...' : 'Run QA Suite'}
        </Button>
      </div>

      {/* Test Suite Overview */}
      {testSuite && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testSuite.totalTests}</div>
                <p className="text-xs text-muted-foreground">
                  Completed in {(testSuite.duration / 1000).toFixed(1)}s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Passed</CardTitle>
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
                <CardTitle className="text-sm">Failed</CardTitle>
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
                <CardTitle className="text-sm">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{testSuite.warningTests}</div>
                <p className="text-xs text-muted-foreground">
                  {testSuite.totalTests > 0 ? Math.round((testSuite.warningTests / testSuite.totalTests) * 100) : 0}% warnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Test Suite Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
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
            <TabsList className="grid grid-cols-3 lg:grid-cols-8 w-full">
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
                            <h4 className="font-medium">{result.testName}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {result.timestamp.toLocaleTimeString()}
                              <span>•</span>
                              <span>{result.phase}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
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
                <strong>Critical Issues Detected:</strong> {testSuite.failedTests} test(s) failed. 
                These issues may affect system functionality and should be addressed immediately.
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
            <h3 className="text-lg font-medium mb-2">Ready to Run QA Suite</h3>
            <p className="text-muted-foreground mb-6">
              Run the comprehensive QA Master Suite to test all ARIA system components
            </p>
            <Button onClick={runQATests} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start QA Testing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Running State */}
      {running && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Running QA Suite...</h3>
            <p className="text-muted-foreground">
              Testing all system components. This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QATestDashboard;
