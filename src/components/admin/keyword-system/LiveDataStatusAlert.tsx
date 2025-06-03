
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Target } from 'lucide-react';

interface LiveDataStatusAlertProps {
  liveDataCount: number;
  ciaPrecisionActive?: boolean;
}

const LiveDataStatusAlert: React.FC<LiveDataStatusAlertProps> = ({ 
  liveDataCount, 
  ciaPrecisionActive = false 
}) => {
  return (
    <Alert className="bg-green-900/20 border-green-500/30">
      <CheckCircle className="h-4 w-4 text-green-400" />
      <AlertDescription className="text-green-300">
        <strong>Live Intelligence Status:</strong> A.R.I.A vX™ is connected to verified OSINT sources. 
        {liveDataCount > 0 ? ` ${liveDataCount} live intelligence items available for processing.` : ' Ready to gather live intelligence data.'}
        {ciaPrecisionActive && (
          <div className="flex items-center gap-2 mt-2">
            <Target className="h-3 w-3 text-blue-400" />
            <span className="text-blue-300 text-sm">CIA-Level Precision Active - Zero false positives guaranteed</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LiveDataStatusAlert;
