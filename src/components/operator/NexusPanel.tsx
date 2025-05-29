
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, MessageCircle, Command, Play, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NexusMission {
  id: string;
  mission_name: string;
  objective: string;
  agents_involved: string[];
  start_time: string;
  end_time: string | null;
  outcome: string | null;
  mission_status: string;
}

interface NexusCommunication {
  id: string;
  mission_id: string;
  agent_name: string;
  message: string;
  timestamp: string;
  context: any;
}

interface NexusCommand {
  id: string;
  target_module: string;
  command: string;
  parameters: any;
  issued_by: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const NexusPanel = () => {
  const [missions, setMissions] = useState<NexusMission[]>([]);
  const [communications, setCommunications] = useState<NexusCommunication[]>([]);
  const [commands, setCommands] = useState<NexusCommand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNexusData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('nexus-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'nexus_missions' },
        () => loadMissions()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'nexus_communications' },
        () => loadCommunications()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'nexus_command_queue' },
        () => loadCommands()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadNexusData = async () => {
    await Promise.all([loadMissions(), loadCommunications(), loadCommands()]);
  };

  const loadMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('nexus_missions')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error('Error loading missions:', error);
    }
  };

  const loadCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('nexus_communications')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(15);

      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error('Error loading communications:', error);
    }
  };

  const loadCommands = async () => {
    try {
      const { data, error } = await supabase
        .from('nexus_command_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCommands(data || []);
    } catch (error) {
      console.error('Error loading commands:', error);
    }
  };

  const getMissionStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-400" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMissionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'complete':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCommandStatusIcon = (status: string) => {
    switch (status) {
      case 'executing':
        return <Play className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCommandStatusColor = (status: string) => {
    switch (status) {
      case 'executing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getAgentColor = (agentName: string) => {
    const colors = {
      'ARIA': 'text-cyan-400',
      'RSI': 'text-orange-400',
      'EIDETIC': 'text-purple-400',
      'PANOPTICA': 'text-green-400',
      'NEXUS': 'text-blue-400'
    };
    return colors[agentName as keyof typeof colors] || 'text-gray-400';
  };

  const simulateNewMission = async () => {
    setIsLoading(true);
    try {
      const missionTypes = [
        {
          name: 'Threat Response Coordination',
          objective: 'Multi-agent response to emerging threat vector detected by PANOPTICA sensors',
          agents: ['ARIA', 'RSI', 'PANOPTICA']
        },
        {
          name: 'Memory Reconstruction Operation',
          objective: 'EIDETIC memory footprint coordination with RSI narrative containment',
          agents: ['EIDETIC', 'RSI', 'ARIA']
        },
        {
          name: 'Strategic Intelligence Fusion',
          objective: 'Cross-platform intelligence gathering and threat assessment',
          agents: ['ARIA', 'PANOPTICA', 'RSI']
        }
      ];

      const randomMission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
      
      await supabase
        .from('nexus_missions')
        .insert({
          mission_name: randomMission.name,
          objective: randomMission.objective,
          agents_involved: randomMission.agents,
          mission_status: 'active'
        });

      toast.success('New mission initiated');
      loadMissions();
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error('Failed to create mission');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAgentCommunication = async () => {
    setIsLoading(true);
    try {
      if (missions.length === 0) {
        toast.error('No active missions for communication');
        return;
      }

      const activeMission = missions.find(m => m.mission_status === 'active') || missions[0];
      const agents = ['ARIA', 'RSI', 'EIDETIC', 'PANOPTICA', 'NEXUS'];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      
      const messages = [
        'Threat vector analysis complete. Proceeding to next phase.',
        'Sensor fusion indicates elevated risk profile. Recommend immediate action.',
        'Memory reconstruction successful. Target narrative neutralized.',
        'Strategic containment protocols activated. Monitoring for effectiveness.',
        'Inter-agent coordination nominal. All systems synchronized.'
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      await supabase
        .from('nexus_communications')
        .insert({
          mission_id: activeMission.id,
          agent_name: randomAgent,
          message: randomMessage,
          context: { priority: 'high', classification: 'operational' }
        });

      toast.success('Agent communication logged');
      loadCommunications();
    } catch (error) {
      console.error('Error creating communication:', error);
      toast.error('Failed to log communication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Missions */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Network className="h-4 w-4" />
            NEXUS CORE™ Active Missions
            <Button
              size="sm"
              onClick={simulateNewMission}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-3 w-3 mr-1" />
              Initiate Mission
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {missions.length === 0 ? (
            <div className="text-gray-500 text-sm">No missions active</div>
          ) : (
            missions.map((mission) => (
              <div key={mission.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getMissionStatusIcon(mission.mission_status)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{mission.mission_name}</div>
                  <div className="text-xs text-blue-300 mb-1">{mission.objective}</div>
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <div className="flex gap-1">
                      {mission.agents_involved.map((agent, index) => (
                        <span key={index} className={`text-xs ${getAgentColor(agent)}`}>
                          {agent}{index < mission.agents_involved.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Started: {new Date(mission.start_time).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getMissionStatusColor(mission.mission_status)}>
                  {mission.mission_status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Agent Communications */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Inter-Agent Communications
            <Button
              size="sm"
              onClick={simulateAgentCommunication}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Simulate Comm
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {communications.length === 0 ? (
            <div className="text-gray-500 text-sm">No communications logged</div>
          ) : (
            communications.map((comm) => (
              <div key={comm.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <div className="text-lg">🤖</div>
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className={getAgentColor(comm.agent_name)}>[{comm.agent_name}]</span>: {comm.message}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(comm.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Command Queue */}
      <Card className="bg-black border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
            <Command className="h-4 w-4" />
            NEXUS Command Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {commands.length === 0 ? (
            <div className="text-gray-500 text-sm">No commands queued</div>
          ) : (
            commands.map((cmd) => (
              <div key={cmd.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getCommandStatusIcon(cmd.status)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-orange-300">[{cmd.target_module}]</span> {cmd.command}
                  </div>
                  {cmd.issued_by && (
                    <div className="text-xs text-orange-400 mb-1">Issued by: {cmd.issued_by}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(cmd.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getCommandStatusColor(cmd.status)}>
                  {cmd.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
