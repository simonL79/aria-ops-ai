
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  FileText, 
  CheckCircle,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

interface CounterNarrativeEngineProps {
  keywordData: KeywordIntelligence[];
  narratives: CounterNarrative[];
  onRefresh: () => void;
}

const CounterNarrativeEngine: React.FC<CounterNarrativeEngineProps> = ({
  keywordData,
  narratives,
  onRefresh
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const generateCounterNarratives = async () => {
    if (keywordData.length === 0) {
      toast.error('No keyword intelligence data available. Run a live scan first.');
      return;
    }

    setIsGenerating(true);

    try {
      toast.info('🧠 A.R.I.A vX™: Generating AI counter-narrative recommendations...');

      // Analyze negative keywords and generate counter strategies
      const negativeKeywords = keywordData.filter(k => 
        k.sentiment_score < -0.2 || k.threat_level === 'high' || k.threat_level === 'critical'
      );

      const { data, error } = await supabase.functions.invoke('generate-counter-narratives', {
        body: {
          negativeKeywords: negativeKeywords,
          selectedKeywords: selectedKeywords,
          analysisMode: 'comprehensive'
        }
      });

      if (error) throw error;

      toast.success(`✅ A.R.I.A vX™: Generated ${data?.narratives?.length || 0} counter-narrative strategies`);
      onRefresh();

    } catch (error) {
      console.error('Counter-narrative generation failed:', error);
      toast.error('❌ A.R.I.A vX™: Counter-narrative generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const approveNarrative = async (narrativeId: string) => {
    try {
      const { error } = await supabase
        .from('counter_narratives')
        .update({ status: 'approved' })
        .eq('id', narrativeId);

      if (error) throw error;

      toast.success('✅ Counter-narrative approved');
      onRefresh();
    } catch (error) {
      console.error('Failed to approve narrative:', error);
      toast.error('❌ Failed to approve narrative');
    }
  };

  const rejectNarrative = async (narrativeId: string) => {
    try {
      const { error } = await supabase
        .from('counter_narratives')
        .update({ status: 'rejected' })
        .eq('id', narrativeId);

      if (error) throw error;

      toast.success('❌ Counter-narrative rejected');
      onRefresh();
    } catch (error) {
      console.error('Failed to reject narrative:', error);
      toast.error('❌ Failed to reject narrative');
    }
  };

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
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
      {/* Counter-Narrative Generator */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Counter-Narrative Recommendation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Keyword Selection */}
          {keywordData.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Select Keywords to Counter:</h4>
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
            onClick={generateCounterNarratives}
            disabled={isGenerating || keywordData.length === 0}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90 font-semibold"
            size="lg"
          >
            <Brain className={`h-5 w-5 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Generating Counter-Narratives...' : 'Generate AI Counter-Narratives'}
          </Button>

          <Alert className="bg-purple-500/10 border-purple-500/50">
            <Lightbulb className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-300">
              A.R.I.A analyzes negative sentiment patterns and generates strategic counter-narrative themes, content formats, and emotional tones to reclaim your narrative.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Generated Counter-Narratives */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-corporate-accent" />
          Generated Counter-Narrative Strategies
        </h3>

        {narratives.map((narrative) => (
          <Card key={narrative.id} className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{narrative.recommended_theme}</CardTitle>
                <Badge className={getStatusColor(narrative.status)}>
                  {narrative.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                  {narrative.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {narrative.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Keywords */}
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-2">Target Keywords to Reclaim:</h5>
                <div className="flex flex-wrap gap-1">
                  {narrative.target_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-corporate-accent border-corporate-accent/50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Strategy Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Content Format</span>
                  <p className="text-white font-medium">{narrative.content_format}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Emotional Tone</span>
                  <p className={`font-medium ${getToneColor(narrative.emotional_tone)}`}>
                    {narrative.emotional_tone}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Target Audience</span>
                  <p className="text-white font-medium">{narrative.target_audience}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Created</span>
                  <p className="text-gray-300 text-sm">
                    {new Date(narrative.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {narrative.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => approveNarrative(narrative.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve Strategy
                  </Button>
                  <Button
                    onClick={() => rejectNarrative(narrative.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                    size="sm"
                  >
                    Reject Strategy
                  </Button>
                </div>
              )}

              {narrative.status === 'approved' && (
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Articles
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {narratives.length === 0 && (
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Counter-Narratives Yet</h3>
              <p className="text-gray-500 mb-4">
                Generate AI-powered counter-narrative strategies based on your keyword intelligence data
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CounterNarrativeEngine;
