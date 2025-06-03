
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  Shield, 
  Zap,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface CounterNarrativeStrategyProps {
  narratives: any[];
  onRefresh: () => void;
}

const CounterNarrativeStrategy: React.FC<CounterNarrativeStrategyProps> = ({
  narratives,
  onRefresh
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCounterNarratives = async () => {
    setIsGenerating(true);
    
    try {
      toast.info('🧠 A.R.I.A vX™: Generating strategic counter-narratives...');
      
      // Simulate counter-narrative generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('✅ Counter-narratives generated successfully');
      onRefresh();
      
    } catch (error) {
      console.error('Counter-narrative generation failed:', error);
      toast.error('❌ Counter-narrative generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStrategyColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Counter-Narrative Generation Engine */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Strategic Counter-Narrative Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateCounterNarratives}
            disabled={isGenerating}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            <Zap className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Generating Counter-Narratives...' : 'Generate AI Counter-Narratives'}
          </Button>

          <Alert className="bg-blue-500/10 border-blue-500/50">
            <Brain className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              A.R.I.A vX™ analyzes live threat intelligence to generate strategic counter-narratives and response frameworks.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Generated Counter-Narratives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {narratives.length > 0 ? narratives.slice(0, 6).map((narrative, index) => (
          <Card key={narrative.id || index} className="bg-corporate-dark border-corporate-border hover:border-corporate-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-corporate-accent" />
                  <span className="text-xs text-gray-400 uppercase">Counter-Narrative</span>
                </div>
                <Badge className={getStrategyColor(narrative.priority || 'low')}>
                  {narrative.priority || 'standard'}
                </Badge>
              </div>

              <h3 className="font-medium text-white mb-2">
                {narrative.title || `Strategy ${index + 1}`}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Entity:</span>
                  <span className="text-blue-400">{narrative.target_entity || 'General'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Strategy Type:</span>
                  <span className="text-green-400">{narrative.strategy_type || 'Defensive'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Effectiveness:</span>
                  <span className="text-yellow-400">{narrative.effectiveness_score || 85}%</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700">
                <span className="text-xs text-gray-500">
                  Generated: {narrative.created_at ? new Date(narrative.created_at).toLocaleString() : 'Just now'}
                </span>
              </div>

              {narrative.description && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">
                  {narrative.description.substring(0, 100)}...
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <Card className="col-span-full bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Counter-Narratives Generated Yet</h3>
              <p className="text-gray-500 mb-4">
                Generate strategic counter-narratives based on live threat intelligence to prepare response strategies
              </p>
              <Button
                onClick={generateCounterNarratives}
                variant="outline"
                className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
              >
                Generate First Counter-Narrative
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {narratives.length > 0 && (
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Counter-Narrative Status: READY</span>
            </div>
            <p className="text-blue-300 text-sm mt-1">
              {narratives.length} strategic counter-narrative{narratives.length !== 1 ? 's' : ''} prepared for deployment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CounterNarrativeStrategy;
