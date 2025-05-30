
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { qaTestRunner, type QATestSuite } from '@/services/testing/qaTestRunner';
import { toast } from 'sonner';
import QATestHeader from './qa/QATestHeader';
import QAOverviewCards from './qa/QAOverviewCards';
import QACompliancePanel from './qa/QACompliancePanel';
import QAResultsTable from './qa/QAResultsTable';
import QAInitialState from './qa/QAInitialState';
import QARunningState from './qa/QARunningState';
import QACriticalIssuesAlert from './qa/QACriticalIssuesAlert';

const QATestDashboard = () => {
  const [testSuite, setTestSuite] = useState<QATestSuite | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [progress, setProgress] = useState(0);

  const runQATests = async () => {
    try {
      setRunning(true);
      setProgress(0);
      toast.info('🧪 Starting ARIA™ NOC QA Master Suite...', {
        description: 'Running comprehensive system health checks'
      });
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const results = await qaTestRunner.runFullQASuite();
      setProgress(100);
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
      setProgress(0);
    }
  };

  const resetResults = () => {
    setTestSuite(null);
    setProgress(0);
  };

  const getCriticalIssues = () => {
    if (!testSuite) return [];
    return testSuite.results.filter(result => result.status === 'fail');
  };

  const getPhases = () => {
    if (!testSuite) return [];
    const phases = [...new Set(testSuite.results.map(result => result.phase))];
    return ['all', ...phases];
  };

  const getFilteredResults = () => {
    if (!testSuite) return [];
    if (selectedPhase === 'all') return testSuite.results;
    return testSuite.results.filter(result => result.phase === selectedPhase);
  };

  return (
    <div className="space-y-6">
      <QATestHeader 
        onRunTests={runQATests} 
        isRunning={running}
        onReset={resetResults}
      />

      {testSuite && (
        <>
          <QAOverviewCards testSuite={testSuite} />
          <QACompliancePanel testSuite={testSuite} />

          <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="space-y-4">
            <TabsList className="grid w-full grid-cols-auto">
              {getPhases().map((phase) => (
                <TabsTrigger key={phase} value={phase} className="capitalize">
                  {phase === 'all' ? 'All Phases' : phase}
                </TabsTrigger>
              ))}
            </TabsList>

            {getPhases().map((phase) => (
              <TabsContent key={phase} value={phase} className="space-y-4">
                <QAResultsTable 
                  results={getFilteredResults()}
                  selectedPhase={selectedPhase}
                />
              </TabsContent>
            ))}
          </Tabs>

          <QACriticalIssuesAlert 
            criticalIssues={getCriticalIssues()}
          />
        </>
      )}

      {!testSuite && !running && (
        <QAInitialState />
      )}

      {running && (
        <QARunningState 
          progress={progress}
          currentPhase="Running comprehensive tests..."
          estimatedTime={Math.max(30 - Math.floor(progress / 3), 5)}
        />
      )}
    </div>
  );
};

export default QATestDashboard;
