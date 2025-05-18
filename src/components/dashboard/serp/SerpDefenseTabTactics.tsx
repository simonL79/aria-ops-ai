
import { Button } from "@/components/ui/button";

const SerpDefenseTabTactics = () => {
  return (
    <div className="space-y-3">
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Content Amplification</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Boost owned content visibility through strategic publishing and link building.
        </p>
        <Button size="sm" variant="outline" className="w-full">Deploy</Button>
      </div>
      
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Authority Linking</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Generate high-authority backlinks to improve domain authority.
        </p>
        <Button size="sm" variant="outline" className="w-full">Deploy</Button>
      </div>
      
      <div className="border rounded-md p-3">
        <h3 className="font-medium mb-1">Content Shield</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Create positive branded content to push down negative results.
        </p>
        <Button size="sm" className="w-full">Deploy (Recommended)</Button>
      </div>
    </div>
  );
};

export default SerpDefenseTabTactics;
