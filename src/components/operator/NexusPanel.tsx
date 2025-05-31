
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Users, Activity } from 'lucide-react';

export function NexusPanel() {
  const [agentCollaboration, setAgentCollaboration] = useState('optimal');
  const [activeAgents, setActiveAgents] = useState(24);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sky-400">
          <Network className="h-5 w-5" />
          NEXUS CORE™ Inter-Agent Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-gray-400">Collaboration</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{agentCollaboration}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Active Agents</span>
            </div>
            <div className="text-lg font-bold text-white">{activeAgents}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
