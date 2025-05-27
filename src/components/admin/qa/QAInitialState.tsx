
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, Play } from 'lucide-react';

interface QAInitialStateProps {
  onRunTests: () => void;
}

const QAInitialState = ({ onRunTests }: QAInitialStateProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <TestTube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">ARIA™ NOC QA Master Suite</h3>
        <p className="text-muted-foreground mb-6">
          Comprehensive system health monitoring with GDPR compliance validation.
          No mock data - all tests use live system data only.
        </p>
        <Button onClick={onRunTests} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Play className="h-4 w-4 mr-2" />
          Start Daily Health Check
        </Button>
      </CardContent>
    </Card>
  );
};

export default QAInitialState;
