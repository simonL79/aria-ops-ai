import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  Zap, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { generateStrategy } from '@/services/strategyBrain/responseGenerator';
import { predictStrategySuccess } from '@/services/strategyBrain/predictiveAnalytics';
import { analyzeEntityPatterns } from '@/services/strategyBrain/patternAnalyzer';
import { executeStrategy } from '@/services/strategyBrain/strategyExecutor';
import { evaluateForAutoExecution } from '@/services/strategyBrain/autoExecutionEngine';
import { toast } from 'sonner';

interface TestResult {
  strategy: string;
  prediction: any;
  status: 'success' | 'warning' | 'failed';
  confidence: number;
}

interface AutoExecutionResult {
  strategy: string;
  canAutoExecute: boolean;
  status: 'approved' | 'rejected';
  reason: string;
}

interface PatternAnalysisResult {
  patterns: any[];
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface ExecutionResult {
  strategy: string;
  result: any;
  status: 'success' | 'failed';
}

const StrategyBrainStage3TestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [autoExecutionResults, setAutoExecutionResults] = useState<AutoExecutionResult[]>([]);
  const [patternResults, setPatternResults] = useState<PatternAnalysisResult | null>(null);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [activeTab, setActiveTab] = useState('predictive');

  const testStrategies = [
    {
      id: 'test-strategy-1',
      title: 'Defensive Response - High Severity',
      type: 'defensive' as const,
      priority: 'high' as const,
      entityName: 'TestCorp',
      threatType: 'defamation',
      description: 'Multi-platform defensive strategy for reputation threats',
      actions: [
        {
          action: 'Deploy positive content across affected platforms',
          platform: 'Twitter, LinkedIn, Reddit',
          timeframe: '2 hours',
          priority: 'high' as const
        },
        {
          action: 'File platform violation reports',
          platform: 'All affected platforms',
          timeframe: '1 hour',
          priority: 'critical' as const
        }
      ],
      estimatedEffectiveness: 85,
      riskLevel: 'medium' as const,
      resourceRequirement: 'high' as const,
      timeline: '4-6 hours',
      platforms: ['twitter', 'linkedin', 'reddit'],
      kpis: [
        { metric: 'Sentiment Score', target: '+15%', timeframe: '24h' },
        { metric: 'Positive Content Ratio', target: '70%', timeframe: '48h' }
      ]
    },
    {
      id: 'test-strategy-2',
      title: 'Proactive Engagement - Medium Severity',
      type: 'engagement' as const,
      priority: 'medium' as const,
      entityName: 'TestCorp',
      threatType: 'misinformation',
      description: 'Proactive engagement strategy with stakeholders',
      actions: [
        {
          action: 'Activate influencer network for positive amplification',
          platform: 'Instagram, TikTok, YouTube',
          timeframe: '4 hours',
          priority: 'medium' as const
        },
        {
          action: 'Monitor sentiment metrics hourly',
          platform: 'All platforms',
          timeframe: 'Ongoing',
          priority: 'low' as const
        }
      ],
      estimatedEffectiveness: 75,
      riskLevel: 'low' as const,
      resourceRequirement: 'medium' as const,
      timeline: '6-8 hours',
      platforms: ['instagram', 'tiktok', 'youtube'],
      kpis: [
        { metric: 'Engagement Rate', target: '+25%', timeframe: '72h' },
        { metric: 'Reach Amplification', target: '3x', timeframe: '48h' }
      ]
    }
  ];

