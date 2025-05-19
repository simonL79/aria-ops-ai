
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { threatTypes } from "@/data/threatData";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useState } from "react";

interface ThreatsTabProps {
  onActivate: () => void;
}

const ThreatsTab = ({ onActivate }: ThreatsTabProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  
  const handleActivate = () => {
    if (analyzing) return;
    
    // Set analyzing state
    setAnalyzing(true);
    
    // Show analyzing toast
    toast.loading("Analyzing Content", {
      description: "Scanning content across all monitored sources for threats"
    });
    
    // Simulate analysis completion
    setTimeout(() => {
      // Call the parent's onActivate handler
      onActivate();
      
      // Show success
      toast.success("Threat Analysis Complete", {
        description: "Content has been analyzed successfully. View results in the analysis panel."
      });
      
      // Reset analyzing state
      setAnalyzing(false);
    }, 3000);
  };
  
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium text-sm mb-2">Detected Content Threats</h3>
        {Object.values(threatTypes).map((threat) => (
          <div key={threat.type} className="flex items-start justify-between mb-3 p-2 rounded hover:bg-gray-100">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">{threat.icon}</div>
              <div>
                <p className="text-sm font-medium">{threat.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                <p className="text-xs text-muted-foreground">{threat.description}</p>
              </div>
            </div>
            <Badge variant={threat.difficulty === 'easy' ? 'outline' : threat.difficulty === 'moderate' ? 'secondary' : 'destructive'} className="text-xs">
              {threat.difficulty}
            </Badge>
          </div>
        ))}
      </div>
      <Button 
        size="sm" 
        className="w-full" 
        onClick={handleActivate}
        disabled={analyzing}
      >
        {analyzing ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Analyzing Content...
          </>
        ) : (
          "Analyze Content"
        )}
      </Button>
    </div>
  );
};

export default ThreatsTab;
