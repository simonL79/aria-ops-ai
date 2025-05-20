
import React from 'react';
import { IntelligenceLevel } from '@/types/intelligence';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SettingsTabProps {
  level: IntelligenceLevel;
  setLevel: React.Dispatch<React.SetStateAction<IntelligenceLevel>>;
  onActivate: () => void;
}

const SettingsTab = ({ level, setLevel, onActivate }: SettingsTabProps) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Intelligence Level</h3>
        <RadioGroup 
          value={level} 
          onValueChange={(value) => setLevel(value as IntelligenceLevel)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic" className="cursor-pointer">Basic</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="cursor-pointer">Advanced</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise" className="cursor-pointer">Enterprise</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Monitoring Frequency</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Hourly</span>
            <span className="text-xs font-medium">
              {level === 'enterprise' ? 'Included' : 'Enterprise Only'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Daily</span>
            <span className="text-xs font-medium">
              {level === 'basic' || level === 'advanced' || level === 'enterprise' ? 'Included' : 'Unavailable'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Weekly Summary</span>
            <span className="text-xs font-medium">
              {level === 'basic' || level === 'advanced' || level === 'enterprise' ? 'Included' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
      
      <Button 
        size="sm" 
        onClick={onActivate}
        className="w-full mt-2"
      >
        Apply Settings
      </Button>
    </div>
  );
};

export default SettingsTab;
