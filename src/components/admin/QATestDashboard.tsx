
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
    <div className="space-y-8 max-w-7xl mx-auto bg-black text-white">
      <QATestHeader 
        onRunTests={runQATests} 
        isRunning={running}
        onReset={resetResults}
      />

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

      {testSuite && (
        <div className="space-y-8">
          <QAOverviewCards testSuite={testSuite} />
          
          <QACompliancePanel testSuite={testSuite} />

          <QACriticalIssuesAlert 
            criticalIssues={getCriticalIssues()}
          />

          <div className="w-full">
            <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="w-full">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 w-full mb-6 bg-gray-900 border border-gray-800">
                {getPhases().map((phase) => (
                  <TabsTrigger key={phase} value={phase} className="text-xs px-2 text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                    {phase === 'all' ? 'All Phases' : phase.replace('Phase ', 'P')}
                  </TabsTrigger>
                ))}
              </TabsList>

              {getPhases().map((phase) => (
                <TabsContent key={phase} value={phase} className="mt-6">
                  <QAResultsTable 
                    results={getFilteredResults()}
                    selectedPhase={selectedPhase}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default QATestDashboard;
