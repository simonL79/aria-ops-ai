
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
  testSuite: QATestSuite | null;
}

const QAOverviewCards = ({ testSuite }: QAOverviewCardsProps) => {
  // Show loading state if testSuite is not available yet
  if (!testSuite) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="h-4 w-4 bg-corporate-darkSecondary rounded animate-pulse" />
                <div className="h-4 w-16 bg-corporate-darkSecondary rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-corporate-darkSecondary rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-corporate-darkSecondary rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
              <TestTube className="h-4 w-4 text-corporate-accent" />
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{testSuite.totalTests}</div>
            <p className="text-xs text-corporate-lightGray">
              {(testSuite.duration / 1000).toFixed(1)}s runtime
            </p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{testSuite.passedTests}</div>
            <p className="text-xs text-corporate-lightGray">
              {testSuite.totalTests > 0 ? Math.round((testSuite.passedTests / testSuite.totalTests) * 100) : 0}% success
            </p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
              <XCircle className="h-4 w-4 text-red-600" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{testSuite.failedTests}</div>
            <p className="text-xs text-corporate-lightGray">
              {testSuite.totalTests > 0 ? Math.round((testSuite.failedTests / testSuite.totalTests) * 100) : 0}% failure
            </p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{testSuite.warningTests}</div>
            <p className="text-xs text-corporate-lightGray">
              {testSuite.totalTests > 0 ? Math.round((testSuite.warningTests / testSuite.totalTests) * 100) : 0}% warnings
            </p>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 corporate-heading">
              <Shield className="h-4 w-4 text-blue-600" />
              GDPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testSuite.gdprCompliance.compliancePercentage}%</div>
            <p className="text-xs text-corporate-lightGray">
              {testSuite.gdprCompliance.compliantTests}/{testSuite.gdprCompliance.totalGdprTests} compliant
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card className="corporate-card mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <TrendingUp className="h-5 w-5 text-corporate-accent" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-corporate-lightGray">
              <span>Overall System Health</span>
              <span className="text-white">{testSuite.passedTests}/{testSuite.totalTests}</span>
            </div>
            <Progress 
              value={(testSuite.passedTests / testSuite.totalTests) * 100} 
              className="h-2" 
            />
            
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-corporate-lightGray">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Passed: {testSuite.passedTests}
              </span>
              <span className="flex items-center gap-1 text-corporate-lightGray">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Failed: {testSuite.failedTests}
              </span>
              <span className="flex items-center gap-1 text-corporate-lightGray">
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
