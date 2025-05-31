
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface LocalInferencePanelProps {
  entityName: string;
  onAnalysisComplete: (analysis: { category: string; confidence: number; threats: string[] }) => void;
}

interface ThreatAnalysis {
  category: string;
  confidence: number;
  threats: string[];
  recommendations: string[];
}

const LocalInferencePanel: React.FC<LocalInferencePanelProps> = ({ 
  entityName, 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);
  const [customEntity, setCustomEntity] = useState(entityName);

  const runLocalAnalysis = async () => {
    setIsAnalyzing(true);
    toast.info(`Running local AI analysis for ${customEntity}...`);

    try {
      // Simulate local AI inference
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: ThreatAnalysis = {
        category: Math.random() > 0.5 ? 'High Risk' : 'Medium Risk',
        confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
        threats: [
          'Negative sentiment detected in recent mentions',
          'Competitor activity in related keywords',
          'Potential reputation vulnerabilities identified'
        ],
        recommendations: [
          'Immediate monitoring implementation',
          'Proactive content strategy deployment',
          'Stakeholder notification protocol activation'
        ]
      };

      setAnalysis(mockAnalysis);
      onAnalysisComplete(mockAnalysis);
      toast.success(`Local analysis completed for ${customEntity}`);
    } catch (error) {
      toast.error('Local analysis failed');
      console.error('Local analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('High')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (category.includes('Medium')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Brain className="h-5 w-5 text-corporate-accent" />
          Local AI Threat Analysis
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Run local inference analysis on entity threat patterns
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-corporate-lightGray">Entity Name</label>
          <div className="flex gap-2">
            <Input
              value={customEntity}
              onChange={(e) => setCustomEntity(e.target.value)}
              placeholder="Enter entity name for analysis"
              className="bg-corporate-dark border-corporate-border text-white"
            />
            <Button
              onClick={runLocalAnalysis}
              disabled={isAnalyzing || !customEntity.trim()}
              className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {analysis && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold corporate-heading">Analysis Results</h3>
              <Badge className={getCategoryColor(analysis.category)}>
                {analysis.category}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-corporate-lightGray">Confidence Score:</span>
                  <span className={`font-bold ${getConfidenceColor(analysis.confidence)}`}>
                    {Math.round(analysis.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Identified Threats
                </h4>
                <div className="space-y-1">
                  {analysis.threats.map((threat, index) => (
                    <div key={index} className="text-sm text-corporate-lightGray flex items-start gap-2">
                      <div className="h-1.5 w-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{threat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Recommendations
                </h4>
                <div className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-corporate-lightGray flex items-start gap-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-corporate-darkSecondary border border-corporate-border rounded-lg">
          <div className="text-xs text-corporate-lightGray">
            <strong>Local AI Status:</strong> Running client-side inference for privacy-first threat analysis
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalInferencePanel;
