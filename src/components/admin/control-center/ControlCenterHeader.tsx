
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ControlCenterHeaderProps {
  selectedEntity: string;
  quickConsoleOpen: boolean;
  setQuickConsoleOpen: (open: boolean) => void;
}

const ControlCenterHeader: React.FC<ControlCenterHeaderProps> = ({
  selectedEntity,
  quickConsoleOpen,
  setQuickConsoleOpen
}) => {
  return (
    <div className="bg-corporate-darkSecondary border-b border-corporate-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-corporate-accent">
            A.R.I.A™ Control Center
          </h1>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <Zap className="h-3 w-3 mr-1" />
            LIVE OPERATIONS
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setQuickConsoleOpen(!quickConsoleOpen)}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Command
          </Button>
          <div className="text-sm text-corporate-lightGray">
            Entity: {selectedEntity || 'None Selected'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlCenterHeader;
