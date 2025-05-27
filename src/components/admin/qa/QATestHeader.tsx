
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface QATestHeaderProps {
  onRunTests: () => void;
  isRunning: boolean;
  onReset?: () => void;
}

const QATestHeader = ({ onRunTests, isRunning, onReset }: QATestHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          🧪 ARIA™ NOC QA Master Suite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Comprehensive system health and compliance verification
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onRunTests}
              disabled={isRunning}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              {isRunning ? 'Running Tests...' : 'Run QA Test Suite'}
            </Button>
            
            {onReset && (
              <Button 
                onClick={onReset}
                variant="outline"
                size="lg"
                disabled={isRunning}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QATestHeader;
