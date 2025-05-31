
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCommandProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processCommand = async (command: string): Promise<boolean> => {
    if (!command.trim()) return false;

    setIsProcessing(true);
    
    try {
      console.log('Processing command:', command);

      // Log the command
      await supabase.from('activity_logs').insert({
        action: 'voice_command_processed',
        details: `Command: ${command}`,
        entity_type: 'operator_command'
      });

      // Simple command classification
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('scan') || lowerCommand.includes('monitor')) {
        return await handleScanCommand(command);
      } else if (lowerCommand.includes('status') || lowerCommand.includes('report')) {
        return await handleStatusCommand(command);
      } else if (lowerCommand.includes('alert') || lowerCommand.includes('threat')) {
        return await handleAlertCommand(command);
      }

      // Default response for unrecognized commands
      await supabase.from('activity_logs').insert({
        action: 'command_response',
        details: `Command processed: ${command}`,
        entity_type: 'operator_response'
      });

      return true;

    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Command processing failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanCommand = async (command: string): Promise<boolean> => {
    try {
      // Use scan_results table to simulate scan operations
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      await supabase.from('activity_logs').insert({
        action: 'scan_initiated',
        details: `Scan command executed: ${command}. Found ${data?.length || 0} recent results.`,
        entity_type: 'scan_operation'
      });

      return true;
    } catch (error) {
      console.error('Error handling scan command:', error);
      return false;
    }
  };

  const handleStatusCommand = async (command: string): Promise<boolean> => {
    try {
      // Check system status using existing tables
      const { data, error } = await supabase
        .from('scan_results')
        .select('status, severity')
        .limit(10);

      if (error) throw error;

      const statusSummary = data?.reduce((acc, item) => {
        acc[item.status || 'unknown'] = (acc[item.status || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      await supabase.from('activity_logs').insert({
        action: 'status_report',
        details: `Status report generated: ${JSON.stringify(statusSummary)}`,
        entity_type: 'system_status'
      });

      return true;
    } catch (error) {
      console.error('Error handling status command:', error);
      return false;
    }
  };

  const handleAlertCommand = async (command: string): Promise<boolean> => {
    try {
      // Create alert notification
      await supabase.from('aria_notifications').insert({
        event_type: 'operator_alert',
        summary: `Manual alert triggered: ${command}`,
        priority: 'high',
        entity_name: 'System'
      });

      await supabase.from('activity_logs').insert({
        action: 'alert_created',
        details: `Alert command processed: ${command}`,
        entity_type: 'alert_system'
      });

      return true;
    } catch (error) {
      console.error('Error handling alert command:', error);
      return false;
    }
  };

  return {
    processCommand,
    isProcessing
  };
};
