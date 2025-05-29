
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Satellite, Activity, AlertTriangle, CheckCircle, XCircle, Eye, Radar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SensorEvent {
  id: string;
  source_type: string;
  source_detail: string | null;
  event_content: string;
  detected_at: string;
  relevance_score: number | null;
  risk_level: string | null;
  verified: boolean | null;
  created_at: string;
}

interface SystemHealth {
  id: string;
  sensor_name: string;
  last_sync: string;
  sync_status: string | null;
  diagnostic: string | null;
}

export const PanopticaPanel = () => {
  const [sensorEvents, setSensorEvents] = useState<SensorEvent[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPanopticaData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('panoptica-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'panoptica_sensor_events' },
        () => loadSensorEvents()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'panoptica_system_health' },
        () => loadSystemHealth()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadPanopticaData = async () => {
    await Promise.all([loadSensorEvents(), loadSystemHealth()]);
  };

  const loadSensorEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('panoptica_sensor_events')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSensorEvents(data || []);
    } catch (error) {
      console.error('Error loading sensor events:', error);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('panoptica_system_health')
        .select('*')
        .order('last_sync', { ascending: false })
        .limit(15);

      if (error) throw error;
      setSystemHealth(data || []);
    } catch (error) {
      console.error('Error loading system health:', error);
    }
  };

  const getRiskIcon = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Activity className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRiskColor = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getHealthIcon = (status: string | null) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getHealthColor = (status: string | null) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'warn':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'fail':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'social':
        return '🐦';
      case 'news':
        return '📰';
      case 'web':
        return '🌐';
      case 'logs':
        return '📊';
      case 'human':
        return '👤';
      default:
        return '📡';
    }
  };

  const simulateNewEvent = async () => {
    setIsLoading(true);
    try {
      const eventTypes = [
        { source: 'social', detail: 'Reddit Thread', content: 'Executive mentioned in concerning discussion thread' },
        { source: 'news', detail: 'Industry Publication', content: 'Negative coverage detected in trade publication' },
        { source: 'web', detail: 'Forum Post', content: 'Anonymous complaint about company practices' },
        { source: 'logs', detail: 'Access Monitor', content: 'Unusual login patterns detected on executive accounts' }
      ];

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      await supabase
        .from('panoptica_sensor_events')
        .insert({
          source_type: randomEvent.source,
          source_detail: randomEvent.detail,
          event_content: randomEvent.content,
          relevance_score: Math.floor(Math.random() * 40) + 60, // 60-100
          risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          verified: Math.random() > 0.5
        });

      toast.success('New sensor event simulated');
      loadSensorEvents();
    } catch (error) {
      console.error('Error simulating event:', error);
      toast.error('Failed to simulate event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sensor Events */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            PANOPTICA™ Sensor Fusion
            <Button
              size="sm"
              onClick={simulateNewEvent}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <Radar className="h-3 w-3 mr-1" />
              Simulate Event
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {sensorEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No sensor events detected</div>
          ) : (
            sensorEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <div className="text-lg">{getSourceIcon(event.source_type)}</div>
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    {event.source_detail && (
                      <span className="text-cyan-300">[{event.source_detail}] </span>
                    )}
                    {event.event_content}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.detected_at).toLocaleTimeString()} • 
                    Relevance: {event.relevance_score || 0}% • 
                    {event.verified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getRiskIcon(event.risk_level)}
                  <Badge className={getRiskColor(event.risk_level)}>
                    {event.risk_level || 'unknown'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sensor System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {systemHealth.length === 0 ? (
            <div className="text-gray-500 text-sm">No sensor health data available</div>
          ) : (
            systemHealth.map((sensor) => (
              <div key={sensor.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getHealthIcon(sensor.sync_status)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{sensor.sensor_name}</div>
                  {sensor.diagnostic && (
                    <div className="text-xs text-green-300 mb-1">{sensor.diagnostic}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date(sensor.last_sync).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getHealthColor(sensor.sync_status)}>
                  {sensor.sync_status || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
