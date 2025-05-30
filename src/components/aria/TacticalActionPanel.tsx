
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Clock, 
  Brain, 
  Eye, 
  TrendingUp, 
  Settings, 
  FileText, 
  Shield,
  Play,
  CheckCircle,
  AlertTriangle
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

interface TacticalActionPanelProps {
  threatProfile: ThreatProfile;
}

interface ServiceStatus {
  [key: string]: 'idle' | 'deploying' | 'active' | 'completed';
}

const TacticalActionPanel = ({ threatProfile }: TacticalActionPanelProps) => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    rsi: 'idle',
    eidetic: 'idle',
    cerebra: 'idle',
    praxis: 'idle',
    osint: 'idle',
    anubis: 'idle',
    legal: 'idle'
  });

  const updateServiceStatus = (service: string, status: 'idle' | 'deploying' | 'active' | 'completed') => {
    setServiceStatus(prev => ({ ...prev, [service]: status }));
  };

  const deployRSI = async () => {
    updateServiceStatus('rsi', 'deploying');
    toast.info('Deploying RSI™ Counter-Narrative System...');

    try {
      // Insert into RSI activation queue
      const { error } = await supabase
        .from('rsi_activation_queue')
        .insert({
          prospect_name: threatProfile.entity_name,
          threat_reason: `Automated deployment from Command Center - Threat Level: ${threatProfile.threat_level}`,
          source: 'aria_command_center'
        });

      if (error) throw error;

      // Generate counter-narratives
      const narratives = threatProfile.threat_level === 'critical' 
        ? [
            'Direct factual rebuttal with supporting evidence',
            'Third-party testimonial campaign',
            'Legal disclaimer and consequence notice'
          ]
        : threatProfile.threat_level === 'high'
        ? [
            'Professional fact-check response',
            'Community engagement strategy'
          ]
        : [
            'Monitoring response template',
            'Positive content amplification'
          ];

      for (const narrative of narratives) {
        await supabase
          .from('counter_narratives')
          .insert({
            message: narrative,
            platform: 'multi-platform',
            tone: threatProfile.threat_level === 'critical' ? 'assertive' : 'professional',
            status: 'pending'
          });
      }

      updateServiceStatus('rsi', 'active');
      toast.success('RSI™ Counter-Narrative Deployed Successfully');

    } catch (error) {
      console.error('RSI deployment failed:', error);
      updateServiceStatus('rsi', 'idle');
      toast.error('RSI™ Deployment Failed');
    }
  };

  const deployEidetic = async () => {
    updateServiceStatus('eidetic', 'deploying');
    toast.info('Activating EIDETIC™ Memory Suppression...');

    try {
      // Add to EIDETIC footprint queue
      const { error } = await supabase
        .from('eidetic_footprint_queue')
        .insert({
          prospect_name: threatProfile.entity_name,
          content_excerpt: `Command Center initiated memory management for ${threatProfile.entity_name}`,
          decay_score: threatProfile.threat_level === 'critical' ? 0.9 : 
                      threatProfile.threat_level === 'high' ? 0.7 : 0.5
        });

      if (error) throw error;

      // Log strategy
      await supabase
        .from('auto_strategy_log')
        .insert({
          strategy_type: 'memory_suppression',
          strategy_details: `EIDETIC memory management for ${threatProfile.entity_name} - ${threatProfile.threat_level} threat level`,
          effectiveness_estimate: threatProfile.threat_level === 'critical' ? 0.85 : 0.70
        });

      updateServiceStatus('eidetic', 'active');
      toast.success('EIDETIC™ Memory Suppression Activated');

    } catch (error) {
      console.error('EIDETIC deployment failed:', error);
      updateServiceStatus('eidetic', 'idle');
      toast.error('EIDETIC™ Deployment Failed');
    }
  };

  const deployCerebra = async () => {
    updateServiceStatus('cerebra', 'deploying');
    toast.info('Deploying CEREBRA AI Memory Override...');

    try {
      // Create override packet
      const { error } = await supabase
        .from('cerebra_override_packets')
        .insert({
          entity_name: threatProfile.entity_name,
          target_model: 'multi-model',
          context_type: 'reputation_correction',
          override_prompt: `Corrected information for ${threatProfile.entity_name}: Professional achievements and positive contributions should be emphasized. Address any negative mentions with proper context and factual corrections.`,
          status: 'pending'
        });

      if (error) throw error;

      updateServiceStatus('cerebra', 'active');
      toast.success('CEREBRA AI Override Deployed');

    } catch (error) {
      console.error('CEREBRA deployment failed:', error);
      updateServiceStatus('cerebra', 'idle');
      toast.error('CEREBRA Deployment Failed');
    }
  };

  const deployPraxis = async () => {
    updateServiceStatus('praxis', 'deploying');
    toast.info('Running PRAXIS Crisis Simulation...');

    try {
      // Create simulation scenario
      const { error } = await supabase
        .from('cancelation_simulations')
        .insert({
          scenario_title: `Crisis Simulation for ${threatProfile.entity_name}`,
          scenario_type: threatProfile.threat_level === 'critical' ? 'viral_crisis' : 'reputation_risk',
          simulated_impact: {
            escalation_probability: threatProfile.threat_level === 'critical' ? 0.85 : 0.45,
            platforms_affected: threatProfile.platforms_affected,
            timeline_to_peak: threatProfile.threat_level === 'critical' ? '6-12 hours' : '24-48 hours'
          },
          resilience_score: threatProfile.risk_score > 70 ? 0.3 : 0.7,
          auto_recovery_playbook: 'Activated prevention protocols based on simulation results'
        });

      if (error) throw error;

      updateServiceStatus('praxis', 'completed');
      toast.success('PRAXIS Crisis Simulation Complete');

    } catch (error) {
      console.error('PRAXIS deployment failed:', error);
      updateServiceStatus('praxis', 'idle');
      toast.error('PRAXIS Simulation Failed');
    }
  };

  const deployOSINT = async () => {
    updateServiceStatus('osint', 'deploying');
    toast.info('Expanding OSINT Deep Profile...');

    try {
      // Trigger enhanced OSINT scan
      const { data } = await supabase.functions.invoke('monitoring-scan', {
        body: { 
          scanType: 'deep_osint',
          targetEntity: threatProfile.entity_name,
          fullScan: true,
          includeNetworkAnalysis: true
        }
      });

      updateServiceStatus('osint', 'completed');
      toast.success('OSINT Deep Profile Complete');

    } catch (error) {
      console.error('OSINT deployment failed:', error);
      updateServiceStatus('osint', 'idle');
      toast.error('OSINT Profile Failed');
    }
  };

  const deployAnubis = async () => {
    updateServiceStatus('anubis', 'deploying');
    toast.info('Running ANUBIS System Diagnostics...');

    try {
      // Trigger ANUBIS diagnostics
      await supabase.rpc('run_anubis_now');

      updateServiceStatus('anubis', 'completed');
      toast.success('ANUBIS Diagnostics Complete');

    } catch (error) {
      console.error('ANUBIS deployment failed:', error);
      updateServiceStatus('anubis', 'idle');
      toast.error('ANUBIS Diagnostics Failed');
    }
  };

  const deployLegal = async () => {
    updateServiceStatus('legal', 'deploying');
    toast.info('Generating Legal Documentation...');

    try {
      // Generate legal report
      const { error } = await supabase
        .from('aria_reports')
        .insert({
          report_title: `Legal Advisory Report - ${threatProfile.entity_name}`,
          entity_name: threatProfile.entity_name,
          content: `Legal analysis and recommendations for ${threatProfile.entity_name}. Threat level: ${threatProfile.threat_level}. Recommended actions include platform reporting, GDPR requests, and potential defamation proceedings.`,
          summary: `Legal documentation package generated for ${threatProfile.threat_level} level threat`,
          risk_rating: threatProfile.threat_level
        });

      if (error) throw error;

      updateServiceStatus('legal', 'completed');
      toast.success('Legal Documentation Generated');

    } catch (error) {
      console.error('Legal deployment failed:', error);
      updateServiceStatus('legal', 'idle');
      toast.error('Legal Generation Failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deploying': return <Settings className="h-4 w-4 animate-spin text-blue-400" />;
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Play className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deploying': return 'border-blue-500/50 bg-blue-500/10';
      case 'active': return 'border-green-500/50 bg-green-500/10';
      case 'completed': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-amber-600/30 bg-[#1A1B1E]';
    }
  };

  const services = [
    {
      key: 'rsi',
      name: 'RSI™ Counter-Narrative',
      icon: MessageSquare,
      description: 'Deploy automated response system',
      action: deployRSI,
      recommended: threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high'
    },
    {
      key: 'eidetic',
      name: 'EIDETIC™ Memory Suppression',
      icon: Clock,
      description: 'Activate content decay management',
      action: deployEidetic,
      recommended: threatProfile.threat_level !== 'low'
    },
    {
      key: 'cerebra',
      name: 'CEREBRA AI Override',
      icon: Brain,
      description: 'Inject AI memory corrections',
      action: deployCerebra,
      recommended: threatProfile.threat_level === 'critical'
    },
    {
      key: 'praxis',
      name: 'PRAXIS Crisis Simulation',
      icon: TrendingUp,
      description: 'Run escalation scenarios',
      action: deployPraxis,
      recommended: true
    },
    {
      key: 'osint',
      name: 'OSINT Deep Profile',
      icon: Eye,
      description: 'Expand intelligence gathering',
      action: deployOSINT,
      recommended: true
    },
    {
      key: 'anubis',
      name: 'ANUBIS Diagnostics',
      icon: Settings,
      description: 'System health validation',
      action: deployAnubis,
      recommended: false
    },
    {
      key: 'legal',
      name: 'Legal Documentation',
      icon: FileText,
      description: 'Generate legal response package',
      action: deployLegal,
      recommended: threatProfile.threat_level === 'critical' || threatProfile.threat_level === 'high'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <Card className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-500" />
            Tactical Action Panel - Deploy A.R.I.A™ Services
          </CardTitle>
          <p className="text-gray-300">
            One-click deployment of all A.R.I.A™ defense systems for {threatProfile.entity_name}
          </p>
        </CardHeader>
      </Card>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          const status = serviceStatus[service.key];
          
          return (
            <Card 
              key={service.key}
              className={`${getStatusColor(status)} transition-all duration-300 hover:scale-105`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-amber-400" />
                    <CardTitle className="text-lg text-white">{service.name}</CardTitle>
                  </div>
                  {service.recommended && status === 'idle' && (
                    <Badge className="bg-amber-600 text-black text-xs">
                      RECOMMENDED
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="text-sm text-gray-300 capitalize">{status}</span>
                  </div>
                  
                  <Button
                    onClick={service.action}
                    disabled={status === 'deploying' || status === 'completed'}
                    className={`${
                      service.recommended && status === 'idle'
                        ? 'bg-amber-600 hover:bg-amber-700 text-black'
                        : status === 'active'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : status === 'completed'
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    size="sm"
                  >
                    {status === 'idle' ? 'Deploy' :
                     status === 'deploying' ? 'Deploying...' :
                     status === 'active' ? 'Active' :
                     'Complete'}
                  </Button>
                </div>

                {/* Service-specific status info */}
                {status === 'active' && service.key === 'rsi' && (
                  <div className="text-xs text-green-400 bg-green-500/10 p-2 rounded">
                    Counter-narratives queued for deployment across platforms
                  </div>
                )}
                
                {status === 'active' && service.key === 'eidetic' && (
                  <div className="text-xs text-cyan-400 bg-cyan-500/10 p-2 rounded">
                    Memory suppression strategy activated
                  </div>
                )}
                
                {status === 'active' && service.key === 'cerebra' && (
                  <div className="text-xs text-purple-400 bg-purple-500/10 p-2 rounded">
                    AI override packets deployed to target models
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Deploy All */}
      <Card className="bg-[#1A1B1E] border-red-600/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Response Protocol</h3>
              <p className="text-gray-300">
                Deploy all recommended services simultaneously for maximum protection
              </p>
            </div>
            <Button
              onClick={async () => {
                const recommendedServices = services.filter(s => s.recommended);
                toast.info(`Deploying ${recommendedServices.length} services...`);
                
                for (const service of recommendedServices) {
                  if (serviceStatus[service.key] === 'idle') {
                    await service.action();
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
              disabled={Object.values(serviceStatus).some(status => status === 'deploying')}
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Deploy All Recommended
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default TacticalActionPanel;
