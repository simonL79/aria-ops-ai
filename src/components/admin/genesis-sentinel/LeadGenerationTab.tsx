
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Mail, 
  FileText, 
  TrendingUp, 
  Clock,
  DollarSign,
  Users,
  Send
} from 'lucide-react';

const LeadGenerationTab = () => {
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null);

  const mockProspects = [
    {
      id: '1',
      entityName: 'QuantumTech Ventures',
      industry: 'AI/Technology',
      riskScore: 82,
      opportunityScore: 78,
      estimatedValue: '$25,000',
      timeToOutreach: '2 hours',
      riskFactors: ['New AI regulation exposure', 'Founder litigation history'],
      briefs: {
        threat: 'Upcoming AI governance regulations pose significant reputational risk',
        opportunity: 'Early intervention could prevent regulatory scrutiny',
        approach: 'Position as AI compliance and reputation experts'
      },
      status: 'ready_for_outreach',
      urgency: 'high'
    },
    {
      id: '2',
      entityName: 'GreenFin Solutions',
      industry: 'FinTech/ESG',
      riskScore: 65,
      opportunityScore: 85,
      estimatedValue: '$40,000',
      timeToOutreach: '4 hours',
      riskFactors: ['ESG controversy potential', 'Greenwashing exposure'],
      briefs: {
        threat: 'ESG sector facing increased scrutiny over greenwashing claims',
        opportunity: 'High conversion potential due to sector volatility',
        approach: 'Lead with ESG reputation management expertise'
      },
      status: 'intelligence_gathering',
      urgency: 'medium'
    },
    {
      id: '3',
      entityName: 'MedTech Innovations',
      industry: 'Healthcare',
      riskScore: 55,
      opportunityScore: 70,
      estimatedValue: '$35,000',
      timeToOutreach: '6 hours',
      riskFactors: ['FDA approval risks', 'Patient data concerns'],
      briefs: {
        threat: 'Medical device approval process creates reputational vulnerability',
        opportunity: 'Healthcare sector values proactive reputation management',
        approach: 'Focus on regulatory reputation and crisis preparedness'
      },
      status: 'queued',
      urgency: 'low'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_for_outreach': return 'bg-green-600';
      case 'intelligence_gathering': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Generation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-corporate-accent" />
              <div>
                <div className="text-lg font-semibold text-white">47</div>
                <div className="text-xs text-corporate-gray">Active prospects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">12</div>
                <div className="text-xs text-corporate-gray">Ready for outreach</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-lg font-semibold text-white">$430K</div>
                <div className="text-xs text-corporate-gray">Pipeline value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <div>
                <div className="text-lg font-semibold text-white">34%</div>
                <div className="text-xs text-corporate-gray">Conversion rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prospect Pipeline */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Target className="h-5 w-5 text-corporate-accent" />
            High-Value Prospect Pipeline
          </CardTitle>
          <p className="text-sm corporate-subtext">
            AI-identified prospects with pre-generated intelligence briefs
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProspects.map((prospect) => (
              <div key={prospect.id} className="p-4 border border-corporate-border rounded-lg bg-corporate-darkTertiary">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white text-lg">{prospect.entityName}</h3>
                      <Badge className={getStatusColor(prospect.status)}>
                        {prospect.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getUrgencyColor(prospect.urgency)}>
                        {prospect.urgency} priority
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-corporate-lightGray mb-2">
                      {prospect.industry}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-corporate-gray">Risk Score:</span>
                        <span className={`ml-1 font-semibold ${getRiskColor(prospect.riskScore)}`}>
                          {prospect.riskScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Opportunity:</span>
                        <span className={`ml-1 font-semibold ${getOpportunityColor(prospect.opportunityScore)}`}>
                          {prospect.opportunityScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Est. Value:</span>
                        <span className="text-green-400 ml-1 font-semibold">{prospect.estimatedValue}</span>
                      </div>
                      <div>
                        <span className="text-corporate-gray">Time to Outreach:</span>
                        <span className="text-corporate-lightGray ml-1">{prospect.timeToOutreach}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                      <FileText className="h-3 w-3 mr-1" />
                      Intel Brief
                    </Button>
                    <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                      <Send className="h-3 w-3 mr-1" />
                      Generate Outreach
                    </Button>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="mb-4">
                  <span className="text-corporate-gray text-sm">Risk Factors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prospect.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-400">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Intelligence Brief Preview */}
                <div className="bg-corporate-darkSecondary p-3 rounded">
                  <h4 className="text-corporate-lightGray font-medium mb-2 text-sm">Intelligence Brief</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-corporate-gray">Threat:</span>
                      <span className="text-corporate-lightGray ml-1">{prospect.briefs.threat}</span>
                    </div>
                    <div>
                      <span className="text-corporate-gray">Opportunity:</span>
                      <span className="text-corporate-lightGray ml-1">{prospect.briefs.opportunity}</span>
                    </div>
                    <div>
                      <span className="text-corporate-gray">Approach:</span>
                      <span className="text-corporate-lightGray ml-1">{prospect.briefs.approach}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outreach Templates */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Mail className="h-5 w-5 text-corporate-accent" />
            AI-Generated Outreach Templates
          </CardTitle>
          <p className="text-sm corporate-subtext">
            Contextual outreach templates based on intelligence analysis
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-corporate-darkTertiary p-4 rounded-lg">
            <div className="mb-3">
              <Badge className="bg-corporate-accent text-black">Template: AI Regulation Risk</Badge>
            </div>
            <div className="text-sm text-corporate-lightGray space-y-2">
              <p><strong>Subject:</strong> Upcoming AI Governance Regulations - Reputation Risk Assessment</p>
              <div className="bg-corporate-darkSecondary p-3 rounded text-xs">
                <p>Hi [Name],</p>
                <p className="mt-2">We've been monitoring developments in AI governance regulations and noticed that [Company] may be exposed to upcoming compliance requirements that could impact your reputation.</p>
                <p className="mt-2">Our intelligence suggests that companies in your sector will face increased scrutiny within the next 2-4 weeks. We've helped similar organizations proactively manage these challenges...</p>
                <p className="mt-2">Would you be interested in a brief conversation about protecting [Company]'s reputation ahead of these regulatory changes?</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black">
                Edit Template
              </Button>
              <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                <Send className="h-3 w-3 mr-1" />
                Send to Prospects
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadGenerationTab;
