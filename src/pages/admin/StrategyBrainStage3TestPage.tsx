import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { generateResponseStrategies, generateStrategy, ResponseStrategy } from '@/services/strategyBrain/responseGenerator';
import { predictStrategySuccess, StrategyPrediction } from '@/services/strategyBrain/predictiveAnalytics';
import { evaluateForAutoExecution, AutoExecutionConfig } from '@/services/strategyBrain/autoExecutionEngine';
import { executeStrategy } from '@/services/strategyBrain/strategyExecutor';
import { toast } from 'sonner';

interface TestResult {
  step: string;
  success: boolean;
  message?: string;
  data?: any;
}

const StrategyBrainStage3TestPage: React.FC = () => {
  const [entityName, setEntityName] = useState('TestEntity');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const addResult = (result: TestResult) => {
      setTestResults(prev => [...prev, result]);
    };

    try {
      // Step 1: Pattern Analysis
      addResult(await testPatternAnalysis(entityName));

      // Step 2: Strategy Generation
      const strategyGenerationResult = await testStrategyGeneration(entityName);
      addResult(strategyGenerationResult);

      // Proceed only if strategy generation was successful
      if (strategyGenerationResult.success) {
        const strategies: ResponseStrategy[] = strategyGenerationResult.data;

        // Step 3: Predictive Analysis (run on the first strategy)
        if (strategies.length > 0) {
          addResult(await testPredictiveAnalysis(entityName, strategies[0]));

          // Step 4: Auto-Execution Evaluation (run on the first strategy)
          addResult(await testAutoExecutionEvaluation(entityName, strategies[0]));

          // Step 5: Strategy Execution (run on the first strategy)
          addResult(await testStrategyExecution(strategies[0].id));
        } else {
          addResult({
            step: 'Predictive Analysis, Auto-Execution Evaluation, and Strategy Execution',
            success: false,
            message: 'No strategies available to test.'
          });
        }
      }
    } catch (error: any) {
      addResult({
        step: 'Overall Test',
        success: false,
        message: `Test failed with error: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testPatternAnalysis = async (entityName: string): Promise<TestResult> => {
    try {
      const patterns = await analyzeEntityPatterns(entityName);
      if (patterns && patterns.length > 0) {
        return {
          step: 'Pattern Analysis',
          success: true,
          message: `Detected ${patterns.length} patterns.`,
          data: patterns
        };
      } else {
        return {
          step: 'Pattern Analysis',
          success: false,
          message: 'No patterns detected.'
        };
      }
    } catch (error: any) {
      return {
        step: 'Pattern Analysis',
        success: false,
        message: `Failed to analyze patterns: ${error.message}`
      };
    }
  };

  const testStrategyGeneration = async (entityName: string): Promise<TestResult> => {
    try {
      // Mock detected patterns for testing purposes
      const mockPatterns = [
        {
          id: 'mock-pattern-1',
          type: 'sentiment_shift',
          entityName: entityName,
          sources: ['Twitter', 'Facebook'],
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          impact: 'high',
          urgency: 'urgent',
          details: 'Sudden negative sentiment increase.',
          raw_data: [{ source: 'Twitter', content: 'Example tweet' }],
          analyzed_data: { sentimentScore: -0.8 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
  
      const strategies = await generateResponseStrategies(entityName, mockPatterns);
      if (strategies && strategies.length > 0) {
        return {
          step: 'Strategy Generation',
          success: true,
          message: `Generated ${strategies.length} strategies.`,
          data: strategies
        };
      } else {
        return {
          step: 'Strategy Generation',
          success: false,
          message: 'No strategies generated.'
        };
      }
    } catch (error: any) {
      return {
        step: 'Strategy Generation',
        success: false,
        message: `Failed to generate strategies: ${error.message}`
      };
    }
  };

  const testPredictiveAnalysis = async (entityName: string, strategy: ResponseStrategy): Promise<TestResult> => {
    try {
      const prediction: StrategyPrediction = await predictStrategySuccess(strategy, entityName);
      if (prediction) {
        return {
          step: 'Predictive Analysis',
          success: true,
          message: `Prediction generated: ${prediction.predictedOutcome}`,
          data: prediction
        };
      } else {
        return {
          step: 'Predictive Analysis',
          success: false,
          message: 'No prediction generated.'
        };
      }
    } catch (error: any) {
      return {
        step: 'Predictive Analysis',
        success: false,
        message: `Failed to generate prediction: ${error.message}`
      };
    }
  };

  const testAutoExecutionEvaluation = async (entityName: string, strategy: ResponseStrategy): Promise<TestResult> => {
    try {
      const decision: boolean = await evaluateForAutoExecution(strategy, entityName);
      return {
        step: 'Auto-Execution Evaluation',
        success: true,
        message: `Auto-execution ${decision ? 'approved' : 'rejected'}.`,
        data: decision
      };
    } catch (error: any) {
      return {
        step: 'Auto-Execution Evaluation',
        success: false,
        message: `Failed to evaluate auto-execution: ${error.message}`
      };
    }
  };

  const testStrategyExecution = async (strategyId: string): Promise<TestResult> => {
    try {
      const result = await executeStrategy(strategyId);
      if (result.success) {
        return {
          step: 'Strategy Execution',
          success: true,
          message: `Strategy executed successfully: ${result.message}`,
          data: result
        };
      } else {
        return {
          step: 'Strategy Execution',
          success: false,
          message: `Strategy execution failed: ${result.message}`
        };
      }
    } catch (error: any) {
      return {
        step: 'Strategy Execution',
        success: false,
        message: `Failed to execute strategy: ${error.message}`
      };
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Strategy Brain Stage 3 Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="entityName" className="block text-sm font-medium text-gray-700">Entity Name:</label>
            <input
              type="text"
              id="entityName"
              className="mt-1 p-2 border rounded-md w-full"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
            />
          </div>
          <Button onClick={runAllTests} disabled={isTesting}>
            {isTesting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          <div className="mt-6">
            {testResults.map((result, index) => (
              <Card key={index} className="mb-2">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>
                    {result.success ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    {result.step}
                  </CardTitle>
                  <Badge variant={result.success ? 'outline' : 'destructive'}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p>{result.message}</p>
                  {result.data && (
                    <details>
                      <summary>Data</summary>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyBrainStage3TestPage;
