
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Clock, 
  Shield, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  FileText
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

interface StrategicGuidancePanelProps {
  threatProfile: ThreatProfile;
}

const StrategicGuidancePanel = ({ threatProfile }: StrategicGuidancePanelProps) => {
  const generateCounterNarrativeStrategy = () => {
    if (threatProfile.threat_level === 'critical') {
      return {
        priority: 'IMMEDIATE',
        approach: 'Multi-platform aggressive counter-narrative',
        messages: [
          'Direct factual rebuttal with evidence',
          'Third-party testimonials and endorsements',
          'Legal disclaimer and threat of action',
          'Positive content amplification campaign'
        ],
        tone: 'Assertive but professional',
        timeline: 'Deploy within 2 hours'
      };
    } else if (threatProfile.threat_level === 'high') {
      return {
        priority: 'URGENT',
        approach: 'Rapid response with fact-checking',
        messages: [
          'Clear factual correction',
          'Supporting evidence and documentation',
          'Community engagement and support'
        ],
        tone: 'Firm but respectful',
        timeline: 'Deploy within 24 hours'
      };
    } else if (threatProfile.threat_level === 'moderate') {
      return {
        priority: 'PLANNED',
        approach: 'Strategic positioning and monitoring',
        messages: [
          'Subtle clarifications where appropriate',
          'Positive content creation',
          'Community relationship building'
        ],
        tone: 'Professional and educational',
        timeline: 'Deploy within 48-72 hours'
      };
    } else {
      return {
        priority: 'MONITORING',
        approach: 'Watchful waiting with prepared responses',
        messages: [
          'Monitor for escalation',
          'Prepare template responses',
          'Continue positive content strategy'
        ],
        tone: 'Neutral monitoring',
        timeline: 'Response templates ready, deploy if needed'
      };
    }
  };

  const generateMemorySuppressionPlan = () => {
    if (threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high') {
      return {
        strategy: 'Active Suppression',
        tactics: [
          'SEO optimization with positive content',
          'Social media algorithm manipulation',
          'Content amplification of positive mentions',
          'Strategic hashtag and keyword management'
        ],
        timeline: '3-6 months aggressive campaign',
        success_probability: '85%'
      };
    } else {
      return {
        strategy: 'Natural Decay Acceleration',
        tactics: [
          'Minimal intervention to avoid Streisand effect',
          'Positive content creation without direct reference',
          'Community engagement on unrelated topics',
          'Time-based decay monitoring'
        ],
        timeline: '2-4 months passive approach',
        success_probability: '70%'
      };
    }
  };

  const generateAIOverrideStrategy = () => {
    return {
      targets: ['GPT-3.5/4', 'Claude', 'Bard', 'Other LLMs'],
      approach: 'Memory override packet injection',
      content: [
        'Corrected biographical information',
        'Positive achievement highlights',
        'Context for any negative mentions',
        'Professional accomplishments emphasis'
      ],
      effectiveness: '72% average response correction',
      duration: 'Ongoing with monthly updates'
    };
  };

  const counterNarrative = generateCounterNarrativeStrategy();
  const memoryPlan = generateMemorySuppressionPlan();
  const aiStrategy = generateAIOverrideStrategy();

  return (
    <div className="space-y-6">
      
      {/* Main Recommendations */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-500" />
            Autonomous Strategic Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {threatProfile.recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.includes('IMMEDIATE') 
                    ? 'bg-red-500/10 border-l-red-500' 
                    : rec.includes('URGENT')
                    ? 'bg-orange-500/10 border-l-orange-500'
                    : 'bg-blue-500/10 border-l-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {rec.includes('IMMEDIATE') ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  )}
                  <p className="text-gray-300 text-sm">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RSI Counter-Narrative Strategy */}
        <Card className="bg-[#1A1B1E] border-green-600/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              RSI™ Counter-Narrative Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Priority Level</span>
              <Badge className={`${
                counterNarrative.priority === 'IMMEDIATE' ? 'bg-red-500' :
                counterNarrative.priority === 'URGENT' ? 'bg-orange-500' :
                counterNarrative.priority === 'PLANNED' ? 'bg-yellow-500' : 'bg-blue-500'
              } text-white`}>
                {counterNarrative.priority}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Approach</h4>
              <p className="text-gray-300 text-sm">{counterNarrative.approach}</p>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Message Strategy</h4>
              <ul className="space-y-1">
                {counterNarrative.messages.map((msg, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    {msg}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Tone:</span>
                <p className="text-white">{counterNarrative.tone}</p>
              </div>
              <div>
                <span className="text-gray-400">Timeline:</span>
                <p className="text-white">{counterNarrative.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EIDETIC Memory Suppression */}
        <Card className="bg-[#1A1B1E] border-cyan-600/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              EIDETIC™ Memory Suppression Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Strategy Type</span>
              <Badge className={`${
                memoryPlan.strategy === 'Active Suppression' ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}>
                {memoryPlan.strategy}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Tactical Approach</h4>
              <ul className="space-y-1">
                {memoryPlan.tactics.map((tactic, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    {tactic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Timeline:</span>
                <p className="text-white">{memoryPlan.timeline}</p>
              </div>
              <div>
                <span className="text-gray-400">Success Rate:</span>
                <p className="text-green-400 font-bold">{memoryPlan.success_probability}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CEREBRA AI Override Strategy */}
        <Card className="bg-[#1A1B1E] border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              CEREBRA AI Override Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Target AI Models</h4>
              <div className="flex flex-wrap gap-2">
                {aiStrategy.targets.map((target, index) => (
                  <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                    {target}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Override Content</h4>
              <ul className="space-y-1">
                {aiStrategy.content.map((item, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Effectiveness:</span>
                <p className="text-purple-400 font-bold">{aiStrategy.effectiveness}</p>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <p className="text-white">{aiStrategy.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OSINT & Legal Advisory */}
        <Card className="bg-[#1A1B1E] border-orange-600/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              OSINT & Legal Advisory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">OSINT Intelligence</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">
                  • Network analysis of threat actors
                </li>
                <li className="text-gray-300 text-sm">
                  • Source credibility assessment
                </li>
                <li className="text-gray-300 text-sm">
                  • Relationship mapping and influence tracking
                </li>
                <li className="text-gray-300 text-sm">
                  • Platform-specific threat vectors
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Legal Recommendations</h4>
              <div className="space-y-2">
                {threatProfile.threat_level === 'critical' && (
                  <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-red-300 text-sm">
                      <strong>Immediate:</strong> Prepare cease & desist letters, document evidence for defamation case
                    </p>
                  </div>
                )}
                {threatProfile.threat_level === 'high' && (
                  <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded">
                    <p className="text-orange-300 text-sm">
                      <strong>Urgent:</strong> Legal notice to platforms, evidence preservation
                    </p>
                  </div>
                )}
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                  <p className="text-blue-300 text-sm">
                    <strong>Standard:</strong> GDPR requests for data removal, platform reporting
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default StrategicGuidancePanel;
