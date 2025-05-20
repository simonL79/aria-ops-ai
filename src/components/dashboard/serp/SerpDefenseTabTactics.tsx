
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const SerpDefenseTabTactics = () => {
  const [deploying, setDeploying] = useState<string | null>(null);
  
  const handleDeploy = (tactic: string) => {
    // Don't allow multiple deployments at once
    if (deploying) return;
    
    // Set deploying state
    setDeploying(tactic);
    
    // Show deploying toast
    toast.loading(`Deploying ${tactic}`, {
      description: "Setting up SERP defense strategy"
    });
    
    // Simulate API call completion
    setTimeout(() => {
      // Show success
      toast.success(`${tactic} Deployed`, {
        description: `${tactic} defense strategy has been deployed successfully.`,
        action: {
          label: "View Results",
          onClick: () => toast.info("Results will be available in 24-48 hours")
        }
      });
      
      // Reset deploying state
      setDeploying(null);
    }, 2500);
  };
  
  return (
    <div className="space-y-3">
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Content Amplification</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Boost owned content visibility through strategic publishing and link building.
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          disabled={deploying !== null}
          onClick={() => handleDeploy("Content Amplification")}
        >
          {deploying === "Content Amplification" ? "Deploying..." : "Deploy"}
        </Button>
      </div>
      
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Authority Linking</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Generate high-authority backlinks to improve domain authority.
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          disabled={deploying !== null}
          onClick={() => handleDeploy("Authority Linking")}
        >
          {deploying === "Authority Linking" ? "Deploying..." : "Deploy"}
        </Button>
      </div>
      
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Content Shield</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Create positive branded content to push down negative results.
        </p>
        <Button 
          size="sm" 
          variant="action"
          className="w-full"
          disabled={deploying !== null}
          onClick={() => handleDeploy("Content Shield")}
        >
          {deploying === "Content Shield" ? "Deploying..." : "Deploy (Recommended)"}
        </Button>
      </div>
    </div>
  );
};

export default SerpDefenseTabTactics;
