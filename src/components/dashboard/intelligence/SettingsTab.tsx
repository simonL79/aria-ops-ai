
import { Button } from "@/components/ui/button";
import { IntelligenceLevel, getIntelligenceLevelColor } from "@/types/intelligence";

interface SettingsTabProps {
  level: IntelligenceLevel;
  setLevel: (level: IntelligenceLevel) => void;
  onActivate: () => void;
}

const SettingsTab = ({ level, setLevel, onActivate }: SettingsTabProps) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Intelligence Level</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={level === 'basic' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLevel('basic')}
            className={level === 'basic' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            Basic
          </Button>
          <Button 
            variant={level === 'advanced' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLevel('advanced')}
            className={level === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            Advanced
          </Button>
          <Button 
            variant={level === 'enterprise' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setLevel('enterprise')}
            className={level === 'enterprise' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            Enterprise
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {level === 'basic' ? 'Basic detection of negative content and simple patterns.' : 
           level === 'advanced' ? 'Advanced linguistic analysis and cross-platform monitoring.' :
           'Expert-level forensic analysis of coordinated campaigns and sophisticated attacks.'}
        </p>
      </div>
      <Button size="sm" className="w-full" onClick={onActivate}>
        Apply Settings
      </Button>
    </div>
  );
};

export default SettingsTab;
