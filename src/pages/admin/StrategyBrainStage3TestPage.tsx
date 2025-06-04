
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Brain, Zap, Target, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { predictStrategySuccess, getBestStrategies } from '@/services/strategyBrain/predictiveAnalytics';
import { enableAutoExecution, evaluateForAutoExecution, processExecutionQueue } from '@/services/strategyBrain/autoExecutionEngine';
import { recommendStrategy, trainMLModel } from '@/services/strategyBrain/patternRecognition';
import { createCoordinationPlan, executeCoordinationPlan, calculateMetrics } from '@/services/strategyBrain/crossPlatformCoordinator';
import { generateResponseStrategies } from '@/services/strategyBrain/responseGenerator';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';

const StrategyBrainStage3TestPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const testEntity = "Stage3Entity-" + Date.now();

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
        const patterns = await analyzeEntityPatterns(testEntity);
        const strategies = await generateResponseStrategies(testEntity, patterns);
        
        if (strategies.length > 0) {
          const prediction = await predictStrategySuccess(strategies[0], testEntity);
          const bestStrategies = await getBestStrategies(testEntity, 3);
          
          results[results.length - 1] = { 
            test: "Predictive Analytics", 
            status: "passed", 
            data: { prediction, bestStrategiesCount: bestStrategies.length },
            timestamp: new Date()
          };
          toast.success("✅ Predictive Analytics: PASSED");
        } else {
          throw new Error("No strategies available for prediction");
        }
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
            maxResourceRequirement: 0.7,
            minConfidenceScore: 0.6
          },
          allowedStrategyTypes: ['defensive', 'engagement'],
          cooldownPeriod: 30,
          maxDailyExecutions: 5
        });

        const strategies = await generateResponseStrategies(testEntity, []);
        if (strategies.length > 0) {
          const canAutoExecute = await evaluateForAutoExecution(strategies[0], testEntity);
          await processExecutionQueue();
          
          results[results.length - 1] = { 
            test: "Auto-Execution Engine", 
            status: "passed", 
            data: { autoExecutionEnabled: true, evaluationResult: canAutoExecute },
            timestamp: new Date()
          };
          toast.success("✅ Auto-Execution Engine: PASSED");
        } else {
          throw new Error("No strategies available for auto-execution test");
        }
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
        const patterns = await analyzeEntityPatterns(testEntity);
        const recommendation = await recommendStrategy(testEntity, patterns, []);
        await trainMLModel(testEntity);
        
        results[results.length - 1] = { 
          test: "ML Pattern Recognition", 
          status: "passed", 
          data: { recommendation, patternsAnalyzed: patterns.length },
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
        const targetPlatforms = ['twitter', 'facebook', 'linkedin'];
        
        if (strategies.length > 0) {
          const plan = await createCoordinationPlan(testEntity, strategies, targetPlatforms);
          const metrics = await calculateMetrics(plan.id);
          
          results[results.length - 1] = { 
            test: "Cross-Platform Coordination", 
            status: "passed", 
            data: { planId: plan.id, platforms: targetPlatforms.length, metrics },
            timestamp: new Date()
          };
          toast.success("✅ Cross-Platform Coordination: PASSED");
        } else {
          throw new Error("No strategies available for coordination test");
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
        toast.success(`🎉 All Stage 3 tests passed! (${passed}/${total})`, {
          description: "Advanced Strategy Brain features are fully functional"
        });
      } else {
        toast.warning(`⚠️ Stage 3 tests completed: ${passed}/${total} passed`, {
          description: "Some advanced features may need attention"
        });
      }

    } catch (error) {
      toast.error("❌ Stage 3 test execution failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
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

  const getTestIcon = (testName: string) => {
    switch (testName) {
      case 'Predictive Analytics': return <Brain className="h-5 w-5" />;
      case 'Auto-Execution Engine': return <Zap className="h-5 w-5" />;
      case 'ML Pattern Recognition': return <Target className="h-5 w-5" />;
      case 'Cross-Platform Coordination': return <Globe className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Strategy Brain Stage 3 - Advanced Intelligence Test</h1>
            <p className="text-corporate-lightGray">Test advanced AI features: Predictive Analytics, Auto-Execution, ML Recognition, and Cross-Platform Coordination</p>
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
                <Brain className="h-4 w-4 mr-2" />
                Run Stage 3 Test Suite
              </>
            )}
          </Button>
        </div>

        {/* Stage 3 Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">Predictive Analytics</h3>
                  <p className="text-xs text-corporate-lightGray">Forecast strategy success</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium">Auto-Execution</h3>
                  <p className="text-xs text-corporate-lightGray">Automated deployment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="text-white font-medium">ML Recognition</h3>
                  <p className="text-xs text-corporate-lightGray">Pattern learning</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-green-400" />
                <div>
                  <h3 className="text-white font-medium">Cross-Platform</h3>
                  <p className="text-xs text-corporate-lightGray">Multi-platform sync</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <p className="text-white">Predictive Analytics, Auto-Execution, ML Recognition, Cross-Platform Coordination</p>
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
                        {getTestIcon(result.test)}
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
                        <p className="text-xs text-corporate-lightGray mb-2">Test Results:</p>
                        <pre className="text-xs text-white overflow-x-auto">
                          {JSON.stringify(result.data, null, 2).slice(0, 400)}
                          {JSON.stringify(result.data, null, 2).length > 400 && '...'}
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
            <div className="space-y-4 text-sm text-corporate-lightGray">
              <p>Stage 3 introduces advanced AI capabilities to the Strategy Brain:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">🔮 Predictive Analytics</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Strategy success probability forecasting</li>
                    <li>Resource requirement prediction</li>
                    <li>Risk level assessment</li>
                    <li>Time-to-completion estimation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">🤖 Auto-Execution Engine</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Threshold-based automatic execution</li>
                    <li>Cooldown period management</li>
                    <li>Daily execution limits</li>
                    <li>Risk-based approval gates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">🧠 ML Pattern Recognition</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Historical pattern learning</li>
                    <li>Feature extraction and analysis</li>
                    <li>Strategy recommendation engine</li>
                    <li>Continuous model improvement</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">🌐 Cross-Platform Coordination</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Multi-platform strategy orchestration</li>
                    <li>Timing optimization across platforms</li>
                    <li>Message consistency maintenance</li>
                    <li>Platform synergy calculation</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-4 text-corporate-accent">
                All Stage 3 features represent cutting-edge AI automation for reputation management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StrategyBrainStage3TestPage;
