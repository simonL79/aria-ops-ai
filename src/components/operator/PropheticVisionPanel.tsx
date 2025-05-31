
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Brain, AlertTriangle } from 'lucide-react';

const PropheticVisionPanel = () => {
  const [predictionAccuracy, setPredictionAccuracy] = useState(89);
  const [futureThreats, setFutureThreats] = useState(4);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-400">
          <Brain className="h-5 w-5" />
          PROPHETIC VISION™ Predictive Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-gray-400">Prediction Accuracy</span>
            </div>
            <div className="text-lg font-bold text-white">{predictionAccuracy}%</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Future Threats</span>
            </div>
            <div className="text-lg font-bold text-white">{futureThreats}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropheticVisionPanel;
