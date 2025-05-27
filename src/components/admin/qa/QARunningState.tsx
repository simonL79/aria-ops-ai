
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader } from 'lucide-react';

interface QARunningStateProps {
  progress: number;
  currentPhase?: string;
  estimatedTime?: number;
}

const QARunningState = ({ progress, currentPhase, estimatedTime }: QARunningStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin" />
          Running QA Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Progress: {Math.round(progress)}%
          </p>
          {currentPhase && (
            <p className="font-medium">
              Current Phase: {currentPhase}
            </p>
          )}
          {estimatedTime && (
            <p className="text-xs text-muted-foreground">
              Estimated time remaining: {estimatedTime}s
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QARunningState;
