
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, TrendingUp } from 'lucide-react';

export function MirrorspacePanel() {
  const [behaviorIndex, setBehaviorIndex] = useState(74);
  const [influenceScore, setInfluenceScore] = useState(82);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-400">
          <Users className="h-5 w-5" />
          MIRRORSPACE™ Behavioral Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-gray-400">Behavior Index</span>
            </div>
            <div className="text-lg font-bold text-white">{behaviorIndex}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Influence Score</span>
            </div>
            <div className="text-lg font-bold text-white">{influenceScore}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
