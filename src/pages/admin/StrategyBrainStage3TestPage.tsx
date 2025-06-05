
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Strategy Brain Stage 3 imports
import { generatePredictiveAnalytics } from '@/services/strategyBrain/predictiveAnalytics';
import { checkAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { analyzePatterns } from '@/services/strategyBrain/patternAnalyzer';
import { createCoordinationPlan, executeCoordinationPlan, getCoordinationMetrics } from '@/services/strategyBrain/crossPlatformCoordinator';
import { ResponseStrategy } from '@/services/strategyBrain/responseGenerator';

interface TestResult {
  test: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  data?: any;
  error?: string;
  timestamp?: string;
}

const StrategyBrainStage3TestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { test: 'Predictive Analytics', status: 'pending' },
    { test: 'Auto-Execution Engine', status: 'pending' },
    { test: 'ML Pattern Recognition', status: 'pending' },
    { test: 'Cross-Platform Coordination', status: 'pending' }
  ]);

  const updateTestResult = (testName: string, status: TestResult['status'], data?: any, error?: string) => {
    setTestResults(prev => prev.map(test => 
      test.test === testName 
        ? { 
            ...test, 
            status, 
            data, 
            error,
            timestamp: new Date().toLocaleTimeString()
          }
        : test
    ));
  };

  const runPredictiveAnalyticsTest = async () => {
    try {
      updateTestResult('Predictive Analytics', 'running');
      
      const mockStrategy: ResponseStrategy = {
        id: 'test-strategy-123',
        entityName: `TestEntity-Stage3-${Date.now()}`,
        priority: 'high',
        timeframe: '24 hours',
        actions: [
          {
            type: 'content_creation',
            platform: 'website',
            content: 'Test content',
            priority: 'high'
          }
        ],
        reasoning: 'Test reasoning',
        confidence: 0.8,
        createdAt: new Date().toISOString()
      };

      const result = await generatePredictiveAnalytics(mockStrategy);
      
      updateTestResult('Predictive Analytics', 'passed', result);
      console.log('✅ Predictive Analytics test passed:', result);
      
    } catch (error) {
      console.error('❌ Predictive Analytics test failed:', error);
      updateTestResult('Predictive Analytics', 'failed', null, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAutoExecutionTest = async () => {
    try {
      updateTestResult('Auto-Execution Engine', 'running');
      
      const mockStrategy: ResponseStrategy = {
        id: 'auto-test-strategy',
        entityName: `TestEntity-AutoExec-${Date.now()}`,
        priority: 'medium',
        timeframe: '1 hour',
        actions: [
          {
            type: 'social_media_post',
            platform: 'twitter',
            content: 'Test auto execution',
            priority: 'medium'
          }
        ],
        reasoning: 'Auto execution test',
        confidence: 0.6,
        createdAt: new Date().toISOString()
      };

      const result = await checkAutoExecution(mockStrategy);
      
      updateTestResult('Auto-Execution Engine', 'passed', result);
      console.log('✅ Auto-Execution Engine test passed:', result);
      
    } catch (error) {
      console.error('❌ Auto-Execution Engine test failed:', error);
      updateTestResult('Auto-Execution Engine', 'failed', null, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runPatternRecognitionTest = async () => {
    try {
      updateTestResult('ML Pattern Recognition', 'running');
      
      const result = await analyzePatterns(`TestEntity-Pattern-${Date.now()}`);
      
      updateTestResult('ML Pattern Recognition', 'passed', result);
      console.log('✅ ML Pattern Recognition test passed:', result);
      
    } catch (error) {
      console.error('❌ ML Pattern Recognition test failed:', error);
      updateTestResult('ML Pattern Recognition', 'failed', null, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runCrossPlatformCoordinationTest = async () => {
    try {
      updateTestResult('Cross-Platform Coordination', 'running');
      
      const mockStrategies: ResponseStrategy[] = [
        {
          id: 'coord-strategy-1',
          entityName: `TestEntity-Coord-${Date.now()}`,
          priority: 'high',
          timeframe: '2 hours',
          actions: [
            {
              type: 'content_creation',
              platform: 'website',
              content: 'Test coordination content 1',
              priority: 'high'
            }
          ],
          reasoning: 'Coordination test strategy 1',
          confidence: 0.9,
          createdAt: new Date().toISOString()
        },
        {
          id: 'coord-strategy-2',
          entityName: `TestEntity-Coord-${Date.now()}`,
          priority: 'medium',
          timeframe: '4 hours',
          actions: [
            {
              type: 'social_media_post',
              platform: 'linkedin',
              content: 'Test coordination content 2',
              priority: 'medium'
            }
          ],
          reasoning: 'Coordination test strategy 2',
          confidence: 0.75,
          createdAt: new Date().toISOString()
        }
      ];

      // Create coordination plan
      const plan = await createCoordinationPlan('TestCoordination', mockStrategies);
      
      // Execute the plan
      const executionResult = await executeCoordinationPlan(plan.id);
      
      updateTestResult('Cross-Platform Coordination', 'passed', executionResult);
      console.log('✅ Cross-Platform Coordination test passed:', executionResult);
      
    } catch (error) {
      console.error('❌ Cross-Platform Coordination test failed:', error);
      updateTestResult('Cross-Platform Coordination', 'failed', null, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      // Reset all tests to pending
      setTestResults(prev => prev.map(test => ({ ...test, status: 'pending' as const })));
      
      await runPredictiveAnalyticsTest();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between tests
      
      await runAutoExecutionTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runPatternRecognitionTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runCrossPlatformCoordinationTest();
      
      // Get coordination metrics without any arguments
      const metrics = await getCoordinationMetrics();
      console.log('📊 Coordination Metrics:', metrics);
      
      toast.success('Stage 3 tests completed', {
        description: 'Check individual test results for details'
      });
      
    } catch (error) {
      console.error('Test suite error:', error);
      toast.error('Test suite failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'bg-green-500 text-white',
      failed: 'bg-red-500 text-white',
      running: 'bg-blue-500 text-white',
      pending: 'bg-gray-500 text-white'
    };

    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const passedTests = testResults.filter(test => test.status === 'passed').length;
  const totalTests = testResults.length;
  const progress = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-500" />
            Strategy Brain Stage 3 Testing
          </h1>
          <p className="text-corporate-lightGray mt-2">
            Advanced AI intelligence features validation
          </p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isRunning ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Test Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{passedTests}/{totalTests} tests passed</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(test => test.status === 'failed').length}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(test => test.status === 'running').length}
                </div>
                <div className="text-xs text-muted-foreground">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {testResults.filter(test => test.status === 'pending').length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid gap-4">
        {testResults.map((test) => (
          <Card key={test.test} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  {test.test}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {test.timestamp && (
                    <span className="text-xs text-muted-foreground">{test.timestamp}</span>
                  )}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {test.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-800 mb-1">Error Details:</h4>
                  <p className="text-sm text-red-700">{test.error}</p>
                </div>
              )}
              {test.data && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Test Data:</h4>
                  <pre className="text-xs text-green-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Stage 3 Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            This advanced test suite validates Stage 3 Strategy Brain intelligence features:
          </p>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li><strong>Predictive Analytics:</strong> Tests success probability calculation and risk assessment</li>
            <li><strong>Auto-Execution Engine:</strong> Tests autonomous strategy execution and queue management</li>
            <li><strong>ML Pattern Recognition:</strong> Tests machine learning recommendations and training</li>
            <li><strong>Cross-Platform Coordination:</strong> Tests multi-platform deployment and synchronization</li>
          </ul>
          <p className="text-blue-700 mt-4">
            All Stage 3 tests should pass for full advanced intelligence functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBrainStage3TestPage;
