
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgentRole, IntelligenceAgent } from "@/types/intelligence";
import { Shield, MessageSquare, Scale, Users, Search, BarChart3, AlertTriangle, Check, Loader } from "lucide-react";

// Sample agent data
const initialAgents: IntelligenceAgent[] = [
  {
    id: "agent-1",
    role: "sentinel",
    name: "Disinformation Hunter",
    description: "Tracks and maps out smear campaigns across platforms",
    capabilities: ["Pattern recognition", "Source tracing", "Campaign mapping"],
    active: true,
    memory: {
      incidentsAnalyzed: 124,
      decisionsRecorded: 67,
      memoryVectors: 1230
    },
    tools: ["search", "analyze", "alert"]
  },
  {
    id: "agent-2",
    role: "legal",
    name: "Legal Watchdog",
    description: "Detects libel, legal risk, and compliance issues",
    capabilities: ["Legal precedent analysis", "Risk assessment", "Regulatory compliance"],
    active: true,
    memory: {
      incidentsAnalyzed: 78,
      decisionsRecorded: 45,
      memoryVectors: 890
    },
    tools: ["analyze", "assess", "report"]
  },
  {
    id: "agent-3",
    role: "liaison",
    name: "Response Strategist",
    description: "Crafts multiple response strategies based on situation",
    capabilities: ["Tone analysis", "Audience targeting", "Multichannel strategy"],
    active: true,
    memory: {
      incidentsAnalyzed: 206,
      decisionsRecorded: 158,
      memoryVectors: 2340
    },
    tools: ["compose", "suggest", "learn"]
  },
  {
    id: "agent-4",
    role: "predictor",
    name: "Trend Forecaster",
    description: "Predicts emerging reputation threats before they spread",
    capabilities: ["Anomaly detection", "Virality prediction", "Early warning"],
    active: false,
    tools: ["predict", "monitor", "alert"]
  },
  {
    id: "agent-5",
    role: "outreach",
    name: "Influence Network",
    description: "Engages journalists or influencers to amplify positive messaging",
    capabilities: ["Contact management", "Pitch creation", "Relationship tracking"],
    active: false,
    tools: ["contact", "compose", "track"]
  }
];

// Get icon for agent role
const getAgentIcon = (role: AgentRole) => {
  switch (role) {
    case "sentinel":
      return <Shield className="h-5 w-5 text-blue-500" />;
    case "liaison":
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case "legal":
      return <Scale className="h-5 w-5 text-amber-500" />;
    case "outreach":
      return <Users className="h-5 w-5 text-purple-500" />;
    case "researcher":
      return <Search className="h-5 w-5 text-indigo-500" />;
    case "predictor":
      return <BarChart3 className="h-5 w-5 text-red-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const AgentsManagement = () => {
  const [agents, setAgents] = useState<IntelligenceAgent[]>(initialAgents);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  const [activatedAgent, setActivatedAgent] = useState<string | null>(null);

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId ? { ...agent, active: !agent.active } : agent
      )
    );
  };

  const handleActivateAgent = (agentId: string) => {
    setActivatedAgent(agentId);
    setTimeout(() => {
      setActivatedAgent(null);
    }, 2000);
  };

  const handleRunSimulation = () => {
    setRunningSimulation(true);
    setTimeout(() => {
      setRunningSimulation(false);
    }, 3000);
  };
  
  // Filter agents based on active tab
  const filteredAgents = agents.filter(agent => 
    activeTab === "active" ? agent.active : !agent.active
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Agent Network</CardTitle>
            <CardDescription>
              Autonomous agents working together to protect your brand
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRunSimulation} 
            disabled={runningSimulation}
          >
            {runningSimulation ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Running Simulation
              </>
            ) : (
              <>Run Red Team Simulation</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="active">Active Agents</TabsTrigger>
            <TabsTrigger value="inactive">Available Agents</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getAgentIcon(agent.role)}
                  <div className="ml-3">
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <Switch
                  checked={agent.active}
                  onCheckedChange={() => handleToggleAgent(agent.id)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.capabilities && agent.capabilities.map(capability => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </div>

              {agent.memory && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Analyzed</div>
                    <div className="font-medium">{agent.memory.incidentsAnalyzed}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Decisions</div>
                    <div className="font-medium">{agent.memory.decisionsRecorded}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Memory</div>
                    <div className="font-medium">{agent.memory.memoryVectors} vectors</div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleActivateAgent(agent.id)}
                  className="w-full"
                >
                  {activatedAgent === agent.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Agent Activated
                    </>
                  ) : (
                    <>Activate Individually</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex flex-col items-start space-y-2">
          <div className="text-sm">
            <strong>Agent Network Status:</strong> {agents.filter(a => a.active).length} of {agents.length} agents active
          </div>
          <div className="text-xs text-muted-foreground">
            Agents collaborate autonomously based on AI-driven intelligence workflows
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentsManagement;
