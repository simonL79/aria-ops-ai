
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StrategyUpdate {
  strategy_id: string;
  status: string;
  execution_result?: any;
  updated_at: string;
}

export const useStrategyRealtime = (entityName?: string) => {
  const [updates, setUpdates] = useState<StrategyUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!entityName) return;

    console.log(`📡 Setting up real-time strategy updates for ${entityName}`);

    const channel = supabase
      .channel('strategy-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'strategy_responses',
          filter: `entity_name=eq.${entityName}`
        },
        (payload) => {
          console.log('📈 Strategy update received:', payload);
          
          const update: StrategyUpdate = {
            strategy_id: payload.new.strategy_id,
            status: payload.new.status,
            execution_result: payload.new.execution_result,
            updated_at: payload.new.updated_at
          };

          setUpdates(prev => [update, ...prev.slice(0, 9)]);

          // Show toast notification for important status changes
          if (payload.new.status === 'completed') {
            toast.success(`✅ Strategy "${payload.new.title}" completed successfully`);
          } else if (payload.new.status === 'cancelled') {
            toast.error(`❌ Strategy "${payload.new.title}" was cancelled`);
          } else if (payload.new.status === 'executing') {
            toast.info(`🚀 Strategy "${payload.new.title}" is now executing`);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'strategy_responses',
          filter: `entity_name=eq.${entityName}`
        },
        (payload) => {
          console.log('🆕 New strategy created:', payload);
          toast.info(`🎯 New strategy generated: ${payload.new.title}`);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('📡 Real-time strategy updates connected');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          console.log('📡 Real-time strategy updates disconnected');
        }
      });

    return () => {
      console.log('📡 Cleaning up real-time strategy updates');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [entityName]);

  return {
    updates,
    isConnected,
    clearUpdates: () => setUpdates([])
  };
};
