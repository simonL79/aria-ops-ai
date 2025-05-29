
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickCommandsProps {
  onCommandSelect: (command: string) => void;
}

export const QuickCommands = ({ onCommandSelect }: QuickCommandsProps) => {
  const quickCommands = [
    'anubis status',
    'scan threats live',
    'show threats',
    'system health',
    'live status'
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {quickCommands.map((cmd) => (
        <Button
          key={cmd}
          variant="outline"
          size="sm"
          onClick={() => onCommandSelect(cmd)}
          className="text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
        >
          {cmd}
        </Button>
      ))}
    </div>
  );
};
