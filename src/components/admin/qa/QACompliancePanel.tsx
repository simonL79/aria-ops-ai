
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield } from 'lucide-react';
import { QATestSuite } from '@/services/testing/qaTestRunner';

interface QACompliancePanelProps {
  testSuite: QATestSuite;
}

const QACompliancePanel = ({ testSuite }: QACompliancePanelProps) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          GDPR Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Compliance Score</span>
            <span className="font-medium">{testSuite.gdprCompliance.compliancePercentage}%</span>
          </div>
          <Progress 
            value={testSuite.gdprCompliance.compliancePercentage} 
            className="h-2"
          />
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Compliant: {testSuite.gdprCompliance.compliantTests}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Non-compliant: {testSuite.gdprCompliance.totalGdprTests - testSuite.gdprCompliance.compliantTests}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QACompliancePanel;
