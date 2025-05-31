
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Database } from 'lucide-react';

export function CitadelPanel() {
  const [infrastructureStatus, setInfrastructureStatus] = useState('reinforced');
  const [policyVaults, setPolicyVaults] = useState(12);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-400">
          <Shield className="h-5 w-5" />
          CITADEL™ Infrastructure Reinforcement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-gray-400">Infrastructure</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{infrastructureStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Policy Vaults</span>
            </div>
            <div className="text-lg font-bold text-white">{policyVaults}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
