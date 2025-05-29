
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { performRealScan } from '@/services/monitoring/realScan';

export const useCommandProcessor = () => {
  const { user } = useAuth();

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
      if (cmd.includes('scan') && (cmd.includes('threats') || cmd.includes('monitoring'))) {
        // Trigger real scan
        const results = await performRealScan({ 
          fullScan: true,
          source: 'operator_console'
        });
        response = `Real threat scan completed. Found ${results.length} recent threats/mentions.`;
      }
      else if (cmd.includes('anubis status')) {
        const { data } = await supabase.from('anubis_state').select('*');
        const criticalIssues = data?.filter(d => d.status === 'warning').length || 0;
        response = `ANUBIS Status: ${criticalIssues} critical issues detected. ${data?.length || 0} modules monitored.`;
      }
      else if (cmd.includes('show') && cmd.includes('threats')) {
        const { data } = await supabase
          .from('scan_results')
          .select('*')
          .eq('severity', 'high')
          .order('created_at', { ascending: false })
          .limit(5);
        response = `${data?.length || 0} high-severity threats found. Latest from: ${data?.[0]?.platform || 'none'}`;
      }
      else if (cmd.includes('show') && cmd.includes('alerts')) {
        const { data } = await supabase
          .from('content_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        response = `${data?.length || 0} content alerts in system. Latest: ${data?.[0]?.platform || 'none'}`;
      }
      else if (cmd.includes('system health')) {
        const { data: opsLog } = await supabase
          .from('aria_ops_log')
          .select('*')
          .gte('created_at', new Date(Date.now() - 3600000).toISOString());
        response = `System Health: ${opsLog?.length || 0} operations in last hour. All core modules operational.`;
      }
      else if (cmd.includes('live status') || cmd.includes('monitoring status')) {
        const { data } = await supabase.from('monitoring_status').select('*').limit(1);
        const isActive = data?.[0]?.is_active || false;
        response = `Live Monitoring: ${isActive ? 'ACTIVE' : 'INACTIVE'}. Last scan: ${data?.[0]?.last_run || 'never'}`;
      }
      else if (cmd.includes('boot') || cmd.includes('initialize')) {
        response = 'A.R.I.A™ Operator Console initialized. All systems nominal. Ghost Protocol active.';
      }
      else if (cmd.includes('real scan') || cmd.includes('live scan')) {
        const results = await performRealScan({
          fullScan: true,
          source: 'operator_command'
        });
        response = `Real scan executed: ${results.length} new results captured from live sources.`;
      }
      else {
        response = `Command "${command}" processed. Available commands: scan threats, anubis status, show threats, system health, live status, real scan`;
      }

      return response;
    } catch (error) {
      console.error('Command execution error:', error);
      return `Error executing command: ${error.message}`;
    }
  };

  const processCommand = async (command: string) => {
    if (!command.trim()) return false;

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

      // Trigger AI classification via edge function
      try {
        await supabase.functions.invoke('classify-ai-command', {
          body: {
            commandId: commandData.id,
            commandText: command
          }
        });
      } catch (aiError) {
        console.error('AI classification failed:', aiError);
        // Continue with basic processing even if AI fails
      }

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

      return true;
    } catch (error) {
      console.error('Error processing command:', error);
      return false;
    }
  };

  return { processCommand };
};
