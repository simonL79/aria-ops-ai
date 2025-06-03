
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface LiveDataStatusAlertProps {
  liveDataCount: number;
}

const LiveDataStatusAlert: React.FC<LiveDataStatusAlertProps> = ({ liveDataCount }) => {
  return (
    <Alert className="bg-green-900/20 border-green-500/30">
      <CheckCircle className="h-4 w-4 text-green-400" />
      <AlertDescription className="text-green-300">
        <strong>Live Intelligence Status:</strong> A.R.I.A vX™ is connected to verified OSINT sources. 
        {liveDataCount > 0 ? ` ${liveDataCount} live intelligence items available for processing.` : ' Ready to gather live intelligence data.'}
      </AlertDescription>
    </Alert>
  );
};

export default LiveDataStatusAlert;
