
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { qaTestRunner, type QATestSuite } from '@/services/testing/qaTestRunner';
import { toast } from 'sonner';
import QATestHeader from './qa/QATestHeader';
import QAOverviewCards from './qa/QAOverviewCards';
import QACompliancePanel from './qa/QACompliancePanel';
import QAResultsTable from './qa/QAResultsTable';
import QAPhaseFilter from './qa/QAPhaseFilter';
import QAInitialState from './qa/QAInitialState';
import QARunningState from './qa/QARunningState';
import QACriticalIssuesAlert from './qa/QACriticalIssuesAlert';

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
      <QATestHeader onRunTests={runQATests} running={running} />

      {testSuite && (
        <>
          <QAOverviewCards testSuite={testSuite} />
          <QACompliancePanel testSuite={testSuite} />

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

          <QACriticalIssuesAlert testSuite={testSuite} />
        </>
      )}

      {!testSuite && !running && (
        <QAInitialState onRunTests={runQATests} />
      )}

      {running && <QARunningState />}
    </div>
  );
};

export default QATestDashboard;
