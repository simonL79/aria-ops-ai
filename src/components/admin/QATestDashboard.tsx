
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TabsContent } from '@/components/ui/tabs';
import { 
  Play, 
  AlertTriangle,
  TestTube,
  RefreshCw
} from 'lucide-react';
import { qaTestRunner, type QATestSuite } from '@/services/testing/qaTestRunner';
import { toast } from 'sonner';
import QAOverviewCards from './qa/QAOverviewCards';
import QACompliancePanel from './qa/QACompliancePanel';
import QAResultsTable from './qa/QAResultsTable';
import QAPhaseFilter from './qa/QAPhaseFilter';

const QATestDashboard = () => {
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const runQATests = async () => {
    try {
      setRunning(true);
      toast.info('🧪 Starting ARIA™ NOC QA Master Suite...', {
        description: 'Running comprehensive system health checks'
      });
      
      const results = await qaTestRunner.runFullQASuite();
      setTestSuite(results);
      
      const { passedTests, failedTests, warningTests, gdprCompliance } = results;
      
      if (failedTests > 0) {
        toast.error(`❌ QA Suite: ${failedTests} critical failures detected`, {
          description: `${warningTests} warnings, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      } else if (warningTests > 0) {
        toast.warning(`⚠️ QA Suite: ${warningTests} warnings found`, {
          description: `All tests passed with warnings, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      } else {
        toast.success('✅ QA Suite: All systems operational!', {
          description: `${passedTests}/${results.totalTests} tests passed, ${gdprCompliance.compliancePercentage}% GDPR compliant`
        });
      }
      
    } catch (error) {
      console.error('QA test suite failed:', error);
      toast.error('❌ QA test suite execution failed', {
        description: 'Check console for detailed error information'
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            ARIA™ NOC QA Master Suite
          </h2>
          <p className="text-muted-foreground">
            Daily system health monitoring • GDPR compliance • Live data validation
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runQATests} 
            disabled={running}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {running ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run QA Suite
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Test Suite Results */}
      {testSuite && (
        <>
          <QAOverviewCards testSuite={testSuite} />
          <QACompliancePanel testSuite={testSuite} />

          {/* Test Results by Phase */}
          <QAPhaseFilter 
            results={testSuite.results}
            selectedPhase={selectedPhase}
            onPhaseChange={setSelectedPhase}
          />

          <TabsContent value={selectedPhase} className="space-y-4">
            <QAResultsTable 
              results={testSuite.results}
              selectedPhase={selectedPhase}
            />
          </TabsContent>

          {/* Critical Issues Alert */}
          {testSuite.failedTests > 0 && (
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
          )}
        </>
      )}

      {/* Initial State */}
      {!testSuite && !running && (
        <Card className="text-center py-12">
          <CardContent>
            <TestTube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">ARIA™ NOC QA Master Suite</h3>
            <p className="text-muted-foreground mb-6">
              Comprehensive system health monitoring with GDPR compliance validation.
              No mock data - all tests use live system data only.
            </p>
            <Button onClick={runQATests} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Daily Health Check
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Running State */}
      {running && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Running ARIA™ NOC QA Suite...</h3>
            <p className="text-muted-foreground">
              Testing all system components with live data validation and GDPR compliance checks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QATestDashboard;
