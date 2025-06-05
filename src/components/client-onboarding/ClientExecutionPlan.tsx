
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Eye, 
  Target, 
  Zap, 
  AlertTriangle, 
  Users, 
  FileText, 
  Activity,
  Clock,
  CheckCircle2,
  PlayCircle,
  Skull
} from "lucide-react";

interface ExecutionPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'escalated';
  timeframe: string;
  description: string;
  actions: string[];
  escalationTrigger?: string;
  nuclearOption?: boolean;
}

interface ClientExecutionPlanProps {
  clientName: string;
  entityName: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

const ClientExecutionPlan: React.FC<ClientExecutionPlanProps> = ({
  clientName,
  entityName,
  threatLevel
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseStatuses, setPhaseStatuses] = useState<{[key: number]: string}>({});

  const executionPhases: ExecutionPhase[] = [
    {
      id: 'intake',
      name: 'Client Intake & Entity Fingerprinting',
      icon: <Users className="h-4 w-4" />,
      status: 'completed',
      timeframe: '24-48 hours',
      description: 'Complete client onboarding, entity mapping, and baseline threat assessment',
      actions: [
        'Submit client intake form with entity details',
        'A.R.I.A™ creates advanced entity fingerprints',
        'Map all known aliases, associates, and risk vectors',
        'Establish baseline reputation metrics',
        'Configure CIA-level precision scanning parameters'
      ]
    },
    {
      id: 'passive_monitoring',
      name: 'Passive Intelligence Gathering',
      icon: <Eye className="h-4 w-4" />,
      status: currentPhase >= 1 ? 'active' : 'pending',
      timeframe: '7-14 days',
      description: 'Deploy EIDETIC™ and RSI™ for comprehensive threat landscape mapping',
      actions: [
        'Activate never-stop autonomous monitoring',
        'Deploy EIDETIC™ memory management across platforms',
        'Scan social media, news, forums, darkweb',
        'Build threat pattern recognition profiles',
        'Generate initial threat landscape report'
      ],
      escalationTrigger: 'Threat score >7.0 or negative sentiment spike >40%'
    },
    {
      id: 'active_defense',
      name: 'Active Defense Deployment',
      icon: <Shield className="h-4 w-4" />,
      status: currentPhase >= 2 ? 'active' : 'pending',
      timeframe: '3-7 days',
      description: 'Deploy counter-narratives and reputation surface inversion',
      actions: [
        'Generate CIA-precision keyword-to-article content',
        'Deploy positive content across strategic platforms',
        'Activate RSI™ reputation surface inversion',
        'Launch influencer network amplification',
        'Deploy decoy assets for threat diversion'
      ],
      escalationTrigger: 'Continued negative momentum or coordinated attack detected'
    },
    {
      id: 'aggressive_suppression',
      name: 'Aggressive Threat Suppression',
      icon: <Target className="h-4 w-4" />,
      status: currentPhase >= 3 ? 'active' : 'pending',
      timeframe: '48-72 hours',
      description: 'Deploy ANUBIS™ pattern disruption and advanced countermeasures',
      actions: [
        'Activate ANUBIS™ auto-escalation protocols',
        'Deploy synthetic media detection and flagging',
        'Launch coordinated platform violation reports',
        'Activate darkweb monitoring agents',
        'Deploy disinformation decoys against bad actors'
      ],
      escalationTrigger: 'Threat persistence >72hrs or legal/financial impact detected'
    },
    {
      id: 'emergency_response',
      name: 'Emergency Strike Protocol',
      icon: <Zap className="h-4 w-4" />,
      status: currentPhase >= 4 ? 'active' : 'pending',
      timeframe: '12-24 hours',
      description: 'Deploy A.R.I.A™/EX Emergency Strike Engine for critical threats',
      actions: [
        'Activate Emergency Strike Engine',
        'Deploy Ghost Protocol operator intervention',
        'Launch coordinated multi-platform response',
        'Activate legal indicator tracking',
        'Deploy batch strike operations'
      ],
      escalationTrigger: 'Business-critical threat or imminent reputational catastrophe'
    },
    {
      id: 'nuclear_option',
      name: 'Nuclear Protocol Activation',
      icon: <Skull className="h-4 w-4" />,
      status: currentPhase >= 5 ? 'escalated' : 'pending',
      timeframe: '6-12 hours',
      description: 'Full-spectrum warfare deployment for existential threats',
      nuclearOption: true,
      actions: [
        'Deploy Weapons-Grade Intelligence Operations',
        'Activate Advanced Persona Saturation',
        'Launch Coordinated Disinformation Campaigns',
        'Deploy Legal Strike Teams',
        'Activate Executive Protection Protocols',
        'Full A.R.I.A™ Arsenal Deployment'
      ],
      escalationTrigger: 'Only deployed for existential threats to client survival'
    }
  ];

  const getPhaseProgress = () => {
    return Math.min(((currentPhase + 1) / executionPhases.length) * 100, 100);
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>A.R.I.A™ Defense Execution Plan</span>
            <Badge className={getThreatLevelColor(threatLevel)}>
              {threatLevel.toUpperCase()} THREAT
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium">Client:</span>
              <p className="text-lg">{clientName}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Primary Entity:</span>
              <p className="text-lg">{entityName}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Execution Progress</span>
              <span>{currentPhase + 1} of {executionPhases.length} phases</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Execution Phases */}
      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phases">Execution Phases</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="nuclear">Nuclear Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {executionPhases.map((phase, index) => (
            <Card key={phase.id} className={`${phase.nuclearOption ? 'border-red-500 bg-red-950/20' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {phase.icon}
                    <span className={phase.nuclearOption ? 'text-red-400' : ''}>
                      Phase {index + 1}: {phase.name}
                    </span>
                    {phase.nuclearOption && <Skull className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      phase.status === 'completed' ? 'default' :
                      phase.status === 'active' ? 'secondary' :
                      phase.status === 'escalated' ? 'destructive' : 'outline'
                    }>
                      {phase.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {phase.status === 'active' && <PlayCircle className="h-3 w-3 mr-1" />}
                      {phase.status === 'escalated' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {phase.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {phase.timeframe}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{phase.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Execution Actions:</h4>
                  <ul className="space-y-2">
                    {phase.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {phase.escalationTrigger && (
                  <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-500/30 rounded">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Escalation Trigger
                    </div>
                    <p className="text-sm text-yellow-300">{phase.escalationTrigger}</p>
                  </div>
                )}

                {index === currentPhase && (
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setCurrentPhase(prev => Math.min(prev + 1, executionPhases.length - 1))}>
                      Execute Phase
                    </Button>
                    {index < executionPhases.length - 1 && (
                      <Button variant="destructive" onClick={() => setCurrentPhase(executionPhases.length - 1)}>
                        Emergency Escalation
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Live Defense Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">98.7%</div>
                  <div className="text-sm text-muted-foreground">Threat Detection Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2.3s</div>
                  <div className="text-sm text-muted-foreground">Average Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-sm text-muted-foreground">Never-Stop Protection</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">47</div>
                  <div className="text-sm text-muted-foreground">Active Countermeasures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nuclear">
          <Card className="border-red-500 bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Skull className="h-5 w-5" />
                Nuclear Protocol Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-900/40 border border-red-500/50 rounded">
                  <h4 className="font-bold text-red-300 mb-2">⚠️ NUCLEAR PROTOCOLS ARE EXTREME MEASURES ⚠️</h4>
                  <p className="text-sm text-red-200">
                    These protocols are reserved for existential threats to client survival. 
                    Deployment requires executive authorization and carries significant operational risks.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-300">Nuclear Arsenal Includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Skull className="h-3 w-3 text-red-500" />
                      Advanced Persona Saturation - Coordinated positive entity flooding
                    </li>
                    <li className="flex items-center gap-2">
                      <Skull className="h-3 w-3 text-red-500" />
                      Legal Strike Teams - Coordinated legal action against bad actors
                    </li>
                    <li className="flex items-center gap-2">
                      <Skull className="h-3 w-3 text-red-500" />
                      Disinformation Campaigns - Counter-intelligence operations
                    </li>
                    <li className="flex items-center gap-2">
                      <Skull className="h-3 w-3 text-red-500" />
                      Executive Protection - Physical and digital security protocols
                    </li>
                    <li className="flex items-center gap-2">
                      <Skull className="h-3 w-3 text-red-500" />
                      Full A.R.I.A™ Arsenal - All systems at maximum aggression
                    </li>
                  </ul>
                </div>

                <Button variant="destructive" className="w-full" disabled>
                  <Skull className="h-4 w-4 mr-2" />
                  NUCLEAR PROTOCOLS REQUIRE EXECUTIVE AUTHORIZATION
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientExecutionPlan;
