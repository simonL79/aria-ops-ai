
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Target, Zap, Database, RefreshCw, Users } from 'lucide-react';

interface KeywordSystemHeaderProps {
  liveDataCount: number;
  isExecutingPipeline: boolean;
  onExecutePipeline: () => void;
  isTestingCIAPrecision?: boolean;
  onTestCIAPrecision?: () => void;
  clientCount?: number;
}

const KeywordSystemHeader = ({ 
  liveDataCount, 
  isExecutingPipeline, 
  onExecutePipeline,
  isTestingCIAPrecision = false,
  onTestCIAPrecision,
  clientCount = 0
}: KeywordSystemHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div className="space-y-3">
        <h1 className="text-4xl lg:text-5xl font-bold text-white corporate-heading flex items-center gap-3">
          <Zap className="h-10 w-10 lg:h-12 lg:w-12 text-corporate-accent" />
          A.R.I.A vX™ Keyword → Article System
        </h1>
        <p className="text-lg lg:text-xl text-corporate-lightGray corporate-subtext max-w-4xl leading-relaxed">
          CIA-Level Entity Recognition • Live Intelligence Processing • Strategic Counter-Narratives
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 bg-corporate-darkTertiary rounded-lg px-4 py-2 border border-corporate-border">
          <Users className="h-5 w-5 text-green-400" />
          <span className="text-base font-medium text-white">{clientCount} Registered Clients</span>
        </div>

        <div className="flex items-center gap-3 bg-corporate-darkTertiary rounded-lg px-4 py-2 border border-corporate-border">
          <Database className="h-5 w-5 text-blue-400" />
          <span className="text-base font-medium text-white">{liveDataCount} Live Data Points</span>
        </div>

        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-900/20 border-blue-500/30 text-blue-300">
          <Target className="h-4 w-4" />
          CIA-Level Precision
        </Badge>

        <div className="flex flex-col sm:flex-row gap-3">
          {onTestCIAPrecision && (
            <Button 
              onClick={onTestCIAPrecision}
              disabled={isTestingCIAPrecision}
              size="default"
              variant="outline"
              className="flex items-center gap-2 border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
            >
              <Target className={`h-4 w-4 ${isTestingCIAPrecision ? 'animate-pulse' : ''}`} />
              {isTestingCIAPrecision ? 'Testing Precision...' : 'Test CIA Precision'}
            </Button>
          )}

          <Button 
            onClick={onExecutePipeline}
            disabled={isExecutingPipeline}
            size="lg"
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black font-bold flex items-center gap-2 px-6 py-3 text-base"
          >
            {isExecutingPipeline ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Execute Full Pipeline ({clientCount} clients)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeywordSystemHeader;