  const runPredictiveAnalysis = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      for (const strategy of testStrategies) {
        const prediction = await predictStrategySuccess(strategy, strategy.entityName);
        
        const confidence = prediction.metrics.confidenceScore;
        const probability = prediction.metrics.successProbability;
        
        const result = {
          strategy: strategy.title,
          prediction,
          status: probability > 0.7 ? 'success' : 'warning',
          confidence: confidence
        };
        
        setTestResults(prev => [...prev, result]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success('Predictive analysis completed');
    } catch (error) {
      console.error('Predictive analysis failed:', error);
      toast.error('Predictive analysis failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoExecutionTest = async () => {
    setIsRunning(true);
    setAutoExecutionResults([]);
    
    try {
      for (const strategy of testStrategies) {
        const canAutoExecute = await evaluateForAutoExecution(strategy, strategy.entityName);
        
        const result = {
          strategy: strategy.title,
          canAutoExecute,
          status: canAutoExecute ? 'approved' : 'rejected',
          reason: canAutoExecute ? 'Meets all auto-execution criteria' : 'Does not meet auto-execution thresholds'
        };
        
        setAutoExecutionResults(prev => [...prev, result]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      toast.success('Auto-execution evaluation completed');
    } catch (error) {
      console.error('Auto-execution test failed:', error);
      toast.error('Auto-execution test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runPatternAnalysis = async () => {
    setIsRunning(true);
    setPatternResults(null);
    
    try {
      const testEntity = 'TestCorp';
      const patterns = await analyzeEntityPatterns(testEntity);
      
      setPatternResults(patterns);
      toast.success(`Pattern analysis completed - found ${patterns.patterns.length} patterns`);
    } catch (error) {
      console.error('Pattern analysis failed:', error);
      toast.error('Pattern analysis failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runStrategyExecution = async () => {
    setIsRunning(true);
    setExecutionResults([]);
    
    try {
      for (const strategy of testStrategies) {
        const result = await executeStrategy(strategy.id);
        
        const executionResult = {
          strategy: strategy.title,
          result,
          status: result.success ? 'success' : 'failed'
        };
        
        setExecutionResults(prev => [...prev, executionResult]);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      toast.success('Strategy execution tests completed');
    } catch (error) {
      console.error('Strategy execution failed:', error);
      toast.error('Strategy execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runFullSystemTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    setAutoExecutionResults([]);
    setPatternResults(null);
    setExecutionResults([]);
    
    toast.info('Starting comprehensive Strategy Brain test...');
    
    await runPredictiveAnalysis();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await runAutoExecutionTest();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await runPatternAnalysis();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await runStrategyExecution();
    
    toast.success('Comprehensive Strategy Brain test completed!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'approved':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'failed':
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Strategy Brain Stage 3</h1>
          </div>
          <p className="text-lg text-purple-200">
            Advanced Testing & Validation Suite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Predictive Analysis</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Success probability modeling</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Auto-Execution</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Autonomous strategy deployment</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Pattern Analysis</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Threat pattern recognition</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">Execution Engine</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Strategy implementation</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={runFullSystemTest}
            disabled={isRunning}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isRunning ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run Full System Test
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="predictive" className="data-[state=active]:bg-purple-600">
              Predictive Analysis
            </TabsTrigger>
            <TabsTrigger value="auto-execution" className="data-[state=active]:bg-purple-600">
              Auto-Execution
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-600">
              Pattern Analysis
            </TabsTrigger>
            <TabsTrigger value="execution" className="data-[state=active]:bg-purple-600">
              Strategy Execution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictive" className="space-y-4">
            <Card className="bg-slate-800 border-purple-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Predictive Analysis Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runPredictiveAnalysis}
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isRunning ? 'Testing...' : 'Test Predictive Analysis'}
                </Button>

                {testResults.length > 0 && (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{result.strategy}</h4>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                          <Progress 
                            value={result.confidence * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto-execution" className="space-y-4">
            <Card className="bg-slate-800 border-purple-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Auto-Execution Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runAutoExecutionTest}
                  disabled={isRunning}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isRunning ? 'Testing...' : 'Test Auto-Execution'}
                </Button>

                {autoExecutionResults.length > 0 && (
                  <div className="space-y-3">
                    {autoExecutionResults.map((result, index) => (
                      <div key={index} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{result.strategy}</h4>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{result.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card className="bg-slate-800 border-purple-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Pattern Analysis Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runPatternAnalysis}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isRunning ? 'Analyzing...' : 'Test Pattern Analysis'}
                </Button>

                {patternResults && (
                  <div className="space-y-3">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Analysis Results</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Patterns Found:</span>
                          <span className="text-white ml-2">{patternResults.patterns.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-white ml-2">{(patternResults.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      {patternResults.patterns.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-white font-medium mb-2">Detected Patterns:</h5>
                          {patternResults.patterns.map((pattern, index) => (
                            <div key={index} className="bg-slate-600 p-2 rounded mb-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white text-sm">{pattern.type}</span>
                                <Badge className={`${pattern.impact === 'high' ? 'bg-red-500' : pattern.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                                  {pattern.impact}
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-xs mt-1">{pattern.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execution" className="space-y-4">
            <Card className="bg-slate-800 border-purple-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Strategy Execution Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runStrategyExecution}
                  disabled={isRunning}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isRunning ? 'Executing...' : 'Test Strategy Execution'}
                </Button>

                {executionResults.length > 0 && (
                  <div className="space-y-3">
                    {executionResults.map((result, index) => (
                      <div key={index} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{result.strategy}</h4>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>Message: {typeof result.result === 'object' && result.result && 'message' in result.result ? String(result.result.message) : 'Execution completed'}</p>
                          {typeof result.result === 'object' && result.result && 'executedActions' in result.result && (
                            <p>Actions Executed: {String(result.result.executedActions)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StrategyBrainStage3TestPage;
