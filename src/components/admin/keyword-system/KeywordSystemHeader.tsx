
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Shield } from 'lucide-react';
import { WeaponsGradeLiveEnforcer } from '@/services/ariaCore/weaponsGradeLiveEnforcer';
import { toast } from 'sonner';

interface KeywordSystemHeaderProps {
  liveDataCount: number;
  isExecutingPipeline: boolean;
  onExecutePipeline: () => void;
}

const KeywordSystemHeader: React.FC<KeywordSystemHeaderProps> = ({
  liveDataCount,
  isExecutingPipeline,
  onExecutePipeline
}) => {
  const [isEnforcingLiveData, setIsEnforcingLiveData] = React.useState(false);

  const handleEnforceLiveData = async () => {
    setIsEnforcingLiveData(true);
    try {
      toast.info('🔥 WEAPONS GRADE: Initiating live data enforcement...');
      const result = await WeaponsGradeLiveEnforcer.enforceWeaponsGradeLiveData();
      
      if (result.systemSecure) {
        toast.success(`🔥 ${result.message}`);
      } else {
        toast.warning(`⚠️ ${result.message}`);
      }
      
      // Trigger a page refresh to show cleaned data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Live data enforcement failed:', error);
      toast.error('❌ Live data enforcement failed');
    } finally {
      setIsEnforcingLiveData(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">A.R.I.A vX™ — Keyword-to-Article System</h1>
        <p className="text-gray-300 mt-2">
          Real-time reputation reshaping engine — Live Intelligence Only
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-400">Live Data Count</div>
          <div className="text-2xl font-bold text-corporate-accent">{liveDataCount}</div>
        </div>
        <Button
          onClick={handleEnforceLiveData}
          disabled={isEnforcingLiveData}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          {isEnforcingLiveData ? (
            <>
              <Shield className="h-4 w-4 mr-2 animate-pulse" />
              Enforcing...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Purge Mock Data
            </>
          )}
        </Button>
        <Button
          onClick={onExecutePipeline}
          disabled={isExecutingPipeline}
          className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          {isExecutingPipeline ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Executing Pipeline...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Execute Full Pipeline
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default KeywordSystemHeader;
