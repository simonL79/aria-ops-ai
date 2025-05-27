
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const QARunningState = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="animate-spin h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-medium mb-2">Running ARIA™ NOC QA Suite...</h3>
        <p className="text-muted-foreground">
          Testing all system components with live data validation and GDPR compliance checks.
        </p>
      </CardContent>
    </Card>
  );
};

export default QARunningState;
