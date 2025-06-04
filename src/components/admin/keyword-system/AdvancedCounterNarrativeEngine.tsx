
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, Clock, CheckCircle } from 'lucide-react';
import { CounterNarrativeEngine } from '@/services/ariaCore/counterNarrativeEngine';
import { ResponseTemplateEngine } from '@/services/ariaCore/responseTemplateEngine';
import { StrategyMemoryService } from '@/services/ariaCore/strategyMemoryService';
import { toast } from 'sonner';

interface AdvancedCounterNarrativeEngineProps {
  keywordData: any[];
  narratives: any[];
  entityName: string;
  onRefresh: () => void;
}

const AdvancedCounterNarrativeEngine: React.FC<AdvancedCounterNarrativeEngineProps> = ({
  keywordData,
  narratives,
  entityName,
  onRefresh
}) => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('strategies');

  useEffect(() => {
    loadRecommendations();
  }, [entityName]);

  const loadRecommendations = async () => {
    try {
      const recs = await StrategyMemoryService.getStrategyRecommendations(entityName, {
        threatData: keywordData
      });
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const generateCounterNarratives = async () => {
    setIsGenerating(true);
    try {
      toast.loading('🧠 A.R.I.A™: Generating advanced counter-narratives...');
      
      const generatedStrategies = await CounterNarrativeEngine.generateAdvancedCounterNarratives(
        entityName,
        keywordData,
        selectedKeywords
      );
      
      setStrategies(generatedStrategies);
      toast.success('✅ Counter-narratives generated successfully');
      
    } catch (error) {
      console.error('Counter-narrative generation failed:', error);
      toast.error('❌ Failed to generate counter-narratives');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResponseTemplates = async () => {
    if (keywordData.length === 0) return;
    
    try {
      toast.loading('🤖 A.R.I.A™: Generating response templates...');
      
      const threatClassification = {
        category: 'Reputation Concern',
        severity: 6,
        platform: 'general',
        intent: 'defensive'
      };
      
      const generatedTemplates = await ResponseTemplateEngine.generateResponseTemplates(
        threatClassification,
        entityName
      );
      
      setTemplates(generatedTemplates);
      toast.success('✅ Response templates generated');
      
    } catch (error) {
      console.error('Template generation failed:', error);
      toast.error('❌ Failed to generate templates');
    }
  };

  const recordStrategySuccess = async (strategyId: string) => {
    try {
      await StrategyMemoryService.recordStrategySuccess(entityName, strategyId, {
        strategyType: 'transparency',
        successScore: 0.85,
        threatSeverity: 'medium',
        platform: 'general',
        metrics: { engagement: 85, sentiment_improvement: 0.3 },
        keySuccessFactors: ['clear communication', 'timely response'],
        lessonsLearned: ['Direct addressing works well'],
        context: 'reputation management'
      });
      
      toast.success('📊 Strategy success recorded for future learning');
      loadRecommendations();
    } catch (error) {
      console.error('Failed to record strategy success:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-corporate-accent" />
            A.R.I.A™ Advanced Counter-Narrative Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Button 
              onClick={generateCounterNarratives}
              disabled={isGenerating}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/80"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Counter-Narratives'}
            </Button>
            
            <Button 
              onClick={generateResponseTemplates}
              variant="outline"
              className="border-corporate-border text-white hover:bg-corporate-darkSecondary"
            >
              <Target className="h-4 w-4 mr-2" />
              Generate Response Templates
            </Button>
            
            <Button 
              onClick={loadRecommendations}
              variant="outline"
              className="border-corporate-border text-white hover:bg-corporate-darkSecondary"
            >
              <Clock className="h-4 w-4 mr-2" />
              Load Strategy Memory
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full bg-corporate-darkSecondary">
              <TabsTrigger value="strategies" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
                Strategies ({strategies.length})
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
                Templates ({templates.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
                Memory ({recommendations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-4">
              {strategies.length === 0 ? (
                <div className="text-center py-8 text-corporate-lightGray">
                  Generate counter-narratives to see AI-powered strategies
                </div>
              ) : (
                strategies.map((strategy) => (
                  <Card key={strategy.id} className="bg-corporate-darkSecondary border-corporate-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{strategy.theme}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            strategy.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                            strategy.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {strategy.riskLevel} risk
                          </Badge>
                          <Badge className="bg-corporate-accent text-black">
                            {Math.round(strategy.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-corporate-lightGray text-sm mb-2">Tone: {strategy.tone}</p>
                        <p className="text-corporate-lightGray text-sm mb-2">Audience: {strategy.audience}</p>
                        <p className="text-corporate-lightGray text-sm">Format: {strategy.format}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Key Messages:</h4>
                        <ul className="space-y-1">
                          {strategy.keyMessages?.map((message: string, index: number) => (
                            <li key={index} className="text-corporate-lightGray text-sm">• {message}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Tactical Approach:</h4>
                        <p className="text-corporate-lightGray text-sm">{strategy.tacticalApproach}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => recordStrategySuccess(strategy.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Successful
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-corporate-border text-white"
                        >
                          Deploy Strategy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-corporate-lightGray">
                  Generate response templates for automated responses
                </div>
              ) : (
                templates.map((template) => (
                  <Card key={template.id} className="bg-corporate-darkSecondary border-corporate-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                        <Badge className="bg-corporate-accent text-black">
                          {Math.round(template.effectiveness * 100)}% effective
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-corporate-lightGray text-sm mb-2">Tone: {template.tone}</p>
                        <p className="text-corporate-lightGray text-sm mb-2">Use Case: {template.useCase}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Response Text:</h4>
                        <Textarea 
                          value={template.responseText}
                          readOnly
                          className="bg-corporate-darkTertiary border-corporate-border text-white resize-none"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Adaptation Notes:</h4>
                        <p className="text-corporate-lightGray text-sm">{template.adaptationNotes}</p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-corporate-accent text-black hover:bg-corporate-accent/80"
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-corporate-lightGray">
                  No historical strategy data available yet
                </div>
              ) : (
                recommendations.map((rec) => (
                  <Card key={rec.id} className="bg-corporate-darkSecondary border-corporate-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{rec.strategyType}</CardTitle>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-corporate-lightGray text-sm">{rec.reasoning}</p>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Key Success Factors:</h4>
                        <ul className="space-y-1">
                          {rec.keyFactors?.map((factor: string, index: number) => (
                            <li key={index} className="text-corporate-lightGray text-sm">• {factor}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Adaptation Notes:</h4>
                        <p className="text-corporate-lightGray text-sm">{rec.adaptationNotes}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCounterNarrativeEngine;
