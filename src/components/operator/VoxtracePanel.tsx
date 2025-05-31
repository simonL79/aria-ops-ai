
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, Mic, AlertTriangle } from 'lucide-react';

export function VoxtracePanel() {
  const [audioThreats, setAudioThreats] = useState(3);
  const [forensicLogs, setForensicLogs] = useState(15);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-400">
          <Volume2 className="h-5 w-5" />
          VOXTRACE™ Audio Threat Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-gray-400">Audio Threats</span>
            </div>
            <div className="text-lg font-bold text-white">{audioThreats}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-400">Forensic Logs</span>
            </div>
            <div className="text-lg font-bold text-white">{forensicLogs}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
