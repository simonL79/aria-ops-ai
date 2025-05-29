
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff, Activity } from 'lucide-react';

interface CommandInputProps {
  currentCommand: string;
  setCurrentCommand: (command: string) => void;
  onProcessCommand: (command: string) => void;
  isProcessing: boolean;
  isListening: boolean;
  startVoiceCommand: () => void;
  stopVoiceCommand: () => void;
  isVoiceSupported: boolean;
}

export const CommandInput = ({
  currentCommand,
  setCurrentCommand,
  onProcessCommand,
  isProcessing,
  isListening,
  startVoiceCommand,
  stopVoiceCommand,
  isVoiceSupported
}: CommandInputProps) => {
  return (
    <div className="border-t border-green-500/30 p-4">
      <div className="flex items-center gap-2">
        <span className="text-blue-400">operator@aria:~$</span>
        <Input
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onProcessCommand(currentCommand)}
          placeholder="Enter command or use voice..."
          disabled={isProcessing}
          className="bg-transparent border-green-500/30 text-green-400 placeholder-green-600 focus:border-green-400"
        />
        {isVoiceSupported && (
          <Button
            onClick={isListening ? stopVoiceCommand : startVoiceCommand}
            disabled={isProcessing}
            size="sm"
            className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Button
          onClick={() => onProcessCommand(currentCommand)}
          disabled={isProcessing || !currentCommand.trim()}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-black"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {isListening && (
        <div className="mt-2 flex items-center gap-2 text-blue-400">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-sm">🎤 Listening for voice command...</span>
        </div>
      )}
    </div>
  );
};
