
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { predictStrategySuccess } from '@/services/strategyBrain/predictiveAnalytics';
import { evaluateForAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { createCoordinationPlan, executeCoordinationPlan, getCoordinationMetrics } from '@/services/strategyBrain/crossPlatformCoordinator';
import { generateResponseStrategies } from '@/services/strategyBrain/responseGenerator';

const StrategyBrainStage3TestPage = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  const runAdvancedTests = async () => {
    setIsTestRunning(true);
    setTestResults([]);
    
    try {
      console.log('🧠 Starting Strategy Brain Stage 3 Advanced Tests...');
      toast.info('Running Advanced Strategy Brain Tests');

      const results = [];

      // Test 1: Predictive Analytics
      try {
        const testStrategy = {
          id: 'test-strategy-1',
          type: 'defensive' as const,
          title: 'Test Defensive Strategy',
          description: 'A test strategy for predictive analysis',
          actions: [
            {
              action: 'Monitor social media platforms',
              platform: 'Twitter',
              timeline: '2 hours',
              responsible: 'Social Media Team',
              kpi: 'Response time < 2 hours'
            },
            {
              action: 'Deploy counter-narrative content',
              platform: 'Facebook',
              timeline: '4 hours',
              responsible: 'Content Team',
              kpi: 'Reach 10K+ users'
            }
          ],
          priority: 'high' as const,
          timeframe: '24 hours',
          resources: ['Social Media Team', 'Content Team'],
          successMetrics: ['Response time', 'Reach metrics'],
          riskLevel: 'medium',
          createdAt: new Date().toISOString()
        };

        const prediction = await predictStrategySuccess(testStrategy);
        results.push({
          test: 'Predictive Analytics',
          status: 'success',
          data: prediction,
          message: `Success probability: ${prediction.successProbability}%`
        });
      } catch (error) {
        results.push({
          test: 'Predictive Analytics',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: Auto-Execution Engine
      try {
        const testStrategy2 = {
          id: 'test-strategy-2',
          type: 'engagement' as const,
          title: 'Test Engagement Strategy',
          description: 'A test strategy for auto-execution evaluation',
          actions: [
            {
              action: 'Engage with positive mentions',
              platform: 'Instagram',
              timeline: '1 hour',
              responsible: 'Community Manager',
              kpi: 'Engagement rate increase'
            },
            {
              action: 'Share user-generated content',
              platform: 'LinkedIn',
              timeline: '6 hours',
              responsible: 'Marketing Team',
              kpi: 'Viral coefficient > 1.2'
            }
          ],
          priority: 'medium' as const,
          timeframe: '12 hours',
          resources: ['Community Manager', 'Marketing Team'],
          successMetrics: ['Engagement rate', 'Viral coefficient'],
          riskLevel: 'low',
          createdAt: new Date().toISOString()
        };

        const autoExecution = await evaluateForAutoExecution(testStrategy2);
        results.push({
          test: 'Auto-Execution Engine',
          status: 'success',
          data: autoExecution,
          message: `Auto-execution ${autoExecution.canAutoExecute ? 'approved' : 'requires manual review'}`
        });
      } catch (error) {
        results.push({
          test: 'Auto-Execution Engine',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Pattern Analysis
      try {
        const testEntity = 'TestCorp Inc';
        const patterns = await analyzeEntityPatterns(testEntity);
        results.push({
          test: 'Pattern Analysis',
          status: 'success',
          data: patterns,
          message: `Detected ${patterns.length} patterns for ${testEntity}`
        });
      } catch (error) {
        results.push({
          test: 'Pattern Analysis',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 4: Cross-Platform Coordination
      try {
        const coordinationStrategies = [
          {
            id: 'coord-test-1',
            type: 'defensive' as const,
            title: 'Coordinated Defense Strategy',
            description: 'Multi-platform defensive response coordination',
            actions: [
              {
                action: 'File platform violation reports',
                platform: 'Twitter, Facebook',
                timeline: '30 minutes',
                responsible: 'Legal Team',
                kpi: 'Reports filed within 30 min'
              },
              {
                action: 'Deploy crisis communication',
                platform: 'All platforms',
                timeline: '1 hour',
                responsible: 'Crisis Team',
                kpi: 'Message consistency across platforms'
              }
            ],
            priority: 'critical' as const,
            timeframe: '2 hours',
            resources: ['Legal Team', 'Crisis Team', 'Platform Relations'],
            successMetrics: ['Response time', 'Message consistency'],
            riskLevel: 'medium',
            createdAt: new Date().toISOString()
          }
        ];

        const coordinationPlan = await createCoordinationPlan('TestCorp Inc', coordinationStrategies);
        const executionResult = await executeCoordinationPlan(coordinationPlan.id);
        
        results.push({
          test: 'Cross-Platform Coordination',
          status: 'success',
          data: { coordinationPlan, executionResult },
          message: `Plan executed: ${executionResult.success ? 'Success' : 'Partial success'}`
        });
      } catch (error) {
        results.push({
          test: 'Cross-Platform Coordination',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Get coordination metrics
      try {
        const coordinationMetrics = await getCoordinationMetrics();
        setMetrics(coordinationMetrics);
      } catch (error) {
        console.warn('Could not fetch coordination metrics:', error);
      }

      setTestResults(results);
      toast.success('Advanced Strategy Brain Tests Completed');

    } catch (error) {
      console.error('Advanced test execution failed:', error);
      toast.error('Advanced tests failed');
    } finally {
      setIsTestRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            Strategy Brain Stage 3 Testing
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced AI strategy testing with predictive analytics and coordination systems
          </p>
        </div>
        
        <Button 
          onClick={runAdvancedTests}
          disabled={isTestRunning}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isTestRunning ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Advanced Tests
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="metrics">Coordination Metrics</TabsTrigger>
          <TabsTrigger value="analysis">Pattern Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <div className="grid gap-4">
            {testResults.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Test Results</h3>
                  <p className="text-muted-foreground">Run advanced tests to see results here</p>
                </CardContent>
              </Card>
            ) : (
              testResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.test}</CardTitle>
                      <Badge className={getStatusColor(result.status)}>
                        {getStatusIcon(result.status)}
                        <span className="ml-1">{result.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{result.message}</p>
                    {result.data && (
                      <details className="bg-muted p-3 rounded text-xs">
                        <summary className="cursor-pointer font-medium">View Data</summary>
                        <pre className="mt-2 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Coordination System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.totalPlans}</div>
                    <div className="text-sm text-blue-600">Total Plans</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.activePlans}</div>
                    <div className="text-sm text-green-600">Active Plans</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.completedPlans}</div>
                    <div className="text-sm text-purple-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{metrics.successRate.toFixed(1)}%</div>
                    <div className="text-sm text-orange-600">Success Rate</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No metrics available. Run tests to generate data.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Advanced Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced pattern analysis results will appear here after running tests.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyBrainStage3TestPage;
