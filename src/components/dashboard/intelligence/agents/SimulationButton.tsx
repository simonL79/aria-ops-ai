
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SimulationButtonProps {
  running: boolean;
  onRun: () => void;
}

const SimulationButton = ({ running: externalRunning, onRun }: SimulationButtonProps) => {
  const [internalRunning, setInternalRunning] = useState(false);
  
  // Combined running state (either from props or internal state)
  const running = externalRunning || internalRunning;
  
  const handleRun = () => {
    if (running) return;
    
    // Start internal running state
    setInternalRunning(true);
    
    // Show toast notification
    toast.info("Starting Red Team Simulation", {
      description: "Simulating potential attack vectors against your brand"
    });
    
    // Simulate some activity
    setTimeout(() => {
      // Call the parent's onRun handler
      onRun();
      
      // After 2 seconds, show results
      setTimeout(() => {
        toast.success("Simulation Complete", {
          description: "3 new vulnerabilities detected. View results in the threats panel."
        });
        
        // End internal running state
        setInternalRunning(false);
      }, 2000);
    }, 1500);
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
