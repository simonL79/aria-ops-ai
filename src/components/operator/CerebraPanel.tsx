
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';

export function CerebraPanel() {
  const [biasDetection, setBiasDetection] = useState('active');
  const [influenceEvents, setInfluenceEvents] = useState(12);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-400">
          <Brain className="h-5 w-5" />
          CEREBRA™ AI Bias Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Bias Detection</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{biasDetection}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Influence Events</span>
            </div>
            <div className="text-lg font-bold text-white">{influenceEvents}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
