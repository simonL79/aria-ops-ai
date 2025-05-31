
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  Eye,
  Shield,
  Target
} from 'lucide-react';

const RiskIntelligenceTab = () => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const mockRiskAnalysis = [
    {
      id: '1',
      entityName: 'TechVenture AI Ltd',
      directorRiskScore: 78,
      sectorRiskScore: 65,
      geographicRiskScore: 45,
      overallRisk: 75,
      threatVectors: [
        { type: 'Director Litigation History', severity: 'High', probability: 85 },
        { type: 'AI Sector Volatility', severity: 'Medium', probability: 70 },
        { type: 'Regulatory Scrutiny', severity: 'Medium', probability: 60 }
      ],
      predictedEvents: [
        { event: 'Media Scrutiny', timeframe: '2-4 weeks', probability: 75 },
        { event: 'Regulatory Investigation', timeframe: '1-3 months', probability: 45 }
      ]
    },
    {
      id: '2',
      entityName: 'CryptoFlow Holdings',
      directorRiskScore: 85,
      sectorRiskScore: 90,
      geographicRiskScore: 70,
      overallRisk: 85,
      threatVectors: [
        { type: 'Offshore Structure Risk', severity: 'High', probability: 90 },
        { type: 'Crypto Regulatory Risk', severity: 'High', probability: 85 },
        { type: 'Anonymous Ownership', severity: 'High', probability: 80 }
      ],
      predictedEvents: [
        { event: 'Regulatory Action', timeframe: '1-2 weeks', probability: 85 },
        { event: 'Media Investigation', timeframe: '2-6 weeks', probability: 70 }
      ]
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">1,247</div>
                <div className="text-xs text-corporate-gray">Directors tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-lg font-semibold text-white">89</div>
                <div className="text-xs text-corporate-gray">High-risk entities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-lg font-semibold text-white">234</div>
                <div className="text-xs text-corporate-gray">Risk escalations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">3.2</div>
                <div className="text-xs text-corporate-gray">Days avg prediction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis Results */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <AlertTriangle className="h-5 w-5 text-corporate-accent" />
            Risk Intelligence Analysis
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Comprehensive risk assessment and threat prediction
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockRiskAnalysis.map((analysis) => (
              <div key={analysis.id} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{analysis.entityName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-corporate-gray text-sm">Overall Risk Score:</span>
                      <span className={`font-bold text-lg ${getRiskColor(analysis.overallRisk)}`}>
                        {analysis.overallRisk}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <Eye className="h-3 w-3 mr-1" />
                      Monitor
                    </Button>
                    <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                      <Target className="h-3 w-3 mr-1" />
                      Queue for Outreach
                    </Button>
                  </div>
                </div>

                {/* Risk Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-corporate-gray">Director Risk</span>
                      <span className={getRiskColor(analysis.directorRiskScore)}>{analysis.directorRiskScore}</span>
                    </div>
                    <Progress 
                      value={analysis.directorRiskScore} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-corporate-gray">Sector Risk</span>
                      <span className={getRiskColor(analysis.sectorRiskScore)}>{analysis.sectorRiskScore}</span>
                    </div>
                    <Progress 
                      value={analysis.sectorRiskScore} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-corporate-gray">Geographic Risk</span>
                      <span className={getRiskColor(analysis.geographicRiskScore)}>{analysis.geographicRiskScore}</span>
                    </div>
                    <Progress 
                      value={analysis.geographicRiskScore} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Threat Vectors */}
                <div className="mb-4">
                  <h4 className="text-corporate-lightGray font-medium mb-2">Identified Threat Vectors</h4>
                  <div className="space-y-2">
                    {analysis.threatVectors.map((vector, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-corporate-darkSecondary rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-corporate-accent" />
                          <span className="text-corporate-lightGray text-sm">{vector.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(vector.severity)} size="sm">
                            {vector.severity}
                          </Badge>
                          <span className="text-corporate-gray text-xs">{vector.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predicted Events */}
                <div>
                  <h4 className="text-corporate-lightGray font-medium mb-2">Predicted Events</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.predictedEvents.map((event, index) => (
                      <div key={index} className="p-2 bg-corporate-darkSecondary rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-corporate-accent" />
                          <span className="text-corporate-lightGray text-sm font-medium">{event.event}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-corporate-gray">Timeframe: {event.timeframe}</span>
                          <span className={getRiskColor(event.probability)}>
                            {event.probability}% probability
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Director Risk Network */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Users className="h-5 w-5 text-corporate-accent" />
            Director Risk Network
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Cross-entity director relationships and risk propagation
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-16 w-16 text-corporate-accent mx-auto mb-4 opacity-50" />
            <p className="text-corporate-gray">Network visualization coming soon</p>
            <p className="text-corporate-gray text-sm">Advanced director linkage and risk mapping interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskIntelligenceTab;
