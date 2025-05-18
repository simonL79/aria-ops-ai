
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { threatTypes } from "@/data/threatData";

interface ThreatsTabProps {
  onActivate: () => void;
}

const ThreatsTab = ({ onActivate }: ThreatsTabProps) => {
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
      <Button size="sm" className="w-full" onClick={onActivate}>
        Analyze Content
      </Button>
    </div>
  );
};

export default ThreatsTab;
