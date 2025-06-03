
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Zap, 
  Clock,
  Search,
  Database,
  Activity
} from 'lucide-react';

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
    <div className="space-y-6 relative z-10">
      {/* A.R.I.A vX™ Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30 relative z-20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-corporate-accent flex items-center gap-2">
                <Target className="h-6 w-6" />
                A.R.I.A vX™ — Entity-Specific Intelligence System
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Precision threat reconnaissance with entity-targeted scanning and counter-narrative deployment
              </p>
            </div>
            <Badge className="bg-corporate-accent/20 text-corporate-accent border-corporate-accent/50">
              LIVE OSINT ENGINE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pipeline Execution */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">{liveDataCount}</span>
                <span className="text-gray-400">Live Intelligence Items</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-corporate-accent" />
                <span className="text-corporate-accent font-medium">Entity-Targeted Scanning</span>
              </div>
            </div>
            
            <Button
              onClick={onExecutePipeline}
              disabled={isExecutingPipeline}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90 disabled:opacity-50 disabled:cursor-not-allowed relative z-30"
              type="button"
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

          {/* Entity-Specific Search Alert */}
          <Alert className="bg-blue-500/10 border-blue-500/50">
            <Search className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              <strong>Entity-Targeted Intelligence:</strong> All searches now use strict entity filtering. 
              Results are filtered to only include content mentioning your specific target entity, 
              eliminating false positives and irrelevant content.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordSystemHeader;
