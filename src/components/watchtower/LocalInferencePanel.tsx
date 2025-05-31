
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Search, Zap, Clock } from 'lucide-react';
import { useLocalInference } from '@/hooks/useLocalInference';
import { toast } from 'sonner';

interface LocalInferencePanelProps {
  entityName?: string;
  onAnalysisComplete?: (analysis: any) => void;
}

const LocalInferencePanel: React.FC<LocalInferencePanelProps> = ({
  entityName = 'Unknown Entity',
  onAnalysisComplete
}) => {
  const [testContent, setTestContent] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  
  const { analyzeThreat, summarizeContent, searchMemories, isAnalyzing, isSearching } = useLocalInference();

  const handleQuickAnalysis = async () => {
    if (!testContent.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    const analysis = await analyzeThreat(testContent, 'test', entityName, true);
    
    if (analysis) {
      setLastAnalysis(analysis);
      onAnalysisComplete?.(analysis);
      toast.success(`Local analysis complete: ${analysis.category} threat detected`);
    } else {
      toast.error('Local analysis failed');
    }
  };

  const handleMemorySearch = async () => {
    if (!testContent.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const results = await searchMemories(testContent, entityName);
    setMemories(results);
    
    if (results.length > 0) {
      toast.success(`Found ${results.length} relevant memories`);
    } else {
      toast.info('No relevant memories found');
    }
  };

  const handleSummarize = async () => {
    if (!testContent.trim()) {
      toast.error('Please enter content to summarize');
      return;
    }

    const summary = await summarizeContent(testContent, entityName);
    
    if (summary) {
      toast.success('Content summarized successfully');
      setLastAnalysis(summary);
    } else {
      toast.error('Summarization failed');
    }
  };

  const getThreatColor = (level: number) => {
    if (level >= 8) return 'bg-red-500';
    if (level >= 6) return 'bg-orange-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Local AI Inference - {entityName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-corporate-lightGray">
              Test Content / Search Query
            </label>
            <Textarea
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              placeholder="Enter content to analyze or search query for memories..."
              className="bg-corporate-dark border-corporate-border text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              onClick={handleQuickAnalysis}
              disabled={isAnalyzing}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Threat
                </>
              )}
            </Button>

            <Button
              onClick={handleMemorySearch}
              disabled={isSearching}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray"
            >
              {isSearching ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Memory
                </>
              )}
            </Button>

            <Button
              onClick={handleSummarize}
              disabled={isAnalyzing}
              variant="outline"
              className="border-corporate-border text-corporate-lightGray"
            >
              <Brain className="h-4 w-4 mr-2" />
              Summarize
            </Button>
          </div>

          {lastAnalysis && (
            <div className="mt-4 p-4 border border-corporate-border rounded-lg bg-corporate-darkSecondary">
              <h4 className="font-semibold corporate-heading mb-2">Analysis Result</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-corporate-lightGray">Threat Level:</span>
                  <Badge className={`${getThreatColor(lastAnalysis.threatLevel)} text-white`}>
                    {lastAnalysis.threatLevel}/10
                  </Badge>
                  <Badge variant="outline" className="border-corporate-border text-corporate-lightGray">
                    {lastAnalysis.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-corporate-lightGray">Provider:</span>
                  <Badge className="bg-green-600 text-white">
                    {lastAnalysis.provider}
                  </Badge>
                  <span className="text-xs text-corporate-lightGray">
                    {lastAnalysis.analysisTime}ms
                  </span>
                </div>
                <p className="text-sm corporate-subtext">{lastAnalysis.explanation}</p>
              </div>
            </div>
          )}

          {memories.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold corporate-heading">Relevant Memories</h4>
              {memories.slice(0, 3).map((memory, index) => (
                <div key={index} className="p-3 border border-corporate-border rounded bg-corporate-darkSecondary">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="border-corporate-border text-corporate-lightGray text-xs">
                      Similarity: {Math.round(memory.similarity * 100)}%
                    </Badge>
                    <span className="text-xs text-corporate-lightGray">
                      {memory.metadata?.source || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-sm corporate-subtext">{memory.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalInferencePanel;
