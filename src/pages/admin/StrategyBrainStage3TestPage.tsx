
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, Target, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { predictStrategySuccess } from '@/services/strategyBrain/predictiveAnalytics';
import { evaluateForAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { createCoordinationPlan, executeCoordinationPlan } from '@/services/strategyBrain/crossPlatformCoordinator';
import type { ResponseStrategy } from '@/services/strategyBrain/responseGenerator';

const StrategyBrainStage3TestPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('predictive');

  // Mock test strategies for advanced testing
  const mockStrategies: ResponseStrategy[] = [
    {
      id: 'strategy-defensive-001',
      type: 'defensive',
      priority: 'high',
      title: 'Counter-Narrative Response Strategy',
      description: 'Deploy coordinated counter-narrative across multiple platforms',
      actions: [
        {
          action: 'Deploy coordinated response across Twitter, LinkedIn, and Reddit',
          timeline: 'within 2 hours',
          responsible: 'Social Media Team',
          kpi: 'Response coverage >80%'
        },
        {
          action: 'Publish authoritative blog post with supporting evidence',
          timeline: 'within 24 hours',
          responsible: 'Content Team',
          kpi: 'SEO ranking improvement'
        }
      ],
      resources: ['Social Media Team', 'Content Writers', 'Legal Review'],
      timeframe: '48 hours',
      successMetrics: ['Sentiment improvement', 'Reach metrics', 'Engagement rates'],
      riskLevel: 'medium',
      createdAt: new Date().toISOString()
    },
    {
      id: 'strategy-engagement-001',
      type: 'engagement',
      priority: 'medium',
      title: 'Proactive Engagement Campaign',
      description: 'Build positive narrative through thought leadership content',
      actions: [
        {
          action: 'Launch thought leadership series on industry trends',
          timeline: 'within 1 week',
          responsible: 'Marketing Team',
          kpi: 'Engagement rate >5%'
        },
        {
          action: 'Engage with industry influencers and thought leaders',
          timeline: 'ongoing',
          responsible: 'Community Manager',
          kpi: 'Influencer partnership rate'
        }
      ],
      resources: ['Marketing Team', 'Community Manager', 'Industry Experts'],
      timeframe: '2 weeks',
      successMetrics: ['Brand mention sentiment', 'Thought leadership metrics'],
      riskLevel: 'low',
      createdAt: new Date().toISOString()
    }
  ];

  const runPredictiveAnalyticsTest = async () => {
    setIsLoading(true);
    try {
      console.log('🧠 Running Predictive Analytics Test...');
      
      const strategy = mockStrategies[0];
      const prediction = await predictStrategySuccess(strategy, 'Test Entity');
      
      const result = {
        test: 'Predictive Analytics',
        strategy: strategy.title,
        prediction: prediction,
        confidence: prediction.confidence || 0.75,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTestResults(prev => [...prev, result]);
      toast.success(`Predictive analytics test completed with ${Math.round((prediction.confidence || 0.75) * 100)}% confidence`);
      
    } catch (error) {
      console.error('Predictive analytics test failed:', error);
      toast.error('Predictive analytics test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runAutoExecutionTest = async () => {
    setIsLoading(true);
    try {
      console.log('⚡ Running Auto-Execution Engine Test...');
      
      const strategy = mockStrategies[1];
      const autoExecResult = await evaluateForAutoExecution(strategy, 'Test Entity');
      
      const result = {
        test: 'Auto-Execution Engine',
        strategy: strategy.title,
        canAutoExecute: autoExecResult,
        recommendation: autoExecResult ? 'Safe for auto-execution' : 'Requires manual review',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTestResults(prev => [...prev, result]);
      toast.success(`Auto-execution evaluation: ${autoExecResult ? 'APPROVED' : 'MANUAL REVIEW REQUIRED'}`);
      
    } catch (error) {
      console.error('Auto-execution test failed:', error);
      toast.error('Auto-execution test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runPatternAnalysisTest = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Running Pattern Analysis Test...');
      
      const entityName = 'Test Entity';
      const patterns = await analyzeEntityPatterns(entityName);
      
      const result = {
        test: 'Pattern Analysis',
        entity: entityName,
        patterns: patterns,
        patternsFound: patterns.patterns.length,
        confidence: patterns.confidence,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTestResults(prev => [...prev, result]);
      toast.success(`Pattern analysis completed - ${patterns.patterns.length} patterns detected`);
      
    } catch (error) {
      console.error('Pattern analysis test failed:', error);
      toast.error('Pattern analysis test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runCoordinationTest = async () => {
    setIsLoading(true);
    try {
      console.log('🌐 Running Cross-Platform Coordination Test...');
      
      const testStrategies = [
        {
          id: 'coord-test-001',
          type: 'defensive' as const,
          priority: 'critical' as const,
          title: 'Emergency Response Coordination',
          description: 'Coordinate rapid response across all platforms',
          actions: [
            {
              action: 'Deploy crisis response on Twitter',
              timeline: 'immediate',
              responsible: 'Crisis Team',
              kpi: 'Response time <30min'
            },
            {
              action: 'Activate legal response protocol',
              timeline: 'within 1 hour',
              responsible: 'Legal Team',
              kpi: 'Legal action documented'
            }
          ],
          resources: ['Crisis Team', 'Legal Team'],
          timeframe: '2 hours',
          successMetrics: ['Response time', 'Legal coverage'],
          riskLevel: 'medium' as const,
          createdAt: new Date().toISOString()
        }
      ];

      // Create coordination plan
      const plan = await createCoordinationPlan('Test Entity', testStrategies);
      
      // Execute coordination plan
      const executionResult = await executeCoordinationPlan(plan.id);
      
      const result = {
        test: 'Cross-Platform Coordination',
        planId: plan.id,
        strategies: testStrategies.length,
        platforms: plan.platforms,
        execution: executionResult,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTestResults(prev => [...prev, result]);
      toast.success(`Coordination test completed - ${executionResult.executedStrategies.length} strategies executed`);
      
    } catch (error) {
      console.error('Coordination test failed:', error);
      toast.error('Coordination test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runAdvancedIntelligenceTest = async () => {
    setIsLoading(true);
    try {
      console.log('🎯 Running Advanced Intelligence Integration Test...');
      
      // Run multiple AI systems in sequence
      const strategy = mockStrategies[0];
      const entityName = 'Test Entity';
      
      // 1. Predictive Analysis
      const prediction = await predictStrategySuccess(strategy, entityName);
      
      // 2. Pattern Analysis
      const patterns = await analyzeEntityPatterns(entityName);
      
      // 3. Auto-Execution Evaluation
      const autoExec = await evaluateForAutoExecution(strategy, entityName);
      
      // 4. Cross-platform coordination
      const plan = await createCoordinationPlan(entityName, [strategy]);
      
      const result = {
        test: 'Advanced Intelligence Integration',
        entity: entityName,
        prediction: prediction,
        patterns: patterns.patterns.length,
        autoExecutionApproved: autoExec,
        coordinationPlan: plan.id,
        overallScore: (prediction.confidence || 0.75) * 100,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      setTestResults(prev => [...prev, result]);
      toast.success('Advanced intelligence integration test completed successfully');
      
    } catch (error) {
      console.error('Advanced intelligence test failed:', error);
      toast.error('Advanced intelligence test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    toast.info('Test results cleared');
  };

  const renderTestResult = (result: any, index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {result.test}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {new Date(result.timestamp).toLocaleTimeString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.test === 'Predictive Analytics' && (
              <>
                <div>
                  <strong>Strategy:</strong> {result.strategy}
                </div>
                <div>
                  <strong>Confidence:</strong>
                  <Progress value={result.confidence * 100} className="mt-1" />
                  <span className="text-sm text-gray-600">{Math.round(result.confidence * 100)}%</span>
                </div>
                <div>
                  <strong>Prediction:</strong> {JSON.stringify(result.prediction, null, 2)}
                </div>
              </>
            )}
            
            {result.test === 'Auto-Execution Engine' && (
              <>
                <div>
                  <strong>Strategy:</strong> {result.strategy}
                </div>
                <div>
                  <strong>Auto-Execution Approved:</strong> 
                  <Badge variant={result.canAutoExecute ? "default" : "destructive"} className="ml-2">
                    {result.canAutoExecute ? 'YES' : 'NO'}
                  </Badge>
                </div>
                <div>
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
              </>
            )}

            {result.test === 'Pattern Analysis' && (
              <>
                <div>
                  <strong>Entity:</strong> {result.entity}
                </div>
                <div>
                  <strong>Patterns Found:</strong> {result.patternsFound}
                </div>
                <div>
                  <strong>Analysis Confidence:</strong>
                  <Progress value={result.confidence * 100} className="mt-1" />
                  <span className="text-sm text-gray-600">{Math.round(result.confidence * 100)}%</span>
                </div>
              </>
            )}

            {result.test === 'Cross-Platform Coordination' && (
              <>
                <div>
                  <strong>Plan ID:</strong> {result.planId}
                </div>
                <div>
                  <strong>Strategies:</strong> {result.strategies}
                </div>
                <div>
                  <strong>Platforms:</strong> {result.platforms?.join(', ') || 'N/A'}
                </div>
                <div>
                  <strong>Execution Status:</strong>
                  <Badge variant={result.execution && result.execution.success ? "default" : "destructive"} className="ml-2">
                    {result.execution && result.execution.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                </div>
              </>
            )}

            {result.test === 'Advanced Intelligence Integration' && (
              <>
                <div>
                  <strong>Entity:</strong> {result.entity}
                </div>
                <div>
                  <strong>Overall Score:</strong>
                  <Progress value={result.overallScore} className="mt-1" />
                  <span className="text-sm text-gray-600">{Math.round(result.overallScore)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <strong>Patterns Detected:</strong> {result.patterns}
                  </div>
                  <div>
                    <strong>Auto-Execution:</strong> 
                    <Badge variant={result.autoExecutionApproved ? "default" : "secondary"} className="ml-1">
                      {result.autoExecutionApproved ? 'Approved' : 'Manual'}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Strategy Brain Stage 3 Testing
          </h1>
          <p className="text-gray-600 mt-2">Advanced AI intelligence testing and validation</p>
        </div>
      </div>

      <Tabs value={selectedTest} onValueChange={setSelectedTest} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="execution">Auto-Exec</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics Testing
              </CardTitle>
              <CardDescription>
                Test the Strategy Brain's ability to predict strategy success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runPredictiveAnalyticsTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Running Predictive Analysis...' : 'Run Predictive Analytics Test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto-Execution Engine Testing
              </CardTitle>
              <CardDescription>
                Test the auto-execution safety and approval mechanisms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runAutoExecutionTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing Auto-Execution...' : 'Run Auto-Execution Test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pattern Analysis Testing
              </CardTitle>
              <CardDescription>
                Test advanced pattern recognition and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runPatternAnalysisTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Analyzing Patterns...' : 'Run Pattern Analysis Test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Cross-Platform Coordination Testing
              </CardTitle>
              <CardDescription>
                Test coordinated response execution across multiple platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runCoordinationTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing Coordination...' : 'Run Coordination Test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Advanced Intelligence Integration
              </CardTitle>
              <CardDescription>
                Run comprehensive integration test of all AI systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This test runs all AI systems in sequence. Monitor system resources.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={runAdvancedIntelligenceTest} 
                disabled={isLoading}
                className="w-full"
                variant="destructive"
              >
                {isLoading ? 'Running Full Integration Test...' : 'Run Advanced Integration Test'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear Results
            </Button>
          </div>
          
          {testResults.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No test results yet. Run some tests to see results here.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => renderTestResult(result, index))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyBrainStage3TestPage;
