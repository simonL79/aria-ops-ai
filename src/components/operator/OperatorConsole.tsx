import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Activity, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { VoiceRecognition } from './VoiceRecognition';
import { useCommandProcessor } from './CommandProcessor';
import { TerminalDisplay } from './TerminalDisplay';
import { CommandInput } from './CommandInput';
import { QuickCommands } from './QuickCommands';
import { FeedbackPanel } from './FeedbackPanel';

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

const OperatorConsole = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<OperatorCommand[]>([]);
  const [responses, setResponses] = useState<OperatorResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);
  const { processCommand } = useCommandProcessor();
  
  const voiceRecognition = VoiceRecognition({
    onTranscript: (transcript) => {
      setCurrentCommand('');
      loadCommandHistory();
      loadResponses();
    },
    disabled: isProcessing
  });

  useEffect(() => {
    if (isAdmin) {
      loadCommandHistory();
      loadResponses();
      subscribeToRealTimeUpdates();
    }
  }, [isAdmin]);

  const subscribeToRealTimeUpdates = () => {
    const channel = supabase
      .channel('operator-console-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'operator_command_log' },
        () => loadCommandHistory()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'operator_response_log' },
        () => loadResponses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadCommandHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_command_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCommandHistory(data || []);
    } catch (error) {
      console.error('Error loading command history:', error);
    }
  };

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_response_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handleProcessCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    
    const success = await processCommand(command);
    
    if (success) {
      setCurrentCommand('');
      toast.success('Command executed');
      loadCommandHistory();
      loadResponses();
    } else {
      toast.error('Command execution failed');
    }
    
    setIsProcessing(false);
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-500 mb-2">Access Denied</h3>
            <p className="text-red-400">Ghost Protocol requires administrative clearance</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex">
      {/* Main Console */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-green-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-green-400" />
              <h1 className="text-xl font-bold">A.R.I.A™ GHOST PROTOCOL</h1>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Activity className="h-3 w-3 mr-1" />
                OPERATOR CONSOLE
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:text-green-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="text-xs text-green-400 hover:text-green-300"
              >
                {showFeedback ? 'Hide' : 'Show'} Feedback
              </button>
              <div className="text-sm text-green-500/60">
                {new Date().toLocaleString()} | {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Output */}
        <TerminalDisplay
          commandHistory={commandHistory}
          responses={responses}
          isProcessing={isProcessing}
        />

        {/* Command Input */}
        <CommandInput
          currentCommand={currentCommand}
          setCurrentCommand={setCurrentCommand}
          onProcessCommand={handleProcessCommand}
          isProcessing={isProcessing}
          isListening={voiceRecognition.isListening}
          startVoiceCommand={voiceRecognition.startVoiceCommand}
          stopVoiceCommand={voiceRecognition.stopVoiceCommand}
          isVoiceSupported={voiceRecognition.isSupported}
        />

        {/* Quick Commands */}
        <QuickCommands onCommandSelect={setCurrentCommand} />
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="w-80 border-l border-green-500/30 p-4 overflow-y-auto">
          <FeedbackPanel commandHistory={commandHistory} />
        </div>
      )}
    </div>
  );
};

export default OperatorConsole;
