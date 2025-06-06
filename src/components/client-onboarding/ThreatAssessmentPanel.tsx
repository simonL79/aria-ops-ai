
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, Target, TrendingUp } from "lucide-react";

interface ThreatAssessmentPanelProps {
  entityData: any[];
  threatData: any[];
  onProceed: () => void;
  isProcessing: boolean;
}

const ThreatAssessmentPanel = ({ entityData, threatData, onProceed, isProcessing }: ThreatAssessmentPanelProps) => {
  const hasAssessmentData = threatData.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Live Threat Assessment</h3>
        <p className="text-corporate-lightGray">
          Analyzing real-time threats and risk indicators for discovered entities
        </p>
      </div>

      {!hasAssessmentData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entityData.map((entity, index) => (
              <Card key={index} className="bg-corporate-dark border-corporate-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{entity.name}</h4>
                      <div className="text-xs text-corporate-lightGray">
                        {entity.liveIntelligence?.length || 0} intelligence items to analyze
                      </div>
                    </div>
                    <Target className="h-5 w-5 text-corporate-accent" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-corporate-dark border border-corporate-border rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Live Assessment Process</h4>
            <ul className="text-sm text-corporate-lightGray space-y-1">
              <li>• Real-time reputation scanning</li>
              <li>• Live monitoring integration</li>
              <li>• Discovery scanner analysis</li>
              <li>• Threat severity classification</li>
              <li>• Risk scoring algorithm</li>
            </ul>
          </div>

          <Button 
            onClick={onProceed}
            disabled={isProcessing}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isProcessing ? 'Analyzing Live Threats...' : 'Start Live Threat Assessment'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Threat Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {threatData.reduce((acc, t) => acc + t.liveThreats.length, 0)}
                    </div>
                    <div className="text-xs text-corporate-lightGray">Live Threats Detected</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {threatData.filter(t => t.riskLevel === 'high').length}
                    </div>
                    <div className="text-xs text-corporate-lightGray">High Risk Entities</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {(threatData.reduce((acc, t) => acc + t.threatScore, 0) / Math.max(threatData.length, 1) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-corporate-lightGray">Average Risk Score</div>
                  </div>
                  <Shield className="h-8 w-8 text-corporate-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Individual Entity Assessments */}
          <div className="space-y-4">
            {threatData.map((threat, index) => (
              <Card key={index} className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-white">{threat.entityName}</span>
                    <Badge variant={
                      threat.riskLevel === 'high' ? 'destructive' : 
                      threat.riskLevel === 'medium' ? 'secondary' : 
                      'outline'
                    }>
                      {threat.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Threat Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-corporate-lightGray">Threat Score</span>
                        <span className="text-white">{(threat.threatScore * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={threat.threatScore * 100} className="h-2" />
                    </div>

                    {/* Live Threats */}
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">
                        Live Threats Detected ({threat.liveThreats.length})
                      </h5>
                      {threat.liveThreats.length > 0 ? (
                        <div className="space-y-2">
                          {threat.liveThreats.slice(0, 3).map((liveThreat: any, threatIndex: number) => (
                            <div key={threatIndex} className="p-2 bg-corporate-darkSecondary rounded text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white">{liveThreat.platform || 'Unknown Source'}</span>
                                <Badge variant={
                                  liveThreat.severity === 'high' ? 'destructive' : 
                                  liveThreat.severity === 'medium' ? 'secondary' : 
                                  'outline'
                                }>
                                  {liveThreat.severity || 'medium'}
                                </Badge>
                              </div>
                              <p className="text-corporate-lightGray truncate">
                                {liveThreat.content || 'Threat content detected'}
                              </p>
                            </div>
                          ))}
                          {threat.liveThreats.length > 3 && (
                            <p className="text-xs text-corporate-lightGray">
                              +{threat.liveThreats.length - 3} more threats detected...
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-corporate-lightGray">No immediate threats detected</p>
                      )}
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Recommendations</h5>
                      <ul className="text-xs text-corporate-lightGray space-y-1">
                        {threat.recommendations.map((rec: string, recIndex: number) => (
                          <li key={recIndex}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400">Live threat assessment completed using real-time intelligence</span>
          </div>

          <Button 
            onClick={() => window.location.hash = '#defense-config'}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            Proceed to Defense Configuration
          </Button>
        </div>
      )}
    </div>
  );
};

export default ThreatAssessmentPanel;
