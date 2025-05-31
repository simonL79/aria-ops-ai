
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Activity } from 'lucide-react';

export function SentinelShieldPanel() {
  const [defenseStatus, setDefenseStatus] = useState('autonomous');
  const [blockedThreats, setBlockedThreats] = useState(156);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lime-400">
          <Shield className="h-5 w-5" />
          SENTINEL SHIELD™ Autonomous Defense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-lime-400" />
              <span className="text-sm text-gray-400">Defense Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{defenseStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Blocked Threats</span>
            </div>
            <div className="text-lg font-bold text-white">{blockedThreats}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
