
import React, { useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface OperatorCommand {
  id: string;
  command_text: string;
  intent: string;
  target: string;
  priority: string;
  response_type: string;
  created_at: string;
}

interface OperatorResponse {
  id: string;
  command_id: string;
  response_text: string;
  processed_by: string;
  created_at: string;
}

interface TerminalDisplayProps {
  commandHistory: OperatorCommand[];
  responses: OperatorResponse[];
  isProcessing: boolean;
}

export const TerminalDisplay = ({ commandHistory, responses, isProcessing }: TerminalDisplayProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, responses]);

  const getResponseForCommand = (commandId: string) => {
    return responses.find(r => r.command_id === commandId);
  };

  return (
    <div 
      ref={terminalRef}
      className="flex-1 p-4 overflow-y-auto space-y-2 text-sm"
    >
      {/* Boot Message */}
      <div className="text-green-500">
        <span className="text-green-600">[SYSTEM]</span> A.R.I.A™ Ghost Protocol initialized...
      </div>
      <div className="text-green-500 mb-4">
        <span className="text-green-600">[SYSTEM]</span> All subsystems operational. Awaiting operator commands.
      </div>

      {/* Command History */}
      {commandHistory.map((cmd) => {
        const response = getResponseForCommand(cmd.id);
        return (
          <div key={cmd.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">operator@aria:~$</span>
              <span className="text-white">{cmd.command_text}</span>
              <Badge 
                className={`text-xs ${
                  cmd.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  cmd.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  cmd.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}
              >
                {cmd.intent}
              </Badge>
            </div>
            {response && (
              <div className="ml-6 text-green-300">
                <span className="text-green-600">[{response.processed_by}]</span> {response.response_text}
              </div>
            )}
          </div>
        );
      })}

      {isProcessing && (
        <div className="flex items-center gap-2 text-yellow-400">
          <Activity className="h-4 w-4 animate-spin" />
          <span>Processing command...</span>
        </div>
      )}
    </div>
  );
};
