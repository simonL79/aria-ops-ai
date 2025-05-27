
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { QATestSuite } from '@/services/testing/qaTestRunner';

interface QACriticalIssuesAlertProps {
  testSuite: QATestSuite;
}

const QACriticalIssuesAlert = ({ testSuite }: QACriticalIssuesAlertProps) => {
  if (testSuite.failedTests === 0) {
    return null;
  }

  return (
    <Alert className="border-l-4 border-l-red-500">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>⚠️ Critical Issues Detected:</strong> {testSuite.failedTests} test(s) failed. 
        These issues may affect system functionality and should be addressed immediately.
        {testSuite.gdprCompliance.compliancePercentage < 100 && (
          <span className="block mt-1">
            <strong>GDPR Compliance:</strong> {100 - testSuite.gdprCompliance.compliancePercentage}% of compliance tests need attention.
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default QACriticalIssuesAlert;
