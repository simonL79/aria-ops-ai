
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IntelligenceAgent } from "@/types/intelligence";
import AgentList from "./agents/AgentList";
import SimulationButton from "./agents/SimulationButton";
import { Shield, MessageSquare, Scale, Users, BarChart3 } from "lucide-react";
import { runRedTeamSimulation } from "@/services/intelligence/agentSimulationService";
import { toast } from "sonner";

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
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId ? { ...agent, active: !agent.active } : agent
      )
    );
    
    // Show toast notification when agent is toggled
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      if (!agent.active) {
        toast.success(`${agent.name} activated`, {
          description: "The agent has been added to your intelligence network"
        });
      } else {
        toast.info(`${agent.name} deactivated`, {
          description: "The agent has been removed from your intelligence network"
        });
      }
    }
  };

  const handleActivateAgent = (agentId: string) => {
    setActivatedAgent(agentId);
    
    // Get the agent that was activated
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      toast.success(`${agent.name} performed a targeted analysis`, {
        description: "Results have been added to the intelligence memory system"
      });
    }
    
    setTimeout(() => {
      setActivatedAgent(null);
    }, 2000);
  };

  const handleRunSimulation = () => {
    setRunningSimulation(true);
    
    // Use the simulation service to generate results
    setTimeout(() => {
      const results = runRedTeamSimulation(agents);
      setSimulationResults(results);
      setRunningSimulation(false);
      
      // Clear results after some time
      setTimeout(() => {
        setSimulationResults(null);
      }, 15000);
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
        {simulationResults && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <AlertTitle>Red Team Simulation Results</AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-1">
                <div>Vulnerabilities identified: <strong>{simulationResults.vulnerabilitiesFound}</strong></div>
                <div>Threats detected: <strong>{simulationResults.threatsDetected}</strong></div>
                <div className="text-sm mt-2">Top mitigation strategies:</div>
                <ul className="list-disc pl-5 text-sm">
                  {simulationResults.mitigationStrategies.slice(0, 3).map((strategy: string, i: number) => (
                    <li key={i}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
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
