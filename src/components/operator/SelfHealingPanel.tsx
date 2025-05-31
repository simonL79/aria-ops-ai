
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, RefreshCw, CheckCircle } from 'lucide-react';

export const SelfHealingPanel = () => {
  const [healingStatus, setHealingStatus] = useState('active');
  const [autoRepairs, setAutoRepairs] = useState(7);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Heart className="h-5 w-5" />
          Self-Healing System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{healingStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Auto Repairs</span>
            </div>
            <div className="text-lg font-bold text-white">{autoRepairs}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
