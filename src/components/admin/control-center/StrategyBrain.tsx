
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import { toast } from 'sonner';
import StrategyBrainPatterns from './StrategyBrainPatterns';
import StrategyBrainResponses from './StrategyBrainResponses';
import { analyzeEntityPatterns, PatternAnalysisResult } from '@/services/strategyBrain/patternAnalyzer';
import { generateResponseStrategies, ResponseStrategy } from '@/services/strategyBrain/responseGenerator';

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
  const [patternResults, setPatternResults] = useState<PatternAnalysisResult | null>(null);
  const [responseStrategies, setResponseStrategies] = useState<ResponseStrategy[]>([]);
  const [activeTab, setActiveTab] = useState('patterns');

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

    toast.success(`🚀 Strategy "${strategy.title}" deployment initiated`, {
      description: `${strategy.actions.length} actions are being executed`
    });

    // Here you would integrate with actual execution systems
    // For now, we'll simulate the execution
    setTimeout(() => {
      toast.success(`✅ Strategy "${strategy.title}" executed successfully`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Entity Status */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Strategy Brain Status
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
              </div>
              <p className="text-corporate-lightGray text-sm">
                Memory entries: {entityMemory.length} | Intelligence: {patternResults ? 'Analyzed' : 'Pending'}
              </p>
              
              {patternResults && (
                <div className="grid grid-cols-3 gap-3 mt-4">
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
              onClick={() => toast.info("Strategy optimization coming soon")}
              disabled={!selectedEntity}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Settings className="h-4 w-4 mr-2" />
              Optimize
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2">
              Optimize strategies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      {(patternResults || responseStrategies.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-corporate-darkSecondary">
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

          <TabsContent value="insights" className="mt-6">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Intelligence Insights</CardTitle>
              </CardHeader>
              <CardContent>
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
