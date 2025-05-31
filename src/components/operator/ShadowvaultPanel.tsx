
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe, AlertTriangle } from 'lucide-react';

export function ShadowvaultPanel() {
  const [darkWebStatus, setDarkWebStatus] = useState('monitoring');
  const [threatIndex, setThreatIndex] = useState(42);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Eye className="h-5 w-5" />
          SHADOWVAULT™ Dark Web Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-400">Dark Web Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{darkWebStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Threat Index</span>
            </div>
            <div className="text-lg font-bold text-white">{threatIndex}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
