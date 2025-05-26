
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, Users, Clock, Globe, Target } from 'lucide-react';
import { ThreatCorrelation, CaseThread } from '@/types/intelligence/fusion';
import { ThreatCorrelationEngine } from '@/services/intelligence/threatCorrelationEngine';

interface ThreatCorrelationPanelProps {
  selectedThreats: string[];
  onCaseCreated?: (caseThread: CaseThread) => void;
}

const ThreatCorrelationPanel = ({ selectedThreats, onCaseCreated }: ThreatCorrelationPanelProps) => {
  const [correlations, setCorrelations] = useState<ThreatCorrelation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('correlations');
  const correlationEngine = new ThreatCorrelationEngine();

  useEffect(() => {
    if (selectedThreats.length > 1) {
      analyzeCorrelations();
    }
  }, [selectedThreats]);

  const analyzeCorrelations = async () => {
    if (selectedThreats.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      const results = await correlationEngine.analyzeCorrelations(selectedThreats);
      setCorrelations(results);
    } catch (error) {
      console.error('Correlation analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createCaseThread = async () => {
    if (correlations.length === 0) return;
    
    try {
      const caseThread = await correlationEngine.createCaseThread(
        correlations,
        `Case ${new Date().toLocaleDateString()} - ${correlations.length} correlations`
      );
      onCaseCreated?.(caseThread);
    } catch (error) {
      console.error('Case thread creation failed:', error);
    }
  };

  const getCorrelationIcon = (type: ThreatCorrelation['correlationType']) => {
    switch (type) {
      case 'language_similarity': return <Target className="h-4 w-4" />;
      case 'username_pattern': return <Users className="h-4 w-4" />;
      case 'timing_pattern': return <Clock className="h-4 w-4" />;
      case 'geolocation': return <Globe className="h-4 w-4" />;
      default: return <GitBranch className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-red-500';
    if (confidence >= 0.6) return 'bg-orange-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (selectedThreats.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Threat Correlation Analysis
          </CardTitle>
          <CardDescription>
            Select at least 2 threats to analyze correlations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Threat Correlation Analysis
            </CardTitle>
            <CardDescription>
              Analyzing {selectedThreats.length} threats for patterns and connections
            </CardDescription>
          </div>
          
          {correlations.length > 0 && (
            <Button onClick={createCaseThread} variant="default">
              Create Case Thread
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="correlations">
              Correlations ({correlations.length})
            </TabsTrigger>
            <TabsTrigger value="analysis">
              Analysis Summary
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="correlations" className="space-y-4">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing threat patterns...</p>
              </div>
            ) : correlations.length > 0 ? (
              <div className="space-y-3">
                {correlations.map((correlation) => (
                  <div key={correlation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCorrelationIcon(correlation.correlationType)}
                        <span className="font-medium">
                          {correlation.correlationType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-16 rounded-full ${getConfidenceColor(correlation.confidence)}`} />
                        <Badge variant="outline">
                          {Math.round(correlation.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {correlation.threats.length} threats connected
                    </p>
                    
                    {correlation.metadata.sharedTokens && (
                      <div className="text-xs">
                        <span className="font-medium">Shared terms: </span>
                        {correlation.metadata.sharedTokens.slice(0, 5).join(', ')}
                      </div>
                    )}
                    
                    {correlation.metadata.usernames && (
                      <div className="text-xs">
                        <span className="font-medium">Common usernames: </span>
                        {correlation.metadata.usernames.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No significant correlations detected</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{correlations.length}</div>
                <div className="text-sm text-muted-foreground">Total Correlations</div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {correlations.length > 0 ? 
                    Math.round(correlations.reduce((sum, c) => sum + c.confidence, 0) / correlations.length * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Correlation Types Found:</h4>
              {Array.from(new Set(correlations.map(c => c.correlationType))).map(type => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  {getCorrelationIcon(type)}
                  <span>{type.replace('_', ' ')}</span>
                  <Badge variant="secondary">
                    {correlations.filter(c => c.correlationType === type).length}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThreatCorrelationPanel;
