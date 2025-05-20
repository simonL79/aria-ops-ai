
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IntelligenceAgent } from "@/types/intelligence";
import AgentList from "./agents/AgentList";
import SimulationButton from "./agents/SimulationButton";
import { Shield, MessageSquare, Scale, Users, BarChart3 } from "lucide-react";

// Sample agent data
const initialAgents: IntelligenceAgent[] = [
  {
    id: "agent-1",
    role: "sentinel",
    name: "Disinformation Hunter",
    description: "Tracks and maps out smear campaigns across platforms",
    capabilities: ["Pattern recognition", "Source tracing", "Campaign mapping"],
    active: true,
    isAI: true,
    icon: <Shield className="h-5 w-5 text-blue-500" />,
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
    isAI: true,
    icon: <Scale className="h-5 w-5 text-amber-500" />,
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
    isAI: true,
    icon: <MessageSquare className="h-5 w-5 text-green-500" />,
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
    isAI: true,
    icon: <BarChart3 className="h-5 w-5 text-red-500" />,
    tools: ["predict", "monitor", "alert"]
  },
  {
    id: "agent-5",
    role: "outreach",
    name: "Influence Network",
    description: "Engages journalists or influencers to amplify positive messaging",
    capabilities: ["Contact management", "Pitch creation", "Relationship tracking"],
    active: false,
    isAI: false,
    icon: <Users className="h-5 w-5 text-purple-500" />,
    tools: ["contact", "compose", "track"]
  }
];

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
          <SimulationButton 
            running={runningSimulation} 
            onRun={handleRunSimulation} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="active">Active Agents</TabsTrigger>
            <TabsTrigger value="inactive">Available Agents</TabsTrigger>
          </TabsList>
        </Tabs>

        <AgentList 
          agents={filteredAgents}
          onToggleAgent={handleToggleAgent}
          onActivateAgent={handleActivateAgent}
          activatedAgent={activatedAgent}
        />
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
