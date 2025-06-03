
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Target, Zap, Database, RefreshCw } from 'lucide-react';

interface KeywordSystemHeaderProps {
  liveDataCount: number;
  isExecutingPipeline: boolean;
  onExecutePipeline: () => void;
  isTestingCIAPrecision?: boolean;
  onTestCIAPrecision?: () => void;
}

const KeywordSystemHeader = ({ 
  liveDataCount, 
  isExecutingPipeline, 
  onExecutePipeline,
  isTestingCIAPrecision = false,
  onTestCIAPrecision
}: KeywordSystemHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-purple-600" />
          A.R.I.A vX™ Keyword → Article System
        </h1>
        <p className="text-muted-foreground mt-1">
          CIA-Level Entity Recognition • Live Intelligence Processing • Strategic Counter-Narratives
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">{liveDataCount} Live Data Points</span>
        </div>

        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          CIA-Level Precision
        </Badge>

        {onTestCIAPrecision && (
          <Button 
            onClick={onTestCIAPrecision}
            disabled={isTestingCIAPrecision}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Target className={`h-4 w-4 ${isTestingCIAPrecision ? 'animate-pulse' : ''}`} />
            {isTestingCIAPrecision ? 'Testing Precision...' : 'Test CIA Precision'}
          </Button>
        )}

        <Button 
          onClick={onExecutePipeline}
          disabled={isExecutingPipeline}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          {isExecutingPipeline ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Executing Pipeline...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Execute Full Pipeline
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default KeywordSystemHeader;
