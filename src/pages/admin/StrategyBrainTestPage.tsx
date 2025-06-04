
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { generateResponseStrategies } from '@/services/strategyBrain/responseGenerator';
import { executeStrategy } from '@/services/strategyBrain/strategyExecutor';
import { optimizeStrategy } from '@/services/strategyBrain/strategyOptimizer';
import { getStrategyAnalytics } from '@/services/strategyBrain/strategyAnalytics';

const StrategyBrainTestPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const testEntity = "TestEntity-" + Date.now();

  const runFullFunctionalityTest = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    const results: any[] = [];

    try {
      // Test 1: Pattern Analysis
      toast.info("🧠 Testing Pattern Analysis...");
      results.push({ test: "Pattern Analysis", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const patternResults = await analyzeEntityPatterns(testEntity);
        results[results.length - 1] = { 
          test: "Pattern Analysis", 
          status: "passed", 
          data: patternResults,
          timestamp: new Date()
        };
        toast.success("✅ Pattern Analysis: PASSED");
      } catch (error) {
        results[results.length - 1] = { 
          test: "Pattern Analysis", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Pattern Analysis: FAILED");
      }

      // Test 2: Response Generation
      toast.info("🎯 Testing Response Generation...");
      results.push({ test: "Response Generation", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const strategies = await generateResponseStrategies(testEntity, []);
        results[results.length - 1] = { 
          test: "Response Generation", 
          status: "passed", 
          data: strategies,
          timestamp: new Date()
        };
        toast.success("✅ Response Generation: PASSED");

        // Test 3: Strategy Execution (if strategies were generated)
        if (strategies.length > 0) {
          toast.info("🚀 Testing Strategy Execution...");
          results.push({ test: "Strategy Execution", status: "running", timestamp: new Date() });
          setTestResults([...results]);

          try {
            const executionResult = await executeStrategy(strategies[0].id);
            results[results.length - 1] = { 
              test: "Strategy Execution", 
              status: "passed", 
              data: executionResult,
              timestamp: new Date()
            };
            toast.success("✅ Strategy Execution: PASSED");

            // Test 4: Strategy Optimization
            toast.info("🔧 Testing Strategy Optimization...");
            results.push({ test: "Strategy Optimization", status: "running", timestamp: new Date() });
            setTestResults([...results]);

            try {
              const optimizationResult = await optimizeStrategy(strategies[0].id);
              results[results.length - 1] = { 
                test: "Strategy Optimization", 
                status: "passed", 
                data: optimizationResult,
                timestamp: new Date()
              };
              toast.success("✅ Strategy Optimization: PASSED");
            } catch (error) {
              results[results.length - 1] = { 
                test: "Strategy Optimization", 
                status: "failed", 
                error: error,
                timestamp: new Date()
              };
              toast.error("❌ Strategy Optimization: FAILED");
            }
          } catch (error) {
            results[results.length - 1] = { 
              test: "Strategy Execution", 
              status: "failed", 
              error: error,
              timestamp: new Date()
            };
            toast.error("❌ Strategy Execution: FAILED");
          }
        }
      } catch (error) {
        results[results.length - 1] = { 
          test: "Response Generation", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Response Generation: FAILED");
      }

      // Test 5: Analytics
      toast.info("📊 Testing Strategy Analytics...");
      results.push({ test: "Strategy Analytics", status: "running", timestamp: new Date() });
      setTestResults([...results]);

      try {
        const analytics = await getStrategyAnalytics(testEntity);
        results[results.length - 1] = { 
          test: "Strategy Analytics", 
          status: "passed", 
          data: analytics,
          timestamp: new Date()
        };
        toast.success("✅ Strategy Analytics: PASSED");
      } catch (error) {
        results[results.length - 1] = { 
          test: "Strategy Analytics", 
          status: "failed", 
          error: error,
          timestamp: new Date()
        };
        toast.error("❌ Strategy Analytics: FAILED");
      }

      setTestResults([...results]);
      
      // Summary
      const passed = results.filter(r => r.status === 'passed').length;
      const total = results.length;
      
      if (passed === total) {
        toast.success(`🎉 All tests passed! (${passed}/${total})`, {
          description: "Strategy Brain is fully functional"
        });
      } else {
        toast.warning(`⚠️ Tests completed: ${passed}/${total} passed`, {
          description: "Some functionality may need attention"
        });
      }

    } catch (error) {
      toast.error("❌ Test execution failed", {
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
            <h1 className="text-2xl font-bold text-white">Strategy Brain - Full Functionality Test</h1>
            <p className="text-corporate-lightGray">Test all Strategy Brain components from button to route to live system</p>
          </div>
          <Button
            onClick={runFullFunctionalityTest}
            disabled={isRunningTests}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isRunningTests ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Run Full Test Suite
              </>
            )}
          </Button>
        </div>

        {/* Test Configuration */}
        <Card className="bg-corporate-dark border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white">Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-corporate-lightGray">Test Entity:</p>
                <p className="text-white font-mono">{testEntity}</p>
              </div>
              <div>
                <p className="text-corporate-lightGray">Test Components:</p>
                <p className="text-white">Pattern Analysis, Response Generation, Execution, Optimization, Analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
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
            <CardTitle className="text-white">Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-corporate-lightGray">
              <p>This test suite validates the complete Strategy Brain functionality:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li><strong>Pattern Analysis:</strong> Tests entity pattern detection and analysis</li>
                <li><strong>Response Generation:</strong> Tests strategy creation based on patterns</li>
                <li><strong>Strategy Execution:</strong> Tests execution engine with simulated actions</li>
                <li><strong>Strategy Optimization:</strong> Tests AI-powered strategy enhancement</li>
                <li><strong>Analytics:</strong> Tests performance metrics and analytics</li>
              </ol>
              <p className="mt-3 text-corporate-accent">
                All tests should pass for full Strategy Brain functionality confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StrategyBrainTestPage;
