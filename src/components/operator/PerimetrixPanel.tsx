import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Network, AlertTriangle } from 'lucide-react';

export const PerimetrixPanel = () => {
  const [networkStatus, setNetworkStatus] = useState('secure');
  const [perimeterEvents, setPerimeterEvents] = useState(3);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Network className="h-5 w-5" />
          PERIMETRIX™ Network Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Network Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{networkStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Perimeter Events</span>
            </div>
            <div className="text-lg font-bold text-white">{perimeterEvents}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
