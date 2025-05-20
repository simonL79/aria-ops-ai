
import { IntelligenceAgent } from "@/types/intelligence";
import { toast } from "sonner";

/**
 * Run a red team simulation with the active agents
 * 
 * @param agents List of all intelligence agents
 * @returns A summary of the simulation results
 */
export const runRedTeamSimulation = (agents: IntelligenceAgent[]): {
  vulnerabilitiesFound: number;
  threatsDetected: number;
  mitigationStrategies: string[];
} => {
  // Count active agents
  const activeAgents = agents.filter(agent => agent.active);
  
  if (activeAgents.length === 0) {
    toast.error("No active agents available", {
      description: "Activate at least one agent to run a simulation"
    });
    return {
      vulnerabilitiesFound: 0,
      threatsDetected: 0,
      mitigationStrategies: []
    };
  }
  
  // Generate simulation results based on active agents
  // In a real app, this would involve complex processing and API calls
  const baseVulnerabilities = Math.floor(Math.random() * 3) + 1; // 1-3
  const vulnerabilitiesFound = baseVulnerabilities + Math.min(activeAgents.length, 5);
  
  const hasPredictor = activeAgents.some(a => a.role === 'predictor');
  const hasSentinel = activeAgents.some(a => a.role === 'sentinel');
  const hasLegal = activeAgents.some(a => a.role === 'legal');
  
  const threatsDetected = hasSentinel ? vulnerabilitiesFound + 2 : vulnerabilitiesFound - 1;
  
  // Generate mitigation strategies based on active agent types
  const mitigationStrategies: string[] = [];
  
  if (hasPredictor) {
    mitigationStrategies.push(
      "Preemptive content strategy for likely attack vectors",
      "Early warning system for emerging threats"
    );
  }
  
  if (hasSentinel) {
    mitigationStrategies.push(
      "Targeted monitoring of identified threat sources",
      "Pattern recognition for improved future detection"
    );
  }
  
  if (hasLegal) {
    mitigationStrategies.push(
      "Legal response template for specific violations",
      "Compliance framework updates to address vulnerabilities"
    );
  }
  
  // Add general strategies regardless of agents
  mitigationStrategies.push(
    "Security posture improvements for digital assets",
    "Enhanced monitoring for identified vulnerabilities"
  );
  
  return {
    vulnerabilitiesFound,
    threatsDetected,
    mitigationStrategies
  };
};
