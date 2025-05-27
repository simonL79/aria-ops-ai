
import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube, Play, RefreshCw } from 'lucide-react';

interface QATestHeaderProps {
  onRunTests: () => void;
  running: boolean;
}

const QATestHeader = ({ onRunTests, running }: QATestHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TestTube className="h-6 w-6" />
          ARIA™ NOC QA Master Suite
        </h2>
        <p className="text-muted-foreground">
          Daily system health monitoring • GDPR compliance • Live data validation
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={onRunTests} 
          disabled={running}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {running ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run QA Suite
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QATestHeader;
