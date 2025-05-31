
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Database, Link } from 'lucide-react';

export function ZeuslinkPanel() {
  const [signalBridges, setSignalBridges] = useState(12);
  const [osintSources, setOsintSources] = useState(48);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Zap className="h-5 w-5" />
          ZEUSLINK™ OSINT Signal Bridge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Signal Bridges</span>
            </div>
            <div className="text-lg font-bold text-white">{signalBridges}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">OSINT Sources</span>
            </div>
            <div className="text-lg font-bold text-white">{osintSources}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
