
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { QATestResult } from '@/services/testing/qaTestRunner';

interface QACriticalIssuesAlertProps {
  criticalIssues: QATestResult[];
  onViewDetails?: () => void;
}

const QACriticalIssuesAlert = ({ criticalIssues, onViewDetails }: QACriticalIssuesAlertProps) => {
  if (criticalIssues.length === 0) return null;

  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-red-800">
        Critical Issues Detected ({criticalIssues.length})
      </AlertTitle>
      <AlertDescription className="text-red-700">
        <div className="mt-2 space-y-1">
          {criticalIssues.slice(0, 3).map((issue, index) => (
            <div key={index} className="text-sm">
              • {issue.testName}: {issue.message}
            </div>
          ))}
          {criticalIssues.length > 3 && (
            <div className="text-sm italic">
              ...and {criticalIssues.length - 3} more issues
            </div>
          )}
        </div>
        {onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            onClick={onViewDetails}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            View All Issues
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default QACriticalIssuesAlert;
