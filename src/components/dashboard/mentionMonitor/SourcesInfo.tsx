
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader } from 'lucide-react';

interface SourcesInfoProps {
  sourcesCount: number;
  isScanning: boolean;
  onScan: () => void;
}

const SourcesInfo = ({ sourcesCount, isScanning, onScan }: SourcesInfoProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">Sources</p>
        <p className="text-sm text-muted-foreground">
          {sourcesCount} platforms connected
        </p>
      </div>
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isScanning}
          onClick={onScan}
        >
          {isScanning ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Scan Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SourcesInfo;
