
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThreatIntelligence {
  id: string;
  source_url?: string;
  content_text: string;
  actor_alias?: string;
  entropy_score: number;
  inserted_at: string;
}

export interface Entity {
  id: string;
  name: string;
  entity_type?: string;
  risk_profile: any;
  created_at: string;
}

export interface RSIQueueItem {
  id: string;
  entity_id: string;
  threat_id?: string;
  counter_message: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'deployed' | 'completed';
  created_at: string;
  processed_at?: string;
}

export interface EventDispatch {
  id: string;
  event_type: string;
  threat_id?: string;
  entity_id?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  payload_json: any;
  dispatched: boolean;
  created_at: string;
  dispatched_at?: string;
}

class HypercoreService {
  async ingestThreatIntelligence(data: {
    source_url?: string;
    content_text: string;
    actor_alias?: string;
    entropy_score: number;
  }): Promise<ThreatIntelligence | null> {
    try {
      // For now, we'll simulate threat intelligence ingestion using activity logs
      const { data: activity, error } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'threat_intelligence_ingested',
          details: JSON.stringify(data),
          entity_type: 'threat',
          entity_id: crypto.randomUUID()
        }])
        .select()
        .single();

      if (error) throw error;

      // Return simulated threat intelligence
      const threat: ThreatIntelligence = {
        id: activity.id,
        source_url: data.source_url,
        content_text: data.content_text,
        actor_alias: data.actor_alias,
        entropy_score: data.entropy_score,
        inserted_at: activity.created_at
      };

      return threat;
    } catch (error) {
      console.error('Error ingesting threat intelligence:', error);
      toast.error('Failed to ingest threat intelligence');
      return null;
    }
  }

  async createEntity(data: {
    name: string;
    entity_type?: string;
    risk_profile?: any;
  }): Promise<Entity | null> {
    try {
      // Simulate entity creation using activity logs
      const { data: activity, error } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'entity_created',
          details: JSON.stringify(data),
          entity_type: data.entity_type || 'entity',
          entity_id: crypto.randomUUID()
        }])
        .select()
        .single();

      if (error) throw error;

      const entity: Entity = {
        id: activity.id,
        name: data.name,
        entity_type: data.entity_type,
        risk_profile: data.risk_profile || {},
        created_at: activity.created_at
      };

      return entity;
    } catch (error) {
      console.error('Error creating entity:', error);
      toast.error('Failed to create entity');
      return null;
    }
  }

  async processThreatIntelligence(threatId: string): Promise<void> {
    try {
      // Log processing initiation
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'threat_processing_initiated',
          entity_type: 'threat',
          entity_id: threatId,
          details: 'A.R.I.A™ HyperCore threat processing started'
        }]);
      
      if (error) throw error;
      
      console.log('Threat intelligence processing initiated');
      toast.success('Threat processing initiated');
    } catch (error) {
      console.error('Error processing threat intelligence:', error);
      toast.error('Failed to process threat intelligence');
    }
  }

  async getRSIQueue(limit = 20): Promise<RSIQueueItem[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'rsi_queue_item')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform activity logs to RSI queue items
      return (data || []).map(log => ({
        id: log.id,
        entity_id: log.entity_id || '',
        threat_id: log.details,
        counter_message: `RSI counter for ${log.entity_type}`,
        priority: 'normal' as const,
        status: 'pending' as const,
        created_at: log.created_at,
        processed_at: log.updated_at
      }));
    } catch (error) {
      console.error('Error fetching RSI queue:', error);
      return [];
    }
  }

  async getEventDispatchQueue(limit = 20): Promise<EventDispatch[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'event_dispatch')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform activity logs to event dispatch items
      return (data || []).map(log => ({
        id: log.id,
        event_type: log.entity_type || 'unknown',
        threat_id: log.entity_id,
        entity_id: log.entity_id,
        severity: 'medium' as const,
        payload_json: log.details ? JSON.parse(log.details) : {},
        dispatched: false,
        created_at: log.created_at,
        dispatched_at: log.updated_at
      }));
    } catch (error) {
      console.error('Error fetching event dispatch queue:', error);
      return [];
    }
  }

  async triggerManualDispatch(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('aria-hypercore-dispatch');
      
      if (error) throw error;
      
      toast.success('Manual dispatch triggered successfully');
      console.log('Dispatch result:', data);
    } catch (error) {
      console.error('Error triggering manual dispatch:', error);
      toast.error('Failed to trigger manual dispatch');
    }
  }

  async getAriaOperationsLog(limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .ilike('action', '%aria%')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ARIA operations log:', error);
      return [];
    }
  }

  async updateRSIStatus(id: string, status: RSIQueueItem['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .update({ 
          details: JSON.stringify({ status }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('RSI status updated');
    } catch (error) {
      console.error('Error updating RSI status:', error);
      toast.error('Failed to update RSI status');
    }
  }

  async simulateThreatDetection(entityName: string): Promise<void> {
    try {
      // Create a simulated threat using activity logs
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'simulated_threat_detected',
          entity_type: 'threat_simulation',
          entity_id: crypto.randomUUID(),
          details: JSON.stringify({
            entity_name: entityName,
            threat_type: 'simulated',
            actor_alias: 'SimulatedActor',
            entropy_score: 0.85,
            source_url: 'https://simulated-darkweb-source.onion'
          })
        }]);

      if (error) throw error;
      
      toast.success('Threat simulation initiated');
    } catch (error) {
      console.error('Error in threat simulation:', error);
      toast.error('Failed to simulate threat');
    }
  }
}

export const hypercoreService = new HypercoreService();
