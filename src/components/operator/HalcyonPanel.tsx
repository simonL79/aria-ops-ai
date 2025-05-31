
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv, AlertTriangle, CheckCircle } from 'lucide-react';

export function HalcyonPanel() {
  const [mediaStatus, setMediaStatus] = useState('monitoring');
  const [propagandaDetected, setPropagandaDetected] = useState(3);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-400">
          <Tv className="h-5 w-5" />
          HALCYON™ Media Manipulation Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Media Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{mediaStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-400">Propaganda Detected</span>
            </div>
            <div className="text-lg font-bold text-white">{propagandaDetected}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
