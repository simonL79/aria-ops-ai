
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Target,
  Shield,
  Globe,
  Clock,
  FileText,
  Download
} from 'lucide-react';

const RiskIntelligenceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [isScanning, setIsScanning] = useState(false);

  const mockRiskAssessments = [
    {
      id: '1',
      entityName: 'Global Dynamics Corp',
      riskScore: 85,
      riskLevel: 'high',
      lastUpdated: '2024-01-15 16:45:00',
      threatVectors: ['Regulatory Scrutiny', 'Litigation Risk', 'Reputational Exposure'],
      riskFactors: {
        financial: 25,
        operational: 30,
        regulatory: 40,
        reputational: 35
      },
      recommendation: 'Enhanced monitoring required - multiple active risk vectors'
    },
    {
      id: '2',
      entityName: 'TechFlow Industries',
      riskScore: 45,
      riskLevel: 'medium',
      lastUpdated: '2024-01-15 15:20:00',
      threatVectors: ['Market Volatility', 'Competition Risk'],
      riskFactors: {
        financial: 15,
        operational: 20,
        regulatory: 10,
        reputational: 25
      },
      recommendation: 'Standard monitoring with quarterly reviews'
    },
    {
      id: '3',
      entityName: 'SafeGuard Holdings',
      riskScore: 20,
      riskLevel: 'low',
      lastUpdated: '2024-01-15 14:10:00',
      threatVectors: [],
      riskFactors: {
        financial: 5,
        operational: 8,
        regulatory: 3,
        reputational: 10
      },
      recommendation: 'Minimal monitoring - low risk profile maintained'
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskTextColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredAssessments = mockRiskAssessments.filter(assessment => {
    const matchesSearch = assessment.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = riskFilter === 'all' || assessment.riskLevel === riskFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Risk Intelligence Header */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Brain className="h-5 w-5 text-corporate-accent" />
            Risk Intelligence Engine
          </CardTitle>
          <p className="text-sm corporate-subtext">
            AI-powered predictive risk assessment and threat vector analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="searchTerm" className="text-corporate-lightGray">Search Entities</Label>
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Entity name or identifier..."
                className="bg-corporate-darkTertiary border-corporate-border text-white"
              />
            </div>

            <div>
              <Label className="text-corporate-lightGray">Risk Level Filter</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue placeholder="All risk levels" />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="all" className="text-white hover:bg-corporate-darkSecondary">All Levels</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-corporate-darkSecondary">High Risk</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-corporate-darkSecondary">Medium Risk</SelectItem>
                  <SelectItem value="low" className="text-white hover:bg-corporate-darkSecondary">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleStartScan}
                disabled={isScanning}
                className="bg-corporate-accent text-black hover:bg-corporate-accentDark w-full"
              >
                {isScanning ? (
                  <>
                    <Search className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Run Risk Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessments */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <AlertTriangle className="h-5 w-5 text-corporate-accent" />
            Active Risk Assessments
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Real-time risk profiles and threat intelligence
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{assessment.entityName}</h3>
                      <Badge className={getRiskColor(assessment.riskLevel)}>
                        <span className="capitalize">{assessment.riskLevel} Risk</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <span className="text-corporate-gray">Risk Score:</span>
                        <span className={`ml-1 font-semibold ${getRiskTextColor(assessment.riskScore)}`}>
                          {assessment.riskScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Financial:</span>
                        <span className={`ml-1 ${getRiskTextColor(assessment.riskFactors.financial)}`}>
                          {assessment.riskFactors.financial}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Regulatory:</span>
                        <span className={`ml-1 ${getRiskTextColor(assessment.riskFactors.regulatory)}`}>
                          {assessment.riskFactors.regulatory}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Updated:</span>
                        <span className="text-corporate-lightGray ml-1">{assessment.lastUpdated}</span>
                      </div>
                    </div>

                    {assessment.threatVectors.length > 0 && (
                      <div className="mb-2">
                        <span className="text-corporate-gray text-sm">Active Threat Vectors:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {assessment.threatVectors.map((vector, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-orange-500 text-orange-400">
                              {vector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="text-corporate-gray">Recommendation:</span>
                      <span className="text-corporate-lightGray ml-1">{assessment.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <FileText className="h-3 w-3 mr-1" />
                      Risk Report
                    </Button>
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <Download className="h-3 w-3 mr-1" />
                      Export Data
                    </Button>
                    {assessment.riskLevel === 'high' && (
                      <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div>
                <div className="text-lg font-semibold text-white">23</div>
                <div className="text-xs text-corporate-gray">High risk entities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-lg font-semibold text-white">67</div>
                <div className="text-xs text-corporate-gray">Risk escalations (30d)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">1.2K</div>
                <div className="text-xs text-corporate-gray">Entities monitored</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">15min</div>
                <div className="text-xs text-corporate-gray">Avg assessment time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskIntelligenceTab;
