
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  TrendingUp, 
  BarChart3, 
  Map, 
  Building,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';

const StrategicMappingTab = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const mockRegionalData = [
    {
      region: 'United Kingdom',
      newEntities: 89,
      riskScore: 67,
      opportunities: 23,
      trend: 'increasing',
      keyRisks: ['Brexit regulations', 'Data protection', 'Financial services']
    },
    {
      region: 'United States',
      newEntities: 156,
      riskScore: 72,
      opportunities: 34,
      trend: 'stable',
      keyRisks: ['Tech regulation', 'ESG mandates', 'AI governance']
    },
    {
      region: 'European Union',
      newEntities: 203,
      riskScore: 75,
      opportunities: 41,
      trend: 'increasing',
      keyRisks: ['GDPR compliance', 'Green taxonomy', 'Digital services']
    },
    {
      region: 'Asia Pacific',
      newEntities: 298,
      riskScore: 58,
      opportunities: 67,
      trend: 'stable',
      keyRisks: ['Supply chain', 'Regulatory fragmentation', 'ESG standards']
    }
  ];

  const mockIndustryData = [
    {
      industry: 'Artificial Intelligence',
      entities: 78,
      avgRiskScore: 82,
      growth: '+45%',
      marketOpportunity: 'Very High',
      keyTrends: ['Regulatory scrutiny', 'Ethical AI concerns', 'Data privacy']
    },
    {
      industry: 'Cryptocurrency',
      entities: 45,
      avgRiskScore: 89,
      growth: '+23%',
      marketOpportunity: 'High',
      keyTrends: ['Regulatory crackdowns', 'Exchange failures', 'Market volatility']
    },
    {
      industry: 'Healthcare Tech',
      entities: 67,
      avgRiskScore: 65,
      growth: '+67%',
      marketOpportunity: 'High',
      keyTrends: ['FDA approvals', 'Patient data', 'Telehealth regulations']
    },
    {
      industry: 'FinTech',
      entities: 123,
      avgRiskScore: 71,
      growth: '+34%',
      marketOpportunity: 'Medium',
      keyTrends: ['Banking regulations', 'Open banking', 'Consumer protection']
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOpportunityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very high': return 'text-green-400';
      case 'high': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-corporate-darkTertiary border-corporate-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
              <SelectItem value="global" className="text-white hover:bg-corporate-darkSecondary">Global View</SelectItem>
              <SelectItem value="uk" className="text-white hover:bg-corporate-darkSecondary">United Kingdom</SelectItem>
              <SelectItem value="us" className="text-white hover:bg-corporate-darkSecondary">United States</SelectItem>
              <SelectItem value="eu" className="text-white hover:bg-corporate-darkSecondary">European Union</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48 bg-corporate-darkTertiary border-corporate-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
              <SelectItem value="all" className="text-white hover:bg-corporate-darkSecondary">All Industries</SelectItem>
              <SelectItem value="ai" className="text-white hover:bg-corporate-darkSecondary">Artificial Intelligence</SelectItem>
              <SelectItem value="crypto" className="text-white hover:bg-corporate-darkSecondary">Cryptocurrency</SelectItem>
              <SelectItem value="healthtech" className="text-white hover:bg-corporate-darkSecondary">Healthcare Tech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Regional Risk & Opportunity Map */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Map className="h-5 w-5 text-corporate-accent" />
            Regional Risk & Opportunity Analysis
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Geographic distribution of reputation risks and business opportunities
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRegionalData.map((region, index) => (
              <div key={index} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{region.region}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className={`h-3 w-3 ${getTrendColor(region.trend)}`} />
                      <span className={`text-xs ${getTrendColor(region.trend)}`}>
                        {region.trend}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-corporate-accent text-black">
                    {region.opportunities} opportunities
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-corporate-gray">New Entities:</span>
                    <div className="text-white font-semibold">{region.newEntities}</div>
                  </div>
                  <div>
                    <span className="text-corporate-gray">Risk Score:</span>
                    <div className={`font-semibold ${getRiskColor(region.riskScore)}`}>
                      {region.riskScore}
                    </div>
                  </div>
                  <div>
                    <span className="text-corporate-gray">Trend:</span>
                    <div className={getTrendColor(region.trend)}>
                      {region.trend}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-corporate-gray text-xs">Key Risk Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {region.keyRisks.map((risk, riskIndex) => (
                      <Badge key={riskIndex} variant="outline" className="text-xs border-corporate-accent text-corporate-accent">
                        {risk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Analysis */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Building className="h-5 w-5 text-corporate-accent" />
            Industry Risk & Growth Analysis
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Sector-specific risk patterns and market opportunities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockIndustryData.map((industry, index) => (
              <div key={index} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{industry.industry}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-corporate-gray">Entities:</span>
                        <div className="text-white font-semibold">{industry.entities}</div>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Avg Risk:</span>
                        <div className={`font-semibold ${getRiskColor(industry.avgRiskScore)}`}>
                          {industry.avgRiskScore}
                        </div>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Growth:</span>
                        <div className="text-green-400 font-semibold">{industry.growth}</div>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Opportunity:</span>
                        <div className={`font-semibold ${getOpportunityColor(industry.marketOpportunity)}`}>
                          {industry.marketOpportunity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <Target className="h-3 w-3 mr-1" />
                      Target Sector
                    </Button>
                    <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                      <Zap className="h-3 w-3 mr-1" />
                      Auto-Campaign
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="text-corporate-gray text-sm">Key Trends:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {industry.keyTrends.map((trend, trendIndex) => (
                      <Badge key={trendIndex} variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Insights */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <AlertTriangle className="h-5 w-5 text-corporate-accent" />
            Strategic Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-corporate-darkSecondary rounded-lg border-l-4 border-corporate-accent">
              <h4 className="font-semibold text-corporate-accent mb-2">High-Opportunity Sectors</h4>
              <p className="text-corporate-lightGray text-sm">
                AI and Healthcare Tech sectors showing highest growth rates with significant regulatory risk exposure. 
                Recommend targeted outreach campaigns focusing on compliance and reputation preparedness.
              </p>
            </div>

            <div className="p-4 bg-corporate-darkSecondary rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-400 mb-2">Regional Risk Alerts</h4>
              <p className="text-corporate-lightGray text-sm">
                EU and UK markets showing increased regulatory activity. Companies in these regions 
                face higher probability of reputation events within next 30-60 days.
              </p>
            </div>

            <div className="p-4 bg-corporate-darkSecondary rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-400 mb-2">Strategic Recommendations</h4>
              <p className="text-corporate-lightGray text-sm">
                Focus Genesis Sentinel monitoring on AI/Crypto sectors in EU/UK jurisdictions. 
                Auto-queue high-risk entities for immediate outreach. Estimated pipeline value: $2.3M over 6 months.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicMappingTab;
