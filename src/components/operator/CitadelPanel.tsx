
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export function CitadelPanel() {
  const [defenseStatus, setDefenseStatus] = useState('fortified');
  const [activeShields, setActiveShields] = useState(8);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Shield className="h-5 w-5" />
          CITADEL™ Defense Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Defense Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{defenseStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Active Shields</span>
            </div>
            <div className="text-lg font-bold text-white">{activeShields}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
