
import { IntelligenceAgent } from "@/types/intelligence";
import AgentCard from "./AgentCard";

interface AgentListProps {
  agents: IntelligenceAgent[];
  onToggleAgent: (agentId: string) => void;
  onActivateAgent: (agentId: string) => void;
  activatedAgent: string | null;
}

const AgentList = ({ agents, onToggleAgent, onActivateAgent, activatedAgent }: AgentListProps) => {
  if (agents.length === 0) {
    return <div className="text-center py-4">No agents found.</div>;
  }

  return (
    <div className="space-y-4">
      {agents.map(agent => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onToggle={onToggleAgent}
          onActivate={onActivateAgent}
          isActivating={agent.id === activatedAgent}
        />
      ))}
    </div>
  );
};

export default AgentList;
