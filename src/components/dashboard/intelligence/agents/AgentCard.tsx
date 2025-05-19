
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { IntelligenceAgent } from "@/types/intelligence";
import { Check } from "lucide-react";
import { getAgentIcon } from "./AgentIcon";

interface AgentCardProps {
  agent: IntelligenceAgent;
  onToggle: (agentId: string) => void;
  onActivate: (agentId: string) => void;
  isActivating: boolean;
}

const AgentCard = ({ agent, onToggle, onActivate, isActivating }: AgentCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
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
          onCheckedChange={() => onToggle(agent.id)}
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
          onClick={() => onActivate(agent.id)}
          className="w-full"
        >
          {isActivating ? (
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
  );
};

export default AgentCard;
