
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QATestResult } from '@/services/testing/qaTestRunner';
import QAResultItem from './QAResultItem';

interface QAResultsTableProps {
  results: QATestResult[];
  selectedPhase: string;
}

const QAResultsTable = ({ results, selectedPhase }: QAResultsTableProps) => {
  const getFilteredResults = (): QATestResult[] => {
    if (selectedPhase === 'all') return results;
    return results.filter(r => r.phase === selectedPhase);
  };

  const getPhaseStats = (phase: string) => {
    const phaseResults = phase === 'all' 
      ? results 
      : results.filter(r => r.phase === phase);
      
    return {
      total: phaseResults.length,
      passed: phaseResults.filter(r => r.status === 'pass').length,
      failed: phaseResults.filter(r => r.status === 'fail').length,
      warnings: phaseResults.filter(r => r.status === 'warning').length
    };
  };

  const stats = getPhaseStats(selectedPhase);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedPhase === 'all' ? 'All Tests' : selectedPhase} Results
        </CardTitle>
        <CardDescription>
          {stats.total} tests: {stats.passed} passed, {stats.failed} failed, {stats.warnings} warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {getFilteredResults().map((result, index) => (
            <QAResultItem key={index} result={result} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QAResultsTable;
