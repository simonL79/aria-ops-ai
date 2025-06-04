
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, TrendingUp, AlertTriangle, Clock, Shield, Zap, Eye } from 'lucide-react';
import { AdvancedThreatClassifier } from '@/services/ariaCore/advancedThreatClassifier';
import { ThreatPredictionEngine } from '@/services/ariaCore/threatPredictionEngine';
import { toast } from 'sonner';

interface AdvancedThreatAnalysisTabProps {
  entityName: string;
}

const AdvancedThreatAnalysisTab: React.FC<AdvancedThreatAnalysisTabProps> = ({ entityName }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [threatAnalysis, setThreatAnalysis] = useState<any>(null);
  const [threatPrediction, setThreatPrediction] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('reddit');

  const runAdvancedAnalysis = async () => {
    if (!entityName || !selectedContent) {
      toast.error('Please provide entity name and content to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      toast.info(`🎯 Starting advanced threat analysis for ${entityName}...`);
      
      const result = await AdvancedThreatClassifier.classifyThreatWithAgents(
        selectedContent,
        entityName,
        selectedPlatform,
        'Advanced threat analysis'
      );
      
      setThreatAnalysis(result);
      toast.success(`✅ Advanced threat analysis complete`);
    } catch (error) {
      console.error('Advanced analysis failed:', error);
      toast.error(`❌ Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runThreatPrediction = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsPredicting(true);
    try {
      toast.info(`🔮 Starting threat prediction for ${entityName}...`);
      
      const mockCurrentThreat = {
        platform: selectedPlatform,
        severity: threatAnalysis?.classification?.severity || 5,
        content: selectedContent
      };
      
      const prediction = await ThreatPredictionEngine.predictThreatEvolution(
        entityName,
        mockCurrentThreat,
        []
      );
      
      setThreatPrediction(prediction);
      toast.success(`✅ Threat prediction complete`);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast.error(`❌ Prediction failed: ${error.message}`);
    } finally {
      setIsPredicting(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 6) return 'bg-orange-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Advanced Threat Analysis Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-white text-sm font-medium">Content to Analyze</label>
              <textarea
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                placeholder="Enter content for threat analysis..."
                className="w-full h-24 p-3 bg-corporate-darkSecondary border border-corporate-border rounded-lg text-white placeholder-corporate-lightGray resize-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-white text-sm font-medium">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full p-3 bg-corporate-darkSecondary border border-corporate-border rounded-lg text-white"
              >
                <option value="reddit">Reddit</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="news">News Media</option>
                <option value="blog">Blog</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runAdvancedAnalysis}
              disabled={isAnalyzing || !entityName || !selectedContent}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Run Multi-Agent Analysis
                </>
              )}
            </Button>

            <Button
              onClick={runThreatPrediction}
              disabled={isPredicting || !entityName}
              variant="outline"
              className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
            >
              {isPredicting ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Predict Evolution
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(threatAnalysis || threatPrediction) && (
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-corporate-darkSecondary">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              Multi-Agent Analysis
            </TabsTrigger>
            <TabsTrigger value="prediction" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              Threat Prediction
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {threatAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Classification Results */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-corporate-accent" />
                      CIA-Grade Classification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Category:</span>
                      <Badge className="bg-blue-500">{threatAnalysis.classification.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Severity:</span>
                      <Badge className={getSeverityColor(threatAnalysis.classification.severity)}>
                        {threatAnalysis.classification.severity}/10
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Intent:</span>
                      <Badge className="bg-purple-500">{threatAnalysis.classification.intent}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Impact:</span>
                      <Badge className="bg-orange-500">{threatAnalysis.classification.impact}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Confidence:</span>
                      <Badge className="bg-corporate-accent text-black">
                        {(threatAnalysis.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    {threatAnalysis.ciaValidated && (
                      <div className="flex items-center justify-center mt-3">
                        <Badge className="bg-green-500">
                          <Shield className="h-3 w-3 mr-1" />
                          CIA VALIDATED
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agent Analysis */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-corporate-accent" />
                      Multi-Agent Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-corporate-lightGray text-sm">Analyst Agent:</span>
                        <Badge className="bg-blue-500 text-xs">{threatAnalysis.agentAnalysis.analyst}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-corporate-lightGray text-sm">Validator Agent:</span>
                        <Badge className="bg-green-500 text-xs">{threatAnalysis.agentAnalysis.validator}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-corporate-lightGray text-sm">Strategist Agent:</span>
                        <Badge className="bg-purple-500 text-xs">{threatAnalysis.agentAnalysis.strategist}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {threatAnalysis.recommendations && threatAnalysis.recommendations.length > 0 && (
                  <Card className="bg-corporate-dark border-corporate-border lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-corporate-accent" />
                        Action Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {threatAnalysis.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-corporate-darkSecondary rounded">
                            <AlertTriangle className="h-4 w-4 text-corporate-accent" />
                            <span className="text-corporate-lightGray text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            {threatPrediction && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Escalation Prediction */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-corporate-accent" />
                      Escalation Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Escalation Probability:</span>
                      <Badge className={threatPrediction.escalationProbability >= 0.7 ? 'bg-red-500' : 
                                      threatPrediction.escalationProbability >= 0.4 ? 'bg-orange-500' : 'bg-green-500'}>
                        {(threatPrediction.escalationProbability * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Prediction Confidence:</span>
                      <Badge className="bg-corporate-accent text-black">
                        {(threatPrediction.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline Prediction */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-corporate-accent" />
                      Timeline Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Peak Expected:</span>
                      <Badge className="bg-blue-500">{threatPrediction.timelinePrediction.peak}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Duration:</span>
                      <Badge className="bg-blue-500">{threatPrediction.timelinePrediction.duration}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Urgency:</span>
                      <Badge className={getUrgencyColor(threatPrediction.timelinePrediction.urgency)}>
                        {threatPrediction.timelinePrediction.urgency}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Prediction */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Impact Prediction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Max Severity:</span>
                      <Badge className={getSeverityColor(threatPrediction.impactPrediction.maxSeverity)}>
                        {threatPrediction.impactPrediction.maxSeverity}/10
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Reach Potential:</span>
                      <Badge className="bg-purple-500">{threatPrediction.impactPrediction.reachPotential}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray">Business Impact:</span>
                      <Badge className="bg-orange-500">{threatPrediction.impactPrediction.businessImpact}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Early Warnings */}
                <Card className="bg-corporate-dark border-corporate-border">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Early Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {threatPrediction.earlyWarnings.map((warning: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-corporate-darkSecondary rounded">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-corporate-lightGray text-sm">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                {threatPrediction.recommendedActions && (
                  <Card className="bg-corporate-dark border-corporate-border lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-corporate-accent" />
                        Preventive Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {threatPrediction.recommendedActions.map((action: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-corporate-darkSecondary rounded">
                            <Zap className="h-4 w-4 text-corporate-accent" />
                            <span className="text-corporate-lightGray text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedThreatAnalysisTab;
