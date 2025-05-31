
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Eye } from 'lucide-react';

export const LuminoscorePanel = () => {
  const [influenceScore, setInfluenceScore] = useState(78);
  const [exposureIndex, setExposureIndex] = useState(42);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Star className="h-5 w-5" />
          LUMINOSCORE™ Influence Scoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Influence Score</span>
            </div>
            <div className="text-lg font-bold text-white">{influenceScore}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Exposure Index</span>
            </div>
            <div className="text-lg font-bold text-white">{exposureIndex}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LuminoscorePanel;
