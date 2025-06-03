
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Clock } from 'lucide-react';

interface KeywordSystemHeaderProps {
  liveDataCount: number;
  isExecutingPipeline: boolean;
  onExecutePipeline: () => void;
}

const KeywordSystemHeader: React.FC<KeywordSystemHeaderProps> = ({
  liveDataCount,
  isExecutingPipeline,
  onExecutePipeline
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">A.R.I.A vX™ — Keyword-to-Article System</h1>
        <p className="text-gray-300 mt-2">
          Real-time reputation reshaping engine — Live Intelligence Only
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-400">Live Data Count</div>
          <div className="text-2xl font-bold text-corporate-accent">{liveDataCount}</div>
        </div>
        <Button
          onClick={onExecutePipeline}
          disabled={isExecutingPipeline}
          className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          {isExecutingPipeline ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Executing Pipeline...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Execute Full Pipeline
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default KeywordSystemHeader;
