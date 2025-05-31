import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Activity } from 'lucide-react';

export const StrikecorePanel = () => {
  const [reputationScore, setReputationScore] = useState(87);
  const [recoveryActions, setRecoveryActions] = useState(5);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <Target className="h-5 w-5" />
          STRIKECORE™ Reputation Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Reputation Score</span>
            </div>
            <div className="text-lg font-bold text-white">{reputationScore}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-400">Recovery Actions</span>
            </div>
            <div className="text-lg font-bold text-white">{recoveryActions}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
