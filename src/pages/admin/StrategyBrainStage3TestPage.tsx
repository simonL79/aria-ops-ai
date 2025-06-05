
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { predictStrategySuccess } from '@/services/strategyBrain/predictiveAnalytics';
import { evaluateForAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { createCoordinationPlan, executeCoordinationPlan, getCoordinationMetrics } from '@/services/strategyBrain/crossPlatformCoordinator';
import type { ResponseStrategy, ResponseAction } from '@/services/strategyBrain/responseGenerator';

const StrategyBrainStage3TestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedEntity] = useState('TestEntity Inc.');

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      toast.info('🧠 Initiating Strategy Brain Stage 3 comprehensive test', {
        description: 'Testing all advanced AI modules with live data'
      });

      const results = {
        predictiveAnalytics: null,
        autoExecution: null,
        patternAnalysis: null,
        crossPlatformCoordination: null,
        metrics: null,
        timestamp: new Date().toISOString()
      };

      // Test 1: Predictive Analytics
      console.log('🔮 Testing Predictive Analytics...');
      try {
        const testStrategy: ResponseStrategy = {
          id: 'test-strategy-1',
          type: 'defensive',
          priority: 'high',
          title: 'Test Defensive Strategy',
          description: 'Testing predictive analytics capabilities',
          actions: [
            {
              id: 'action-1',
              action: 'Monitor social media',
              timeline: 'immediate',
              responsible: 'AI System',
              kpi: 'Mentions tracked'
            },
            {
              id: 'action-2',
              action: 'Deploy counter-narrative',
              timeline: '2 hours',
              responsible: 'Content Team',
              kpi: 'Engagement rate'
            }
          ],
          resources: ['AI Monitoring', 'Content Creation'],
          timeframe: 'immediate',
          successMetrics: ['Reduced negative sentiment', 'Increased positive mentions'],
          riskLevel: 'medium',
          createdAt: new Date().toISOString()
        };

        const prediction = await predictStrategySuccess(testStrategy, selectedEntity);
        results.predictiveAnalytics = {
          success: true,
          prediction,
          successProbability: prediction.metrics.successProbability,
          confidence: prediction.metrics.confidenceScore
        };
        console.log('✅ Predictive Analytics test completed');
      } catch (error) {
        console.error('❌ Predictive Analytics test failed:', error);
        results.predictiveAnalytics = { success: false, error: error.message };
      }

      // Test 2: Auto Execution Engine
      console.log('⚡ Testing Auto Execution Engine...');
      try {
        const testStrategy2: ResponseStrategy = {
          id: 'test-strategy-2',
          type: 'engagement',
          priority: 'medium',
          title: 'Test Engagement Strategy',
          description: 'Testing auto execution capabilities',
          actions: [
            {
              id: 'action-3',
              action: 'Engage with positive mentions',
              timeline: 'within 1 hour',
              responsible: 'Social Media Team',
              kpi: 'Response rate'
            },
            {
              id: 'action-4',
              action: 'Share positive content',
              timeline: 'daily',
              responsible: 'Marketing Team',
              kpi: 'Reach and engagement'
            }
          ],
          resources: ['Social Media Management', 'Content Library'],
          timeframe: '24 hours',
          successMetrics: ['Increased engagement', 'Positive sentiment growth'],
          riskLevel: 'low',
          createdAt: new Date().toISOString()
        };

        const autoExecutionResult = await evaluateForAutoExecution(testStrategy2, selectedEntity);
        results.autoExecution = {
          success: true,
          canAutoExecute: autoExecutionResult,
          strategy: testStrategy2.title
        };
        console.log('✅ Auto Execution Engine test completed');
      } catch (error) {
        console.error('❌ Auto Execution Engine test failed:', error);
        results.autoExecution = { success: false, error: error.message };
      }

      // Test 3: Pattern Analysis
      console.log('🔍 Testing Pattern Analysis...');
      try {
        const patternAnalysis = await analyzeEntityPatterns(selectedEntity);
        results.patternAnalysis = {
          success: true,
          patternsDetected: patternAnalysis.patterns.length,
          insights: patternAnalysis.insights.length,
          confidence: patternAnalysis.confidence
        };
        console.log('✅ Pattern Analysis test completed');
      } catch (error) {
        console.error('❌ Pattern Analysis test failed:', error);
        results.patternAnalysis = { success: false, error: error.message };
      }

      // Test 4: Cross-Platform Coordination
      console.log('🌐 Testing Cross-Platform Coordination...');
      try {
        const testStrategies: ResponseStrategy[] = [
          {
            id: 'coord-strategy-1',
            type: 'defensive',
            priority: 'critical',
            title: 'Coordinated Response Strategy',
            description: 'Testing cross-platform coordination',
            actions: [
              {
                id: 'coord-action-1',
                action: 'Monitor all platforms',
                timeline: 'continuous',
                responsible: 'AI Monitoring',
                kpi: 'Coverage percentage'
              },
              {
                id: 'coord-action-2',
                action: 'Deploy unified response',
                timeline: 'immediate',
                responsible: 'Response Team',
                kpi: 'Response consistency'
              }
            ],
            resources: ['Multi-platform Tools', 'Coordination System'],
            timeframe: 'ongoing',
            successMetrics: ['Unified messaging', 'Coordinated timing'],
            riskLevel: 'medium',
            createdAt: new Date().toISOString()
          }
        ];

        const coordinationPlan = await createCoordinationPlan(selectedEntity, testStrategies);
        const executionResult = await executeCoordinationPlan(coordinationPlan.id);
        
        results.crossPlatformCoordination = {
          success: true,
          planId: coordinationPlan.id,
          executionSuccess: executionResult.success,
          executedStrategies: executionResult.executedStrategies.length
        };
        console.log('✅ Cross-Platform Coordination test completed');
      } catch (error) {
        console.error('❌ Cross-Platform Coordination test failed:', error);
        results.crossPlatformCoordination = { success: false, error: error.message };
      }

      // Test 5: Get System Metrics
      console.log('📊 Getting System Metrics...');
      try {
        const metrics = await getCoordinationMetrics();
        results.metrics = {
          success: true,
          totalPlans: metrics.totalPlans,
          activePlans: metrics.activePlans,
          successRate: metrics.successRate
        };
        console.log('✅ System Metrics retrieved');
      } catch (error) {
        console.error('❌ System Metrics retrieval failed:', error);
        results.metrics = { success: false, error: error.message };
      }

      setTestResults(results);
      
      const successCount = Object.values(results).filter(r => r && r.success).length;
      const totalTests = 5;
      
      if (successCount === totalTests) {
        toast.success(`🎉 All Strategy Brain Stage 3 tests passed! (${successCount}/${totalTests})`, {
          description: 'Advanced AI intelligence is fully operational'
        });
      } else {
        toast.warning(`⚠️ ${successCount}/${totalTests} tests passed`, {
          description: 'Some advanced features may need attention'
        });
      }

    } catch (error) {
      console.error('Strategy Brain Stage 3 test failed:', error);
      toast.error('Strategy Brain Stage 3 test failed');
      setTestResults({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (result: any) => {
    if (!result) return <Badge variant="secondary">Not Run</Badge>;
    if (result.success) return <Badge className="bg-green-500">✅ Pass</Badge>;
    return <Badge variant="destructive">❌ Fail</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-900/10 to-indigo-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Strategy Brain Stage 3 — Advanced AI Intelligence Testing
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Live Testing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">
                Comprehensive testing of advanced AI strategy modules with live data integration.
              </p>
              <p className="text-sm text-gray-400">
                Target Entity: <span className="text-purple-400">{selectedEntity}</span>
              </p>
            </div>
            <Button
              onClick={runComprehensiveTest}
              disabled={isRunning}
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              {isRunning ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Testing...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Run Stage 3 Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Predictive Analytics */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                🔮 Predictive Analytics
                {getStatusBadge(testResults.predictiveAnalytics)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {testResults.predictiveAnalytics?.success ? (
                <div className="space-y-2 text-gray-300">
                  <p>Success Probability: <span className="text-green-400">{(testResults.predictiveAnalytics.successProbability * 100).toFixed(1)}%</span></p>
                  <p>Confidence: <span className="text-blue-400">{(testResults.predictiveAnalytics.confidence * 100).toFixed(1)}%</span></p>
                </div>
              ) : (
                <p className="text-red-400">Error: {testResults.predictiveAnalytics?.error}</p>
              )}
            </CardContent>
          </Card>

          {/* Auto Execution */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                ⚡ Auto Execution
                {getStatusBadge(testResults.autoExecution)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {testResults.autoExecution?.success ? (
                <div className="space-y-2 text-gray-300">
                  <p>Auto Execute: <span className={testResults.autoExecution.canAutoExecute ? "text-green-400" : "text-yellow-400"}>
                    {testResults.autoExecution.canAutoExecute ? "Eligible" : "Manual Review Required"}
                  </span></p>
                  <p className="text-xs">Strategy: {testResults.autoExecution.strategy}</p>
                </div>
              ) : (
                <p className="text-red-400">Error: {testResults.autoExecution?.error}</p>
              )}
            </CardContent>
          </Card>

          {/* Pattern Analysis */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                🔍 Pattern Analysis
                {getStatusBadge(testResults.patternAnalysis)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {testResults.patternAnalysis?.success ? (
                <div className="space-y-2 text-gray-300">
                  <p>Patterns: <span className="text-purple-400">{testResults.patternAnalysis.patternsDetected}</span></p>
                  <p>Insights: <span className="text-blue-400">{testResults.patternAnalysis.insights}</span></p>
                  <p>Confidence: <span className="text-green-400">{(testResults.patternAnalysis.confidence * 100).toFixed(1)}%</span></p>
                </div>
              ) : (
                <p className="text-red-400">Error: {testResults.patternAnalysis?.error}</p>
              )}
            </CardContent>
          </Card>

          {/* Cross-Platform Coordination */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                🌐 Cross-Platform Coordination
                {getStatusBadge(testResults.crossPlatformCoordination)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {testResults.crossPlatformCoordination?.success ? (
                <div className="space-y-2 text-gray-300">
                  <p>Plan ID: <span className="text-blue-400 font-mono text-xs">{testResults.crossPlatformCoordination.planId.slice(-8)}</span></p>
                  <p>Execution: <span className={testResults.crossPlatformCoordination.executionSuccess ? "text-green-400" : "text-red-400"}>
                    {testResults.crossPlatformCoordination.executionSuccess ? "Success" : "Failed"}
                  </span></p>
                  <p>Strategies: <span className="text-purple-400">{testResults.crossPlatformCoordination.executedStrategies}</span></p>
                </div>
              ) : (
                <p className="text-red-400">Error: {testResults.crossPlatformCoordination?.error}</p>
              )}
            </CardContent>
          </Card>

          {/* System Metrics */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                📊 System Metrics
                {getStatusBadge(testResults.metrics)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {testResults.metrics?.success ? (
                <div className="space-y-2 text-gray-300">
                  <p>Total Plans: <span className="text-blue-400">{testResults.metrics.totalPlans}</span></p>
                  <p>Active Plans: <span className="text-yellow-400">{testResults.metrics.activePlans}</span></p>
                  <p>Success Rate: <span className="text-green-400">{testResults.metrics.successRate.toFixed(1)}%</span></p>
                </div>
              ) : (
                <p className="text-red-400">Error: {testResults.metrics?.error}</p>
              )}
            </CardContent>
          </Card>

          {/* Test Summary */}
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                📋 Test Summary
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(testResults.timestamp).toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2 text-gray-300">
                {Object.entries(testResults).filter(([key]) => key !== 'timestamp').map(([key, result]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {result?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results State */}
      {!testResults && !isRunning && (
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Ready for Advanced Testing</h3>
            <p className="text-gray-400 mb-4">
              Run comprehensive tests to validate Strategy Brain Stage 3 capabilities
            </p>
            <Button
              onClick={runComprehensiveTest}
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              <Target className="h-4 w-4 mr-2" />
              Start Stage 3 Testing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategyBrainStage3TestPage;
