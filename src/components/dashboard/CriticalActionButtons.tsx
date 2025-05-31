
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, FileText, Activity, Play, Search } from 'lucide-react';

interface CriticalActionButtonsProps {
  onLiveThreatScan?: () => void;
  onLiveIntelligenceSweep?: () => void;
  onGuardianToggle?: () => void;
  onGenerateReport?: () => void;
  onActivateRealTime?: () => void;
  onRunManualScan?: () => void;
  isScanning?: boolean;
  isGuardianActive?: boolean;
  isRealTimeActive?: boolean;
}

const CriticalActionButtons: React.FC<CriticalActionButtonsProps> = ({
  onLiveThreatScan = () => {},
  onLiveIntelligenceSweep = () => {},
  onGuardianToggle = () => {},
  onGenerateReport = () => {},
  onActivateRealTime = () => {},
  onRunManualScan = () => {},
  isScanning = false,
  isGuardianActive = false,
  isRealTimeActive = false
}) => {
  return (
    <Card className="corporate-card mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button
            onClick={onLiveThreatScan}
            disabled={isScanning}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Live Threat Scan</span>
          </Button>

          <Button
            onClick={onLiveIntelligenceSweep}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1"
          >
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Live Intelligence Sweep</span>
          </Button>

          <Button
            onClick={onGuardianToggle}
            className={`text-white text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1 ${
              isGuardianActive 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Guardian</span>
          </Button>

          <Button
            onClick={onGenerateReport}
            className="bg-corporate-accent hover:bg-corporate-accentDark text-black text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Generate Report</span>
          </Button>

          <Button
            onClick={onActivateRealTime}
            className={`text-white text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1 ${
              isRealTimeActive 
                ? 'bg-corporate-accent hover:bg-corporate-accentDark text-black' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Activate Real-Time</span>
          </Button>

          <Button
            onClick={onRunManualScan}
            disabled={isScanning}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 h-auto flex flex-col items-center gap-1"
          >
            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-center leading-tight">Run Manual Scan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalActionButtons;
