
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  FileText, 
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  MessageSquare,
  Shield,
  Cpu
} from 'lucide-react';
import { CounterNarrativeEngine } from '@/services/ariaCore/counterNarrativeEngine';
import { ResponseTemplateEngine } from '@/services/ariaCore/responseTemplateEngine';
import { toast } from 'sonner';

interface KeywordIntelligence {
  id: string;
  keyword: string;
  sentiment_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
}

interface CounterNarrative {
  id: string;
  target_keywords: string[];
  recommended_theme: string;
  content_format: string;
  emotional_tone: string;
  target_audience: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AdvancedCounterNarrativeEngineProps {
  keywordData: KeywordIntelligence[];
  narratives: CounterNarrative[];
  entityName: string;
  onRefresh: () => void;
}

const AdvancedCounterNarrativeEngine: React.FC<AdvancedCounterNarrativeEngineProps> = ({
  keywordData,
  narratives,
  entityName,
  onRefresh
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [generatedStrategies, setGeneratedStrategies] = useState<any[]>([]);
  const [responseTemplates, setResponseTemplates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('strategies');

  const generateAdvancedCounterNarratives = async () => {
    if (keywordData.length === 0) {
      toast.error('No keyword intelligence data available. Run a live scan first.');
      return;
    }

    setIsGenerating(true);

    try {
      toast.info('🧠 A.R.I.A™ vX: Analyzing threat patterns and generating advanced counter-narratives...');

      // Generate sophisticated counter-narratives
      const strategies = await CounterNarrativeEngine.generateAdvancedCounterNarratives(
        entityName,
        keywordData,
        selectedKeywords
      );

      setGeneratedStrategies(strategies);

      // Generate response templates for the most severe threats
      const severeThreat = keywordData.find(k => k.threat_level === 'critical' || k.threat_level === 'high');
      if (severeThreat) {
        const templates = await ResponseTemplateEngine.generateResponseTemplates(
          {
            category: 'Reputation Attack',
            severity: severeThreat.threat_level === 'critical' ? 9 : 7,
            intent: 'attack',
            platform: severeThreat.platform
          },
          entityName
        );
        setResponseTemplates(templates);
      }

      toast.success(`✅ A.R.I.A™ vX: Generated ${strategies.length} advanced counter-narrative strategies`);
      onRefresh();

    } catch (error) {
      console.error('Advanced counter-narrative generation failed:', error);
      toast.error('❌ A.R.I.A™ vX: Advanced counter-narrative generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const getStrategyStatusColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (confidence >= 0.6) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getToneColor = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'professional': return 'text-blue-400';
      case 'empathetic': return 'text-green-400';
      case 'assertive': return 'text-red-400';
      case 'inspirational': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Advanced Counter-Narrative Generator */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Brain className="h-5 w-5" />
            A.R.I.A™ vX Advanced Counter-Narrative Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Keyword Selection */}
          {keywordData.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Target Keywords for Counter-Narrative:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {keywordData
                  .filter(k => k.sentiment_score < 0 || k.threat_level !== 'low')
                  .map((keyword) => (
                    <Badge
                      key={keyword.id}
                      className={`cursor-pointer transition-colors ${
                        selectedKeywords.includes(keyword.keyword)
                          ? 'bg-corporate-accent text-black'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => toggleKeywordSelection(keyword.keyword)}
                    >
                      "{keyword.keyword}" ({keyword.sentiment_score.toFixed(1)})
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <Button
            onClick={generateAdvancedCounterNarratives}
            disabled={isGenerating || keywordData.length === 0}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90 font-semibold"
            size="lg"
          >
            <Brain className={`h-5 w-5 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Generating Advanced Counter-Narratives...' : 'Generate AI-Powered Counter-Narratives'}
          </Button>

          <Alert className="bg-purple-500/10 border-purple-500/50">
            <Cpu className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-300">
              A.R.I.A™ vX uses advanced AI reasoning, strategy memory, and threat pattern analysis to generate sophisticated counter-narrative frameworks.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Generated Strategies and Templates */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-corporate-darkSecondary">
          <TabsTrigger 
            value="strategies" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            <Target className="h-4 w-4 mr-2" />
            Counter-Narrative Strategies
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Response Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-corporate-accent" />
              Advanced Counter-Narrative Strategies
            </h3>

            {generatedStrategies.map((strategy) => (
              <Card key={strategy.id} className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{strategy.theme}</CardTitle>
                    <Badge className={getStrategyStatusColor(strategy.confidence)}>
                      <Zap className="h-3 w-3 mr-1" />
                      {Math.round(strategy.confidence * 100)}% Confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strategy Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Tone</span>
                      <p className={`font-medium ${getToneColor(strategy.tone)}`}>
                        {strategy.tone}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Format</span>
                      <p className="text-white font-medium">{strategy.format}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Risk Level</span>
                      <p className="text-white font-medium">{strategy.riskLevel}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Audience</span>
                      <p className="text-white font-medium">{strategy.audience}</p>
                    </div>
                  </div>

                  {/* Key Messages */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Key Messages:</h5>
                    <div className="space-y-1">
                      {strategy.keyMessages.map((message: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-corporate-accent mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Approach */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Tactical Approach:</h5>
                    <p className="text-gray-300 text-sm">{strategy.tacticalApproach}</p>
                  </div>

                  {/* Expected Outcome */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Expected Outcome:</h5>
                    <p className="text-gray-300 text-sm">{strategy.expectedOutcome}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {generatedStrategies.length === 0 && (
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Advanced Strategies Generated Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Generate AI-powered counter-narrative strategies based on your threat intelligence
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-corporate-accent" />
              Automated Response Templates
            </h3>

            {responseTemplates.map((template) => (
              <Card key={template.id} className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {Math.round(template.effectiveness * 100)}% Effective
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Tone</span>
                      <p className={`font-medium ${getToneColor(template.tone)}`}>
                        {template.tone}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Category</span>
                      <p className="text-white font-medium">{template.category}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Response Text:</h5>
                    <div className="bg-corporate-darkSecondary p-3 rounded border-l-4 border-corporate-accent">
                      <p className="text-gray-300 italic">{template.responseText}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Use Case:</h5>
                    <p className="text-gray-300 text-sm">{template.useCase}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Adaptation Notes:</h5>
                    <p className="text-gray-300 text-sm">{template.adaptationNotes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {responseTemplates.length === 0 && (
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Response Templates Generated Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Response templates will be automatically generated when counter-narratives are created
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCounterNarrativeEngine;
