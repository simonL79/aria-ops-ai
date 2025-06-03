
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
    <Alert className="bg-green-900/20 border-green-500/30 mb-6">
      <CheckCircle className="h-5 w-5 text-green-400" />
      <AlertDescription className="text-green-300 text-base leading-relaxed">
        <strong className="text-green-200 text-lg">Live Intelligence Status:</strong> A.R.I.A vX™ is connected to verified OSINT sources. 
        {liveDataCount > 0 ? ` ${liveDataCount} live intelligence items available for processing.` : ' Ready to gather live intelligence data.'}
        {ciaPrecisionActive && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">CIA-Level Precision Active - Zero false positives guaranteed</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LiveDataStatusAlert;
