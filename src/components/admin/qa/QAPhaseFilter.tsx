
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QATestResult } from '@/services/testing/qaTestRunner';

interface QAPhaseFilterProps {
  results: QATestResult[];
  selectedPhase: string;
  onPhaseChange: (phase: string) => void;
}

const QAPhaseFilter = ({ results, selectedPhase, onPhaseChange }: QAPhaseFilterProps) => {
  const getPhases = (): string[] => {
    const phases = [...new Set(results.map(r => r.phase))];
    return ['all', ...phases];
  };

  return (
    <Tabs value={selectedPhase} onValueChange={onPhaseChange}>
      <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full">
        {getPhases().map((phase) => (
          <TabsTrigger key={phase} value={phase} className="text-xs">
            {phase === 'all' ? 'All' : phase.replace('Phase ', 'P')}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default QAPhaseFilter;
