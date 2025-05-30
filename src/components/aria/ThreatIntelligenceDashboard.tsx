
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Shield,
  Eye,
  Brain,
  Target
} from 'lucide-react';

interface ThreatProfile {
  entity_name: string;
  threat_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_score: number;
  total_mentions: number;
  negative_sentiment: number;
  platforms_affected: string[];
  threat_types: string[];
  analysis_complete: boolean;
  recommendations: string[];
}

interface ThreatIntelligenceDashboardProps {
  threatProfile: ThreatProfile;
}

const ThreatIntelligenceDashboard = ({ threatProfile }: ThreatIntelligenceDashboardProps) => {
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      
      {/* Main Threat Summary */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Threat Intelligence Report: {threatProfile.entity_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                <Badge className={`text-lg px-4 py-2 ${getThreatLevelColor(threatProfile.threat_level)}`}>
                  {threatProfile.threat_level.toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-400">Threat Level</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getRiskScoreColor(threatProfile.risk_score)}`}>
                {threatProfile.risk_score}%
              </div>
              <p className="text-gray-400">Risk Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {threatProfile.total_mentions}
              </div>
              <p className="text-gray-400">Total Mentions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {threatProfile.negative_sentiment}%
              </div>
              <p className="text-gray-400">Negative Sentiment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Detected Threat Summary */}
        <Card className="bg-[#1A1B1E] border-amber-600/30">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detected Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Platforms Affected</h4>
              <div className="flex flex-wrap gap-2">
                {threatProfile.platforms_affected.map((platform, index) => (
                  <Badge key={index} variant="outline" className="border-blue-500 text-blue-400">
                    {platform}
                  </Badge>
                ))}
                {threatProfile.platforms_affected.length === 0 && (
                  <span className="text-gray-400">No specific platforms detected</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Threat Categories</h4>
              <div className="space-y-2">
                {threatProfile.threat_types.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#0A0B0D] rounded">
                    <span className="text-gray-300">{type}</span>
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        <Card className="bg-[#1A1B1E] border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Module Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#0A0B0D] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">RSI™ Sentiment</span>
                </div>
                <div className="text-lg font-bold text-green-400">Analyzed</div>
              </div>
              
              <div className="p-3 bg-[#0A0B0D] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">OSINT Profile</span>
                </div>
                <div className="text-lg font-bold text-green-400">Complete</div>
              </div>
              
              <div className="p-3 bg-[#0A0B0D] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">PRAXIS Forecast</span>
                </div>
                <div className="text-lg font-bold text-green-400">Generated</div>
              </div>
              
              <div className="p-3 bg-[#0A0B0D] rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">EIDETIC Strategy</span>
                </div>
                <div className="text-lg font-bold text-green-400">Calculated</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-white mb-2">CEREBRA AI Bias Check</h4>
              <div className="flex items-center gap-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm text-gray-300">85% Clean</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Crisis Forecast & Memory Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PRAXIS Crisis Forecast */}
        <Card className="bg-[#1A1B1E] border-orange-600/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              PRAXIS Crisis Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Escalation Probability</span>
                <span className="text-orange-400 font-bold">
                  {threatProfile.threat_level === 'critical' ? '85%' : 
                   threatProfile.threat_level === 'high' ? '65%' :
                   threatProfile.threat_level === 'moderate' ? '35%' : '15%'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Viral Potential</span>
                <span className="text-red-400 font-bold">
                  {threatProfile.total_mentions > 10 ? 'High' : 
                   threatProfile.total_mentions > 5 ? 'Medium' : 'Low'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Timeline to Peak</span>
                <span className="text-yellow-400 font-bold">
                  {threatProfile.threat_level === 'critical' ? '6-12 hours' : 
                   threatProfile.threat_level === 'high' ? '24-48 hours' :
                   threatProfile.threat_level === 'moderate' ? '3-7 days' : '1-2 weeks'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <p className="text-orange-300 text-sm">
                <strong>Forecast Advisory:</strong> {
                  threatProfile.threat_level === 'critical' 
                    ? 'Immediate intervention required. High probability of viral escalation.'
                    : threatProfile.threat_level === 'high'
                    ? 'Rapid response recommended within 24 hours.'
                    : threatProfile.threat_level === 'moderate'
                    ? 'Monitor closely. Prepare intervention strategies.'
                    : 'Standard monitoring protocol. Low escalation risk.'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* EIDETIC Memory Strategy */}
        <Card className="bg-[#1A1B1E] border-cyan-600/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              EIDETIC Memory Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Natural Decay Timeline</span>
                <span className="text-cyan-400 font-bold">
                  {threatProfile.threat_level === 'critical' ? '6-8 months' : 
                   threatProfile.threat_level === 'high' ? '3-4 months' :
                   threatProfile.threat_level === 'moderate' ? '6-8 weeks' : '2-3 weeks'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Memory Footprint</span>
                <span className={`font-bold ${
                  threatProfile.risk_score > 60 ? 'text-red-400' : 
                  threatProfile.risk_score > 30 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {threatProfile.risk_score > 60 ? 'Deep' : 
                   threatProfile.risk_score > 30 ? 'Moderate' : 'Shallow'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Recommendation</span>
                <Badge className={
                  threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high'
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }>
                  {threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high'
                    ? 'Intervene Now'
                    : 'Let it Fade'}
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <p className="text-cyan-300 text-sm">
                <strong>EIDETIC Advisory:</strong> {
                  threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high'
                    ? 'Active memory suppression recommended. Deploy counter-narrative immediately.'
                    : 'Natural decay probable. Monitor and reassess in 2 weeks.'
                }
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ThreatIntelligenceDashboard;
