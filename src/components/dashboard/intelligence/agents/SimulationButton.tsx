
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useIntelligenceSimulation } from "@/hooks/useIntelligenceSimulation";

interface SimulationButtonProps {
  running: boolean;
  onRun: () => void;
}

const SimulationButton = ({ running: externalRunning, onRun }: SimulationButtonProps) => {
  const { isSimulating, runSimulation } = useIntelligenceSimulation({
    successMessage: "Simulation Complete",
    description: "Simulating potential attack vectors against your brand",
    onComplete: onRun
  });
  
  // Combined running state (either from props or internal state)
  const running = externalRunning || isSimulating;
  
  const handleRun = () => {
    if (running) return;
    runSimulation();
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleRun} 
      disabled={running}
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
