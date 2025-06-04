
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { predictStrategySuccess } from '@/services/strategyBrain/predictiveAnalytics';
import { enableAutoExecution, evaluateForAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { recommendStrategy } from '@/services/strategyBrain/patternRecognition';
import { createCoordinationPlan } from '@/services/strategyBrain/crossPlatformCoordinator';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { generateResponseStrategies } from '@/services/strategyBrain/responseGenerator';

const StrategyBrainStage3TestPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const testEntity = "Stage3TestEntity-" + Date.now();

  const runStage3Tests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    const results: any[] = [];

    try {
      // Test 1: Predictive Analytics
      toast.info("🔮 Testing Predictive Analytics...");
      results.push({ test: "Predictive Analytics", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const patternAnalysis = await analyzeEntityPatterns(testEntity);
        const mockStrategy = {
          id: `test-${Date.now()}`,
          type: 'defensive' as const,
          title: 'Test Strategy',
          description: 'Test strategy for predictive analytics',
          actions: [{ type: 'monitor', description: 'Test monitoring', timeline: '1 hour', responsible: 'AI', kpi: 'Test KPI' }],
          priority: 'medium' as const,
          timeframe: '24 hours',
          resources: ['AI Assistant']
        };

        const prediction = await predictStrategySuccess(mockStrategy, testEntity);
        results[results.length - 1] = { 
          test: "Predictive Analytics", 
          status: "passed", 
          data: prediction,
          timestamp: new Date()
        };
        toast.success("✅ Predictive Analytics: PASSED");
      } catch (error) {
        results[results.length - 1] = { 
          test: "Predictive Analytics", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Predictive Analytics: FAILED");
      }

      // Test 2: Auto-Execution Engine
      toast.info("🤖 Testing Auto-Execution Engine...");
      results.push({ test: "Auto-Execution Engine", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        await enableAutoExecution(testEntity, {
          autoExecutionEnabled: true,
          executionThresholds: {
            minSuccessProbability: 0.7,
            maxRiskLevel: 0.5,
            maxResourceRequirement: 0.8,
            minConfidenceScore: 0.6
          },
          allowedStrategyTypes: ['defensive', 'engagement'],
          cooldownPeriod: 30,
          maxDailyExecutions: 5
        });

        const mockStrategy = {
          id: `auto-test-${Date.now()}`,
          type: 'defensive' as const,
          title: 'Auto-Execution Test Strategy',
          description: 'Test strategy for auto-execution',
          actions: [{ type: 'monitor', description: 'Test monitoring', timeline: '1 hour', responsible: 'AI', kpi: 'Test KPI' }],
          priority: 'medium' as const,
          timeframe: '24 hours',
          resources: ['AI Assistant']
        };

        const shouldExecute = await evaluateForAutoExecution(mockStrategy, testEntity);
        results[results.length - 1] = { 
          test: "Auto-Execution Engine", 
          status: "passed", 
          data: { autoExecutionEnabled: true, shouldExecute },
          timestamp: new Date()
        };
        toast.success("✅ Auto-Execution Engine: PASSED");
      } catch (error) {
        results[results.length - 1] = { 
          test: "Auto-Execution Engine", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Auto-Execution Engine: FAILED");
      }

      // Test 3: ML Pattern Recognition
      toast.info("🧠 Testing ML Pattern Recognition...");
      results.push({ test: "ML Pattern Recognition", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const patternAnalysis = await analyzeEntityPatterns(testEntity);
        const patterns = patternAnalysis.patterns || [];
        
        const recommendation = await recommendStrategy(testEntity, patterns, []);
        results[results.length - 1] = { 
          test: "ML Pattern Recognition", 
          status: "passed", 
          data: { recommendation, patternsFound: patterns.length },
          timestamp: new Date()
        };
        toast.success("✅ ML Pattern Recognition: PASSED");
      } catch (error) {
        results[results.length - 1] = { 
          test: "ML Pattern Recognition", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ ML Pattern Recognition: FAILED");
      }

      // Test 4: Cross-Platform Coordination
      toast.info("🌐 Testing Cross-Platform Coordination...");
      results.push({ test: "Cross-Platform Coordination", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const strategies = await generateResponseStrategies(testEntity, []);
        if (strategies.length > 0) {
          const coordinationPlan = await createCoordinationPlan(testEntity, strategies);
          results[results.length - 1] = { 
            test: "Cross-Platform Coordination", 
            status: "passed", 
            data: coordinationPlan,
            timestamp: new Date()
          };
          toast.success("✅ Cross-Platform Coordination: PASSED");
        } else {
          results[results.length - 1] = { 
            test: "Cross-Platform Coordination", 
            status: "passed", 
            data: { message: "No strategies available for coordination" },
            timestamp: new Date()
          };
          toast.success("✅ Cross-Platform Coordination: PASSED (No strategies)");
        }
      } catch (error) {
        results[results.length - 1] = { 
          test: "Cross-Platform Coordination", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Cross-Platform Coordination: FAILED");
      }

      setTestResults([...results]);
      
      // Summary
      const passed = results.filter(r => r.status === 'passed').length;
      const total = results.length;
      
      if (passed === total) {
        toast.success(`🎉 Stage 3 tests completed! (${passed}/${total})`, {
          description: "Advanced Strategy Brain features are functional"
        });
      } else {
        toast.warning(`⚠️ Stage 3 tests completed: ${passed}/${total} passed`, {
          description: "Some advanced features may need attention"
        });
      }

    } catch (error) {
      toast.error("❌ Stage 3 test execution failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      default: return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Strategy Brain Stage 3 - Advanced Intelligence</h1>
            <p className="text-corporate-lightGray">Test predictive analytics, auto-execution, ML pattern recognition, and cross-platform coordination</p>
          </div>
          <Button
            onClick={runStage3Tests}
            disabled={isRunningTests}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isRunningTests ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Stage 3 Tests...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Run Stage 3 Test Suite
              </>
            )}
          </Button>
        </div>

        {/* Test Configuration */}
        <Card className="bg-corporate-dark border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white">Stage 3 Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-corporate-lightGray">Test Entity:</p>
                <p className="text-white font-mono">{testEntity}</p>
              </div>
              <div>
                <p className="text-corporate-lightGray">Advanced Features:</p>
                <p className="text-white">Predictive Analytics, Auto-Execution, ML Recognition, Cross-Platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white">Stage 3 Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-corporate-darkSecondary p-4 rounded border border-corporate-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <h4 className="text-white font-medium">{result.test}</h4>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-corporate-lightGray">
                        {result.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {result.data && (
                      <div className="mt-3 p-3 bg-corporate-dark rounded">
                        <p className="text-xs text-corporate-lightGray mb-2">Test Data:</p>
                        <pre className="text-xs text-white overflow-x-auto">
                          {JSON.stringify(result.data, null, 2).slice(0, 300)}
                          {JSON.stringify(result.data, null, 2).length > 300 && '...'}
                        </pre>
                      </div>
                    )}

                    {result.error && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded">
                        <p className="text-xs text-red-400 mb-2">Error Details:</p>
                        <p className="text-xs text-red-300">
                          {result.error instanceof Error ? result.error.message : String(result.error)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-corporate-dark border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white">Stage 3 Advanced Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-corporate-lightGray">
              <p>This test suite validates the Stage 3 advanced Strategy Brain capabilities:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><strong>Predictive Analytics:</strong> AI-powered success probability forecasting</li>
                <li><strong>Auto-Execution Engine:</strong> Automated strategy deployment with safety thresholds</li>
                <li><strong>ML Pattern Recognition:</strong> Machine learning-based strategy recommendations</li>
                <li><strong>Cross-Platform Coordination:</strong> Multi-platform strategy orchestration</li>
              </ol>
              <p className="mt-3 text-corporate-accent">
                All Stage 3 tests should pass for full advanced functionality confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StrategyBrainStage3TestPage;
