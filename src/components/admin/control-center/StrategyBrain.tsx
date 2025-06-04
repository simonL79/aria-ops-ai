
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, AlertTriangle, BarChart3, Settings, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import StrategyBrainPatterns from './StrategyBrainPatterns';
import StrategyBrainResponses from './StrategyBrainResponses';
import StrategyBrainMetrics from './StrategyBrainMetrics';
import { analyzeEntityPatterns, PatternAnalysisResult } from '@/services/strategyBrain/patternAnalyzer';
import { generateResponseStrategies, ResponseStrategy } from '@/services/strategyBrain/responseGenerator';
import { executeStrategy } from '@/services/strategyBrain/strategyExecutor';
import { optimizeStrategy } from '@/services/strategyBrain/strategyOptimizer';
import { useStrategyRealtime } from '@/hooks/useStrategyRealtime';

interface StrategyBrainProps {
  selectedEntity: string;
  entityMemory: any[];
}

const StrategyBrain: React.FC<StrategyBrainProps> = ({
  selectedEntity,
  entityMemory
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingResponses, setIsGeneratingResponses] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [patternResults, setPatternResults] = useState<PatternAnalysisResult | null>(null);
  const [responseStrategies, setResponseStrategies] = useState<ResponseStrategy[]>([]);
  const [activeTab, setActiveTab] = useState('patterns');

  // Real-time updates
  const { updates, isConnected, clearUpdates } = useStrategyRealtime(selectedEntity);

  const handlePatternAnalysis = async () => {
    if (!selectedEntity) {
      toast.error("No entity selected for pattern analysis");
      return;
    }

    setIsAnalyzing(true);
    toast.info(`🧠 A.R.I.A™ Strategy Brain: Analyzing patterns for ${selectedEntity}`);

    try {
      const results = await analyzeEntityPatterns(selectedEntity);
      setPatternResults(results);
      
      toast.success(`Pattern analysis completed for ${selectedEntity}`, {
        description: `${results.patterns.length} patterns detected with ${(results.confidence * 100).toFixed(0)}% confidence`
      });

      // Auto-generate responses if significant patterns found
      if (results.patterns.length > 0) {
        await handleResponseGeneration(results.patterns);
      }
      
    } catch (error) {
      console.error('Pattern analysis failed:', error);
      toast.error("Pattern analysis failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResponseGeneration = async (patterns?: any[]) => {
    if (!selectedEntity) {
      toast.error("No entity selected for response generation");
      return;
    }

    const patternsToUse = patterns || patternResults?.patterns || [];
    setIsGeneratingResponses(true);
    
    toast.info(`🎯 Generating response strategies for ${selectedEntity}`);

    try {
      const strategies = await generateResponseStrategies(selectedEntity, patternsToUse);
      setResponseStrategies(strategies);
      
      toast.success(`Response strategies generated for ${selectedEntity}`, {
        description: `${strategies.length} strategies ready for deployment`
      });

      setActiveTab('responses');
      
    } catch (error) {
      console.error('Response generation failed:', error);
      toast.error("Response generation failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsGeneratingResponses(false);
    }
  };

  const handleExecuteStrategy = async (strategyId: string) => {
    const strategy = responseStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    toast.info(`🚀 Strategy "${strategy.title}" deployment initiated`, {
      description: `${strategy.actions.length} actions are being executed`
    });

    try {
      const result = await executeStrategy(strategyId);
      
      if (result.success) {
        toast.success(`✅ Strategy "${strategy.title}" executed successfully`, {
          description: `${result.executedActions} actions completed`
        });
      } else {
        toast.warning(`⚠️ Strategy "${strategy.title}" partially completed`, {
          description: `${result.executedActions} completed, ${result.failedActions} failed`
        });
      }
    } catch (error) {
      toast.error(`❌ Strategy "${strategy.title}" execution failed`, {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const handleOptimizeStrategies = async () => {
    if (responseStrategies.length === 0) {
      toast.error("No strategies to optimize");
      return;
    }

    setIsOptimizing(true);
    toast.info("🔧 Optimizing strategies using AI analysis...");

    try {
      const optimizedStrategies: ResponseStrategy[] = [];
      
      for (const strategy of responseStrategies) {
        try {
          const result = await optimizeStrategy(strategy.id);
          optimizedStrategies.push(result.optimizedStrategy);
        } catch (error) {
          console.error(`Failed to optimize strategy ${strategy.id}:`, error);
          optimizedStrategies.push(strategy); // Keep original if optimization fails
        }
      }

      setResponseStrategies(optimizedStrategies);
      
      toast.success("🎯 Strategy optimization completed", {
        description: `${optimizedStrategies.length} strategies enhanced with AI optimization`
      });
      
    } catch (error) {
      console.error('Strategy optimization failed:', error);
      toast.error("Strategy optimization failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Entity Status */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Strategy Brain Status
            {isConnected && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 ml-auto">
                <Activity className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEntity ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Active Entity: {selectedEntity}
                </Badge>
                {patternResults && (
                  <Badge className="bg-corporate-accent/20 text-corporate-accent">
                    {patternResults.patterns.length} Patterns Detected
                  </Badge>
                )}
                {updates.length > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {updates.length} Recent Updates
                  </Badge>
                )}
              </div>
              <p className="text-corporate-lightGray text-sm">
                Memory entries: {entityMemory.length} | Intelligence: {patternResults ? 'Analyzed' : 'Pending'} | Real-time: {isConnected ? 'Connected' : 'Disconnected'}
              </p>
              
              {patternResults && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="text-center">
                    <p className="text-corporate-accent font-bold text-lg">{patternResults.patterns.length}</p>
                    <p className="text-xs text-corporate-lightGray">Patterns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-corporate-accent font-bold text-lg">{(patternResults.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-corporate-lightGray">Confidence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-corporate-accent font-bold text-lg">{responseStrategies.length}</p>
                    <p className="text-xs text-corporate-lightGray">Strategies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-corporate-accent font-bold text-lg">{updates.length}</p>
                    <p className="text-xs text-corporate-lightGray">Live Updates</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-corporate-lightGray">No entity selected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <Button
              onClick={handlePatternAnalysis}
              disabled={!selectedEntity || isAnalyzing}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-black"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Pattern Analysis
                </>
              )}
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2">
              Analyze intelligence patterns
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <Button
              onClick={() => handleResponseGeneration()}
              disabled={!selectedEntity || isGeneratingResponses}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isGeneratingResponses ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-black"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Responses
                </>
              )}
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2">
              Create response strategies
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <Button
              onClick={handleOptimizeStrategies}
              disabled={!selectedEntity || isOptimizing || responseStrategies.length === 0}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-black"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  AI Optimize
                </>
              )}
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2">
              AI-powered strategy enhancement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      {(patternResults || responseStrategies.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary">
            <TabsTrigger 
              value="patterns" 
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
            <TabsTrigger 
              value="responses"
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black"
            >
              <Target className="h-4 w-4 mr-2" />
              Strategies
            </TabsTrigger>
            <TabsTrigger 
              value="metrics"
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black"
            >
              <Brain className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="mt-6">
            <StrategyBrainPatterns
              patterns={patternResults?.patterns || []}
              isAnalyzing={isAnalyzing}
            />
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <StrategyBrainResponses
              strategies={responseStrategies}
              isGenerating={isGeneratingResponses}
              onExecuteStrategy={handleExecuteStrategy}
            />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <StrategyBrainMetrics
              selectedEntity={selectedEntity}
            />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Intelligence Insights & Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Real-time Updates */}
                {updates.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Live Strategy Updates:</h4>
                      <Button 
                        onClick={clearUpdates}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {updates.slice(0, 5).map((update, index) => (
                        <div key={index} className="text-sm bg-corporate-dark p-2 rounded border border-corporate-border">
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-green-400" />
                            <span className="text-white">Strategy {update.strategy_id}</span>
                            <Badge className="text-xs">{update.status}</Badge>
                          </div>
                          <p className="text-xs text-corporate-lightGray mt-1">
                            {new Date(update.updated_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {patternResults ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Key Insights:</h4>
                      <ul className="space-y-1">
                        {patternResults.insights.map((insight, index) => (
                          <li key={index} className="text-corporate-lightGray text-sm flex items-start gap-2">
                            <Zap className="h-3 w-3 mt-1 text-corporate-accent flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {patternResults.recommendations.map((rec, index) => (
                          <li key={index} className="text-corporate-lightGray text-sm flex items-start gap-2">
                            <Target className="h-3 w-3 mt-1 text-corporate-accent flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-corporate-lightGray">Run pattern analysis to view insights</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StrategyBrain;
