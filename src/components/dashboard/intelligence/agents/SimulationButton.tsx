
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SimulationButtonProps {
  running: boolean;
  onRun: () => void;
}

const SimulationButton = ({ running, onRun }: SimulationButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onRun} 
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
