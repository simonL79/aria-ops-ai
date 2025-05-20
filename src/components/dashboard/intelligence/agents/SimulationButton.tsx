
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useIntelligenceSimulation } from "@/hooks/useIntelligenceSimulation";
import { useState } from "react";
import { runRedTeamSimulation } from "@/services/intelligence";

interface SimulationButtonProps {
  running: boolean;
  onRun: () => void;
}

const SimulationButton = ({ running: externalRunning, onRun }: SimulationButtonProps) => {
  const [results, setResults] = useState<{
    vulnerabilities: string[];
    mitigations: string[];
  } | null>(null);
  
  const { isSimulating, runSimulation } = useIntelligenceSimulation({
    successMessage: "Simulation Complete",
    description: "Simulating potential attack vectors against your brand",
    onComplete: () => {
      onRun();
      
      // Show results in toast with more detail
      if (results) {
        results.vulnerabilities.forEach((vuln, i) => {
          const mitigation = results.mitigations[i];
          
          setTimeout(() => {
            toast.info(`Vulnerability ${i+1}: ${vuln}`, {
              description: `Mitigation: ${mitigation}`,
              duration: 5000
            });
          }, i * 1000); // Stagger the toasts
        });
      }
    }
  });
  
  // Combined running state (either from props or internal state)
  const running = externalRunning || isSimulating;
  
  const handleRun = async () => {
    if (running) return;
    
    // Start the simulation UI
    runSimulation();
    
    try {
      // Actually run the simulation
      const simulationResults = await runRedTeamSimulation();
      
      if (simulationResults.success) {
        setResults({
          vulnerabilities: simulationResults.vulnerabilities,
          mitigations: simulationResults.mitigations
        });
      }
    } catch (error) {
      toast.error("Simulation failed", {
        description: "There was an error running the red team simulation"
      });
      console.error("Simulation error:", error);
    }
  };
  
  return (
    <Button 
      variant="action" 
      onClick={handleRun} 
      disabled={running}
      className="font-medium"
    >
      {running ? (
        <>
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Running Simulation
        </>
      ) : (
        <>Run Red Team Simulation</>
      )}
    </Button>
  );
};

export default SimulationButton;
