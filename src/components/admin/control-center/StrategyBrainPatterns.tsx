
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Users, Zap } from 'lucide-react';
import { DetectedPattern } from '@/services/strategyBrain/patternAnalyzer';

interface StrategyBrainPatternsProps {
  patterns: DetectedPattern[];
  isAnalyzing: boolean;
}

const StrategyBrainPatterns: React.FC<StrategyBrainPatternsProps> = ({
  patterns,
  isAnalyzing
}) => {
  const getPatternIcon = (type: DetectedPattern['type']) => {
    switch (type) {
      case 'sentiment_shift': return <TrendingDown className="h-4 w-4" />;
      case 'coordinated_attack': return <AlertTriangle className="h-4 w-4" />;
      case 'viral_risk': return <TrendingUp className="h-4 w-4" />;
      case 'platform_migration': return <Zap className="h-4 w-4" />;
      case 'influencer_involvement': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPatternColor = (impact: DetectedPattern['impact']) => {
    switch (impact) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-corporate-border bg-corporate-darkSecondary';
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge className="bg-green-500/20 text-green-400">High Confidence</Badge>;
    if (confidence >= 0.6) return <Badge className="bg-yellow-500/20 text-yellow-400">Medium Confidence</Badge>;
    return <Badge className="bg-red-500/20 text-red-400">Low Confidence</Badge>;
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-corporate-accent"></div>
            <p className="text-corporate-lightGray">Analyzing patterns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Detected Patterns ({patterns.length})</h3>
      
      {patterns.length === 0 ? (
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardContent className="p-6 text-center">
            <p className="text-corporate-lightGray">No significant patterns detected</p>
            <p className="text-sm text-corporate-lightGray mt-2">Entity appears stable</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern, index) => (
            <Card key={index} className={`border ${getPatternColor(pattern.impact)}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  {getPatternIcon(pattern.type)}
                  {pattern.type.replace(/_/g, ' ').toUpperCase()}
                  <div className="ml-auto flex items-center gap-2">
                    {getConfidenceBadge(pattern.confidence)}
                    <Badge variant={pattern.impact === 'high' ? 'destructive' : 'secondary'}>
                      {pattern.impact.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-corporate-lightGray text-sm mb-3">{pattern.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-corporate-lightGray">Timeframe:</p>
                    <p className="text-white">{pattern.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-corporate-lightGray">Sources:</p>
                    <p className="text-white">{pattern.sources.join(', ')}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-corporate-lightGray">Confidence:</span>
                    <div className="flex-1 bg-corporate-dark rounded-full h-2">
                      <div 
                        className="bg-corporate-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pattern.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white">{(pattern.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrategyBrainPatterns;
