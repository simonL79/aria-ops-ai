
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Send, Activity, Shield, AlertTriangle, Mic, MicOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<OperatorCommand[]>([]);
  const [responses, setResponses] = useState<OperatorResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isAdmin) {
      loadCommandHistory();
      loadResponses();
      setupVoiceRecognition();
      subscribeToRealTimeUpdates();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, responses]);

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Voice command active - speak now');
      };

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentCommand(transcript);
        toast.success(`Voice captured: "${transcript}"`);
        
        // Auto-process voice commands
        await processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        toast.error(`Voice recognition error: ${event.error}`);
      };
    }
  };

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

  const startVoiceCommand = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceCommand = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
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

  const processVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    
    try {
      // Call the voice command processing edge function
      const response = await fetch('/functions/v1/process-voice-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          command: command,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Command processed successfully');
        setCurrentCommand('');
        
        // Reload data to show new command and response
        await loadCommandHistory();
        await loadResponses();
      } else {
        throw new Error(result.error || 'Command processing failed');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Command processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    
    try {
      // Insert command directly into operator_command_log
      const { data: commandData, error: commandError } = await supabase
        .from('operator_command_log')
        .insert({
          user_id: user?.id,
          command_text: command,
          intent: determineIntent(command),
          target: extractTarget(command),
          priority: determinePriority(command),
          response_type: 'manual'
        })
        .select()
        .single();

      if (commandError) throw commandError;

      // Generate response based on command
      const response = await executeCommand(command);

      // Insert response
      await supabase
        .from('operator_response_log')
        .insert({
          command_id: commandData.id,
          response_text: response,
          processed_by: 'A.R.I.A™ Operator Console'
        });

      setCurrentCommand('');
      toast.success('Command executed');
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Command execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const determineIntent = (command: string): string => {
    const cmd = command.toLowerCase();
    if (cmd.includes('scan') || cmd.includes('monitor')) return 'scan_threats';
    if (cmd.includes('anubis') || cmd.includes('system')) return 'system_status';
    if (cmd.includes('threat') || cmd.includes('alert')) return 'threat_management';
    if (cmd.includes('status') || cmd.includes('health')) return 'health_check';
    if (cmd.includes('show') || cmd.includes('list')) return 'data_query';
    return 'general';
  };

  const extractTarget = (command: string): string => {
    const cmd = command.toLowerCase();
    if (cmd.includes('anubis')) return 'anubis_system';
    if (cmd.includes('threat')) return 'threat_scanner';
    if (cmd.includes('system')) return 'system_health';
    if (cmd.includes('live')) return 'monitoring_status';
    return 'general';
  };

  const determinePriority = (command: string): string => {
    const cmd = command.toLowerCase();
    if (cmd.includes('critical') || cmd.includes('emergency')) return 'critical';
    if (cmd.includes('urgent') || cmd.includes('high')) return 'high';
    if (cmd.includes('scan') || cmd.includes('threat')) return 'medium';
    return 'low';
  };

  const executeCommand = async (command: string): Promise<string> => {
    const cmd = command.toLowerCase();
    let response = '';

    try {
      if (cmd.includes('anubis status')) {
        const { data } = await supabase.from('anubis_state').select('*');
        const criticalIssues = data?.filter(d => d.status === 'warning').length || 0;
        response = `ANUBIS Status: ${criticalIssues} critical issues detected. ${data?.length || 0} modules monitored.`;
      }
      else if (cmd.includes('scan') && cmd.includes('threats')) {
        const { data } = await supabase
          .from('scan_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        response = `Threat scan completed. Found ${data?.length || 0} recent threats.`;
      }
      else if (cmd.includes('show') && cmd.includes('threats')) {
        const { data } = await supabase
          .from('scan_results')
          .select('*')
          .eq('severity', 'high')
          .order('created_at', { ascending: false })
          .limit(5);
        response = `${data?.length || 0} high-severity threats in queue. Latest: ${data?.[0]?.platform || 'none'}`;
      }
      else if (cmd.includes('system health')) {
        const { data: opsLog } = await supabase
          .from('aria_ops_log')
          .select('*')
          .gte('created_at', new Date(Date.now() - 3600000).toISOString());
        response = `System Health: ${opsLog?.length || 0} operations in last hour. All core modules operational.`;
      }
      else if (cmd.includes('live status')) {
        const { data } = await supabase.from('monitoring_status').select('*').limit(1);
        const isActive = data?.[0]?.is_active || false;
        response = `Live Monitoring: ${isActive ? 'ACTIVE' : 'INACTIVE'}. Last scan: ${data?.[0]?.last_run || 'never'}`;
      }
      else if (cmd.includes('boot') || cmd.includes('initialize')) {
        response = 'A.R.I.A™ Operator Console initialized. All systems nominal. Ghost Protocol active.';
      }
      else {
        response = `Command "${command}" processed. Use 'help' for available commands.`;
      }

      return response;
    } catch (error) {
      return `Error executing command: ${error}`;
    }
  };

  const getResponseForCommand = (commandId: string) => {
    return responses.find(r => r.command_id === commandId);
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
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col">
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
          <div className="text-sm text-green-500/60">
            {new Date().toLocaleString()} | {user?.email}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
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

      {/* Command Input */}
      <div className="border-t border-green-500/30 p-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">operator@aria:~$</span>
          <Input
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && processCommand(currentCommand)}
            placeholder="Enter command or use voice..."
            disabled={isProcessing}
            className="bg-transparent border-green-500/30 text-green-400 placeholder-green-600 focus:border-green-400"
          />
          <Button
            onClick={isListening ? stopVoiceCommand : startVoiceCommand}
            disabled={isProcessing}
            size="sm"
            className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => processCommand(currentCommand)}
            disabled={isProcessing || !currentCommand.trim()}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-black"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            'anubis status',
            'scan threats live',
            'show threats',
            'system health',
            'live status'
          ].map((cmd) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => setCurrentCommand(cmd)}
              className="text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
            >
              {cmd}
            </Button>
          ))}
        </div>

        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-blue-400">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm">🎤 Listening for voice command...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorConsole;
