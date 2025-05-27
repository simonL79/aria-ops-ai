
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react';
import { QATestSuite } from '@/services/testing/qaTestRunner';

interface QAOverviewCardsProps {
  testSuite: QATestSuite;
}

const QAOverviewCards = ({ testSuite }: QAOverviewCardsProps) => {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testSuite.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {(testSuite.duration / 1000).toFixed(1)}s runtime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{testSuite.passedTests}</div>
            <p className="text-xs text-muted-foreground">
              {testSuite.totalTests > 0 ? Math.round((testSuite.passedTests / testSuite.totalTests) * 100) : 0}% success
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{testSuite.failedTests}</div>
            <p className="text-xs text-muted-foreground">
              {testSuite.totalTests > 0 ? Math.round((testSuite.failedTests / testSuite.totalTests) * 100) : 0}% failure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{testSuite.warningTests}</div>
            <p className="text-xs text-muted-foreground">
              {testSuite.totalTests > 0 ? Math.round((testSuite.warningTests / testSuite.totalTests) * 100) : 0}% warnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              GDPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testSuite.gdprCompliance.compliancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {testSuite.gdprCompliance.compliantTests}/{testSuite.gdprCompliance.totalGdprTests} compliant
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Overall System Health</span>
              <span>{testSuite.passedTests}/{testSuite.totalTests}</span>
            </div>
            <Progress 
              value={(testSuite.passedTests / testSuite.totalTests) * 100} 
              className="h-2" 
            />
            
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Passed: {testSuite.passedTests}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Failed: {testSuite.failedTests}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Warnings: {testSuite.warningTests}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QAOverviewCards;
