
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Scan } from 'lucide-react';

interface GraveyardHeaderProps {
  isScanning: boolean;
  onScanForLegacyContent: () => void;
}

const GraveyardHeader = ({ isScanning, onScanForLegacyContent }: GraveyardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trash2 className="h-8 w-8 text-red-600" />
          GRAVEYARD™ Legacy Signal Suppressor
        </h1>
        <p className="text-muted-foreground">
          Advanced legacy content identification and suppression system
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onScanForLegacyContent} disabled={isScanning}>
          <Scan className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan for Legacy Content'}
        </Button>
      </div>
    </div>
  );
};

export default GraveyardHeader;
