
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Target } from 'lucide-react';

export function PolarisPanel() {
  const [narrativeStatus, setNarrativeStatus] = useState('active');
  const [counterNarratives, setCounterNarratives] = useState(23);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Star className="h-5 w-5" />
          POLARIS™ Counter-Narrative Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{narrativeStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Counter-Narratives</span>
            </div>
            <div className="text-lg font-bold text-white">{counterNarratives}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
