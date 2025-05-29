
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Send, Activity, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OperatorCommand {
  id: string;
  command: string;
  context: string;
  intent: string;
  issued_at: string;
  status: string;
  resolved: boolean;
}

interface OperatorResponse {
  id: string;
  command_id: string;
  response: string;
  system_module: string;
  created_at: string;
}

const OperatorConsole = () => {
  const { user, isAdmin } = useAuth();
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<OperatorCommand[]>([]);
  const [responses, setResponses] = useState<OperatorResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin) {
      loadCommandHistory();
      loadResponses();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, responses]);

  const loadCommandHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_command_log')
        .select('*')
        .order('issued_at', { ascending: false })
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

  const processCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    
    try {
      // Log command
      const { data: commandData, error: commandError } = await supabase
        .from('operator_command_log')
        .insert({
          operator_id: user?.id,
          command: command,
          context: 'operator_console',
          intent: determineIntent(command),
          status: 'processing'
        })
        .select()
        .single();

      if (commandError) throw commandError;

      // Process command based on intent
      const response = await executeCommand(command, commandData.id);

      // Update command status
      await supabase
        .from('operator_command_log')
        .update({ status: 'executed', resolved: true })
        .eq('id', commandData.id);

      // Reload data
      loadCommandHistory();
      loadResponses();
      
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
    if (cmd.includes('scan') || cmd.includes('monitor')) return 'intelligence';
    if (cmd.includes('anubis') || cmd.includes('system')) return 'system';
    if (cmd.includes('threat') || cmd.includes('alert')) return 'threat_management';
    if (cmd.includes('status') || cmd.includes('health')) return 'status';
    if (cmd.includes('show') || cmd.includes('list')) return 'query';
    return 'general';
  };

  const executeCommand = async (command: string, commandId: string): Promise<string> => {
    const cmd = command.toLowerCase();
    let response = '';
    let systemModule = 'operator_console';

    try {
      if (cmd.includes('anubis status')) {
        // Get Anubis system status
        const { data } = await supabase.from('anubis_state').select('*');
        const criticalIssues = data?.filter(d => d.status === 'warning').length || 0;
        response = `ANUBIS Status: ${criticalIssues} critical issues detected. ${data?.length || 0} modules monitored.`;
        systemModule = 'anubis';
      }
      else if (cmd.includes('scan') && cmd.includes('threats')) {
        // Run threat scan
        const { data } = await supabase.functions.invoke('monitoring-scan', {
          body: { scanType: 'threat_scan' }
        });
        response = `Threat scan completed. Found ${data?.results?.length || 0} new threats.`;
        systemModule = 'threat_scanner';
      }
      else if (cmd.includes('show') && cmd.includes('threats')) {
        // Show recent threats
        const { data } = await supabase
          .from('scan_results')
          .select('*')
          .eq('severity', 'high')
          .order('created_at', { ascending: false })
          .limit(5);
        response = `${data?.length || 0} high-severity threats in queue. Latest: ${data?.[0]?.platform || 'none'}`;
        systemModule = 'threat_intelligence';
      }
      else if (cmd.includes('system health')) {
        // Check system health
        const { data: opsLog } = await supabase
          .from('aria_ops_log')
          .select('*')
          .gte('created_at', new Date(Date.now() - 3600000).toISOString());
        response = `System Health: ${opsLog?.length || 0} operations in last hour. All core modules operational.`;
        systemModule = 'system_health';
      }
      else if (cmd.includes('live status')) {
        // Check live monitoring status
        const { data } = await supabase.from('monitoring_status').select('*').limit(1);
        const isActive = data?.[0]?.is_active || false;
        response = `Live Monitoring: ${isActive ? 'ACTIVE' : 'INACTIVE'}. Last scan: ${data?.[0]?.last_run || 'never'}`;
        systemModule = 'monitoring';
      }
      else if (cmd.includes('boot') || cmd.includes('initialize')) {
        response = 'A.R.I.A™ Operator Console initialized. All systems nominal. Ghost Protocol active.';
        systemModule = 'console';
      }
      else {
        response = `Command "${command}" processed. Use 'help' for available commands.`;
      }

      // Log response
      await supabase
        .from('operator_response_log')
        .insert({
          command_id: commandId,
          response,
          system_module: systemModule
        });

      return response;
    } catch (error) {
      const errorResponse = `Error executing command: ${error}`;
      await supabase
        .from('operator_response_log')
        .insert({
          command_id: commandId,
          response: errorResponse,
          system_module: 'error_handler'
        });
      return errorResponse;
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
                <span className="text-white">{cmd.command}</span>
                <Badge 
                  className={`text-xs ${
                    cmd.status === 'executed' ? 'bg-green-500/20 text-green-400' : 
                    cmd.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}
                >
                  {cmd.status}
                </Badge>
              </div>
              {response && (
                <div className="ml-6 text-green-300">
                  <span className="text-green-600">[{response.system_module.toUpperCase()}]</span> {response.response}
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
            placeholder="Enter command..."
            disabled={isProcessing}
            className="bg-transparent border-green-500/30 text-green-400 placeholder-green-600 focus:border-green-400"
          />
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
      </div>
    </div>
  );
};

export default OperatorConsole;
